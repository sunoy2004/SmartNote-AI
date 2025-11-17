"""
Example script demonstrating how to use the custom voice-to-notes models
"""

import torch
import os


def example_asr_usage():
    """Example of using the ASR model"""
    print("=== ASR Model Usage Example ===")
    
    try:
        # Import ASR components
        from asr.model import CustomASRModel, AudioPreprocessor
        
        # Initialize model and preprocessor
        model = CustomASRModel()
        preprocessor = AudioPreprocessor()
        
        print(f"ASR Model has {sum(p.numel() for p in model.parameters())} parameters")
        print("ASR Model initialized successfully")
        
        # Example: Create dummy mel-spectrogram input
        # In practice, you would load and preprocess an actual audio file
        dummy_mel_spec = torch.randn(1, 80, 100)  # (batch, features, time)
        
        # Run inference
        with torch.no_grad():
            output = model(dummy_mel_spec)
            
        print(f"Input shape: {dummy_mel_spec.shape}")
        print(f"Output shape: {output.shape}")
        print("ASR inference completed successfully")
        
        return True
        
    except Exception as e:
        print(f"ASR example failed: {e}")
        return False


def example_nlp_usage():
    """Example of using the NLP model"""
    print("\n=== NLP Model Usage Example ===")
    
    try:
        # Import NLP components
        from nlp.model_summarizer import CustomSummarizer
        
        # Initialize model
        model = CustomSummarizer(vocab_size=1000)
        
        print(f"NLP Model has {sum(p.numel() for p in model.parameters())} parameters")
        print("NLP Model initialized successfully")
        
        # Example: Create dummy input tensors
        # In practice, you would tokenize actual text
        src = torch.randint(0, 1000, (20, 1))  # (seq_len, batch)
        tgt = torch.randint(0, 1000, (15, 1))  # (seq_len, batch)
        
        # Run inference
        with torch.no_grad():
            output = model(src, tgt)
            
        print(f"Source shape: {src.shape}")
        print(f"Target shape: {tgt.shape}")
        print(f"Output shape: {output.shape}")
        print("NLP inference completed successfully")
        
        return True
        
    except Exception as e:
        print(f"NLP example failed: {e}")
        return False


def example_pipeline_usage():
    """Example of using the end-to-end pipeline"""
    print("\n=== Pipeline Usage Example ===")
    
    try:
        # Import pipeline components
        from pipeline_voice_to_notes import process_audio_file
        
        print("Pipeline components imported successfully")
        print("To use the pipeline, call process_audio_file() with:")
        print("  - Path to audio file (.wav/.mp3)")
        print("  - Path to trained ASR model")
        print("  - Path to trained NLP model")
        print("  - Output directory (optional)")
        
        return True
        
    except Exception as e:
        print(f"Pipeline example failed: {e}")
        return False


def example_training_usage():
    """Example of training the models"""
    print("\n=== Training Usage Example ===")
    
    try:
        print("To train the ASR model:")
        print("  cd ml_models/asr")
        print("  python train_asr.py")
        print()
        print("To train the NLP model:")
        print("  cd ml_models/nlp")
        print("  python train_nlp.py")
        
        return True
        
    except Exception as e:
        print(f"Training example failed: {e}")
        return False


def main():
    """Main example function"""
    print("Custom Voice-to-Notes Model Examples")
    print("=" * 40)
    
    # Run all examples
    results = []
    results.append(example_asr_usage())
    results.append(example_nlp_usage())
    results.append(example_pipeline_usage())
    results.append(example_training_usage())
    
    # Summary
    print("\n" + "=" * 40)
    print("Example Summary:")
    passed = sum(results)
    total = len(results)
    print(f"Successful examples: {passed}/{total}")
    
    if passed == total:
        print("✓ All examples completed successfully!")
        print("\nNext steps:")
        print("1. Prepare your dataset")
        print("2. Train the models using the training scripts")
        print("3. Use the pipeline for inference")
    else:
        print("✗ Some examples failed. Please check the errors above.")


if __name__ == "__main__":
    main()