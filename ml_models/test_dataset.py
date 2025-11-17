"""
Test script to verify dataset loading
"""

from datasets import load_dataset

def test_dataset_loading():
    """
    Test loading the LibriSpeech dataset
    """
    print("Testing LibriSpeech dataset loading...")
    
    try:
        # Load a small subset of the dataset
        dataset = load_dataset("nguyenvulebinh/libris_clean_100", split="train.clean.100[:10]")
        print(f"Successfully loaded {len(dataset)} samples")
        
        # Print first sample
        if len(dataset) > 0:
            sample = dataset[0]
            print("First sample:")
            print(f"  Text: {sample['text']}")
            print(f"  Speaker ID: {sample['speaker_id']}")
            print(f"  Chapter ID: {sample['chapter_id']}")
            
        return True
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return False

if __name__ == "__main__":
    test_dataset_loading()