"""
Custom Summarization / Notes Generator Model Implementation
Implements a Transformer-based encoder-decoder architecture for text summarization
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import math
import numpy as np


class PositionalEncoding(nn.Module):
    """
    Positional Encoding module for Transformer models
    """
    
    def __init__(self, d_model, max_len=5000):
        """
        Initialize positional encoding
        
        Args:
            d_model (int): Model dimension
            max_len (int): Maximum sequence length
        """
        super(PositionalEncoding, self).__init__()
        
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(0).transpose(0, 1)
        self.register_buffer('pe', pe)
    
    def forward(self, x):
        """
        Add positional encoding to input
        
        Args:
            x (Tensor): Input tensor of shape (seq_len, batch_size, d_model)
            
        Returns:
            Tensor: Positional encoded tensor
        """
        x = x + self.pe[:x.size(0), :]
        return x


class CustomSummarizer(nn.Module):
    """
    Custom Transformer-based Summarization Model
    """
    
    def __init__(self, vocab_size=10000, d_model=256, nhead=8, num_encoder_layers=4, 
                 num_decoder_layers=4, dim_feedforward=512, dropout=0.1):
        """
        Initialize the summarization model
        
        Args:
            vocab_size (int): Size of vocabulary
            d_model (int): Model dimension (default: 256)
            nhead (int): Number of attention heads (default: 8)
            num_encoder_layers (int): Number of encoder layers (default: 4)
            num_decoder_layers (int): Number of decoder layers (default: 4)
            dim_feedforward (int): Dimension of feedforward network (default: 512)
            dropout (float): Dropout rate (default: 0.1)
        """
        super(CustomSummarizer, self).__init__()
        
        self.d_model = d_model
        self.vocab_size = vocab_size
        
        # Embedding layers
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.pos_encoder = PositionalEncoding(d_model)
        self.pos_decoder = PositionalEncoding(d_model)
        
        # Transformer
        self.transformer = nn.Transformer(
            d_model=d_model,
            nhead=nhead,
            num_encoder_layers=num_encoder_layers,
            num_decoder_layers=num_decoder_layers,
            dim_feedforward=dim_feedforward,
            dropout=dropout,
            batch_first=False
        )
        
        # Output layer
        self.fc_out = nn.Linear(d_model, vocab_size)
        self.dropout = nn.Dropout(dropout)
        
        # Initialize parameters
        self._init_weights()
    
    def _init_weights(self):
        """
        Initialize model weights
        """
        for p in self.parameters():
            if p.dim() > 1:
                nn.init.xavier_uniform_(p)
    
    def forward(self, src, tgt, src_mask=None, tgt_mask=None, 
                src_key_padding_mask=None, tgt_key_padding_mask=None, 
                memory_key_padding_mask=None):
        """
        Forward pass of the summarization model
        
        Args:
            src (Tensor): Source sequence tensor of shape (src_len, batch_size)
            tgt (Tensor): Target sequence tensor of shape (tgt_len, batch_size)
            src_mask (Tensor): Source mask tensor
            tgt_mask (Tensor): Target mask tensor
            src_key_padding_mask (Tensor): Source key padding mask
            tgt_key_padding_mask (Tensor): Target key padding mask
            memory_key_padding_mask (Tensor): Memory key padding mask
            
        Returns:
            Tensor: Output tensor of shape (tgt_len, batch_size, vocab_size)
        """
        # Embedding and positional encoding
        src_emb = self.embedding(src) * math.sqrt(self.d_model)
        tgt_emb = self.embedding(tgt) * math.sqrt(self.d_model)
        
        src_emb = self.pos_encoder(src_emb)
        tgt_emb = self.pos_decoder(tgt_emb)
        
        # Apply dropout
        src_emb = self.dropout(src_emb)
        tgt_emb = self.dropout(tgt_emb)
        
        # Transformer forward pass
        output = self.transformer(
            src_emb, tgt_emb,
            src_mask=src_mask,
            tgt_mask=tgt_mask,
            src_key_padding_mask=src_key_padding_mask,
            tgt_key_padding_mask=tgt_key_padding_mask,
            memory_key_padding_mask=memory_key_padding_mask
        )
        
        # Output projection
        output = self.fc_out(output)
        
        return output


class BPETokenizer:
    """
    Custom Byte-Pair Encoding (BPE) Tokenizer
    """
    
    def __init__(self, vocab_size=10000):
        """
        Initialize BPE tokenizer
        
        Args:
            vocab_size (int): Target vocabulary size
        """
        self.vocab_size = vocab_size
        self.vocab = {}
        self.inv_vocab = {}
        self.merges = {}
        
    def train(self, texts):
        """
        Train BPE tokenizer on a corpus of texts
        
        Args:
            texts (list): List of text strings
        """
        print("Training BPE tokenizer...")
        
        # Initialize vocabulary with characters
        vocab = {}
        for text in texts:
            for char in text.lower():
                vocab[char] = vocab.get(char, 0) + 1
        
        # Add special tokens
        vocab['<PAD>'] = 1
        vocab['<UNK>'] = 1
        vocab['<BOS>'] = 1
        vocab['<EOS>'] = 1
        
        # Convert to list of words
        words = list(vocab.keys())
        
        # Perform BPE merges until we reach target vocab size
        while len(vocab) < self.vocab_size:
            # Find most frequent pair
            pairs = self._get_stats(vocab)
            if not pairs:
                break
            best_pair = max(pairs, key=pairs.get)
            
            # Merge the pair
            vocab = self._merge_vocab(best_pair, vocab)
            
            # Store the merge
            self.merges[best_pair] = len(self.merges)
        
        # Create final vocabulary
        self.vocab = {word: idx for idx, word in enumerate(vocab)}
        self.inv_vocab = {idx: word for word, idx in self.vocab.items()}
        
        print(f"BPE tokenizer trained with vocabulary size: {len(self.vocab)}")
    
    def _get_stats(self, vocab):
        """
        Get statistics of symbol pairs in vocabulary
        """
        pairs = {}
        for word, freq in vocab.items():
            symbols = word.split()
            for i in range(len(symbols) - 1):
                pair = (symbols[i], symbols[i+1])
                pairs[pair] = pairs.get(pair, 0) + freq
        return pairs
    
    def _merge_vocab(self, pair, vocab):
        """
        Merge a pair in vocabulary
        """
        bigram = ' '.join(pair)
        new_vocab = {}
        for word, freq in vocab.items():
            new_word = word.replace(bigram, ''.join(pair))
            new_vocab[new_word] = new_vocab.get(new_word, 0) + freq
        return new_vocab
    
    def encode(self, text):
        """
        Encode text to token indices
        
        Args:
            text (str): Input text
            
        Returns:
            list: List of token indices
        """
        # For simplicity, we'll just split by characters
        # In a real implementation, you would apply BPE algorithm
        tokens = [char for char in text.lower()]
        
        # Convert to indices
        indices = []
        for token in tokens:
            if token in self.vocab:
                indices.append(self.vocab[token])
            else:
                indices.append(self.vocab.get('<UNK>', 0))
        
        return indices
    
    def decode(self, indices):
        """
        Decode token indices to text
        
        Args:
            indices (list): List of token indices
            
        Returns:
            str: Decoded text
        """
        # Convert indices to tokens
        tokens = []
        for idx in indices:
            if idx in self.inv_vocab:
                tokens.append(self.inv_vocab[idx])
            else:
                tokens.append('<UNK>')
        
        # Join tokens
        text = ''.join(tokens)
        return text


def create_masks(src, tgt, pad_idx=0):
    """
    Create masks for Transformer model
    
    Args:
        src (Tensor): Source tensor
        tgt (Tensor): Target tensor
        pad_idx (int): Padding index
        
    Returns:
        tuple: Source mask, target mask, source key padding mask, target key padding mask
    """
    # Source mask (no masking for encoder)
    src_mask = None
    src_key_padding_mask = (src == pad_idx).transpose(0, 1)
    
    # Target mask (causal mask for decoder)
    tgt_mask = nn.Transformer.generate_square_subsequent_mask(tgt.size(0)).to(tgt.device)
    tgt_key_padding_mask = (tgt == pad_idx).transpose(0, 1)
    
    return src_mask, tgt_mask, src_key_padding_mask, tgt_key_padding_mask


if __name__ == "__main__":
    # Example usage
    print("Custom Summarization Model Implementation")
    print("----------------------------------------")
    
    # Create model instance
    model = CustomSummarizer()
    print(f"Model created with {sum(p.numel() for p in model.parameters())} parameters")
    
    # Example input (seq_len, batch_size)
    src_example = torch.randint(0, 10000, (20, 4))  # 20 tokens, batch size 4
    tgt_example = torch.randint(0, 10000, (15, 4))  # 15 tokens, batch size 4
    
    # Forward pass
    with torch.no_grad():
        output = model(src_example, tgt_example)
        print(f"Source shape: {src_example.shape}")
        print(f"Target shape: {tgt_example.shape}")
        print(f"Output shape: {output.shape}")