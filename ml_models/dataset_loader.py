"""
Dataset Loader for Custom ASR + NLP Models
Handles loading, preprocessing, and saving datasets for both ASR and NLP training
"""

import os
import json
import torch
import torchaudio
import numpy as np
from pathlib import Path
from tqdm import tqdm
import librosa
from datasets import load_dataset
import random
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import our custom models
from asr.model import AudioPreprocessor
from nlp.model_summarizer import BPETokenizer

class DatasetLoader:
    """
    Dataset loader for ASR and NLP models
    """
    
    def __init__(self, dataset_name="librispeech", data_dir="./data"):
        """
        Initialize dataset loader
        
        Args:
            dataset_name (str): Name of dataset to load
            data_dir (str): Base directory for data storage
        """
        self.dataset_name = dataset_name
        self.data_dir = Path(data_dir)
        self.asr_data_dir = self.data_dir / "asr"
        self.nlp_data_dir = self.data_dir / "nlp"
        
        # Create directories if they don't exist
        self.asr_data_dir.mkdir(parents=True, exist_ok=True)
        self.nlp_data_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize preprocessors
        self.audio_preprocessor = AudioPreprocessor()
        
        # Initialize tokenizer
        self.tokenizer = BPETokenizer(vocab_size=5000)
        
        # Dataset configuration
        self.config = {
            "dataset_name": dataset_name,
            "sampling_rate": 16000,
            "train_split": 0.8,
            "val_split": 0.1,
            "test_split": 0.1
        }
    
    def load_dataset(self):
        """
        Load the specified dataset
        """
        print(f"Loading {self.dataset_name} dataset...")
        
        if self.dataset_name == "librispeech":
            # Load LibriSpeech dataset
            dataset = load_dataset("nguyenvulebinh/libris_clean_100")
            return dataset
        else:
            raise ValueError(f"Unsupported dataset: {self.dataset_name}")
    
    def preprocess_audio(self, waveform, sample_rate):
        """
        Preprocess audio for ASR model
        
        Args:
            waveform (Tensor): Audio waveform
            sample_rate (int): Sample rate
            
        Returns:
            Tensor: Preprocessed mel-spectrogram
        """
        return self.audio_preprocessor.preprocess_audio(waveform, sample_rate)
    
    def generate_synthetic_summary(self, transcript):
        """
        Generate synthetic summary from transcript
        
        Args:
            transcript (str): Source transcript
            
        Returns:
            str: Generated summary
        """
        # Simple template-based summarization
        sentences = transcript.split('.')
        if len(sentences) > 1:
            # Take first and last sentences as summary
            summary = f"{sentences[0]}. {sentences[-2]}." if len(sentences) > 2 else f"{sentences[0]}."
        else:
            # For short transcripts, just use the transcript
            summary = transcript
            
        # Add summary prefix
        summary_templates = [
            f"This recording discusses: {summary}",
            f"Key points: {summary}",
            f"Summary: {summary}",
            f"Main content: {summary}"
        ]
        
        return random.choice(summary_templates)
    
    def prepare_asr_data(self, dataset, split_name, dataset_split_name):
        """
        Prepare ASR training data
        
        Args:
            dataset: HuggingFace dataset
            split_name (str): Name of split (train/val/test)
            dataset_split_name (str): Actual name of split in dataset
        """
        print(f"Preparing ASR {split_name} data...")
        
        # Create split directory
        split_dir = self.asr_data_dir / split_name
        split_dir.mkdir(exist_ok=True)
        
        audio_dir = split_dir / "audio"
        audio_dir.mkdir(exist_ok=True)
        
        # Process samples
        samples = []
        for idx, sample in enumerate(tqdm(dataset[dataset_split_name])):
            try:
                # Get audio and transcript
                audio = sample["audio"]
                transcript = sample["text"].lower()
                
                # Save audio file
                audio_path = audio_dir / f"sample_{idx:06d}.wav"
                torchaudio.save(str(audio_path), torch.tensor(audio["array"]).unsqueeze(0), audio["sampling_rate"])
                
                # Add to samples
                samples.append({
                    "audio_file": f"sample_{idx:06d}.wav",
                    "transcript": transcript
                })
            except Exception as e:
                print(f"Error processing sample {idx}: {e}")
                continue
        
        # Save metadata
        metadata_path = split_dir / "metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(samples, f, indent=2)
        
        print(f"Saved {len(samples)} ASR samples to {split_dir}")
    
    def prepare_nlp_data(self, dataset, split_name, dataset_split_name):
        """
        Prepare NLP training data
        
        Args:
            dataset: HuggingFace dataset
            split_name (str): Name of split (train/val/test)
            dataset_split_name (str): Actual name of split in dataset
        """
        print(f"Preparing NLP {split_name} data...")
        
        # Create split directory
        split_dir = self.nlp_data_dir / split_name
        split_dir.mkdir(exist_ok=True)
        
        texts_dir = split_dir / "texts"
        summaries_dir = split_dir / "summaries"
        texts_dir.mkdir(exist_ok=True)
        summaries_dir.mkdir(exist_ok=True)
        
        # Process samples
        samples = []
        for idx, sample in enumerate(tqdm(dataset[dataset_split_name])):
            try:
                # Get transcript
                transcript = sample["text"].lower()
                
                # Generate synthetic summary
                summary = self.generate_synthetic_summary(transcript)
                
                # Save text and summary files
                text_path = texts_dir / f"text_{idx:06d}.txt"
                summary_path = summaries_dir / f"summary_{idx:06d}.txt"
                
                with open(text_path, 'w') as f:
                    f.write(transcript)
                
                with open(summary_path, 'w') as f:
                    f.write(summary)
                
                # Add to samples
                samples.append({
                    "text_file": f"text_{idx:06d}.txt",
                    "summary_file": f"summary_{idx:06d}.txt",
                    "text": transcript,
                    "summary": summary
                })
            except Exception as e:
                print(f"Error processing sample {idx}: {e}")
                continue
        
        # Save metadata
        metadata_path = split_dir / "metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(samples, f, indent=2)
        
        print(f"Saved {len(samples)} NLP samples to {split_dir}")
    
    def create_train_val_test_splits(self, dataset):
        """
        Create train/validation/test splits
        
        Args:
            dataset: HuggingFace dataset
            
        Returns:
            dict: Split datasets
        """
        # For LibriSpeech, we'll use the existing splits
        # Create a mapping from our expected splits to actual dataset splits
        split_mapping = {
            "train": "train.clean.100",
            "test": "test.clean"
        }
        
        return split_mapping
    
    def process_dataset(self):
        """
        Process the entire dataset
        """
        print("Starting dataset processing...")
        
        # Load dataset
        dataset = self.load_dataset()
        
        # Get split mapping
        split_mapping = self.create_train_val_test_splits(dataset)
        
        # Prepare ASR data for each split
        # For now, we'll just use train and test splits since validation is not available
        self.prepare_asr_data(dataset, "train", split_mapping["train"])
        self.prepare_asr_data(dataset, "test", split_mapping["test"])
        
        # For validation, we'll create a small subset from train data
        print("Preparing ASR validation data (subset of train)...")
        split_dir = self.asr_data_dir / "validation"
        split_dir.mkdir(exist_ok=True)
        
        # Copy a small subset of train data for validation
        train_split_dir = self.asr_data_dir / "train"
        train_metadata_path = train_split_dir / "metadata.json"
        if train_metadata_path.exists():
            with open(train_metadata_path, 'r') as f:
                train_samples = json.load(f)
            
            # Take first 100 samples for validation
            val_samples = train_samples[:100]
            val_metadata_path = split_dir / "metadata.json"
            with open(val_metadata_path, 'w') as f:
                json.dump(val_samples, f, indent=2)
            
            print(f"Saved {len(val_samples)} ASR samples to {split_dir}")
        
        # Prepare NLP data for each split
        self.prepare_nlp_data(dataset, "train", split_mapping["train"])
        self.prepare_nlp_data(dataset, "test", split_mapping["test"])
        
        # For validation, we'll create a small subset from train data
        print("Preparing NLP validation data (subset of train)...")
        split_dir = self.nlp_data_dir / "validation"
        split_dir.mkdir(exist_ok=True)
        
        # Copy a small subset of train data for validation
        train_split_dir = self.nlp_data_dir / "train"
        train_metadata_path = train_split_dir / "metadata.json"
        if train_metadata_path.exists():
            with open(train_metadata_path, 'r') as f:
                train_samples = json.load(f)
            
            # Take first 100 samples for validation
            val_samples = train_samples[:100]
            val_metadata_path = split_dir / "metadata.json"
            with open(val_metadata_path, 'w') as f:
                json.dump(val_samples, f, indent=2)
            
            print(f"Saved {len(val_samples)} NLP samples to {split_dir}")
        
        # Save configuration
        config_path = self.data_dir / "dataset_config.json"
        with open(config_path, 'w') as f:
            json.dump(self.config, f, indent=2)
        
        print("Dataset processing completed!")
        print(f"ASR data saved to: {self.asr_data_dir}")
        print(f"NLP data saved to: {self.nlp_data_dir}")
        print(f"Configuration saved to: {config_path}")

def main():
    """
    Main function to process dataset
    """
    # Create dataset loader
    loader = DatasetLoader(dataset_name="librispeech")
    
    # Process dataset
    loader.process_dataset()

if __name__ == "__main__":
    main()