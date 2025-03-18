from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.attendance import Attendance
from app.models.subject import Subject
from app.utils.pdf_generator import generate_attendance_report
from datetime import datetime, timedelta
import os
import uuid

@jwt_required()
def mark_attendance():
    """Mark attendance for a user."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get data from request
    data = request.get_json()
    
    # Validate required fields
    if 'subject_id' not in data:
        return jsonify({'error': 'Subject ID is required'}), 400
    
    # Check if subject exists
    subject = Subject.query.get(data['subject_id'])
    if not subject:
        return jsonify({'error': 'Subject not found'}), 404
    
    # Check if attendance already marked for today
    today = datetime.utcnow().date()
    existing_attendance = Attendance.query.filter_by(
        user_id=user_id,
        subject_id=subject.id,
        date=today
    ).first()
    
    if existing_attendance:
        return jsonify({
            'message': 'Attendance already marked for today',
            'attendance': existing_attendance.to_dict()
        }), 200
    
    # Create new attendance record
    try:
        attendance = Attendance(
            user_id=user_id,
            subject_id=subject.id,
            status=data.get('status', 'present'),
            verification_method=data.get('verification_method', 'face'),
            liveness_verified=data.get('liveness_verified', False)
        )
        db.session.add(attendance)
        db.session.commit()
        
        return jsonify({
            'message': 'Attendance marked successfully',
            'attendance': attendance.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@jwt_required()
def get_attendance_report():
    """Get attendance report for a user or all users (for admin)."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get query parameters
    subject_id = request.args.get('subject_id')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    user_id_param = request.args.get('user_id')  # For admin to query specific user
    
    # Build query
    query = Attendance.query
    
    # Filter by user (if admin and user_id provided, use that, otherwise use current user)
    if user.role == 'admin' and user_id_param:
        query = query.filter(Attendance.user_id == user_id_param)
    else:
        query = query.filter(Attendance.user_id == user_id)
    
    # Apply additional filters
    if subject_id:
        query = query.filter(Attendance.subject_id == subject_id)
    
    if start_date:
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            query = query.filter(Attendance.date >= start_date)
        except ValueError:
            return jsonify({'error': 'Invalid start_date format. Use YYYY-MM-DD'}), 400
    
    if end_date:
        try:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            query = query.filter(Attendance.date <= end_date)
        except ValueError:
            return jsonify({'error': 'Invalid end_date format. Use YYYY-MM-DD'}), 400
    
    # Execute query and get results
    attendances = query.order_by(Attendance.date.desc(), Attendance.time.desc()).all()
    
    # Format results
    result = [attendance.to_dict() for attendance in attendances]
    
    return jsonify({
        'attendances': result,
        'count': len(result)
    }), 200

@jwt_required()
def get_attendance_stats():
    """Get attendance statistics for a user or all users (for admin)."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get query parameters
    subject_id = request.args.get('subject_id')
    period = request.args.get('period', 'month')  # 'week', 'month', 'semester', 'year'
    user_id_param = request.args.get('user_id')  # For admin to query specific user
    
    # Determine date range based on period
    today = datetime.utcnow().date()
    if period == 'week':
        start_date = today - timedelta(days=today.weekday())
    elif period == 'month':
        start_date = today.replace(day=1)
    elif period == 'semester':
        # Assuming semesters are Jan-Jun and Jul-Dec
        if today.month <= 6:
            start_date = today.replace(month=1, day=1)
        else:
            start_date = today.replace(month=7, day=1)
    elif period == 'year':
        start_date = today.replace(month=1, day=1)
    else:
        return jsonify({'error': 'Invalid period. Use week, month, semester, or year'}), 400
    
    # Build query for total classes
    if user.role == 'admin' and user_id_param:
        target_user_id = user_id_param
    else:
        target_user_id = user_id
    
    # Get all subjects for the user
    if subject_id:
        subjects = [Subject.query.get(subject_id)]
        if not subjects[0]:
            return jsonify({'error': 'Subject not found'}), 404
    else:
        # In a real app, you would have a user_subjects relationship
        # This is a simplified version
        subjects = Subject.query.all()
    
    # Calculate statistics
    stats = {
        'total_classes': 0,
        'present': 0,
        'absent': 0,
        'late': 0,
        'attendance_percentage': 0,
        'subjects': []
    }
    
    for subject in subjects:
        # Get attendance records for this subject
        attendances = Attendance.query.filter(
            Attendance.user_id == target_user_id,
            Attendance.subject_id == subject.id,
            Attendance.date >= start_date
        ).all()
        
        # Count by status
        present_count = sum(1 for a in attendances if a.status == 'present')
        absent_count = sum(1 for a in attendances if a.status == 'absent')
        late_count = sum(1 for a in attendances if a.status == 'late')
        
        # Calculate total classes (this is simplified - in a real app you would use the schedule)
        total_classes = len(attendances)
        
        # Calculate percentage
        percentage = (present_count + late_count) / total_classes * 100 if total_classes > 0 else 0
        
        # Add to overall stats
        stats['total_classes'] += total_classes
        stats['present'] += present_count
        stats['absent'] += absent_count
        stats['late'] += late_count
        
        # Add subject-specific stats
        stats['subjects'].append({
            'id': subject.id,
            'name': subject.name,
            'code': subject.code,
            'total_classes': total_classes,
            'present': present_count,
            'absent': absent_count,
            'late': late_count,
            'attendance_percentage': round(percentage, 2)
        })
    
    # Calculate overall percentage
    if stats['total_classes'] > 0:
        stats['attendance_percentage'] = round(
            (stats['present'] + stats['late']) / stats['total_classes'] * 100, 2
        )
    
    return jsonify(stats), 200
