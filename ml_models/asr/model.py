"""
Custom Automatic Speech Recognition (ASR) Model Implementation
Implements a model architecture using:
- Audio Preprocessing: 16 kHz mono, Mel-Spectrogram extraction
- ASR Model Architecture: 3×CNN layers, 2×Bi-LSTM layers, Fully connected layer with Softmax
- Training Method: CTC Loss
"""

import torch
import torch.nn as nn
import torchaudio
import torchaudio.transforms as transforms
import numpy as np


class CustomASRModel(nn.Module):
    """
    Custom ASR Model with CNN + Bi-LSTM architecture
    """
    
    def __init__(self, input_dim=80, hidden_dim=256, num_classes=40, num_layers=2):
        """
        Initialize the ASR model
        
        Args:
            input_dim (int): Input feature dimension (default: 80 for mel-spectrogram)
            hidden_dim (int): Hidden dimension for LSTM layers (default: 256)
            num_classes (int): Number of output classes (characters + blank for CTC)
            num_layers (int): Number of LSTM layers (default: 2)
        """
        super(CustomASRModel, self).__init__()
        
        # CNN layers for feature extraction
        self.conv_layers = nn.Sequential(
            # First conv layer
            nn.Conv1d(input_dim, 256, kernel_size=3, padding=1),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.1),
            
            # Second conv layer
            nn.Conv1d(256, 256, kernel_size=3, padding=1),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.1),
            
            # Third conv layer
            nn.Conv1d(256, 256, kernel_size=3, padding=1),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.1),
        )
        
        # Bi-LSTM layers
        self.lstm_layers = nn.LSTM(
            input_size=256,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            bidirectional=True,
            batch_first=True,
            dropout=0.1 if num_layers > 1 else 0
        )
        
        # Fully connected layer
        self.fc = nn.Linear(hidden_dim * 2, num_classes)  # *2 for bidirectional
        
        # Character set (example)
        self.characters = [' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
                          'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 
                          "'", '-', '.', '?', '!', ',', ';', ':', '"', '(', ')', '<BLANK>']
        
    def forward(self, x):
        """
        Forward pass of the ASR model
        
        Args:
            x (Tensor): Input tensor of shape (batch_size, input_dim, seq_len)
            
        Returns:
            Tensor: Output logits of shape (batch_size, seq_len, num_classes)
        """
        # Pass through CNN layers
        # x shape: (batch_size, input_dim, seq_len)
        cnn_out = self.conv_layers(x)
        # cnn_out shape: (batch_size, 256, seq_len)
        
        # Transpose for LSTM input
        lstm_input = cnn_out.transpose(1, 2)
        # lstm_input shape: (batch_size, seq_len, 256)
        
        # Pass through Bi-LSTM layers
        lstm_out, _ = self.lstm_layers(lstm_input)
        # lstm_out shape: (batch_size, seq_len, hidden_dim*2)
        
        # Pass through fully connected layer
        output = self.fc(lstm_out)
        # output shape: (batch_size, seq_len, num_classes)
        
        return output


class AudioPreprocessor:
    """
    Audio preprocessing module for ASR
    """
    
    def __init__(self, sample_rate=16000):
        """
        Initialize audio preprocessor
        
        Args:
            sample_rate (int): Target sample rate (default: 16000)
        """
        self.sample_rate = sample_rate
        self.resampler = None
        self.mel_spectrogram = transforms.MelSpectrogram(
            sample_rate=sample_rate,
            n_fft=400,           # 25ms window at 16kHz = 400 samples
            hop_length=160,      # 10ms stride at 16kHz = 160 samples
            n_mels=80            # Number of mel filters
        )
        
    def preprocess_audio(self, waveform, original_sample_rate):
        """
        Preprocess audio waveform to mel-spectrogram
        
        Args:
            waveform (Tensor): Audio waveform tensor
            original_sample_rate (int): Original sample rate of the audio
            
        Returns:
            Tensor: Mel-spectrogram of shape (n_mels, time_frames)
        """
        # Resample if needed
        if original_sample_rate != self.sample_rate:
            if self.resampler is None:
                self.resampler = transforms.Resample(
                    orig_freq=original_sample_rate, 
                    new_freq=self.sample_rate
                )
            waveform = self.resampler(waveform)
        
        # Convert to mono if stereo
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)
        
        # Convert to mel-spectrogram
        mel_spec = self.mel_spectrogram(waveform)
        
        # Apply log transformation
        log_mel_spec = torch.log(mel_spec + 1e-9)
        
        # Remove channel dimension
        log_mel_spec = log_mel_spec.squeeze(0)
        
        return log_mel_spec


def ctc_decode(predictions, blank_label=39):
    """
    Decode CTC predictions to text
    
    Args:
        predictions (Tensor): Model predictions of shape (seq_len, num_classes)
        blank_label (int): Label for blank character
        
    Returns:
        str: Decoded text
    """
    # Get the most probable characters at each time step
    predicted_chars = torch.argmax(predictions, dim=1)
    
    # Remove consecutive duplicates and blanks
    decoded_chars = []
    prev_char = None
    
    for char in predicted_chars:
        if char.item() != blank_label and char.item() != prev_char:
            decoded_chars.append(char.item())
        prev_char = char.item()
    
    # Convert indices to characters
    decoded_text = ''.join([CustomASRModel().characters[i] for i in decoded_chars])
    
    return decoded_text


if __name__ == "__main__":
    # Example usage
    print("Custom ASR Model Implementation")
    print("-------------------------------")
    
    # Create model instance
    model = CustomASRModel()
    print(f"Model created with {sum(p.numel() for p in model.parameters())} parameters")
    
    # Example input (batch_size=1, input_dim=80, seq_len=100)
    example_input = torch.randn(1, 80, 100)
    
    # Forward pass
    with torch.no_grad():
        output = model(example_input)
        print(f"Input shape: {example_input.shape}")
        print(f"Output shape: {output.shape}")