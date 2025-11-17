# Custom Voice-to-Notes NLP Model

This project implements a complete **Voice-to-Notes Generator** without using any pretrained ASR or NLP models. It includes custom implementations of both Automatic Speech Recognition (ASR) and text summarization models built from scratch using only basic PyTorch.

## 🎯 Project Overview

The system consists of two main components:

1. **Custom ASR Model**: A CNN + Bi-LSTM architecture for speech-to-text conversion
2. **Custom Summarization Model**: A Transformer-based encoder-decoder for note generation

## 📁 Project Structure

```
ml_models/
├── asr/
│   ├── model.py           # Custom ASR model implementation
│   ├── train_asr.py       # ASR model training script
│   └── evaluate_asr.py    # ASR model evaluation script
├── nlp/
│   ├── model_summarizer.py # Custom summarization model implementation
│   ├── train_nlp.py       # Summarization model training script
│   └── evaluate_nlp.py    # Summarization model evaluation script
├── evaluation/            # Evaluation results and metrics
├── docs/                  # Documentation files
└── pipeline_voice_to_notes.py # End-to-end pipeline
```

## 🚀 Getting Started

### Prerequisites

- Python 3.7+
- PyTorch
- torchaudio
- numpy
- tqdm
- editdistance

Install dependencies:
```bash
pip install torch torchaudio numpy tqdm editdistance
```

### Training the Models

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
- **Tokenizer**: Custom subword BPE
- **Encoder**: 4 Transformer layers, 8 Heads, Hidden size 256
- **Decoder**: 4 layers with teacher forcing, dropout 0.1
- **Output**: Generated notes/summaries

## 📊 Evaluation Metrics

### ASR Evaluation
- **WER** (Word Error Rate)
- **CER** (Character Error Rate)

### NLP Evaluation
- **ROUGE-1**
- **ROUGE-2**
- **ROUGE-L**

## 📈 Results

The models are evaluated and results are stored in the `evaluation/` directory with performance metrics and graphs.

## 📄 Documentation

See the `docs/` directory for detailed documentation:
- Model explanations
- Research background
- Dataset descriptions
- Evaluation reports

## ⚠️ Restrictions

This implementation does NOT use:
- Pretrained ASR models (Whisper, wav2vec, HuBERT, etc.)
- Pretrained NLP models (BART, T5, Pegasus, GPT, etc.)
- Only basic PyTorch is used for all implementations

## 🛠️ Modular Coding Structure

The code follows a modular structure with separate modules for:
- Model definitions
- Training scripts
- Evaluation scripts
- Data preprocessing
- Utility functions

## 🖥️ Hardware Support

The models support both CPU and GPU training and inference.