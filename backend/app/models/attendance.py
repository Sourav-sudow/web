from app import db
from datetime import datetime

class Attendance(db.Model):
    __tablename__ = 'attendances'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date)
    time = db.Column(db.Time, nullable=False, default=datetime.utcnow().time)
    status = db.Column(db.String(20), nullable=False, default='present')  # 'present', 'absent', 'late'
    verification_method = db.Column(db.String(20), nullable=False, default='face')  # 'face', 'manual', etc.
    liveness_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __init__(self, user_id, subject_id, status='present', verification_method='face', liveness_verified=False):
        self.user_id = user_id
        self.subject_id = subject_id
        self.status = status
        self.verification_method = verification_method
        self.liveness_verified = liveness_verified
        self.date = datetime.utcnow().date()
        self.time = datetime.utcnow().time()
    
    def to_dict(self):
        """Convert attendance object to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'subject_id': self.subject_id,
            'date': self.date.isoformat(),
            'time': self.time.isoformat(),
            'status': self.status,
            'verification_method': self.verification_method,
            'liveness_verified': self.liveness_verified,
            'created_at': self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Attendance {self.id}: User {self.user_id}, Subject {self.subject_id}, Date {self.date}>'
