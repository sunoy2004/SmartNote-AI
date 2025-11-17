# Custom ML Models Integration

This document explains how to integrate and use the custom voice-to-notes ML models with the SmartNote-AI application.

## 📁 Project Structure

The custom ML models are located in the `ml_models/` directory with the following structure:

```
ml_models/
├── asr/                 # Automatic Speech Recognition models
├── nlp/                 # Natural Language Processing models
├── evaluation/          # Model evaluation results
├── docs/                # Model documentation
├── api_server.py        # Python API server for model inference
├── api_requirements.txt # Python dependencies for API server
├── requirements.txt     # Python dependencies for models
├── README.md            # Main documentation
└── ...
```

## 🚀 Getting Started

### 1. Install Python Dependencies

First, install the required Python packages:

```bash
# For the ML models
pip install -r ml_models/requirements.txt

# For the API server
pip install -r ml_models/api_requirements.txt
```

### 2. Start the Python API Server

The custom ML models are accessed through a Python API server that the React frontend communicates with.

#### On Windows:
```bash
npm run ml-server:windows
```

#### On Linux/Mac:
```bash
npm run ml-server:linux
```

#### Manual start:
```bash
python ml_models/api_server.py
```

The server will start on `http://localhost:5000`.

### 3. Enable Custom Models in the Frontend

To enable the custom ML models in the React frontend, you need to modify the `areCustomModelsAvailable` function in `src/services/customML.ts`:

```typescript
export const areCustomModelsAvailable = (): boolean => {
  // Change this to return true when you're ready to use custom models
  return true; // <-- Change this from false to true
};
```

## 🧠 How It Works

### Architecture Overview

```
React Frontend ↔ Python API Server ↔ Custom ML Models
```

1. **React Frontend**: The SmartNote-AI web application
2. **Python API Server**: Flask server that serves as a bridge between the frontend and ML models
3. **Custom ML Models**: PyTorch-based models for ASR and NLP tasks

### Data Flow

1. User records audio in the React app
2. Audio is sent to the Python API server
3. Python server processes audio with custom ASR model
4. Transcribed text is processed with custom NLP model
5. Results are sent back to the React frontend

## 🔧 Development Workflow

### Training New Models

1. Prepare your dataset (see `ml_models/docs/dataset_description.md`)
2. Train the ASR model:
   ```bash
   cd ml_models/asr
   python train_asr.py
   ```
3. Train the NLP model:
   ```bash
   cd ml_models/nlp
   python train_nlp.py
   ```

### Testing Models

1. Start the API server:
   ```bash
   npm run ml-server
   ```
2. Use the test endpoints:
   - Health check: `GET http://localhost:5000/health`
   - Transcription: `POST http://localhost:5000/transcribe`
   - Summarization: `POST http://localhost:5000/summarize`

### Integration with React

The integration is handled through the `customML.ts` service:

```typescript
// Check if custom models are available
if (areCustomModelsAvailable()) {
  // Use custom models
  const result = await processAudioWithCustomModels(audioBlob, subjects);
} else {
  // Fallback to original implementation
  const result = processWithFallback(transcript, subjects);
}
```

## 🛠️ Customization

### Model Parameters

You can adjust model parameters in the respective model files:
- ASR model: `ml_models/asr/model.py`
- NLP model: `ml_models/nlp/model_summarizer.py`

### API Endpoints

The Python API server provides the following endpoints:
- `GET /health` - Health check
- `POST /transcribe` - Audio transcription
- `POST /summarize` - Text summarization
- `POST /process` - Complete pipeline processing

## 📊 Model Evaluation

Evaluation results are stored in `ml_models/evaluation/`:
- Performance metrics
- Architecture diagrams
- Training logs

## ⚠️ Important Notes

1. **Python Environment**: Ensure you have Python 3.7+ installed
2. **Dependencies**: Install all required packages before running
3. **CORS**: The API server has CORS enabled for development
4. **Model Files**: Trained model files are not included in the repository
5. **Training Data**: You'll need to provide your own training data

## 🚀 Next Steps

1. Train the models with your own dataset
2. Enable custom models in the frontend
3. Test the integration
4. Fine-tune model parameters for better performance