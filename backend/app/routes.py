from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from werkzeug.utils import secure_filename

main_bp = Blueprint('main', __name__)

# Test route to verify the API is working
@main_bp.route('/', methods=['GET'])
def test_route():
    return jsonify({
        'status': 'success',
        'message': 'Automatic Attendance System API is running!',
        'version': '1.0.0'
    })

# Auth routes
@main_bp.route('/api/auth/register', methods=['POST'])
def register():
    # Placeholder - actual implementation will be in a user controller
    return jsonify({'message': 'User registered successfully'})

@main_bp.route('/api/auth/login', methods=['POST'])
def login():
    # Placeholder - actual implementation will be in a user controller
    return jsonify({
        'token': 'sample_jwt_token',
        'user': {
            'id': 1,
            'name': 'John Doe',
            'email': 'john@example.com',
            'role': 'student'
        }
    })

@main_bp.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def profile():
    # Placeholder - actual implementation will be in a user controller
    return jsonify({
        'id': 1,
        'name': 'John Doe',
        'email': 'john@example.com',
        'role': 'student'
    })

# Face recognition routes
@main_bp.route('/api/faces/register', methods=['POST'])
@jwt_required()
def register_face_route():
    # Placeholder - actual implementation will be in a face recognition controller
    return jsonify({'message': 'Face registered successfully'})

@main_bp.route('/api/faces/recognize', methods=['POST'])
def recognize_face_route():
    # Placeholder - actual implementation will be in a face recognition controller
    return jsonify({
        'recognized': True,
        'user_id': 1,
        'confidence': 0.95
    })

# Liveness detection route
@main_bp.route('/api/liveness/verify', methods=['POST'])
def verify_liveness_route():
    # Placeholder - actual implementation will be in a liveness detection controller
    return jsonify({
        'is_live': True,
        'confidence': 0.98
    })

# Attendance routes
@main_bp.route('/api/attendance/mark', methods=['POST'])
@jwt_required()
def mark_attendance_route():
    # Placeholder - actual implementation will be in an attendance controller
    return jsonify({'message': 'Attendance marked successfully'})

@main_bp.route('/api/attendance/report', methods=['GET'])
@jwt_required()
def get_attendance_report_route():
    # Placeholder - actual implementation will be in an attendance controller
    return jsonify([
        {'date': '2023-01-01', 'subject': 'MATH101', 'status': 'present'},
        {'date': '2023-01-02', 'subject': 'CS101', 'status': 'absent'},
        {'date': '2023-01-03', 'subject': 'PHYS101', 'status': 'present'}
    ])

@main_bp.route('/api/attendance/stats', methods=['GET'])
@jwt_required()
def get_attendance_stats_route():
    # Placeholder - actual implementation will be in an attendance controller
    return jsonify({
        'total_classes': 30,
        'present': 25,
        'absent': 3,
        'late': 2,
        'attendance_percentage': 83.33,
        'subjects': [
            {
                'id': 1,
                'name': 'Mathematics',
                'code': 'MATH101',
                'total_classes': 10,
                'present': 9,
                'absent': 1,
                'late': 0,
                'attendance_percentage': 90
            },
            {
                'id': 2,
                'name': 'Computer Science',
                'code': 'CS101',
                'total_classes': 10,
                'present': 8,
                'absent': 1,
                'late': 1,
                'attendance_percentage': 80
            },
            {
                'id': 3,
                'name': 'Physics',
                'code': 'PHYS101',
                'total_classes': 10,
                'present': 8,
                'absent': 1,
                'late': 1,
                'attendance_percentage': 80
            }
        ]
    })

# Subject routes
@main_bp.route('/api/subjects', methods=['GET'])
@jwt_required()
def get_subjects_route():
    # Placeholder - actual implementation will be in a subject controller
    subjects = [
        {'id': 1, 'name': 'Mathematics', 'code': 'MATH101'},
        {'id': 2, 'name': 'Computer Science', 'code': 'CS101'},
        {'id': 3, 'name': 'Physics', 'code': 'PHYS101'}
    ]
    return jsonify(subjects)

@main_bp.route('/api/subjects/<subject_id>', methods=['GET'])
@jwt_required()
def get_subject_route(subject_id):
    # Placeholder - actual implementation will be in a subject controller
    return jsonify({
        'id': subject_id,
        'name': 'Mathematics',
        'code': 'MATH101',
        'description': 'Introduction to Mathematics'
    })

@main_bp.route('/api/subjects', methods=['POST'])
@jwt_required()
def create_subject_route():
    # Placeholder - actual implementation will be in a subject controller
    return jsonify({'message': 'Subject created successfully'})

# File upload route for face images
@main_bp.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        filename = secure_filename(file.filename)
        upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        
        # Create upload folder if it doesn't exist
        os.makedirs(upload_folder, exist_ok=True)
        
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        
        return jsonify({
            'status': 'success',
            'message': 'File uploaded successfully',
            'filename': filename,
            'path': file_path
        })

# Error handlers
@main_bp.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Resource not found'}), 404

@main_bp.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error'}), 500
