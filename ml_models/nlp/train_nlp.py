"""
NLP Summarization Model Training Script
Trains the custom Transformer-based summarization model
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
import numpy as np
import os
import json
from tqdm import tqdm
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import our custom model
from nlp.model_summarizer import CustomSummarizer, BPETokenizer, create_masks


class SummarizationDataset(Dataset):
    """
    Custom Dataset for Summarization training
    """
    
    def __init__(self, data_dir, tokenizer, split_name="train"):
        """
        Initialize dataset
        
        Args:
            data_dir (str): Path to directory containing text files and summaries
            tokenizer (BPETokenizer): BPE tokenizer
            split_name (str): Name of data split (train/validation/test)
        """
        self.data_dir = data_dir
        self.tokenizer = tokenizer
        self.split_name = split_name
        self.samples = []
        
        # Load processed dataset metadata
        processed_metadata_path = os.path.join(data_dir, "nlp", split_name, "processed_metadata.json")
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
                "text": f"This is a sample text number {i} that contains some information for summarization.",
                "summary": f"Summary of sample {i}"
            })
    
    def __len__(self):
        return len(self.samples)
    
    def __getitem__(self, idx):
        """
        Get a single sample from the dataset
        """
        sample = self.samples[idx]
        
        try:
            # Load preprocessed token tensors
            processed_dir = os.path.join(self.data_dir, "nlp", self.split_name, "processed")
            
            # Load text tokens
            text_path = os.path.join(processed_dir, sample["text_tokens_file"])
            text_tensor = torch.load(text_path)
            
            # Load summary tokens
            summary_path = os.path.join(processed_dir, sample["summary_tokens_file"])
            summary_tensor = torch.load(summary_path)
            
            return text_tensor, summary_tensor
        except Exception as e:
            print(f"Error loading sample {idx}: {e}")
            # Return dummy data as fallback
            text_tensor = torch.LongTensor([1, 2, 3, 4, 5])
            summary_tensor = torch.LongTensor([1, 2, 3])
            return text_tensor, summary_tensor


def collate_fn(batch):
    """
    Custom collate function to handle variable-length sequences
    """
    texts, summaries = zip(*batch)
    
    # Pad sequences to the same length
    max_text_len = max([len(text) for text in texts])
    max_summary_len = max([len(summary) for summary in summaries])
    
    padded_texts = []
    padded_summaries = []
    
    for text, summary in zip(texts, summaries):
        # Pad text
        text_padding = torch.zeros(max_text_len - len(text), dtype=torch.long)
        padded_text = torch.cat([text, text_padding])
        padded_texts.append(padded_text)
        
        # Pad summary
        summary_padding = torch.zeros(max_summary_len - len(summary), dtype=torch.long)
        padded_summary = torch.cat([summary, summary_padding])
        padded_summaries.append(padded_summary)
    
    texts_tensor = torch.stack(padded_texts)
    summaries_tensor = torch.stack(padded_summaries)
    
    return texts_tensor, summaries_tensor


def compute_loss(predictions, targets, pad_idx=0):
    """
    Compute cross-entropy loss for summarization
    
    Args:
        predictions (Tensor): Model predictions of shape (tgt_len, batch_size, vocab_size)
        targets (Tensor): Target sequences of shape (batch_size, tgt_len)
        pad_idx (int): Padding index
        
    Returns:
        Tensor: Loss value
    """
    # Transpose targets to match predictions: (tgt_len, batch_size)
    targets = targets.transpose(0, 1)
    
    # Flatten for loss computation
    predictions = predictions.view(-1, predictions.size(-1))
    targets = targets.reshape(-1)
    
    # Create mask to ignore padding
    mask = (targets != pad_idx)
    
    # Compute loss
    criterion = nn.CrossEntropyLoss(ignore_index=pad_idx)
    loss = criterion(predictions, targets)
    
    return loss


def train_summarization_model(data_dir="./data"):
    """
    Train the summarization model
    
    Args:
        data_dir (str): Path to data directory
    """
    print("Starting Summarization Model Training")
    print("=" * 40)
    
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Initialize tokenizer and model
    tokenizer = BPETokenizer(vocab_size=5000)
    
    # In a real implementation, you would load the trained tokenizer
    # For demonstration, we'll recreate it
    dummy_texts = [f"This is a sample text number {i}" for i in range(100)]
    tokenizer.train(dummy_texts)
    
    model = CustomSummarizer(vocab_size=5000).to(device)
    
    # Create dataset and dataloader
    dataset = SummarizationDataset(data_dir, tokenizer, "train")
    dataloader = DataLoader(dataset, batch_size=8, shuffle=True, collate_fn=collate_fn)
    
    # Initialize optimizer
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    # Training loop
    num_epochs = 10
    for epoch in range(num_epochs):
        model.train()
        total_loss = 0.0
        
        progress_bar = tqdm(dataloader, desc=f"Epoch {epoch+1}/{num_epochs}")
        for batch_idx, (texts, summaries) in enumerate(progress_bar):
            # Move data to device
            texts = texts.to(device)  # (batch_size, src_len)
            summaries = summaries.to(device)  # (batch_size, tgt_len)
            
            # Prepare inputs (transpose for Transformer: (seq_len, batch_size))
            src = texts.transpose(0, 1)
            tgt = summaries.transpose(0, 1)
            
            # Create masks
            src_mask, tgt_mask, src_key_padding_mask, tgt_key_padding_mask = create_masks(
                src, tgt[:-1, :], pad_idx=0
            )
            
            # Forward pass
            predictions = model(
                src, tgt[:-1, :],
                src_mask=src_mask,
                tgt_mask=tgt_mask,
                src_key_padding_mask=src_key_padding_mask,
                tgt_key_padding_mask=tgt_key_padding_mask[:-1, :],
                memory_key_padding_mask=src_key_padding_mask
            )
            
            # Compute loss
            loss = compute_loss(predictions, summaries[:, 1:], pad_idx=0)
            
            # Backward pass
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            progress_bar.set_postfix({'Loss': f'{loss.item():.4f}'})
        
        avg_loss = total_loss / len(dataloader)
        print(f"Epoch {epoch+1}/{num_epochs}, Average Loss: {avg_loss:.4f}")
    
    # Save model and tokenizer
    torch.save(model.state_dict(), "summarizer_model.pth")
    print("Model saved as 'summarizer_model.pth'")


if __name__ == "__main__":
    train_summarization_model()