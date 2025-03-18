import api from './api';
import * as faceapi from 'face-api.js';

// Load face-api.js models
export const loadModels = async () => {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ]);
    return true;
  } catch (error) {
    console.error('Error loading face-api.js models:', error);
    throw new Error('Failed to load face recognition models');
  }
};

/**
 * Register a user's face
 * @param {string} imageData - Base64 encoded image data
 * @returns {Promise} - Promise with registration response
 */
export const registerFace = async (imageData) => {
  try {
    const response = await api.post('/face/register', { image: imageData });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to register face' };
  }
};

/**
 * Recognize a face from an image
 * @param {string} imageData - Base64 encoded image data
 * @returns {Promise} - Promise with recognition response
 */
export const recognizeFace = async (imageData) => {
  try {
    const response = await api.post('/face/recognize', { image: imageData });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to recognize face' };
  }
};

/**
 * Verify liveness using blink detection
 * @param {Array} frames - Array of base64 encoded image frames
 * @returns {Promise} - Promise with liveness verification response
 */
export const verifyLivenessBlink = async (frames) => {
  try {
    const response = await api.post('/liveness/verify', {
      method: 'blink',
      frames,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to verify liveness' };
  }
};

/**
 * Verify liveness using thermal image analysis
 * @param {string} thermalImageData - Base64 encoded thermal image data
 * @returns {Promise} - Promise with liveness verification response
 */
export const verifyLivenessThermal = async (thermalImageData) => {
  try {
    const response = await api.post('/liveness/verify', {
      method: 'thermal',
      thermal_image: thermalImageData,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to verify liveness' };
  }
};

/**
 * Detect face in an image using face-api.js (client-side)
 * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} input - Input element
 * @returns {Promise} - Promise with detection results
 */
export const detectFace = async (input) => {
  try {
    const detections = await faceapi.detectAllFaces(
      input,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks();
    
    return detections;
  } catch (error) {
    console.error('Error detecting face:', error);
    throw new Error('Failed to detect face');
  }
};

/**
 * Draw face landmarks on a canvas
 * @param {HTMLCanvasElement} canvas - Canvas element to draw on
 * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} input - Input element
 * @param {Object} detections - Face detection results
 */
export const drawFaceLandmarks = (canvas, input, detections) => {
  // Resize canvas to match input dimensions
  const displaySize = { width: input.width, height: input.height };
  faceapi.matchDimensions(canvas, displaySize);
  
  // Resize detections to match display size
  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
  // Clear canvas
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw detections
  faceapi.draw.drawDetections(canvas, resizedDetections);
  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
};
