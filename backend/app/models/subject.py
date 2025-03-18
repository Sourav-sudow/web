from app import db
from datetime import datetime

class Subject(db.Model):
    __tablename__ = 'subjects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    schedule_days = db.Column(db.String(50), nullable=True)  # e.g., "1,3,5" for Mon,Wed,Fri
    start_time = db.Column(db.Time, nullable=True)
    end_time = db.Column(db.Time, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    attendances = db.relationship('Attendance', backref='subject', lazy=True)
    
    def __init__(self, name, code, description=None, teacher_id=None, 
                 schedule_days=None, start_time=None, end_time=None):
        self.name = name
        self.code = code
        self.description = description
        self.teacher_id = teacher_id
        self.schedule_days = schedule_days
        self.start_time = start_time
        self.end_time = end_time
    
    def to_dict(self):
        """Convert subject object to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'description': self.description,
            'teacher_id': self.teacher_id,
            'schedule_days': self.schedule_days,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Subject {self.code}: {self.name}>'
