from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os
from .config import Config

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Ensure instance and upload directories exist
    os.makedirs(app.instance_path, exist_ok=True)
    os.makedirs(app.config.get('UPLOAD_FOLDER', 'uploads'), exist_ok=True)
    
    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    
    # Import and register blueprints
    from .routes import main_bp
    app.register_blueprint(main_bp)
    
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
        
    return app
