from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.utils.face_recognition_utils import encode_face, compare_faces
import base64
import numpy as np
import json
import cv2
import os
import tempfile

@jwt_required()
def register_face():
    """Register a user's face for recognition."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get image data from request
    if 'image' not in request.json:
        return jsonify({'error': 'No image data provided'}), 400
    
    try:
        # Decode base64 image
        image_data = request.json['image']
        if 'data:image' in image_data:
            # Remove the data URL prefix if present
            image_data = image_data.split(',')[1]
        
        # Decode base64 to binary
        image_binary = base64.b64decode(image_data)
        
        # Create a temporary file to save the image
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            temp_file.write(image_binary)
            temp_file_path = temp_file.name
        
        # Process the image to get face encoding
        face_encoding = encode_face(temp_file_path)
        
        # Clean up the temporary file
        os.unlink(temp_file_path)
        
        if face_encoding is None:
            return jsonify({'error': 'No face detected in the image'}), 400
        
        # Save the face encoding to the user record
        user.face_encoding = json.dumps(face_encoding.tolist())
        db.session.commit()
        
        return jsonify({
            'message': 'Face registered successfully',
            'user_id': user.id
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jwt_required()
def recognize_face():
    """Recognize a face from an image."""
    # Get image data from request
    if 'image' not in request.json:
        return jsonify({'error': 'No image data provided'}), 400
    
    try:
        # Decode base64 image
        image_data = request.json['image']
        if 'data:image' in image_data:
            # Remove the data URL prefix if present
            image_data = image_data.split(',')[1]
        
        # Decode base64 to binary
        image_binary = base64.b64decode(image_data)
        
        # Create a temporary file to save the image
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            temp_file.write(image_binary)
            temp_file_path = temp_file.name
        
        # Process the image to get face encoding
        face_encoding = encode_face(temp_file_path)
        
        # Clean up the temporary file
        os.unlink(temp_file_path)
        
        if face_encoding is None:
            return jsonify({'error': 'No face detected in the image'}), 400
        
        # Get the user ID from the token
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if not user.face_encoding:
            return jsonify({'error': 'User has not registered a face'}), 400
        
        # Compare the face with the stored encoding
        stored_encoding = np.array(json.loads(user.face_encoding))
        is_match = compare_faces(stored_encoding, face_encoding, 
                                tolerance=current_app.config['FACE_RECOGNITION_TOLERANCE'])
        
        if is_match:
            return jsonify({
                'message': 'Face recognized successfully',
                'user_id': user.id,
                'match': True
            }), 200
        else:
            return jsonify({
                'message': 'Face does not match',
                'match': False
            }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
