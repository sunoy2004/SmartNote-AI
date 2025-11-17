"""
ASR Data Conversion Script
Converts raw audio files to Mel-Spectrogram tensors for ASR model training
"""

import os
import json
import torch
import torchaudio
from pathlib import Path
from tqdm import tqdm
import numpy as np

# Import our custom model
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from asr.model import CustomASRModel, AudioPreprocessor

def convert_audio_to_spectrograms(data_dir, split_name):
    """
    Convert audio files to mel-spectrograms for ASR training
    
    Args:
        data_dir (str): Base data directory
        split_name (str): Split name (train/val/test)
    """
    print(f"Converting {split_name} audio to spectrograms...")
    
    # Paths
    split_dir = Path(data_dir) / "asr" / split_name
    audio_dir = split_dir / "audio"
    processed_dir = split_dir / "processed"
    processed_dir.mkdir(exist_ok=True)
    
    # Load metadata
    metadata_path = split_dir / "metadata.json"
    with open(metadata_path, 'r') as f:
        samples = json.load(f)
    
    # Initialize preprocessor
    preprocessor = AudioPreprocessor()
    
    # Character to index mapping
    char_to_idx = {char: idx for idx, char in enumerate(CustomASRModel().characters)}
    
    # Process each sample
    processed_samples = []
    for sample in tqdm(samples):
        try:
            # Load audio file
            audio_path = audio_dir / sample["audio_file"]
            if not audio_path.exists():
                print(f"Audio file not found: {audio_path}")
                continue
                
            waveform, sample_rate = torchaudio.load(str(audio_path))
            
            # Preprocess audio to mel-spectrogram
            mel_spectrogram = preprocessor.preprocess_audio(waveform, sample_rate)
            
            # Save spectrogram tensor
            spec_filename = f"{Path(sample['audio_file']).stem}_spec.pt"
            spec_path = processed_dir / spec_filename
            torch.save(mel_spectrogram, spec_path)
            
            # Convert transcript to character indices
            transcript = sample["transcript"].lower()
            target_indices = [char_to_idx.get(char, 0) for char in transcript]
            target_tensor = torch.LongTensor(target_indices)
            
            # Save target tensor
            target_filename = f"{Path(sample['audio_file']).stem}_target.pt"
            target_path = processed_dir / target_filename
            torch.save(target_tensor, target_path)
            
            # Update sample with processed file paths
            processed_sample = {
                "spectrogram_file": spec_filename,
                "target_file": target_filename,
                "transcript": transcript,
                "original_audio_file": sample["audio_file"]
            }
            processed_samples.append(processed_sample)
            
        except Exception as e:
            print(f"Error processing {sample['audio_file']}: {e}")
            continue
    
    # Save processed metadata
    processed_metadata_path = split_dir / "processed_metadata.json"
    with open(processed_metadata_path, 'w') as f:
        json.dump(processed_samples, f, indent=2)
    
    print(f"Processed {len(processed_samples)} samples for {split_name} split")
    print(f"Saved processed data to: {processed_dir}")

def create_ctc_labels(data_dir, split_name):
    """
    Create CTC-compatible label sequences
    
    Args:
        data_dir (str): Base data directory
        split_name (str): Split name (train/val/test)
    """
    print(f"Creating CTC labels for {split_name} split...")
    
    # Load processed metadata
    split_dir = Path(data_dir) / "asr" / split_name
    processed_metadata_path = split_dir / "processed_metadata.json"
    
    with open(processed_metadata_path, 'r') as f:
        samples = json.load(f)
    
    # Process each sample
    for sample in tqdm(samples):
        try:
            # Load target tensor
            target_path = split_dir / "processed" / sample["target_file"]
            target_tensor = torch.load(target_path)
            
            # CTC labels are already in the correct format (character indices)
            # Just verify they're valid
            if len(target_tensor) > 0:
                # Save CTC-compatible labels
                ctc_filename = f"{Path(sample['target_file']).stem}_ctc.pt"
                ctc_path = split_dir / "processed" / ctc_filename
                torch.save(target_tensor, ctc_path)
                
                # Update sample
                sample["ctc_label_file"] = ctc_filename
        except Exception as e:
            print(f"Error creating CTC labels for {sample['target_file']}: {e}")
    
    # Save updated metadata
    with open(processed_metadata_path, 'w') as f:
        json.dump(samples, f, indent=2)
    
    print(f"Created CTC labels for {len(samples)} samples")

def main():
    """
    Main function to convert ASR data
    """
    data_dir = "./data"
    
    # Process each split
    for split_name in ["train", "validation", "test"]:
        if (Path(data_dir) / "asr" / split_name).exists():
            # Convert audio to spectrograms
            convert_audio_to_spectrograms(data_dir, split_name)
            
            # Create CTC labels
            create_ctc_labels(data_dir, split_name)
    
    print("ASR data conversion completed!")

if __name__ == "__main__":
    main()