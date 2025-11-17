"""
Create Data Directories
Creates the required directory structure for dataset integration
"""

import os
from pathlib import Path

def create_directories():
    """
    Create all required directories
    """
    base_dir = Path(__file__).parent
    
    # Required directories
    required_dirs = [
        "data",
        "data/asr",
        "data/asr/train",
        "data/asr/train/audio",
        "data/asr/train/processed",
        "data/asr/validation",
        "data/asr/validation/audio",
        "data/asr/validation/processed",
        "data/asr/test",
        "data/asr/test/audio",
        "data/asr/test/processed",
        "data/nlp",
        "data/nlp/train",
        "data/nlp/train/texts",
        "data/nlp/train/summaries",
        "data/nlp/train/processed",
        "data/nlp/validation",
        "data/nlp/validation/texts",
        "data/nlp/validation/summaries",
        "data/nlp/validation/processed",
        "data/nlp/test",
        "data/nlp/test/texts",
        "data/nlp/test/summaries",
        "data/nlp/test/processed"
    ]
    
    # Create each directory
    for dir_path in required_dirs:
        full_path = base_dir / dir_path
        full_path.mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {dir_path}")
    
    print(f"\nCreated {len(required_dirs)} directories successfully!")

if __name__ == "__main__":
    create_directories()