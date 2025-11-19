"""
ASR Model Training Script
Trains the custom ASR model using CTC loss
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
import torchaudio
import numpy as np
import os
import json
from tqdm import tqdm
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import our custom model
from asr.model import CustomASRModel, AudioPreprocessor, ctc_decode


class ASRDataset(Dataset):
    """
    Custom Dataset for ASR training
    """
    
    def __init__(self, data_dir, preprocessor, split_name="train"):
        """
        Initialize dataset
        
        Args:
            data_dir (str): Path to directory containing audio files and transcripts
            preprocessor (AudioPreprocessor): Audio preprocessing module
            split_name (str): Name of data split (train/validation/test)
        """
        self.data_dir = data_dir
        self.preprocessor = preprocessor
        self.split_name = split_name
        self.samples = []
        
        # Load processed dataset metadata
        processed_metadata_path = os.path.join(data_dir, "asr", split_name, "processed_metadata.json")
        if os.path.exists(processed_metadata_path):
            with open(processed_metadata_path, 'r') as f:
                self.samples = json.load(f)
        else:
            # Generate dummy data for demonstration
            self._generate_dummy_data()
    
    def _generate_dummy_data(self):
        """
        Generate dummy data for demonstration purposes
        """
        print("Generating dummy dataset for demonstration...")
        for i in range(100):
            self.samples.append({
                "audio_file": f"sample_{i}.wav",
                "transcript": f"This is a sample transcript number {i}"
            })
    
    def __len__(self):
        return len(self.samples)
    
    def __getitem__(self, idx):
        """
        Get a single sample from the dataset
        """
        sample = self.samples[idx]
        
        try:
            # Load preprocessed spectrogram and target tensors
            processed_dir = os.path.join(self.data_dir, "asr", self.split_name, "processed")
            
            # Load spectrogram
            spec_path = os.path.join(processed_dir, sample["spectrogram_file"])
            mel_spectrogram = torch.load(spec_path)
            
            # Load target
            target_path = os.path.join(processed_dir, sample["target_file"])
            target_tensor = torch.load(target_path)
            
            return mel_spectrogram, target_tensor
        except Exception as e:
            print(f"Error loading sample {idx}: {e}")
            # Return dummy data as fallback
            mel_spectrogram = torch.randn(80, 100)  # (n_mels, time_frames)
            target_tensor = torch.LongTensor([1, 2, 3, 4, 5])  # dummy target
            return mel_spectrogram, target_tensor


def compute_ctc_loss(predictions, targets, input_lengths, target_lengths):
    """
    Compute CTC loss for ASR training
    
    Args:
        predictions (Tensor): Model predictions of shape (batch_size, seq_len, num_classes)
        targets (Tensor): Target sequences of shape (batch_size, max_target_len)
        input_lengths (Tensor): Length of each input sequence
        target_lengths (Tensor): Length of each target sequence
        
    Returns:
        Tensor: CTC loss value
    """
    # Transpose predictions for CTC loss (expected: (seq_len, batch_size, num_classes))
    predictions = predictions.permute(1, 0, 2)
    
    # Create CTC loss criterion
    criterion = nn.CTCLoss(blank=39, reduction='mean', zero_infinity=True)
    
    # Compute loss
    loss = criterion(predictions, targets, input_lengths, target_lengths)
    
    return loss


def train_asr_model(data_dir="./data"):
    """
    Train the ASR model
    
    Args:
        data_dir (str): Path to data directory
    """
    print("Starting ASR Model Training")
    print("=" * 30)
    
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Initialize preprocessor and model
    preprocessor = AudioPreprocessor()
    model = CustomASRModel().to(device)
    
    # Create dataset and dataloader
    dataset = ASRDataset(data_dir, preprocessor, "train")
    dataloader = DataLoader(dataset, batch_size=8, shuffle=True, collate_fn=collate_fn)
    
    # Initialize optimizer
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    # Training loop
    num_epochs = 10
    for epoch in range(num_epochs):
        model.train()
        total_loss = 0.0
        
        progress_bar = tqdm(dataloader, desc=f"Epoch {epoch+1}/{num_epochs}")
        for batch_idx, (mel_specs, targets) in enumerate(progress_bar):
            # Move data to device
            mel_specs = [spec.to(device) for spec in mel_specs]
            targets = targets.to(device)
            
            # Prepare inputs (transpose to match model input: (batch_size, input_dim, seq_len))
            batch_inputs = torch.stack([spec.transpose(0, 1) for spec in mel_specs])
            
            # Forward pass
            predictions = model(batch_inputs)
            
            # Prepare lengths for CTC loss
            input_lengths = torch.full((len(mel_specs),), predictions.size(1), dtype=torch.long)
            target_lengths = torch.LongTensor([len(target) for target in targets])
            
            # Compute loss
            loss = compute_ctc_loss(predictions, targets, input_lengths, target_lengths)
            
            # Backward pass
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            progress_bar.set_postfix({'Loss': f'{loss.item():.4f}'})
        
        avg_loss = total_loss / len(dataloader)
        print(f"Epoch {epoch+1}/{num_epochs}, Average Loss: {avg_loss:.4f}")
    
    # Save model
    torch.save(model.state_dict(), "asr_model.pth")
    print("Model saved as 'asr_model.pth'")


def collate_fn(batch):
    """
    Custom collate function to handle variable-length sequences
    """
    mel_specs, targets = zip(*batch)
    
    # Pad targets to the same length
    max_target_len = max([len(target) for target in targets])
    padded_targets = []
    for target in targets:
        padding = torch.zeros(max_target_len - len(target), dtype=torch.long)
        padded_target = torch.cat([target, padding])
        padded_targets.append(padded_target)
    
    targets_tensor = torch.stack(padded_targets)
    
    return mel_specs, targets_tensor


if __name__ == "__main__":
    train_asr_model()