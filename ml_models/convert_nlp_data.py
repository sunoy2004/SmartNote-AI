"""
NLP Data Conversion Script
Converts text data to tokenized tensors for NLP model training
"""

import os
import json
import torch
from pathlib import Path
from tqdm import tqdm
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import our custom model
from nlp.model_summarizer import CustomSummarizer, BPETokenizer

def load_and_train_tokenizer(data_dir, vocab_size=5000):
    """
    Load text data and train BPE tokenizer
    
    Args:
        data_dir (str): Base data directory
        vocab_size (int): Vocabulary size for tokenizer
        
    Returns:
        BPETokenizer: Trained tokenizer
    """
    print("Training BPE tokenizer...")
    
    # Collect all text data for tokenizer training
    texts = []
    
    # Load training data
    train_dir = Path(data_dir) / "nlp" / "train"
    metadata_path = train_dir / "metadata.json"
    
    if metadata_path.exists():
        with open(metadata_path, 'r') as f:
            samples = json.load(f)
        
        for sample in samples[:1000]:  # Use first 1000 samples for training tokenizer
            texts.append(sample["text"])
    
    # Train tokenizer
    tokenizer = BPETokenizer(vocab_size=vocab_size)
    tokenizer.train(texts)
    
    return tokenizer

def convert_text_to_tokens(data_dir, split_name, tokenizer):
    """
    Convert text files to tokenized tensors for NLP training
    
    Args:
        data_dir (str): Base data directory
        split_name (str): Split name (train/val/test)
        tokenizer (BPETokenizer): Trained tokenizer
    """
    print(f"Converting {split_name} text to tokens...")
    
    # Paths
    split_dir = Path(data_dir) / "nlp" / split_name
    texts_dir = split_dir / "texts"
    summaries_dir = split_dir / "summaries"
    processed_dir = split_dir / "processed"
    processed_dir.mkdir(exist_ok=True)
    
    # Load metadata
    metadata_path = split_dir / "metadata.json"
    with open(metadata_path, 'r') as f:
        samples = json.load(f)
    
    # Process each sample
    processed_samples = []
    for sample in tqdm(samples):
        try:
            # Load text and summary
            text_path = texts_dir / sample["text_file"]
            summary_path = summaries_dir / sample["summary_file"]
            
            if not text_path.exists() or not summary_path.exists():
                print(f"Text or summary file not found: {text_path} or {summary_path}")
                continue
            
            with open(text_path, 'r') as f:
                text = f.read()
            
            with open(summary_path, 'r') as f:
                summary = f.read()
            
            # Tokenize text and summary
            text_tokens = tokenizer.encode(text)
            summary_tokens = tokenizer.encode(summary)
            
            # Add BOS and EOS tokens
            text_indices = [tokenizer.vocab.get('<BOS>', 1)] + text_tokens + [tokenizer.vocab.get('<EOS>', 2)]
            summary_indices = [tokenizer.vocab.get('<BOS>', 1)] + summary_tokens + [tokenizer.vocab.get('<EOS>', 2)]
            
            # Convert to tensors
            text_tensor = torch.LongTensor(text_indices)
            summary_tensor = torch.LongTensor(summary_indices)
            
            # Save token tensors
            text_filename = f"{Path(sample['text_file']).stem}_tokens.pt"
            summary_filename = f"{Path(sample['summary_file']).stem}_tokens.pt"
            
            text_path = processed_dir / text_filename
            summary_path = processed_dir / summary_filename
            
            torch.save(text_tensor, text_path)
            torch.save(summary_tensor, summary_path)
            
            # Update sample with processed file paths
            processed_sample = {
                "text_tokens_file": text_filename,
                "summary_tokens_file": summary_filename,
                "original_text_file": sample["text_file"],
                "original_summary_file": sample["summary_file"]
            }
            processed_samples.append(processed_sample)
            
        except Exception as e:
            print(f"Error processing {sample.get('text_file', 'unknown')}: {e}")
            continue
    
    # Save processed metadata
    processed_metadata_path = split_dir / "processed_metadata.json"
    with open(processed_metadata_path, 'w') as f:
        json.dump(processed_samples, f, indent=2)
    
    print(f"Processed {len(processed_samples)} samples for {split_name} split")
    print(f"Saved processed data to: {processed_dir}")

def main():
    """
    Main function to convert NLP data
    """
    data_dir = "./data"
    
    # Train tokenizer
    tokenizer = load_and_train_tokenizer(data_dir)
    
    # Process each split
    for split_name in ["train", "validation", "test"]:
        if (Path(data_dir) / "nlp" / split_name).exists():
            convert_text_to_tokens(data_dir, split_name, tokenizer)
    
    print("NLP data conversion completed!")

if __name__ == "__main__":
    main()