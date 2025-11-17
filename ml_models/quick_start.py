"""
Quick Start Guide for Custom Voice-to-Notes Models
Provides a simple interface to get started with training
"""

import os
import sys
import subprocess
from pathlib import Path

def print_header():
    """Print the header for the quick start guide"""
    print("="*60)
    print("CUSTOM VOICE-TO-NOTES MODELS - QUICK START GUIDE")
    print("="*60)
    print()

def check_dependencies():
    """Check if required dependencies are installed"""
    print("Checking dependencies...")
    
    dependencies = [
        "torch",
        "torchaudio",
        "numpy",
        "tqdm",
        "editdistance",
        "matplotlib",
        "datasets"
    ]
    
    missing_deps = []
    
    for dep in dependencies:
        try:
            __import__(dep)
            print(f"  ✓ {dep}")
        except ImportError:
            print(f"  ✗ {dep} (missing)")
            missing_deps.append(dep)
    
    if missing_deps:
        print(f"\nMissing dependencies: {', '.join(missing_deps)}")
        print("Install with: pip install -r requirements.txt")
        print("Also install: pip install datasets")
        return False
    else:
        print("\nAll dependencies are installed!")
        return True

def show_training_options():
    """Show available training options"""
    print("\n" + "="*40)
    print("TRAINING OPTIONS")
    print("="*40)
    print("1. Automated Training (Recommended)")
    print("   Runs the complete training pipeline")
    print("   Command: python train_pipeline.py")
    print()
    print("2. Manual Training")
    print("   Run each step individually:")
    print("   - Load dataset: python dataset_loader.py")
    print("   - Generate summaries: python generate_synthetic_summaries.py")
    print("   - Convert ASR data: python convert_asr_data.py")
    print("   - Convert NLP data: python convert_nlp_data.py")
    print("   - Train ASR model: cd asr && python train_asr.py")
    print("   - Train NLP model: cd nlp && python train_nlp.py")
    print()
    print("3. Quick Test")
    print("   Run a quick example with dummy data")
    print("   Command: python example_usage_with_dataset.py")

def show_next_steps():
    """Show next steps after training"""
    print("\n" + "="*40)
    print("NEXT STEPS AFTER TRAINING")
    print("="*40)
    print("1. Check evaluation metrics in evaluation/metrics.json")
    print("2. Use trained models with the end-to-end pipeline:")
    print("   python pipeline_voice_to_notes.py")
    print("3. Review documentation in docs/ directory")
    print("4. Fine-tune hyperparameters for better performance")

def show_help():
    """Show help information"""
    print("\n" + "="*40)
    print("HELP AND SUPPORT")
    print("="*40)
    print("For detailed instructions, see:")
    print("- TRAINING_GUIDE.md for comprehensive training guide")
    print("- docs/DATASET_INTEGRATION.md for dataset integration")
    print("- docs/dataset/README.md for dataset documentation")
    print()
    print("For issues, check:")
    print("- Error messages in console output")
    print("- Verify all dependencies are installed")
    print("- Ensure sufficient disk space and memory")

def main():
    """Main function"""
    print_header()
    
    # Check dependencies
    deps_ok = check_dependencies()
    
    if not deps_ok:
        response = input("\nWould you like to continue anyway? (y/n): ")
        if response.lower() != 'y':
            print("Exiting...")
            return
    
    # Show training options
    show_training_options()
    
    # Show next steps
    show_next_steps()
    
    # Show help
    show_help()
    
    print("\n" + "="*60)
    print("READY TO START TRAINING!")
    print("="*60)
    print("Run one of the commands above to begin training your models.")
    print("For automated training: python train_pipeline.py")

if __name__ == "__main__":
    main()