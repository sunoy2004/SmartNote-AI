"""
Test script to verify that all modules can be imported correctly
"""

def test_asr_imports():
    """Test ASR module imports"""
    try:
        from asr.model import CustomASRModel, AudioPreprocessor, ctc_decode
        print("✓ ASR model imports successful")
        
        # Test model instantiation
        model = CustomASRModel()
        print(f"✓ ASR model instantiated with {sum(p.numel() for p in model.parameters())} parameters")
        
        preprocessor = AudioPreprocessor()
        print("✓ ASR preprocessor instantiated")
        
        return True
    except Exception as e:
        print(f"✗ ASR import failed: {e}")
        return False


def test_nlp_imports():
    """Test NLP module imports"""
    try:
        from nlp.model_summarizer import CustomSummarizer, BPETokenizer, create_masks
        print("✓ NLP model imports successful")
        
        # Test model instantiation
        model = CustomSummarizer()
        print(f"✓ NLP model instantiated with {sum(p.numel() for p in model.parameters())} parameters")
        
        tokenizer = BPETokenizer()
        print("✓ NLP tokenizer instantiated")
        
        return True
    except Exception as e:
        print(f"✗ NLP import failed: {e}")
        return False


def test_pipeline_imports():
    """Test pipeline imports"""
    try:
        from pipeline_voice_to_notes import load_audio_file, preprocess_audio, transcribe_audio, generate_notes, save_output
        print("✓ Pipeline imports successful")
        return True
    except Exception as e:
        print(f"✗ Pipeline import failed: {e}")
        return False


def test_training_imports():
    """Test training script imports"""
    try:
        from asr.train_asr import ASRDataset, compute_ctc_loss, train_asr_model
        print("✓ ASR training imports successful")
        
        from nlp.train_nlp import SummarizationDataset, compute_loss, train_summarization_model
        print("✓ NLP training imports successful")
        
        return True
    except Exception as e:
        print(f"✗ Training import failed: {e}")
        return False


def test_evaluation_imports():
    """Test evaluation script imports"""
    try:
        from asr.evaluate_asr import compute_wer, compute_cer, evaluate_asr_model
        print("✓ ASR evaluation imports successful")
        
        from nlp.evaluate_nlp import compute_rouge_n, compute_rouge_l, evaluate_summarization_model
        print("✓ NLP evaluation imports successful")
        
        return True
    except Exception as e:
        print(f"✗ Evaluation import failed: {e}")
        return False


if __name__ == "__main__":
    print("Testing module imports...")
    print("=" * 30)
    
    # Test all imports
    results = []
    results.append(test_asr_imports())
    results.append(test_nlp_imports())
    results.append(test_pipeline_imports())
    results.append(test_training_imports())
    results.append(test_evaluation_imports())
    
    # Summary
    print("\n" + "=" * 30)
    print("Import Test Summary:")
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("✓ All imports successful!")
    else:
        print("✗ Some imports failed. Please check the errors above.")