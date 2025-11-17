"""
ASR Model Evaluation Script
Evaluates the custom ASR model using WER and CER metrics
"""

import torch
import torch.nn as nn
import numpy as np
import editdistance
from torch.utils.data import DataLoader
import torchaudio
import json
import os
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import our custom model
from asr.model import CustomASRModel, AudioPreprocessor, ctc_decode
from asr.train_asr import ASRDataset, collate_fn


def compute_wer(reference, hypothesis):
    """
    Compute Word Error Rate (WER)
    
    Args:
        reference (str): Reference text
        hypothesis (str): Hypothesis text
        
    Returns:
        float: WER value
    """
    # Split into words
    ref_words = reference.split()
    hyp_words = hypothesis.split()
    
    # Compute edit distance
    distance = editdistance.eval(ref_words, hyp_words)
    
    # Compute WER
    wer = distance / len(ref_words) if len(ref_words) > 0 else 0.0
    
    return wer


def compute_cer(reference, hypothesis):
    """
    Compute Character Error Rate (CER)
    
    Args:
        reference (str): Reference text
        hypothesis (str): Hypothesis text
        
    Returns:
        float: CER value
    """
    # Compute edit distance
    distance = editdistance.eval(reference, hypothesis)
    
    # Compute CER
    cer = distance / len(reference) if len(reference) > 0 else 0.0
    
    return cer


def evaluate_asr_model(model_path, data_dir="./data", split_name="test"):
    """
    Evaluate the ASR model
    
    Args:
        model_path (str): Path to the trained model
        data_dir (str): Path to evaluation data
        split_name (str): Split name to evaluate on (test/validation)
        
    Returns:
        dict: Evaluation metrics
    """
    print(f"Starting ASR Model Evaluation on {split_name} split")
    print("=" * 40)
    
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Initialize preprocessor and model
    preprocessor = AudioPreprocessor()
    model = CustomASRModel().to(device)
    
    # Load trained model
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    
    # Create dataset and dataloader
    dataset = ASRDataset(data_dir, preprocessor, split_name)
    dataloader = DataLoader(dataset, batch_size=4, shuffle=False, collate_fn=collate_fn)
    
    # Evaluation metrics
    total_wer = 0.0
    total_cer = 0.0
    total_samples = 0
    
    print("Evaluating model...")
    with torch.no_grad():
        for batch_idx, (mel_specs, targets) in enumerate(dataloader):
            # Move data to device
            mel_specs = [spec.to(device) for spec in mel_specs]
            targets = targets.to(device)
            
            # Prepare inputs
            batch_inputs = torch.stack([spec.transpose(0, 1) for spec in mel_specs])
            
            # Forward pass
            predictions = model(batch_inputs)
            
            # Decode predictions for each sample in the batch
            for i in range(len(mel_specs)):
                # Get prediction for this sample
                sample_pred = predictions[i]
                
                # Decode prediction to text
                decoded_text = ctc_decode(sample_pred)
                
                # Get target text
                target_indices = targets[i]
                target_chars = [CustomASRModel().characters[idx] for idx in target_indices if idx < len(CustomASRModel().characters)]
                target_text = ''.join(target_chars)
                
                # Compute metrics
                wer = compute_wer(target_text, decoded_text)
                cer = compute_cer(target_text, decoded_text)
                
                total_wer += wer
                total_cer += cer
                total_samples += 1
                
                # Print sample results
                if batch_idx < 3:  # Print first few samples
                    print(f"\nSample {batch_idx * len(mel_specs) + i + 1}:")
                    print(f"  Reference: {target_text}")
                    print(f"  Hypothesis: {decoded_text}")
                    print(f"  WER: {wer:.4f}, CER: {cer:.4f}")
    
    # Compute average metrics
    avg_wer = total_wer / total_samples
    avg_cer = total_cer / total_samples
    
    metrics = {
        "wer": avg_wer,
        "cer": avg_cer,
        "total_samples": total_samples
    }
    
    print("\n" + "=" * 40)
    print("Evaluation Results:")
    print(f"  Average WER: {avg_wer:.4f}")
    print(f"  Average CER: {avg_cer:.4f}")
    print(f"  Total samples: {total_samples}")
    print("=" * 40)
    
    return metrics


def save_metrics(metrics, data_dir="./data", split_name="test"):
    """
    Save evaluation metrics to JSON file
    
    Args:
        metrics (dict): Evaluation metrics
        data_dir (str): Path to data directory
        split_name (str): Split name
    """
    # Load existing metrics
    metrics_path = os.path.join(data_dir, "..", "evaluation", "metrics.json")
    
    if os.path.exists(metrics_path):
        with open(metrics_path, 'r') as f:
            all_metrics = json.load(f)
    else:
        # Create default metrics structure
        all_metrics = {
            "asr_metrics": {
                "wer": {"train": 0.0, "validation": 0.0, "test": 0.0},
                "cer": {"train": 0.0, "validation": 0.0, "test": 0.0}
            },
            "nlp_metrics": {
                "rouge_1": {"train": 0.0, "validation": 0.0, "test": 0.0},
                "rouge_2": {"train": 0.0, "validation": 0.0, "test": 0.0},
                "rouge_l": {"train": 0.0, "validation": 0.0, "test": 0.0}
            },
            "pipeline_metrics": {
                "end_to_end_accuracy": 0.0,
                "processing_time": 0.0
            }
        }
    
    # Update ASR metrics
    all_metrics["asr_metrics"]["wer"][split_name] = metrics["wer"]
    all_metrics["asr_metrics"]["cer"][split_name] = metrics["cer"]
    
    # Save updated metrics
    with open(metrics_path, 'w') as f:
        json.dump(all_metrics, f, indent=2)
    
    print(f"Metrics saved to {metrics_path}")


def plot_evaluation_results():
    """
    Plot evaluation results (placeholder for actual implementation)
    """
    print("Plotting evaluation results...")
    # In a real implementation, you would plot loss curves, WER/CER over epochs, etc.
    print("Evaluation plots would be saved to the evaluation directory.")


if __name__ == "__main__":
    # Evaluate the model
    metrics = evaluate_asr_model("asr_model.pth", split_name="test")
    
    # Save metrics
    save_metrics(metrics, split_name="test")
    
    # Plot results
    plot_evaluation_results()