"""
Complete Training Pipeline for Custom Voice-to-Notes Models
Orchestrates the entire training process from dataset loading to model evaluation
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def run_command(command, description):
    """
    Run a shell command and handle errors
    
    Args:
        command (str): Command to run
        description (str): Description of what the command does
        
    Returns:
        bool: True if successful, False otherwise
    """
    print(f"\n{'='*50}")
    print(f"Running: {description}")
    print(f"Command: {command}")
    print('='*50)
    
    try:
        # Use shell=True and cwd to handle paths with spaces better
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True, cwd=Path(__file__).parent)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running {description}:")
        print(f"Command: {e.cmd}")
        print(f"Return code: {e.returncode}")
        print(f"Output: {e.output}")
        print(f"Error: {e.stderr}")
        return False

def main():
    """
    Main training pipeline
    """
    print("Starting Complete Training Pipeline")
    print("="*50)
    
    # Define paths using pathlib to handle spaces properly
    base_dir = Path(__file__).parent.resolve()
    data_dir = base_dir / "data"
    asr_dir = base_dir / "asr"
    nlp_dir = base_dir / "nlp"
    
    # Step 1: Load and process dataset
    print("\nStep 1: Loading and processing dataset...")
    
    # Run dataset loader with proper path handling
    dataset_loader_path = base_dir / "dataset_loader.py"
    if not run_command(
        f'python "{dataset_loader_path}"',
        "Dataset loading"
    ):
        print("Dataset loading failed. Exiting.")
        return
    
    # Step 2: Generate synthetic summaries for NLP
    print("\nStep 2: Generating synthetic summaries...")
    
    generate_summaries_path = base_dir / "generate_synthetic_summaries.py"
    if not run_command(
        f'python "{generate_summaries_path}"',
        "Synthetic summary generation"
    ):
        print("Synthetic summary generation failed. Exiting.")
        return
    
    # Step 3: Convert ASR data
    print("\nStep 3: Converting ASR data...")
    
    convert_asr_path = base_dir / "convert_asr_data.py"
    if not run_command(
        f'python "{convert_asr_path}"',
        "ASR data conversion"
    ):
        print("ASR data conversion failed. Exiting.")
        return
    
    # Step 4: Convert NLP data
    print("\nStep 4: Converting NLP data...")
    
    convert_nlp_path = base_dir / "convert_nlp_data.py"
    if not run_command(
        f'python "{convert_nlp_path}"',
        "NLP data conversion"
    ):
        print("NLP data conversion failed. Exiting.")
        return
    
    # Step 5: Train ASR model
    print("\nStep 5: Training ASR model...")
    
    if not run_command(
        f'cd "{asr_dir}" && python train_asr.py',
        "ASR model training"
    ):
        print("ASR model training failed. Exiting.")
        return
    
    # Step 6: Train NLP model
    print("\nStep 6: Training NLP model...")
    
    if not run_command(
        f'cd "{nlp_dir}" && python train_nlp.py',
        "NLP model training"
    ):
        print("NLP model training failed. Exiting.")
        return
    
    # Step 7: Evaluate ASR model
    print("\nStep 7: Evaluating ASR model...")
    
    if not run_command(
        f'cd "{asr_dir}" && python evaluate_asr.py',
        "ASR model evaluation"
    ):
        print("ASR model evaluation failed. Exiting.")
        return
    
    # Step 8: Evaluate NLP model
    print("\nStep 8: Evaluating NLP model...")
    
    if not run_command(
        f'cd "{nlp_dir}" && python evaluate_nlp.py',
        "NLP model evaluation"
    ):
        print("NLP model evaluation failed. Exiting.")
        return
    
    # Step 9: Display final metrics
    print("\nStep 9: Displaying final metrics...")
    
    metrics_path = base_dir / "evaluation" / "metrics.json"
    if metrics_path.exists():
        with open(metrics_path, 'r') as f:
            metrics = json.load(f)
        
        print("\n" + "="*50)
        print("FINAL MODEL METRICS")
        print("="*50)
        
        print("\nASR Metrics:")
        print(f"  WER - Train: {metrics['asr_metrics']['wer']['train']:.4f}")
        print(f"  WER - Validation: {metrics['asr_metrics']['wer']['validation']:.4f}")
        print(f"  WER - Test: {metrics['asr_metrics']['wer']['test']:.4f}")
        print(f"  CER - Train: {metrics['asr_metrics']['cer']['train']:.4f}")
        print(f"  CER - Validation: {metrics['asr_metrics']['cer']['validation']:.4f}")
        print(f"  CER - Test: {metrics['asr_metrics']['cer']['test']:.4f}")
        
        print("\nNLP Metrics:")
        print(f"  ROUGE-1 - Train: {metrics['nlp_metrics']['rouge_1']['train']:.4f}")
        print(f"  ROUGE-1 - Validation: {metrics['nlp_metrics']['rouge_1']['validation']:.4f}")
        print(f"  ROUGE-1 - Test: {metrics['nlp_metrics']['rouge_1']['test']:.4f}")
        print(f"  ROUGE-2 - Train: {metrics['nlp_metrics']['rouge_2']['train']:.4f}")
        print(f"  ROUGE-2 - Validation: {metrics['nlp_metrics']['rouge_2']['validation']:.4f}")
        print(f"  ROUGE-2 - Test: {metrics['nlp_metrics']['rouge_2']['test']:.4f}")
        print(f"  ROUGE-L - Train: {metrics['nlp_metrics']['rouge_l']['train']:.4f}")
        print(f"  ROUGE-L - Validation: {metrics['nlp_metrics']['rouge_l']['validation']:.4f}")
        print(f"  ROUGE-L - Test: {metrics['nlp_metrics']['rouge_l']['test']:.4f}")
        
        print("\n" + "="*50)
        print("Training Pipeline Completed Successfully!")
        print("="*50)
    else:
        print("Metrics file not found. Training may have completed with issues.")
    
    print("\nTrained models are saved as:")
    print(f"  - ASR Model: {asr_dir / 'asr_model.pth'}")
    print(f"  - NLP Model: {nlp_dir / 'summarizer_model.pth'}")

if __name__ == "__main__":
    main()