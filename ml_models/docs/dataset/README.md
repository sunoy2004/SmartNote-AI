# Dataset Documentation for Custom Voice-to-Notes Models

## Overview

This document describes the dataset integration for training the custom ASR (Automatic Speech Recognition) and NLP (Natural Language Processing) models in the SmartNote-AI project. We've selected the **LibriSpeech** dataset as our primary data source due to its high quality and standardization in the speech recognition research community.

## Dataset Selection

### Chosen Dataset: LibriSpeech

We selected the LibriSpeech dataset (`nguyenvulebinh/libris_clean_100`) from HuggingFace for the following reasons:

1. **Quality**: Professional recordings with high signal-to-noise ratio
2. **Size**: Approximately 100 hours of clean read English speech
3. **Diversity**: Multiple speakers with various accents and speaking styles
4. **Transcriptions**: Accurate, professionally-created transcripts
5. **Standardization**: Well-established benchmark in the research community

### Dataset Structure

The processed dataset follows our standard structure:

```
data/
├── asr/
│   ├── train/
│   │   ├── audio/
│   │   ├── processed/
│   │   ├── metadata.json
│   │   └── processed_metadata.json
│   ├── validation/
│   │   ├── audio/
│   │   ├── processed/
│   │   ├── metadata.json
│   │   └── processed_metadata.json
│   └── test/
│       ├── audio/
│       ├── processed/
│       ├── metadata.json
│       └── processed_metadata.json
└── nlp/
    ├── train/
    │   ├── texts/
    │   ├── summaries/
    │   ├── processed/
    │   ├── metadata.json
    │   └── processed_metadata.json
    ├── validation/
    │   ├── texts/
    │   ├── summaries/
    │   ├── processed/
    │   ├── metadata.json
    │   └── processed_metadata.json
    └── test/
        ├── texts/
        ├── summaries/
        ├── processed/
        ├── metadata.json
        └── processed_metadata.json
```

## Preprocessing Pipeline

### Audio Preprocessing (ASR)

1. **Resampling**: All audio is converted to 16kHz mono format to match our model requirements
2. **Mel-Spectrogram Extraction**: Using torchaudio transforms with:
   - FFT size: 400 samples (25ms at 16kHz)
   - Hop length: 160 samples (10ms at 16kHz)
   - Number of mel filters: 80
3. **Log Transformation**: Applied to mel-spectrograms for better numerical stability
4. **Normalization**: Audio waveforms are normalized to [-1, 1] range

### Text Preprocessing (NLP)

1. **Lowercasing**: All text is converted to lowercase for consistency
2. **Special Character Handling**: Minimal cleaning to preserve linguistic information
3. **Tokenization**: Byte-Pair Encoding (BPE) with a vocabulary size of 5000 tokens
4. **Sequence Padding**: Variable-length sequences are padded for batch processing

## Synthetic Summary Generation

Since LibriSpeech doesn't include summaries, we generate synthetic summaries for NLP training:

1. **Template-Based Approach**: Use templates like "This recording discusses: {content}" or "Key points: {content}"
2. **Content Extraction**: Extract key sentences from transcripts to form summaries
3. **Diversity**: Multiple template variations to increase dataset diversity

## Dataset Integration Scripts

### 1. Dataset Loader (`dataset_loader.py`)

Handles loading the LibriSpeech dataset from HuggingFace and organizing it into our standard directory structure.

**Usage:**
```bash
python dataset_loader.py
```

### 2. ASR Data Conversion (`convert_asr_data.py`)

Converts raw audio files to Mel-Spectrogram tensors and creates CTC-compatible label sequences.

**Usage:**
```bash
python convert_asr_data.py
```

### 3. NLP Data Conversion (`convert_nlp_data.py`)

Converts text files to tokenized tensors using BPE tokenization.

**Usage:**
```bash
python convert_nlp_data.py
```

### 4. Synthetic Summary Generation (`generate_synthetic_summaries.py`)

Generates synthetic summaries for the NLP model training from ASR transcripts.

**Usage:**
```bash
python generate_synthetic_summaries.py
```

## Training Pipeline

### ASR Model Training

1. Process dataset using `dataset_loader.py`
2. Convert audio to spectrograms using `convert_asr_data.py`
3. Train ASR model:
   ```bash
   cd ml_models/asr
   python train_asr.py
   ```

### NLP Model Training

1. Generate synthetic summaries using `generate_synthetic_summaries.py`
2. Convert text to tokens using `convert_nlp_data.py`
3. Train NLP model:
   ```bash
   cd ml_models/nlp
   python train_nlp.py
   ```

## Evaluation Metrics

The evaluation scripts save metrics to `ml_models/evaluation/metrics.json`:

- **ASR Metrics**: WER (Word Error Rate), CER (Character Error Rate)
- **NLP Metrics**: ROUGE-1, ROUGE-2, ROUGE-L

## Expected Performance

With this dataset and preprocessing approach, we expect:

- **ASR Model**: Word Error Rate (WER) < 20% on validation set
- **NLP Model**: ROUGE-1 score > 0.4 on validation set
- **End-to-End Pipeline**: Coherent note generation from speech input

## Dataset Configuration

See `dataset_config.json` for detailed configuration parameters including:
- Sampling rate
- Preprocessing parameters
- Data split ratios
- Storage paths

## Troubleshooting

### Common Issues

1. **Dataset Loading Errors**: Ensure you have internet access and HuggingFace credentials set up
2. **Memory Issues**: Process dataset in smaller batches if you encounter memory issues
3. **File Not Found Errors**: Verify dataset paths and file permissions

### Solutions

1. **Install Dependencies**:
   ```bash
   pip install datasets torchaudio librosa
   ```

2. **Increase Swap Space**: For memory issues, consider increasing system swap space
3. **Check Permissions**: Ensure read/write permissions for data directories

## Next Steps

1. Run the dataset loader script to download and organize the LibriSpeech dataset
2. Process the data using the conversion scripts
3. Train the ASR and NLP models
4. Evaluate model performance using the evaluation scripts
5. Fine-tune hyperparameters based on evaluation results