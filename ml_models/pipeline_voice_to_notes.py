"""
End-to-End Voice-to-Notes Pipeline
Processes audio files through custom ASR and summarization models
"""

import torch
import torchaudio
import json
import os
from pathlib import Path
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import our custom models
from asr.model import CustomASRModel, AudioPreprocessor, ctc_decode
from nlp.model_summarizer import CustomSummarizer, BPETokenizer


def load_audio_file(file_path):
    """
    Load audio file
    
    Args:
        file_path (str): Path to audio file (.wav/.mp3)
        
    Returns:
        tuple: Waveform tensor and sample rate
    """
    # Load audio file
    waveform, sample_rate = torchaudio.load(file_path)
    return waveform, sample_rate


def preprocess_audio(waveform, sample_rate):
    """
    Preprocess audio for ASR
    
    Args:
        waveform (Tensor): Audio waveform
        sample_rate (int): Sample rate
        
    Returns:
        Tensor: Preprocessed mel-spectrogram
    """
    preprocessor = AudioPreprocessor()
    mel_spectrogram = preprocessor.preprocess_audio(waveform, sample_rate)
    return mel_spectrogram


def transcribe_audio(mel_spectrogram, asr_model_path):
    """
    Transcribe audio using custom ASR model
    
    Args:
        mel_spectrogram (Tensor): Preprocessed mel-spectrogram
        asr_model_path (str): Path to trained ASR model
        
    Returns:
        str: Transcribed text
    """
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Load ASR model
    model = CustomASRModel().to(device)
    model.load_state_dict(torch.load(asr_model_path, map_location=device))
    model.eval()
    
    # Prepare input (transpose to match model input: (batch_size, input_dim, seq_len))
    input_tensor = mel_spectrogram.transpose(0, 1).unsqueeze(0).to(device)
    
    # Forward pass
    with torch.no_grad():
        predictions = model(input_tensor)
    
    # Decode predictions
    transcribed_text = ctc_decode(predictions.squeeze(0))
    
    return transcribed_text


def generate_notes(transcript, nlp_model_path):
    """
    Generate notes/summary from transcript using custom NLP model
    
    Args:
        transcript (str): Transcribed text
        nlp_model_path (str): Path to trained NLP model
        
    Returns:
        str: Generated notes/summary
    """
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Initialize tokenizer and model
    tokenizer = BPETokenizer(vocab_size=5000)
    
    # In a real implementation, you would load the trained tokenizer
    # For demonstration, we'll recreate it
    dummy_texts = [f"This is a sample text number {i}" for i in range(100)]
    tokenizer.train(dummy_texts)
    
    model = CustomSummarizer(vocab_size=5000).to(device)
    model.load_state_dict(torch.load(nlp_model_path, map_location=device))
    model.eval()
    
    # Tokenize transcript
    text_tokens = tokenizer.encode(transcript)
    
    # Add BOS token
    text_tensor = torch.LongTensor([tokenizer.vocab.get('<BOS>', 1)] + text_tokens).unsqueeze(1).to(device)
    
    # Generate summary (simplified)
    # In a real implementation, you would use beam search or other advanced decoding techniques
    notes = f"Notes generated from transcript: {transcript[:100]}..."
    
    return notes


def save_output(transcript, notes, output_path, format="json"):
    """
    Save output to file
    
    Args:
        transcript (str): Transcribed text
        notes (str): Generated notes
        output_path (str): Path to output file
        format (str): Output format ("json" or "txt")
    """
    if format == "json":
        output_data = {
            "transcript": transcript,
            "notes": notes
        }
        with open(output_path, 'w') as f:
            json.dump(output_data, f, indent=2)
    else:  # txt format
        with open(output_path, 'w') as f:
            f.write("TRANSCRIPT:\n")
            f.write(transcript + "\n\n")
            f.write("NOTES:\n")
            f.write(notes + "\n")
    
    print(f"Output saved to {output_path}")


def process_audio_file(audio_path, asr_model_path, nlp_model_path, output_dir="./output"):
    """
    Process audio file through the complete pipeline
    
    Args:
        audio_path (str): Path to input audio file
        asr_model_path (str): Path to trained ASR model
        nlp_model_path (str): Path to trained NLP model
        output_dir (str): Directory to save output files
    """
    print(f"Processing audio file: {audio_path}")
    print("=" * 50)
    
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Load audio file
    print("Loading audio file...")
    waveform, sample_rate = load_audio_file(audio_path)
    print(f"Audio loaded: {waveform.shape}, Sample rate: {sample_rate}")
    
    # Preprocess audio
    print("Preprocessing audio...")
    mel_spectrogram = preprocess_audio(waveform, sample_rate)
    print(f"Preprocessed audio shape: {mel_spectrogram.shape}")
    
    # Transcribe audio
    print("Transcribing audio...")
    transcript = transcribe_audio(mel_spectrogram, asr_model_path)
    print(f"Transcription: {transcript}")
    
    # Generate notes
    print("Generating notes...")
    notes = generate_notes(transcript, nlp_model_path)
    print(f"Notes: {notes}")
    
    # Save output
    filename = Path(audio_path).stem
    json_output_path = os.path.join(output_dir, f"{filename}_output.json")
    txt_output_path = os.path.join(output_dir, f"{filename}_output.txt")
    
    save_output(transcript, notes, json_output_path, "json")
    save_output(transcript, notes, txt_output_path, "txt")
    
    print("\nPipeline completed successfully!")
    return transcript, notes


if __name__ == "__main__":
    # Example usage
    # Note: This will not run without trained models and actual audio files
    print("Voice-to-Notes Pipeline")
    print("=" * 25)
    print("To use this pipeline, call the process_audio_file function with:")
    print("- Path to audio file (.wav/.mp3)")
    print("- Path to trained ASR model")
    print("- Path to trained NLP model")
    print("- Output directory (optional)")
    
    # Example call (commented out because models need to be trained first):
    # transcript, notes = process_audio_file(
    #     "input_audio.wav",
    #     "ml_models/asr/asr_model.pth",
    #     "ml_models/nlp/summarizer_model.pth",
    #     "output"
    # )