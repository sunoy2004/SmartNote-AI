# Custom Models Training Guide

This guide explains how to train the custom ASR and NLP models using the integrated LibriSpeech dataset.

## Overview

The training process consists of several stages:
1. Dataset integration and preprocessing
2. Model training
3. Model evaluation
4. Metrics reporting

## Prerequisites

Before training, ensure you have:

1. **Installed dependencies**:
   ```bash
   pip install -r requirements.txt
   pip install datasets  # For LibriSpeech dataset integration
   ```

2. **Sufficient disk space** (approximately 10GB for the full LibriSpeech dataset)

3. **Internet connection** (for downloading the dataset)

## Training Pipeline

### Option 1: Automated Training (Recommended)

Run the complete training pipeline:
```bash
python train_pipeline.py
```

This script will automatically:
1. Load and process the LibriSpeech dataset
2. Generate synthetic summaries for NLP training
3. Convert data to appropriate formats
4. Train both ASR and NLP models
5. Evaluate model performance
6. Save metrics and trained models

### Option 2: Manual Training

For more control over the process, you can run each step manually:

#### Step 1: Load Dataset
```bash
python dataset_loader.py
```

#### Step 2: Generate Synthetic Summaries
```bash
python generate_synthetic_summaries.py
```

#### Step 3: Convert ASR Data
```bash
python convert_asr_data.py
```

#### Step 4: Convert NLP Data
```bash
python convert_nlp_data.py
```

#### Step 5: Train ASR Model
```bash
cd asr
python train_asr.py
```

#### Step 6: Train NLP Model
```bash
cd ../nlp
python train_nlp.py
```

#### Step 7: Evaluate Models
```bash
cd ../asr
python evaluate_asr.py

cd ../nlp
python evaluate_nlp.py
```

## Expected Training Times

Training times will vary based on your hardware:

- **ASR Model Training**: 2-4 hours on GPU, 8-12 hours on CPU
- **NLP Model Training**: 3-6 hours on GPU, 12-24 hours on CPU
- **Complete Pipeline**: 5-10 hours on GPU, 20-36 hours on CPU

## Model Performance

### Expected Metrics

After training, you should see metrics similar to:

**ASR Model**:
- WER (Word Error Rate): < 20% on validation set
- CER (Character Error Rate): < 10% on validation set

**NLP Model**:
- ROUGE-1: > 0.4 on validation set
- ROUGE-2: > 0.2 on validation set
- ROUGE-L: > 0.3 on validation set

### Metrics Storage

All metrics are saved to `evaluation/metrics.json` in the following format:

```json
{
  "asr_metrics": {
    "wer": {
      "train": 0.0,
      "validation": 0.0,
      "test": 0.0
    },
    "cer": {
      "train": 0.0,
      "validation": 0.0,
      "test": 0.0
    }
  },
  "nlp_metrics": {
    "rouge_1": {
      "train": 0.0,
      "validation": 0.0,
      "test": 0.0
    },
    "rouge_2": {
      "train": 0.0,
      "validation": 0.0,
      "test": 0.0
    },
    "rouge_l": {
      "train": 0.0,
      "validation": 0.0,
      "test": 0.0
    }
  }
}
```

## Trained Model Files

After successful training, the following model files will be created:

- **ASR Model**: `asr/asr_model.pth`
- **NLP Model**: `nlp/summarizer_model.pth`

## Troubleshooting

### Common Issues

1. **Dataset Loading Errors**: 
   - Ensure you have internet access
   - Check HuggingFace credentials if required
   - Verify sufficient disk space

2. **Memory Issues**:
   - Reduce batch size in training scripts
   - Process dataset in smaller chunks
   - Increase system swap space

3. **CUDA Out of Memory**:
   - Reduce batch size
   - Use CPU training instead (much slower but will work)

4. **File Not Found Errors**:
   - Verify all directories are created
   - Check file permissions

### Solutions

1. **Reduce Batch Size**:
   Edit `asr/train_asr.py` and `nlp/train_nlp.py`:
   ```python
   # Change this line:
   dataloader = DataLoader(dataset, batch_size=8, shuffle=True, collate_fn=collate_fn)
   # To:
   dataloader = DataLoader(dataset, batch_size=4, shuffle=True, collate_fn=collate_fn)
   ```

2. **Use CPU Training**:
   The scripts automatically detect GPU availability and fall back to CPU if not available.

## Advanced Configuration

### Hyperparameter Tuning

You can modify training hyperparameters in the respective training scripts:

**ASR Model** (`asr/train_asr.py`):
- Learning rate: `lr=0.001`
- Batch size: `batch_size=8`
- Number of epochs: `num_epochs=10`

**NLP Model** (`nlp/train_nlp.py`):
- Learning rate: `lr=0.001`
- Batch size: `batch_size=8`
- Number of epochs: `num_epochs=10`

### Model Architecture

You can modify model architectures in:

- **ASR Model**: `asr/model.py`
- **NLP Model**: `nlp/model_summarizer.py`

## Using Trained Models

After training, you can use the models with:

1. **End-to-End Pipeline**:
   ```bash
   python pipeline_voice_to_notes.py
   ```

2. **Example Usage**:
   ```bash
   python example_usage_with_dataset.py
   ```

## Next Steps

1. **Fine-tune hyperparameters** based on initial results
2. **Experiment with different architectures**
3. **Add data augmentation techniques**
4. **Implement advanced decoding methods** (beam search, etc.)
5. **Add more sophisticated evaluation metrics**

## Support

For issues with the training process, please check:
1. All dependencies are installed correctly
2. Sufficient system resources are available
3. The documentation in `docs/` directory
4. Error messages in the console output