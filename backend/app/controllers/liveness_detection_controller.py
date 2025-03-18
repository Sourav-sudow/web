from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.liveness_detection_utils import detect_blinks, analyze_thermal_image
import base64
import numpy as np
import cv2
import os
import tempfile
import json

@jwt_required()
def verify_liveness():
    """Verify if the person is live using blink detection and/or thermal analysis."""
    # Get data from request
    if not request.json:
        return jsonify({'error': 'No data provided'}), 400
    
    # Check which liveness detection method to use
    method = request.json.get('method', 'blink')  # Default to blink detection
    
    try:
        if method == 'blink':
            return verify_liveness_blink()
        elif method == 'thermal':
            return verify_liveness_thermal()
        else:
            return jsonify({'error': f'Unsupported liveness detection method: {method}'}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def verify_liveness_blink():
    """Verify liveness using blink detection."""
    # Get video frames from request
    if 'frames' not in request.json:
        return jsonify({'error': 'No video frames provided'}), 400
    
    frames = request.json['frames']
    if not frames or len(frames) < 10:  # Need enough frames to detect blinks
        return jsonify({'error': 'Not enough frames provided'}), 400
    
    try:
        # Process frames to detect blinks
        frame_images = []
        for frame_data in frames:
            # Decode base64 image
            if 'data:image' in frame_data:
                # Remove the data URL prefix if present
                frame_data = frame_data.split(',')[1]
            
            # Decode base64 to binary
            frame_binary = base64.b64decode(frame_data)
            
            # Create a temporary file to save the frame
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                temp_file.write(frame_binary)
                frame_images.append(temp_file.name)
        
        # Detect blinks in the sequence of frames
        blink_count = detect_blinks(frame_images)
        
        # Clean up temporary files
        for frame_path in frame_images:
            os.unlink(frame_path)
        
        # Check if enough blinks were detected
        min_blinks_required = current_app.config['MIN_BLINKS_REQUIRED']
        is_live = blink_count >= min_blinks_required
        
        return jsonify({
            'is_live': is_live,
            'blink_count': blink_count,
            'min_blinks_required': min_blinks_required
        }), 200
    
    except Exception as e:
        # Clean up any remaining temporary files
        for frame_path in frame_images:
            if os.path.exists(frame_path):
                os.unlink(frame_path)
        
        return jsonify({'error': str(e)}), 500

def verify_liveness_thermal():
    """Verify liveness using thermal image analysis."""
    # Get thermal image from request
    if 'thermal_image' not in request.json:
        return jsonify({'error': 'No thermal image provided'}), 400
    
    try:
        # Decode base64 image
        image_data = request.json['thermal_image']
        if 'data:image' in image_data:
            # Remove the data URL prefix if present
            image_data = image_data.split(',')[1]
        
        # Decode base64 to binary
        image_binary = base64.b64decode(image_data)
        
        # Create a temporary file to save the image
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            temp_file.write(image_binary)
            temp_file_path = temp_file.name
        
        # Analyze thermal image to detect if it's a real person
        is_live, confidence = analyze_thermal_image(temp_file_path)
        
        # Clean up the temporary file
        os.unlink(temp_file_path)
        
        return jsonify({
            'is_live': is_live,
            'confidence': confidence
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
