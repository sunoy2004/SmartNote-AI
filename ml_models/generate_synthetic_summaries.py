"""
Generate Synthetic Summaries for NLP Training
Creates text-summary pairs from LibriSpeech transcripts
"""

import json
import os
import random
from pathlib import Path

def generate_summary_template(transcript):
    """
    Generate a synthetic summary using template-based approach
    
    Args:
        transcript (str): Source transcript
        
    Returns:
        str: Generated summary
    """
    # Clean transcript
    transcript = transcript.strip()
    
    # Split into sentences
    sentences = [s.strip() for s in transcript.split('.') if s.strip()]
    
    if len(sentences) == 0:
        return "No content available."
    
    if len(sentences) == 1:
        # For single sentence, use the sentence with a prefix
        summary_templates = [
            f"Key point: {sentences[0]}",
            f"Main idea: {sentences[0]}",
            f"Content summary: {sentences[0]}",
            f"This text covers: {sentences[0]}"
        ]
        return random.choice(summary_templates)
    
    # For multiple sentences, extract key information
    first_sentence = sentences[0]
    last_sentence = sentences[-1] if len(sentences) > 1 else ""
    
    # Template-based summaries
    summary_templates = [
        f"This recording discusses: {first_sentence}. {last_sentence}" if last_sentence else f"This recording discusses: {first_sentence}",
        f"Key points include: {first_sentence} and {last_sentence}" if last_sentence else f"Key point: {first_sentence}",
        f"Summary: {first_sentence}. Additional information: {last_sentence}" if last_sentence else f"Summary: {first_sentence}",
        f"Main content: {first_sentence}" + (f" ... {last_sentence}" if last_sentence else ""),
        f"Focus of this text: {first_sentence}" + (f" and {last_sentence}" if last_sentence else ""),
        f"Central theme: {first_sentence}" + (f" with details on {last_sentence}" if last_sentence else "")
    ]
    
    return random.choice(summary_templates)

def process_split(data_dir, split_name):
    """
    Process a data split to generate synthetic summaries
    
    Args:
        data_dir (str): Base data directory
        split_name (str): Split name (train/validation/test)
    """
    print(f"Processing {split_name} split...")
    
    # Paths
    split_dir = Path(data_dir) / "asr" / split_name
    nlp_split_dir = Path(data_dir) / "nlp" / split_name
    nlp_split_dir.mkdir(parents=True, exist_ok=True)
    
    texts_dir = nlp_split_dir / "texts"
    summaries_dir = nlp_split_dir / "summaries"
    texts_dir.mkdir(exist_ok=True)
    summaries_dir.mkdir(exist_ok=True)
    
    # Load ASR metadata
    asr_metadata_path = split_dir / "metadata.json"
    if not asr_metadata_path.exists():
        print(f"ASR metadata not found for {split_name} split")
        return
    
    with open(asr_metadata_path, 'r') as f:
        asr_samples = json.load(f)
    
    # Generate NLP samples
    nlp_samples = []
    for idx, sample in enumerate(asr_samples):
        try:
            transcript = sample["transcript"]
            
            # Generate synthetic summary
            summary = generate_summary_template(transcript)
            
            # Save text and summary files
            text_filename = f"text_{idx:06d}.txt"
            summary_filename = f"summary_{idx:06d}.txt"
            
            text_path = texts_dir / text_filename
            summary_path = summaries_dir / summary_filename
            
            with open(text_path, 'w') as f:
                f.write(transcript)
            
            with open(summary_path, 'w') as f:
                f.write(summary)
            
            # Add to NLP samples
            nlp_samples.append({
                "text_file": text_filename,
                "summary_file": summary_filename,
                "text": transcript,
                "summary": summary
            })
        except Exception as e:
            print(f"Error processing sample {idx}: {e}")
            continue
    
    # Save NLP metadata
    nlp_metadata_path = nlp_split_dir / "metadata.json"
    with open(nlp_metadata_path, 'w') as f:
        json.dump(nlp_samples, f, indent=2)
    
    print(f"Generated {len(nlp_samples)} text-summary pairs for {split_name} split")

def main():
    """
    Main function to generate synthetic summaries
    """
    data_dir = "./data"
    
    # Process each split
    for split_name in ["train", "validation", "test"]:
        asr_split_dir = Path(data_dir) / "asr" / split_name
        if asr_split_dir.exists():
            process_split(data_dir, split_name)
    
    print("Synthetic summary generation completed!")

if __name__ == "__main__":
    main()