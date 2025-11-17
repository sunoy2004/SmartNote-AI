# Dataset Comparison for Custom ASR + NLP Models

## Dataset Analysis

### 1. LibriSpeech (HuggingFace)

```python
from datasets import load_dataset
ds = load_dataset("nguyenvulebinh/libris_clean_100")
```

**Pros:**
- Large dataset with ~100 hours of clean audio
- High-quality transcriptions
- Standard benchmark dataset for ASR research
- Multiple speakers with diverse accents
- 16kHz sampling rate (matches our model requirements)
- WAV format audio files

**Cons:**
- Only suitable for ASR training, lacks summaries for NLP training
- Requires additional processing to generate summaries for NLP model

### 2. MINDS-14 (HuggingFace)

```python
minds = load_dataset("PolyAI/minds14", name="en-US", split="train[:500]")
```

**Pros:**
- Real-world conversational data
- Intent classification annotations
- Multiple domains (banking, booking, etc.)
- Structured metadata

**Cons:**
- Small dataset (only 500 samples)
- Not specifically designed for ASR training
- Limited linguistic diversity
- May not be sufficient for training robust models

### 3. Kaggle – Automatic Speech Recognition Competition

Download:
```
kaggle competitions download -c automatic-speech-recognition-asr
```

**Pros:**
- Competition-quality dataset
- Likely includes evaluation metrics
- May have standardized format

**Cons:**
- Unknown size and quality
- Requires Kaggle account and API setup
- May have licensing restrictions

### 4. Kaggle – LibriSpeech Manifest + Audio Loader

```python
MANIFEST = "/kaggle/input/libri-manifest/librispeech_manifest (1).csv"
```

**Pros:**
- Based on LibriSpeech (high quality)
- CSV manifest format for easy processing
- Likely includes proper train/validation splits

**Cons:**
- Requires Kaggle account and API setup
- Unknown exact contents

## Recommendation

### Chosen Strategy: LibriSpeech for ASR + Synthetic Summaries for NLP

**Justification:**

1. **LibriSpeech** is the gold standard for ASR research with:
   - ~100 hours of clean audio
   - Professional recordings with high SNR
   - Accurate transcriptions
   - Diverse speaker pool
   - Standard 16kHz sampling rate
   - Well-established benchmark

2. **Synthetic Summaries** for NLP training because:
   - LibriSpeech lacks summaries
   - We can generate domain-appropriate summaries from transcripts
   - Ensures consistency between ASR and NLP training data
   - Allows for controlled experimentation

## Dataset Integration Plan

### ASR Training Pipeline:
1. Load LibriSpeech dataset
2. Preprocess audio to 16kHz mono WAV
3. Extract mel-spectrograms
4. Convert transcripts to character indices
5. Save processed tensors to `/data/asr/train|valid|test/`

### NLP Training Pipeline:
1. Use LibriSpeech transcripts as source texts
2. Generate synthetic summaries using template-based approach
3. Create text-summary pairs
4. Tokenize using BPE tokenizer
5. Save processed tensors to `/data/nlp/train|valid|test/`

## Expected Performance

With this dataset strategy:
- **ASR Model**: Should achieve WER < 20% on validation set
- **NLP Model**: Should achieve ROUGE-1 > 0.4 on validation set
- **End-to-End Pipeline**: Should produce coherent notes from speech