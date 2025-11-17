# Research Background

## Automatic Speech Recognition (ASR)

Automatic Speech Recognition (ASR) is a field of computational linguistics and computer science that deals with the recognition and translation of spoken language into text by computers. Traditional ASR systems have evolved from simple pattern matching approaches to complex deep learning models.

### Historical Development

The development of ASR systems can be traced through several key phases:

1. **Early Template Matching (1950s-1970s)**: Simple digit recognition systems that matched spoken input against pre-recorded templates.

2. **Hidden Markov Models (1980s-1990s)**: Statistical approaches using HMMs became the dominant paradigm, modeling speech as a sequence of states.

3. **Deep Learning Era (2000s-Present)**: Neural networks, particularly deep neural networks (DNNs), convolutional neural networks (CNNs), and recurrent neural networks (RNNs) revolutionized ASR performance.

### Key Techniques in Modern ASR

#### Connectionist Temporal Classification (CTC)

CTC is a loss function specifically designed for sequence-to-sequence problems where the alignment between input and output is unknown. It's particularly useful for speech recognition where the duration of spoken words can vary.

#### Mel-Spectrogram Features

Mel-spectrograms are a representation of the short-term power spectrum of a sound, based on a linear scale of frequency and a logarithmic scale of the amplitude. They capture the perceptually relevant characteristics of audio signals.

#### Deep Learning Architectures

Modern ASR systems commonly use:
- **CNNs** for local feature extraction
- **RNNs/LSTMs** for sequence modeling
- **Attention mechanisms** for better alignment
- **Transformer models** for end-to-end training

## Text Summarization

Text summarization is the process of creating a concise and coherent summary of a longer text document while preserving key information and overall meaning.

### Types of Summarization

1. **Extractive Summarization**: Selects and combines existing sentences or phrases from the source document.

2. **Abstractive Summarization**: Generates new sentences that capture the meaning of the source document, potentially using words not present in the original.

### Transformer-Based Models

The Transformer architecture, introduced in "Attention is All You Need" (Vaswani et al., 2017), has become the foundation for state-of-the-art summarization models. Transformers use self-attention mechanisms to model relationships between all words in a sequence, enabling parallel processing and better handling of long-range dependencies.

### Evaluation Metrics

#### ROUGE Metrics

ROUGE (Recall-Oriented Understudy for Gisting Evaluation) is a set of metrics for evaluating automatic summarization and machine translation software:

- **ROUGE-N**: Overlap of n-grams between generated and reference texts
- **ROUGE-L**: Longest Common Subsequence-based statistics
- **ROUGE-W**: Weighted longest common subsequence
- **ROUGE-S**: Skip-bigram based co-occurrence statistics

## Custom Implementation Approach

This project implements custom ASR and summarization models from scratch using only basic PyTorch components, without relying on pretrained models or specialized libraries. This approach:

1. **Enhances Understanding**: Provides deep insight into the inner workings of ASR and NLP models
2. **Ensures Control**: Allows complete control over model architecture and training process
3. **Facilitates Customization**: Enables easy modification for specific requirements
4. **Reduces Dependencies**: Minimizes reliance on external pretrained models

### Challenges and Considerations

Building models from scratch presents several challenges:

1. **Data Requirements**: Training effective models requires large, high-quality datasets
2. **Computational Resources**: Training from scratch is computationally intensive
3. **Hyperparameter Tuning**: Finding optimal parameters requires extensive experimentation
4. **Evaluation**: Proper evaluation requires robust metrics and benchmark datasets

### Advantages of Custom Implementation

1. **Educational Value**: Deep understanding of model mechanics
2. **Flexibility**: Complete control over architecture and training process
3. **Transparency**: Full visibility into model behavior
4. **Customization**: Ability to tailor models to specific domains or requirements