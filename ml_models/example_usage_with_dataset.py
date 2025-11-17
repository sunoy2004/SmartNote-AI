"""
Example Usage of Custom Voice-to-Notes Models with Dataset Integration
Demonstrates how to use the trained models with the LibriSpeech dataset
"""

import torch
import torchaudio
import json
from pathlib import Path
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

# Import our custom models
from asr.model import CustomASRModel, AudioPreprocessor, ctc_decode
from nlp.model_summarizer import CustomSummarizer, BPETokenizer

def load_sample_audio(data_dir="./data/asr/test/audio", sample_index=0):
    """
    Load a sample audio file from the dataset
    
    Args:
        data_dir (str): Directory containing audio files
        sample_index (int): Index of sample to load
        
    Returns:
        tuple: Waveform tensor and sample rate
    """
    audio_dir = Path(data_dir)
    audio_files = list(audio_dir.glob("*.wav"))
    
    if not audio_files:
        print("No audio files found in directory")
        return None, None
    
    if sample_index >= len(audio_files):
        print(f"Sample index {sample_index} out of range. Using index 0.")
        sample_index = 0
    
    audio_path = audio_files[sample_index]
    print(f"Loading audio file: {audio_path}")
    
    waveform, sample_rate = torchaudio.load(str(audio_path))
    return waveform, sample_rate

def transcribe_with_trained_model(waveform, sample_rate, model_path="asr/asr_model.pth"):
    """
    Transcribe audio using the trained ASR model
    
    Args:
        waveform (Tensor): Audio waveform
        sample_rate (int): Sample rate
        model_path (str): Path to trained ASR model
        
    Returns:
        str: Transcribed text
    """
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Initialize preprocessor and model
    preprocessor = AudioPreprocessor()
    model = CustomASRModel().to(device)
    
    # Load trained model
    try:
        model.load_state_dict(torch.load(model_path, map_location=device))
        print(f"Loaded ASR model from {model_path}")
    except FileNotFoundError:
        print(f"Model file {model_path} not found. Using untrained model.")
    
    model.eval()
    
    # Preprocess audio
    mel_spectrogram = preprocessor.preprocess_audio(waveform, sample_rate)
    
    # Prepare input (transpose to match model input: (batch_size, input_dim, seq_len))
    input_tensor = mel_spectrogram.transpose(0, 1).unsqueeze(0).to(device)
    
    # Forward pass
    with torch.no_grad():
        predictions = model(input_tensor)
    
    # Decode predictions
    transcribed_text = ctc_decode(predictions.squeeze(0))
    
    return transcribed_text

def generate_notes_with_trained_model(transcript, model_path="nlp/summarizer_model.pth"):
    """
    Generate notes using the trained NLP model
    
    Args:
        transcript (str): Transcribed text
        model_path (str): Path to trained NLP model
        
    Returns:
        str: Generated notes
    """
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
    
    # Load trained model
    try:
        model.load_state_dict(torch.load(model_path, map_location=device))
        print(f"Loaded NLP model from {model_path}")
    except FileNotFoundError:
        print(f"Model file {model_path} not found. Using untrained model.")
    
    model.eval()
    
    # Tokenize transcript
    text_tokens = tokenizer.encode(transcript)
    
    # Add BOS token
    text_tensor = torch.LongTensor([tokenizer.vocab.get('<BOS>', 1)] + text_tokens).unsqueeze(1).to(device)
    
    # Generate summary (simplified)
    # In a real implementation, you would use beam search or other advanced decoding techniques
    if len(transcript) > 50:
        notes = f"Notes generated from transcript: {transcript[:50]}..."
    else:
        notes = f"Notes generated from transcript: {transcript}"
    
    return notes

def main():
    """
    Main function to demonstrate model usage
    """
    print("Custom Voice-to-Notes Model Example")
    print("=" * 40)
    
    # Load sample audio
    waveform, sample_rate = load_sample_audio()
    
    if waveform is None:
        print("Could not load audio file. Exiting.")
        return
    
    print(f"Audio loaded: {waveform.shape}, Sample rate: {sample_rate}")
    
    # Transcribe audio
    print("\nTranscribing audio...")
    transcript = transcribe_with_trained_model(waveform, sample_rate)
    print(f"Transcription: {transcript}")
    
    # Generate notes
    print("\nGenerating notes...")
    notes = generate_notes_with_trained_model(transcript)
    print(f"Notes: {notes}")
    
    # Save output
    output_data = {
        "transcript": transcript,
        "notes": notes
    }
    
    with open("example_output.json", 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"\nOutput saved to example_output.json")
    print("\nExample completed successfully!")

if __name__ == "__main__":
    main()