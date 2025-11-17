# Training Custom Models with LibriSpeech Dataset

This document explains how to train your custom ASR and NLP models using the LibriSpeech dataset.

## Overview

The LibriSpeech dataset is a large-scale corpus of English speech derived from read audiobooks. It contains approximately 1000 hours of 16kHz read English speech from 250 speakers, mostly from the LibriVox project.

## Dataset Information

- **Name**: LibriSpeech (nguyenvulebinh/libris_clean_100)
- **Size**: ~100 hours of clean read English speech
- **Sampling Rate**: 16kHz
- **Speakers**: 250+ speakers
- **Content**: Read audiobooks from the LibriVox project

## Training Process

### 1. Dependencies Installation

First, ensure all required dependencies are installed:

```bash
# Install core dependencies
pip install -r requirements.txt

# Install additional libraries
pip install datasets torchaudio
```

### 2. Dataset Loading

The dataset is automatically loaded from HuggingFace using:

```python
from datasets import load_dataset
dataset = load_dataset("nguyenvulebinh/libris_clean_100", split="train.clean.100")
```

### 3. Data Preprocessing

#### ASR Data
- Audio files are preprocessed to mel-spectrograms using torchaudio
- Transcripts are converted to character indices for CTC training

#### NLP Data
- Since LibriSpeech doesn't include summaries, synthetic summaries are generated
- Texts are tokenized using a custom BPE tokenizer

### 4. Model Training

#### ASR Model
- **Architecture**: CNN + Bi-LSTM with CTC loss
- **Input**: 80-dim mel-spectrograms
- **Output**: Character-level transcriptions
- **Loss**: CTC loss

#### NLP Model
- **Architecture**: Transformer encoder-decoder
- **Tokenizer**: Custom BPE with 5000 vocabulary size
- **Output**: Generated notes/summaries
- **Loss**: Cross-entropy loss

### 5. Training Scripts

#### Automated Training
Run the complete training pipeline:
```bash
python train_pipeline.py
```

#### Manual Training
For more control, run each step individually:
```bash
# Load and process dataset
python dataset_loader.py

# Generate synthetic summaries
python generate_synthetic_summaries.py

# Convert data formats
python convert_asr_data.py
python convert_nlp_data.py

# Train models
cd asr && python train_asr.py
cd ../nlp && python train_nlp.py
```

## Expected Results

With proper training on the LibriSpeech dataset:
- **ASR Model**: WER < 20% on validation set
- **NLP Model**: ROUGE-1 > 0.4 on validation set

## Hardware Requirements

### Minimum Requirements
- **RAM**: 8GB
- **Storage**: 20GB free space
- **CPU**: Modern multi-core processor

### Recommended Requirements
- **GPU**: CUDA-compatible GPU with 8GB+ VRAM
- **RAM**: 16GB+
- **Storage**: 50GB+ free space (SSD recommended)

## Training Times

Estimated training times depend on hardware:

| Hardware | ASR Model | NLP Model | Total Time |
|----------|-----------|-----------|------------|
| CPU      | 8-12 hrs  | 12-24 hrs | 20-36 hrs  |
| GPU      | 2-4 hrs   | 3-6 hrs   | 5-10 hrs   |

## Troubleshooting

### Common Issues

1. **Memory Errors**
   - Reduce batch size in training scripts
   - Process dataset in smaller chunks
   - Use CPU training if GPU memory is insufficient

2. **Dataset Loading Errors**
   - Check internet connection
   - Verify sufficient disk space
   - Ensure HuggingFace credentials (if required)

3. **Dependency Issues**
   - Update pip: `pip install --upgrade pip`
   - Install dependencies individually if batch install fails

### Solutions

1. **Reduce Batch Size**
   Edit training scripts to use smaller batch sizes:
   ```python
   # In train_asr.py and train_nlp.py
   dataloader = DataLoader(dataset, batch_size=4, shuffle=True, collate_fn=collate_fn)
   ```

2. **Process Smaller Dataset**
   Use a subset of the data for initial testing:
   ```python
   dataset = load_dataset("nguyenvulebinh/libris_clean_100", split="train.clean.100[:1000]")
   ```

## Model Evaluation

After training, models are evaluated using:

- **ASR Model**: WER (Word Error Rate) and CER (Character Error Rate)
- **NLP Model**: ROUGE-1, ROUGE-2, and ROUGE-L scores

Metrics are saved to `evaluation/metrics.json`.

## Using Trained Models

Once trained, use the models with:

```bash
# End-to-end pipeline
python pipeline_voice_to_notes.py

# Example usage
python example_usage_with_dataset.py
```

## Next Steps

1. **Fine-tune hyperparameters** based on initial results
2. **Experiment with different architectures**
3. **Add data augmentation techniques**
4. **Implement advanced decoding methods** (beam search, etc.)

## Support

For issues with training:
1. Check console error messages
2. Verify all dependencies are installed
3. Ensure sufficient system resources
4. Review documentation in `docs/` directory