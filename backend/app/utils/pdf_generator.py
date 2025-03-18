from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from flask import current_app
import os
from datetime import datetime
import uuid

def generate_attendance_report(attendances, user=None, subject=None, start_date=None, end_date=None):
    """
    Generate a PDF attendance report.
    
    Args:
        attendances (list): List of attendance records
        user (User, optional): User object for user-specific reports
        subject (Subject, optional): Subject object for subject-specific reports
        start_date (date, optional): Start date for the report period
        end_date (date, optional): End date for the report period
        
    Returns:
        str: Path to the generated PDF file
    """
    # Create a unique filename for the report
    report_id = str(uuid.uuid4())
    report_path = os.path.join(current_app.config['UPLOAD_FOLDER'], f'report_{report_id}.pdf')
    
    # Ensure the upload directory exists
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    
    # Create the PDF document
    doc = SimpleDocTemplate(report_path, pagesize=letter)
    
    # Get styles
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    subtitle_style = styles['Heading2']
    normal_style = styles['Normal']
    
    # Create a list to hold the flowables (elements to be added to the document)
    elements = []
    
    # Add title
    title = "Attendance Report"
    elements.append(Paragraph(title, title_style))
    elements.append(Spacer(1, 0.25 * inch))
    
    # Add report details
    if user:
        elements.append(Paragraph(f"User: {user.first_name} {user.last_name}", subtitle_style))
        if user.student_id:
            elements.append(Paragraph(f"Student ID: {user.student_id}", normal_style))
    
    if subject:
        elements.append(Paragraph(f"Subject: {subject.name} ({subject.code})", subtitle_style))
    
    # Add date range
    date_range = "All dates"
    if start_date and end_date:
        date_range = f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}"
    elif start_date:
        date_range = f"From {start_date.strftime('%Y-%m-%d')}"
    elif end_date:
        date_range = f"Until {end_date.strftime('%Y-%m-%d')}"
    
    elements.append(Paragraph(f"Period: {date_range}", normal_style))
    elements.append(Paragraph(f"Generated on: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}", normal_style))
    elements.append(Spacer(1, 0.5 * inch))
    
    # Add attendance table
    if attendances:
        # Define table data
        table_data = [['Date', 'Time', 'Subject', 'Status', 'Verification Method']]
        
        for attendance in attendances:
            # Get subject name
            subject_name = attendance.subject.code if hasattr(attendance, 'subject') else "Unknown"
            
            # Format date and time
            date_str = attendance.date.strftime('%Y-%m-%d')
            time_str = attendance.time.strftime('%H:%M:%S')
            
            # Add row to table
            table_data.append([
                date_str,
                time_str,
                subject_name,
                attendance.status.capitalize(),
                attendance.verification_method.capitalize()
            ])
        
        # Create the table
        table = Table(table_data, colWidths=[1.2 * inch, 1 * inch, 1.5 * inch, 1 * inch, 1.5 * inch])
        
        # Add style to the table
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(table)
        
        # Add summary
        elements.append(Spacer(1, 0.5 * inch))
        elements.append(Paragraph("Summary:", subtitle_style))
        
        # Count by status
        present_count = sum(1 for a in attendances if a.status == 'present')
        absent_count = sum(1 for a in attendances if a.status == 'absent')
        late_count = sum(1 for a in attendances if a.status == 'late')
        total_count = len(attendances)
        
        # Calculate attendance percentage
        attendance_percentage = (present_count + late_count) / total_count * 100 if total_count > 0 else 0
        
        elements.append(Paragraph(f"Total Classes: {total_count}", normal_style))
        elements.append(Paragraph(f"Present: {present_count}", normal_style))
        elements.append(Paragraph(f"Absent: {absent_count}", normal_style))
        elements.append(Paragraph(f"Late: {late_count}", normal_style))
        elements.append(Paragraph(f"Attendance Percentage: {attendance_percentage:.2f}%", normal_style))
    else:
        elements.append(Paragraph("No attendance records found for the specified criteria.", normal_style))
    
    # Build the PDF
    doc.build(elements)
    
    return report_path
