"""
Verify Dataset Integration
Checks that all required files for dataset integration have been created
"""

import os
from pathlib import Path

def verify_files():
    """
    Verify that all required files exist
    """
    base_dir = Path(__file__).parent
    
    # List of required files
    required_files = [
        # Main scripts
        "dataset_loader.py",
        "convert_asr_data.py",
        "convert_nlp_data.py",
        "generate_synthetic_summaries.py",
        "train_pipeline.py",
        "example_usage_with_dataset.py",
        
        # Configuration files
        "dataset_config.json",
        
        # Documentation
        "docs/dataset/README.md",
        "docs/DATASET_INTEGRATION.md",
        
        # Model scripts (already existed)
        "asr/train_asr.py",
        "asr/evaluate_asr.py",
        "nlp/train_nlp.py",
        "nlp/evaluate_nlp.py",
        "pipeline_voice_to_notes.py",
        
        # Requirements
        "requirements.txt"
    ]
    
    # Check each file
    missing_files = []
    existing_files = []
    
    for file_path in required_files:
        full_path = base_dir / file_path
        if full_path.exists():
            existing_files.append(file_path)
            print(f"✓ {file_path}")
        else:
            missing_files.append(file_path)
            print(f"✗ {file_path}")
    
    # Summary
    print("\n" + "="*50)
    print("VERIFICATION SUMMARY")
    print("="*50)
    print(f"Files found: {len(existing_files)}")
    print(f"Files missing: {len(missing_files)}")
    
    if missing_files:
        print("\nMissing files:")
        for file_path in missing_files:
            print(f"  - {file_path}")
        return False
    else:
        print("\nAll required files are present!")
        return True

def verify_directory_structure():
    """
    Verify the directory structure
    """
    base_dir = Path(__file__).parent
    
    # Required directories
    required_dirs = [
        "data",
        "data/asr",
        "data/asr/train",
        "data/asr/validation",
        "data/asr/test",
        "data/nlp",
        "data/nlp/train",
        "data/nlp/validation",
        "data/nlp/test",
        "docs/dataset",
        "evaluation"
    ]
    
    # Check each directory
    missing_dirs = []
    existing_dirs = []
    
    for dir_path in required_dirs:
        full_path = base_dir / dir_path
        if full_path.exists():
            existing_dirs.append(dir_path)
            print(f"✓ {dir_path}")
        else:
            missing_dirs.append(dir_path)
            print(f"✗ {dir_path}")
    
    # Summary
    print("\n" + "="*50)
    print("DIRECTORY STRUCTURE VERIFICATION")
    print("="*50)
    print(f"Directories found: {len(existing_dirs)}")
    print(f"Directories missing: {len(missing_dirs)}")
    
    if missing_dirs:
        print("\nMissing directories:")
        for dir_path in missing_dirs:
            print(f"  - {dir_path}")
        return False
    else:
        print("\nAll required directories are present!")
        return True

def main():
    """
    Main verification function
    """
    print("Dataset Integration Verification")
    print("="*50)
    
    # Verify files
    files_ok = verify_files()
    
    # Verify directory structure
    dirs_ok = verify_directory_structure()
    
    # Final summary
    print("\n" + "="*50)
    print("FINAL VERIFICATION RESULT")
    print("="*50)
    
    if files_ok and dirs_ok:
        print("✅ Dataset integration is complete and ready to use!")
        print("\nNext steps:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Install datasets library: pip install datasets")
        print("3. Run dataset loader: python dataset_loader.py")
        print("4. Run training pipeline: python train_pipeline.py")
    else:
        print("❌ Dataset integration is incomplete.")
        print("Please check the missing files/directories above.")

if __name__ == "__main__":
    main()