import os
from datetime import timedelta

class Config:
    # Basic Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('FLASK_DEBUG', 'False') == 'True'
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///attendance_system.db'
    # Handle Heroku's updated DATABASE_URL format
    if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # File upload configuration
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    
    # Face recognition configuration
    FACE_RECOGNITION_TOLERANCE = 0.6
    FACE_RECOGNITION_MODEL = 'hog'  # 'hog' is faster, 'cnn' is more accurate but requires GPU
    
    # Liveness detection configuration
    BLINK_THRESHOLD = 0.3
    MIN_BLINKS_REQUIRED = 2
    
    # Attendance configuration
    ATTENDANCE_WINDOW_MINUTES = 15  # Time window to mark attendance after class starts
