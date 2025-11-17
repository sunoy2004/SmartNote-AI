# Model Explanation

## ASR Model Architecture

The Automatic Speech Recognition model is designed as a deep neural network combining Convolutional Neural Networks (CNNs) for feature extraction and Bidirectional Long Short-Term Memory (Bi-LSTM) networks for sequence modeling.

### Architecture Overview

```
Input Audio → Mel-Spectrogram → CNN Layers → Bi-LSTM Layers → Fully Connected → CTC Loss
```

### Detailed Components

#### 1. Audio Preprocessing
- **Sample Rate Conversion**: All audio is converted to 16kHz mono
- **Mel-Spectrogram Extraction**: 
  - Window size: 25ms (400 samples at 16kHz)
  - Stride: 10ms (160 samples at 16kHz)
  - Number of mel filters: 80
  - Log transformation applied for better numerical stability

#### 2. CNN Feature Extraction (3 Layers)
Each CNN layer consists of:
- **Conv1D Layer**: Extracts local features from mel-spectrogram
- **Batch Normalization**: Normalizes activations for stable training
- **ReLU Activation**: Introduces non-linearity
- **Dropout (0.1)**: Regularization to prevent overfitting

Parameters:
- Layer 1: 80 input channels → 256 output channels, kernel size 3
- Layer 2: 256 input channels → 256 output channels, kernel size 3
- Layer 3: 256 input channels → 256 output channels, kernel size 3

#### 3. Bi-LSTM Sequence Modeling (2 Layers)
- **Hidden Units**: 256 units per layer
- **Bidirectional**: Processes sequences in both forward and backward directions
- **Dropout**: 0.1 between layers for regularization
- **Batch First**: False (sequence length first for Transformer compatibility)

#### 4. Output Layer
- **Fully Connected**: 512 input (256*2 for bidirectional) → 40 output classes
- **Softmax**: Applied during inference for probability distribution
- **Character Set**: 39 characters + 1 blank token for CTC

### Training Methodology

#### Connectionist Temporal Classification (CTC)
CTC is used as the loss function to handle the alignment problem between input audio frames and output characters:

1. **Blank Token**: Special token to handle variable-length alignments
2. **Path Marginalization**: Sums probabilities of all possible alignments
3. **Dynamic Programming**: Efficient computation using forward-backward algorithm

#### Optimization
- **Optimizer**: Adam optimizer
- **Learning Rate**: 0.001 (initial)
- **Batch Size**: 8 samples
- **Epochs**: 10 (configurable)

## Summarization Model Architecture

The text summarization model is based on the Transformer architecture with an encoder-decoder structure.

### Architecture Overview

```
Source Text → Embedding → Encoder (4 Layers) → Decoder (4 Layers) → Output
```

### Detailed Components

#### 1. Tokenization
- **Byte-Pair Encoding (BPE)**: Custom implementation for subword tokenization
- **Vocabulary Size**: 10,000 tokens
- **Special Tokens**: PAD, UNK, BOS, EOS

#### 2. Embedding Layer
- **Dimension**: 256
- **Positional Encoding**: Sinusoidal positional encodings added to embeddings

#### 3. Encoder (4 Layers)
Each encoder layer consists of:
- **Multi-Head Attention**: 8 attention heads
- **Feed-Forward Network**: 
  - Input: 256 dimensions
  - Hidden: 512 dimensions
  - Output: 256 dimensions
- **Layer Normalization**: Applied after each sub-layer
- **Residual Connections**: Skip connections around each sub-layer
- **Dropout**: 0.1 for regularization

#### 4. Decoder (4 Layers)
Each decoder layer consists of:
- **Masked Multi-Head Attention**: Prevents attending to future tokens
- **Multi-Head Attention**: Attends to encoder output
- **Feed-Forward Network**: Same as encoder
- **Layer Normalization**: Applied after each sub-layer
- **Residual Connections**: Skip connections around each sub-layer
- **Dropout**: 0.1 for regularization

#### 5. Output Layer
- **Linear Projection**: 256 dimensions → 10,000 vocabulary size
- **Softmax**: Applied during inference for probability distribution

### Training Methodology

#### Teacher Forcing
During training, the model uses teacher forcing where the ground truth tokens are fed as input to the decoder instead of the model's own predictions.

#### Loss Function
- **Cross-Entropy Loss**: Applied at each time step
- **Padding Mask**: Ignores padding tokens in loss computation
- **Label Smoothing**: (Optional) Can be added for better generalization

#### Optimization
- **Optimizer**: Adam optimizer
- **Learning Rate**: 0.001 (initial)
- **Batch Size**: 8 samples
- **Epochs**: 10 (configurable)
- **Dropout**: 0.1 throughout the model

## Model Integration

### Pipeline Flow
1. **Audio Input**: WAV or MP3 file
2. **ASR Processing**: Audio → Mel-Spectrogram → ASR Model → Transcript
3. **NLP Processing**: Transcript → Tokenization → Summarization Model → Notes
4. **Output**: JSON or text file containing both transcript and notes

### Memory and Computational Considerations
- **ASR Model**: Relatively lightweight, suitable for real-time processing
- **Summarization Model**: More computationally intensive, especially for long texts
- **GPU Support**: Both models support GPU acceleration for faster training/inference
- **Memory Optimization**: Models can be optimized with techniques like gradient checkpointing

## Hyperparameter Tuning

### ASR Model
- **CNN Filters**: Number and size of convolutional filters
- **LSTM Units**: Hidden state dimensions
- **Dropout Rates**: Regularization strength
- **Learning Rate**: Optimization speed and stability

### Summarization Model
- **Model Dimensions**: Embedding and hidden state sizes
- **Attention Heads**: Number of parallel attention mechanisms
- **Layers**: Depth of encoder and decoder
- **Dropout Rates**: Regularization strength

## Model Evaluation

### ASR Evaluation Metrics
- **Word Error Rate (WER)**: Primary metric for ASR performance
- **Character Error Rate (CER)**: Fine-grained error measurement
- **Substitution/Deletion/Insertion Rates**: Detailed error analysis

### Summarization Evaluation Metrics
- **ROUGE-1**: Unigram overlap between generated and reference summaries
- **ROUGE-2**: Bigram overlap for capturing phrase-level similarity
- **ROUGE-L**: Longest Common Subsequence for sentence-level structure
- **BLEU**: Precision-based metric (optional)

## Future Improvements

### ASR Enhancements
1. **Attention Mechanisms**: Replace Bi-LSTM with self-attention for better parallelization
2. **Data Augmentation**: Implement more sophisticated audio augmentation techniques
3. **Language Modeling**: Integrate external language models for better decoding

### Summarization Enhancements
1. **Beam Search**: Implement advanced decoding strategies
2. **Copy Mechanism**: Enable copying of rare words from source to summary
3. **Multi-Document Summarization**: Extend to handle multiple input documents