# Dataset Integration Guide

This guide explains how to integrate and use datasets with the custom voice-to-notes models.

## Dataset Integration Workflow

### 1. Dataset Selection

We use the LibriSpeech dataset (`nguyenvulebinh/libris_clean_100`) from HuggingFace as our primary dataset because:

- High-quality audio recordings
- Professional transcriptions
- Standard benchmark in speech recognition research
- Approximately 100 hours of clean English speech

### 2. Dataset Loading

The dataset is loaded using the `dataset_loader.py` script:

```bash
python dataset_loader.py
```

This script:
1. Downloads the LibriSpeech dataset from HuggingFace
2. Organizes the data into our standard directory structure
3. Creates train/validation/test splits
4. Generates metadata files for each split

### 3. Synthetic Summary Generation

Since LibriSpeech doesn't include summaries, we generate synthetic summaries using:

```bash
python generate_synthetic_summaries.py
```

This script:
1. Takes transcripts from the ASR dataset
2. Generates synthetic summaries using template-based approaches
3. Creates text-summary pairs for NLP model training

### 4. Data Conversion

#### ASR Data Conversion

Convert audio files to mel-spectrograms:

```bash
python convert_asr_data.py
```

This script:
1. Loads audio files
2. Preprocesses them to mel-spectrograms
3. Converts transcripts to character indices
4. Saves processed tensors for efficient training

#### NLP Data Conversion

Convert text files to tokenized tensors:

```bash
python convert_nlp_data.py
```

This script:
1. Trains a BPE tokenizer on the text data
2. Tokenizes texts and summaries
3. Saves tokenized tensors for efficient training

### 5. Training Pipeline

Run the complete training pipeline:

```bash
python train_pipeline.py
```

This orchestrates the entire process:
1. Dataset loading and processing
2. Data conversion
3. Model training
4. Model evaluation
5. Metrics reporting

## Directory Structure

After dataset integration, the directory structure will be:

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

## Configuration

The dataset configuration is stored in `dataset_config.json`:

```json
{
  "dataset_name": "librispeech",
  "source": "HuggingFace nguyenvulebinh/libris_clean_100",
  "size_hours": 100,
  "sampling_rate": 16000,
  "audio_format": "WAV",
  "num_speakers": "Diverse",
  "linguistic_diversity": "High",
  "transcription_quality": "Professional",
  "asr_suitability": "Excellent",
  "nlp_suitability": "Good (with synthetic summaries)",
  "preprocessing": {
    "audio_normalization": "Convert to 16kHz mono",
    "text_normalization": "Lowercase conversion",
    "spectrogram_extraction": "80-dim mel-spectrograms",
    "tokenization": "BPE with 5000 vocab size"
  },
  "splits": {
    "train": 0.8,
    "validation": 0.1,
    "test": 0.1
  },
  "storage_paths": {
    "asr_data": "./data/asr/",
    "nlp_data": "./data/nlp/"
  }
}
```

## Expected Performance

With proper training on the LibriSpeech dataset:

- **ASR Model**: WER < 20% on validation set
- **NLP Model**: ROUGE-1 > 0.4 on validation set

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