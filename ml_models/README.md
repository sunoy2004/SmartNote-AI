# Custom Voice-to-Notes NLP Model

This project implements a complete **Voice-to-Notes Generator** without using any pretrained ASR or NLP models. It includes custom implementations of both Automatic Speech Recognition (ASR) and text summarization models built from scratch using only basic PyTorch.

## 🎯 Project Overview

The system consists of two main components:

1. **Custom ASR Model**: A CNN + Bi-LSTM architecture for speech-to-text conversion
2. **Custom Summarization Model**: A Transformer-based encoder-decoder for note generation

## 📁 Project Structure

```
ml_models/
├── asr/                 # Automatic Speech Recognition models
│   ├── model.py           # Custom ASR model implementation
│   ├── train_asr.py       # ASR model training script
│   └── evaluate_asr.py    # ASR model evaluation script
├── nlp/                 # Natural Language Processing models
│   ├── model_summarizer.py # Custom summarization model implementation
│   ├── train_nlp.py       # Summarization model training script
│   └── evaluate_nlp.py    # Summarization model evaluation script
├── evaluation/          # Model evaluation results and metrics
├── docs/                # Documentation files
│   └── dataset/         # Dataset documentation and integration guides
├── pipeline_voice_to_notes.py # End-to-end pipeline
├── dataset_loader.py    # Dataset loading and preprocessing
├── convert_asr_data.py  # ASR data conversion scripts
├── convert_nlp_data.py  # NLP data conversion scripts
├── generate_synthetic_summaries.py # Synthetic summary generation
├── train_pipeline.py    # Complete training pipeline orchestrator
├── dataset_config.json  # Dataset configuration
└── requirements.txt     # Python dependencies
```

## 🚀 Getting Started

### Prerequisites

- Python 3.7+
- PyTorch
- torchaudio
- numpy
- tqdm
- editdistance
- datasets (for LibriSpeech integration)

Install dependencies:
```bash
pip install -r requirements.txt
pip install datasets  # For LibriSpeech dataset integration
```

### Dataset Integration

This project uses the LibriSpeech dataset for training. To integrate and process the dataset:

1. **Load and Process Dataset**:
   ```bash
   python dataset_loader.py
   ```

2. **Generate Synthetic Summaries** (for NLP training):
   ```bash
   python generate_synthetic_summaries.py
   ```

3. **Convert ASR Data**:
   ```bash
   python convert_asr_data.py
   ```

4. **Convert NLP Data**:
   ```bash
   python convert_nlp_data.py
   ```

### Training the Models

#### Option 1: Individual Training

1. **Train the ASR Model**:
   ```bash
   cd ml_models/asr
   python train_asr.py
   ```

2. **Train the Summarization Model**:
   ```bash
   cd ml_models/nlp
   python train_nlp.py
   ```

#### Option 2: Complete Pipeline Training

Run the complete training pipeline:
```bash
cd ml_models
python train_pipeline.py
```

### Running the Pipeline

Process an audio file through the complete pipeline:
```bash
cd ml_models
python pipeline_voice_to_notes.py
```

## 🧠 Model Architectures

### ASR Model
- **Audio Preprocessing**: 16 kHz mono, Mel-Spectrogram extraction
- **Architecture**: 3×CNN layers → 2×Bi-LSTM layers → Fully connected layer
- **Training Method**: CTC Loss
- **Output**: Character-level speech-to-text

### Summarization Model
- **Tokenization**: Custom BPE tokenizer with 5000 vocabulary size
- **Architecture**: Transformer encoder-decoder with 4 layers each
- **Training Method**: Cross-entropy loss with teacher forcing
- **Output**: Generated notes/summaries

## 📊 Evaluation Metrics

Model performance is evaluated using standard metrics:

- **ASR Model**: WER (Word Error Rate), CER (Character Error Rate)
- **NLP Model**: ROUGE-1, ROUGE-2, ROUGE-L

Metrics are saved to `evaluation/metrics.json`.

## 📄 Documentation

See the `docs/` directory for detailed documentation:
- Model explanations
- Research background
- Dataset descriptions and integration guides
- Evaluation reports

## ⚠️ Restrictions

This implementation does NOT use:
- Pretrained ASR models (Whisper, wav2vec, HuBERT, etc.)
- Pretrained NLP models (BART, T5, Pegasus, GPT, etc.)
- Only basic PyTorch is used for all implementations

The code follows a modular structure with separate modules for:
- Model definitions
- Training scripts
- Evaluation scripts
- Data preprocessing
- Utility functions

## 🖥️ Hardware Support

The models support both CPU and GPU training and inference.

## 📈 Expected Performance

With the LibriSpeech dataset and proper training:
- **ASR Model**: WER < 20% on validation set
- **NLP Model**: ROUGE-1 > 0.4 on validation set