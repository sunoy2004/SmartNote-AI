"""
Python API Server for Custom Voice-to-Notes Models
This server provides an API endpoint for the React frontend to access the custom ML models.
"""

import os
import sys
import json
import torch
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Add the ml_models directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

# Import our custom models
try:
    from asr.model import CustomASRModel, AudioPreprocessor
    from nlp.model_summarizer import CustomSummarizer
    from pipeline_voice_to_notes import transcribe_audio, generate_notes
    ML_MODELS_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Could not import custom ML models: {e}")
    ML_MODELS_AVAILABLE = False

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model instances
asr_model = None
nlp_model = None
asr_preprocessor = None

def initialize_models():
    """Initialize the custom ML models"""
    global asr_model, nlp_model, asr_preprocessor, ML_MODELS_AVAILABLE
    
    if not ML_MODELS_AVAILABLE:
        logger.warning("ML models not available, using mock implementations")
        return False
    
    try:
        # Initialize ASR model
        asr_model = CustomASRModel()
        asr_preprocessor = AudioPreprocessor()
        
        # Initialize NLP model
        nlp_model = CustomSummarizer()
        
        logger.info("Custom ML models initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize models: {e}")
        ML_MODELS_AVAILABLE = False
        return False

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "ml_models_available": ML_MODELS_AVAILABLE,
        "models_initialized": asr_model is not None and nlp_model is not None
    })

@app.route('/transcribe', methods=['POST'])
def transcribe():
    """Transcribe audio using the custom ASR model"""
    if not ML_MODELS_AVAILABLE:
        # Return mock response if models are not available
        return jsonify({
            "transcript": "This is a mock transcription from the custom ASR model.",
            "confidence": 0.92
        })
    
    try:
        # Get audio data from request
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        audio_file = request.files['audio']
        
        # Process audio file
        # In a real implementation, you would:
        # 1. Save the audio file temporarily
        # 2. Load and preprocess it
        # 3. Run it through the ASR model
        # 4. Return the transcription
        
        # For now, return a mock response
        return jsonify({
            "transcript": "This is a mock transcription from the custom ASR model.",
            "confidence": 0.92
        })
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/summarize', methods=['POST'])
def summarize():
    """Generate notes and summary using the custom NLP model"""
    if not ML_MODELS_AVAILABLE:
        # Return mock response if models are not available
        return jsonify({
            "notes": "These are mock notes generated from the custom NLP model.",
            "summary": "This is a mock summary from the custom NLP model."
        })
    
    try:
        # Get text data from request
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400
        
        text = data['text']
        preference = data.get('preference', 'Intermediate')
        
        # Process text
        # In a real implementation, you would:
        # 1. Tokenize the text
        # 2. Run it through the NLP model
        # 3. Generate notes and summary
        # 4. Return the results
        
        # For now, return a mock response
        return jsonify({
            "notes": f"These are mock notes generated from the custom NLP model based on: {text}",
            "summary": f"This is a mock summary from the custom NLP model based on: {text}"
        })
    except Exception as e:
        logger.error(f"Summarization error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/process', methods=['POST'])
def process_audio():
    """Process audio through the complete pipeline"""
    if not ML_MODELS_AVAILABLE:
        # Return mock response if models are not available
        return jsonify({
            "transcript": "This is a mock transcription from the custom ASR model.",
            "notes": "These are mock notes generated from the custom NLP model.",
            "summary": "This is a mock summary from the custom NLP model.",
            "subject": "General",
            "confidence": 0.85
        })
    
    try:
        # Get data from request
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Process through complete pipeline
        # In a real implementation, you would:
        # 1. Transcribe audio (if audio provided) or use text
        # 2. Generate notes and summary
        # 3. Detect subject
        # 4. Return all results
        
        # For now, return a mock response
        return jsonify({
            "transcript": "This is a mock transcription from the custom ASR model.",
            "notes": "These are mock notes generated from the custom NLP model.",
            "summary": "This is a mock summary from the custom NLP model.",
            "subject": "General",
            "confidence": 0.85
        })
    except Exception as e:
        logger.error(f"Processing error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Initialize models
    initialize_models()
    
    # Run the server
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)