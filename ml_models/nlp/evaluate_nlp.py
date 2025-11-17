"""
NLP Summarization Model Evaluation Script
Evaluates the custom summarization model using ROUGE metrics
"""

import torch
import torch.nn as nn
import numpy as np
from torch.utils.data import DataLoader
import re
import json
import os
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import our custom model
from nlp.model_summarizer import CustomSummarizer, BPETokenizer, create_masks
from nlp.train_nlp import SummarizationDataset, collate_fn


def compute_rouge_n(reference, hypothesis, n=1):
    """
    Compute ROUGE-N score
    
    Args:
        reference (str): Reference text
        hypothesis (str): Hypothesis text
        n (int): N-gram size (1 for ROUGE-1, 2 for ROUGE-2, etc.)
        
    Returns:
        float: ROUGE-N score
    """
    # Tokenize texts
    ref_tokens = reference.split()
    hyp_tokens = hypothesis.split()
    
    # Generate n-grams
    if n == 1:
        ref_ngrams = set(ref_tokens)
        hyp_ngrams = set(hyp_tokens)
    else:
        ref_ngrams = set(zip(*[ref_tokens[i:] for i in range(n)]))
        hyp_ngrams = set(zip(*[hyp_tokens[i:] for i in range(n)]))
    
    # Compute overlap
    overlap = len(ref_ngrams.intersection(hyp_ngrams))
    
    # Compute precision and recall
    precision = overlap / len(hyp_ngrams) if len(hyp_ngrams) > 0 else 0.0
    recall = overlap / len(ref_ngrams) if len(ref_ngrams) > 0 else 0.0
    
    # Compute F1-score
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0
    
    return f1


def compute_rouge_l(reference, hypothesis):
    """
    Compute ROUGE-L score (Longest Common Subsequence)
    
    Args:
        reference (str): Reference text
        hypothesis (str): Hypothesis text
        
    Returns:
        float: ROUGE-L score
    """
    # Tokenize texts
    ref_tokens = reference.split()
    hyp_tokens = hypothesis.split()
    
    # Compute LCS length
    lcs_length = _lcs_length(ref_tokens, hyp_tokens)
    
    # Compute precision and recall
    precision = lcs_length / len(hyp_tokens) if len(hyp_tokens) > 0 else 0.0
    recall = lcs_length / len(ref_tokens) if len(ref_tokens) > 0 else 0.0
    
    # Compute F1-score
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0
    
    return f1


def _lcs_length(x, y):
    """
    Compute length of Longest Common Subsequence
    """
    m, n = len(x), len(y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if x[i-1] == y[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]


def evaluate_summarization_model(model_path, data_dir="./data", split_name="test"):
    """
    Evaluate the summarization model
    
    Args:
        model_path (str): Path to the trained model
        data_dir (str): Path to evaluation data
        split_name (str): Split name to evaluate on (test/validation)
        
    Returns:
        dict: Evaluation metrics
    """
    print(f"Starting Summarization Model Evaluation on {split_name} split")
    print("=" * 50)
    
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
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    
    # Create dataset and dataloader
    dataset = SummarizationDataset(data_dir, tokenizer, split_name)
    dataloader = DataLoader(dataset, batch_size=4, shuffle=False, collate_fn=collate_fn)
    
    # Evaluation metrics
    total_rouge_1 = 0.0
    total_rouge_2 = 0.0
    total_rouge_l = 0.0
    total_samples = 0
    
    print("Evaluating model...")
    with torch.no_grad():
        for batch_idx, (texts, summaries) in enumerate(dataloader):
            # Move data to device
            texts = texts.to(device)  # (batch_size, src_len)
            summaries = summaries.to(device)  # (batch_size, tgt_len)
            
            # Prepare inputs (transpose for Transformer: (seq_len, batch_size))
            src = texts.transpose(0, 1)
            
            # Generate summaries for each sample in the batch
            for i in range(len(texts)):
                # Get source text
                src_text = texts[i]
                
                # Generate summary (simplified greedy decoding)
                generated_summary = generate_summary(model, src_text.unsqueeze(1), tokenizer, device)
                
                # Get reference summary
                ref_indices = summaries[i]
                ref_tokens = [tokenizer.inv_vocab.get(idx.item(), '<UNK>') for idx in ref_indices if idx.item() not in [0, 1, 2]]  # Remove special tokens
                reference_summary = ' '.join(ref_tokens)
                
                # Compute metrics
                rouge_1 = compute_rouge_n(reference_summary, generated_summary, n=1)
                rouge_2 = compute_rouge_n(reference_summary, generated_summary, n=2)
                rouge_l = compute_rouge_l(reference_summary, generated_summary)
                
                total_rouge_1 += rouge_1
                total_rouge_2 += rouge_2
                total_rouge_l += rouge_l
                total_samples += 1
                
                # Print sample results
                if batch_idx < 3:  # Print first few samples
                    print(f"\nSample {batch_idx * len(texts) + i + 1}:")
                    print(f"  Reference: {reference_summary}")
                    print(f"  Generated: {generated_summary}")
                    print(f"  ROUGE-1: {rouge_1:.4f}, ROUGE-2: {rouge_2:.4f}, ROUGE-L: {rouge_l:.4f}")
    
    # Compute average metrics
    avg_rouge_1 = total_rouge_1 / total_samples
    avg_rouge_2 = total_rouge_2 / total_samples
    avg_rouge_l = total_rouge_l / total_samples
    
    metrics = {
        "rouge_1": avg_rouge_1,
        "rouge_2": avg_rouge_2,
        "rouge_l": avg_rouge_l,
        "total_samples": total_samples
    }
    
    print("\n" + "=" * 50)
    print("Evaluation Results:")
    print(f"  Average ROUGE-1: {avg_rouge_1:.4f}")
    print(f"  Average ROUGE-2: {avg_rouge_2:.4f}")
    print(f"  Average ROUGE-L: {avg_rouge_l:.4f}")
    print(f"  Total samples: {total_samples}")
    print("=" * 50)
    
    return metrics


def generate_summary(model, src, tokenizer, device, max_len=50):
    """
    Generate summary using greedy decoding
    
    Args:
        model (CustomSummarizer): Trained model
        src (Tensor): Source sequence tensor
        tokenizer (BPETokenizer): BPE tokenizer
        device (torch.device): Device to use
        max_len (int): Maximum length of generated summary
        
    Returns:
        str: Generated summary
    """
    model.eval()
    
    # Start with BOS token
    tgt_indices = [tokenizer.vocab.get('<BOS>', 1)]
    tgt_tensor = torch.LongTensor(tgt_indices).unsqueeze(1).to(device)
    
    # Generate tokens one by one
    for _ in range(max_len):
        # Prepare input (transpose for Transformer: (seq_len, batch_size))
        src_transposed = src.transpose(0, 1)
        tgt_transposed = tgt_tensor.transpose(0, 1)
        
        # Create masks
        src_mask, tgt_mask, src_key_padding_mask, tgt_key_padding_mask = create_masks(
            src_transposed, tgt_transposed, pad_idx=0
        )
        
        # Forward pass
        with torch.no_grad():
            output = model(
                src_transposed, tgt_transposed,
                src_mask=src_mask,
                tgt_mask=tgt_mask,
                src_key_padding_mask=src_key_padding_mask,
                tgt_key_padding_mask=tgt_key_padding_mask,
                memory_key_padding_mask=src_key_padding_mask
            )
        
        # Get next token (greedy decoding)
        next_token_logits = output[-1, 0, :]  # Last token logits
        next_token = torch.argmax(next_token_logits).item()
        
        # Stop if EOS token
        if next_token == tokenizer.vocab.get('<EOS>', 2):
            break
            
        # Add token to sequence
        tgt_indices.append(next_token)
        tgt_tensor = torch.LongTensor(tgt_indices).unsqueeze(1).to(device)
    
    # Convert indices to text
    summary_tokens = [tokenizer.inv_vocab.get(idx, '<UNK>') for idx in tgt_indices[1:]]  # Remove BOS
    summary_text = ' '.join(summary_tokens)
    
    return summary_text


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
    
    # Update NLP metrics
    all_metrics["nlp_metrics"]["rouge_1"][split_name] = metrics["rouge_1"]
    all_metrics["nlp_metrics"]["rouge_2"][split_name] = metrics["rouge_2"]
    all_metrics["nlp_metrics"]["rouge_l"][split_name] = metrics["rouge_l"]
    
    # Save updated metrics
    with open(metrics_path, 'w') as f:
        json.dump(all_metrics, f, indent=2)
    
    print(f"Metrics saved to {metrics_path}")


def plot_evaluation_results():
    """
    Plot evaluation results (placeholder for actual implementation)
    """
    print("Plotting evaluation results...")
    # In a real implementation, you would plot loss curves, ROUGE scores over epochs, etc.
    print("Evaluation plots would be saved to the evaluation directory.")


if __name__ == "__main__":
    # Evaluate the model
    metrics = evaluate_summarization_model("summarizer_model.pth", split_name="test")
    
    # Save metrics
    save_metrics(metrics, split_name="test")
    
    # Plot results
    plot_evaluation_results()