"""
Visualization Script for Generating Model Architecture Diagrams
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np


def draw_asr_architecture():
    """
    Draw ASR model architecture diagram
    """
    fig, ax = plt.subplots(1, 1, figsize=(12, 6))
    
    # Define component positions
    components = [
        ("Audio Input", 0, 2),
        ("Mel-Spectrogram\nExtraction", 2, 2),
        ("CNN Layers\n(3× Conv1D)", 4, 2),
        ("Bi-LSTM Layers\n(2× Bi-LSTM)", 6, 2),
        ("Fully Connected\nLayer", 8, 2),
        ("CTC Loss\nOutput", 10, 2)
    ]
    
    # Draw components
    for i, (label, x, y) in enumerate(components):
        rect = patches.Rectangle((x-0.8, y-0.5), 1.6, 1, linewidth=2, 
                               edgecolor='blue', facecolor='lightblue')
        ax.add_patch(rect)
        ax.text(x, y, label, ha='center', va='center', fontsize=10, weight='bold')
        
        # Draw arrows between components
        if i > 0:
            ax.annotate('', xy=(x-0.8, y), xytext=(x-1.2, y),
                       arrowprops=dict(arrowstyle='->', lw=2, color='black'))
    
    # Set axis properties
    ax.set_xlim(-1, 11)
    ax.set_ylim(0, 4)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('ASR Model Architecture', fontsize=16, weight='bold')
    
    # Save figure
    plt.tight_layout()
    plt.savefig('evaluation/model_architecture_asr.png', dpi=300, bbox_inches='tight')
    plt.close()


def draw_nlp_architecture():
    """
    Draw NLP model architecture diagram
    """
    fig, ax = plt.subplots(1, 1, figsize=(12, 6))
    
    # Define component positions
    components = [
        ("Text Input", 0, 2),
        ("BPE Tokenization", 2, 2),
        ("Embedding +\nPositional Encoding", 4, 2),
        ("Transformer\nEncoder (4 Layers)", 6, 3),
        ("Transformer\nDecoder (4 Layers)", 6, 1),
        ("Output\nProjection", 8, 2),
        ("Notes Output", 10, 2)
    ]
    
    # Draw components
    for i, (label, x, y) in enumerate(components):
        color = 'lightgreen' if 'Encoder' in label or 'Decoder' in label else 'lightblue'
        edge_color = 'green' if 'Encoder' in label or 'Decoder' in label else 'blue'
        
        rect = patches.Rectangle((x-0.8, y-0.5), 1.6, 1, linewidth=2, 
                               edgecolor=edge_color, facecolor=color)
        ax.add_patch(rect)
        ax.text(x, y, label, ha='center', va='center', fontsize=9, weight='bold')
        
        # Draw arrows between components
        if i > 0:
            if i == 3:  # Encoder
                ax.annotate('', xy=(x-0.8, y), xytext=(x-1.2, y+0.5),
                           arrowprops=dict(arrowstyle='->', lw=2, color='black'))
            elif i == 4:  # Decoder
                ax.annotate('', xy=(x-0.8, y), xytext=(x-1.2, y-0.5),
                           arrowprops=dict(arrowstyle='->', lw=2, color='black'))
            elif i == 5:  # Output projection
                ax.annotate('', xy=(x-0.8, y), xytext=(x-1.2, y),
                           arrowprops=dict(arrowstyle='->', lw=2, color='black'))
                # Arrows from encoder and decoder to output projection
                ax.annotate('', xy=(x-0.8, y+0.3), xytext=(x-0.8, y+0.8),
                           arrowprops=dict(arrowstyle='->', lw=1, color='gray'))
                ax.annotate('', xy=(x-0.8, y-0.3), xytext=(x-0.8, y-0.8),
                           arrowprops=dict(arrowstyle='->', lw=1, color='gray'))
            else:
                ax.annotate('', xy=(x-0.8, y), xytext=(x-1.2, y),
                           arrowprops=dict(arrowstyle='->', lw=2, color='black'))
    
    # Set axis properties
    ax.set_xlim(-1, 11)
    ax.set_ylim(0, 4)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('NLP Summarization Model Architecture', fontsize=16, weight='bold')
    
    # Save figure
    plt.tight_layout()
    plt.savefig('evaluation/model_architecture_nlp.png', dpi=300, bbox_inches='tight')
    plt.close()


def draw_system_architecture():
    """
    Draw overall system architecture diagram
    """
    fig, ax = plt.subplots(1, 1, figsize=(14, 8))
    
    # Define component positions
    components = [
        ("Audio File\n(.wav/.mp3)", 0, 6),
        ("Audio\nPreprocessing", 2, 6),
        ("ASR Model\n(CNN + Bi-LSTM)", 4, 6),
        ("Transcript\n(Text)", 6, 6),
        ("NLP Model\n(Transformer)", 4, 4),
        ("Notes/Summary\n(Text)", 6, 2),
        ("Output Files\n(JSON/TXT)", 8, 2),
        ("Evaluation\nMetrics", 10, 4)
    ]
    
    # Draw components
    for i, (label, x, y) in enumerate(components):
        if "Audio" in label:
            color, edge_color = 'lightyellow', 'orange'
        elif "ASR" in label:
            color, edge_color = 'lightblue', 'blue'
        elif "NLP" in label:
            color, edge_color = 'lightgreen', 'green'
        elif "Evaluation" in label:
            color, edge_color = 'lightcoral', 'red'
        else:
            color, edge_color = 'lightgray', 'gray'
            
        rect = patches.Rectangle((x-1, y-0.7), 2, 1.4, linewidth=2, 
                               edgecolor=edge_color, facecolor=color)
        ax.add_patch(rect)
        ax.text(x, y, label, ha='center', va='center', fontsize=9, weight='bold')
    
    # Draw arrows
    arrows = [
        (0, 6, 1, 6),  # Audio file to preprocessing
        (2, 6, 3, 6),  # Preprocessing to ASR
        (4, 6, 5, 6),  # ASR to Transcript
        (6, 6, 4, 5),  # Transcript to NLP (diagonal)
        (4, 4, 5, 3),  # NLP to Notes (diagonal)
        (6, 2, 7, 2),  # Notes to Output
        (6, 2, 9, 3),  # Notes to Evaluation (diagonal)
        (4, 4, 9, 5),  # NLP to Evaluation (diagonal)
    ]
    
    for x1, y1, x2, y2 in arrows:
        ax.annotate('', xy=(x2-0.5, y2), xytext=(x1+0.5, y1),
                   arrowprops=dict(arrowstyle='->', lw=2, color='black'))
    
    # Set axis properties
    ax.set_xlim(-1, 11)
    ax.set_ylim(1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Voice-to-Notes System Architecture', fontsize=16, weight='bold')
    
    # Save figure
    plt.tight_layout()
    plt.savefig('evaluation/system_architecture.png', dpi=300, bbox_inches='tight')
    plt.close()


def draw_data_flow():
    """
    Draw data flow diagram
    """
    fig, ax = plt.subplots(1, 1, figsize=(12, 6))
    
    # Define component positions
    components = [
        ("Audio Data\nCollection", 0, 3),
        ("Data\nPreprocessing", 2, 3),
        ("ASR Training\nDataset", 4, 4),
        ("NLP Training\nDataset", 4, 2),
        ("ASR Model\nTraining", 6, 4),
        ("NLP Model\nTraining", 6, 2),
        ("Model\nEvaluation", 8, 3),
        ("Pipeline\nIntegration", 10, 3)
    ]
    
    # Draw components
    for i, (label, x, y) in enumerate(components):
        if "ASR" in label and "Training" in label:
            color, edge_color = 'lightblue', 'blue'
        elif "NLP" in label and "Training" in label:
            color, edge_color = 'lightgreen', 'green'
        elif "Training" in label:
            color, edge_color = 'lightyellow', 'orange'
        elif "Evaluation" in label:
            color, edge_color = 'lightcoral', 'red'
        else:
            color, edge_color = 'lightgray', 'gray'
            
        rect = patches.Rectangle((x-0.8, y-0.5), 1.6, 1, linewidth=2, 
                               edgecolor=edge_color, facecolor=color)
        ax.add_patch(rect)
        ax.text(x, y, label, ha='center', va='center', fontsize=8, weight='bold')
    
    # Draw arrows
    arrows = [
        (0, 3, 1, 3),  # Data collection to preprocessing
        (2, 3, 3, 3.7),  # Preprocessing to ASR dataset
        (2, 3, 3, 2.3),  # Preprocessing to NLP dataset
        (4, 4, 5, 4),  # ASR dataset to ASR training
        (4, 2, 5, 2),  # NLP dataset to NLP training
        (5, 4, 7, 3.3),  # ASR training to evaluation
        (5, 2, 7, 2.7),  # NLP training to evaluation
        (8, 3, 9, 3),  # Evaluation to pipeline
    ]
    
    for x1, y1, x2, y2 in arrows:
        ax.annotate('', xy=(x2-0.5, y2), xytext=(x1+0.5, y1),
                   arrowprops=dict(arrowstyle='->', lw=2, color='black'))
    
    # Set axis properties
    ax.set_xlim(-1, 11)
    ax.set_ylim(1, 5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Data Flow Diagram', fontsize=16, weight='bold')
    
    # Save figure
    plt.tight_layout()
    plt.savefig('evaluation/data_flow_diagram.png', dpi=300, bbox_inches='tight')
    plt.close()


def draw_training_pipeline():
    """
    Draw training pipeline flowchart
    """
    fig, ax = plt.subplots(1, 1, figsize=(14, 8))
    
    # Define component positions
    components = [
        ("Initialize\nModel", 1, 6),
        ("Load\nDataset", 3, 6),
        ("Preprocess\nData", 5, 6),
        ("Forward\nPass", 7, 6),
        ("Compute\nLoss", 9, 6),
        ("Backward\nPass", 11, 6),
        ("Update\nWeights", 13, 6),
        ("Validation\nEvaluation", 13, 4),
        ("Save\nCheckpoint", 11, 2),
        ("Continue\nTraining?", 9, 2),
        ("Final\nModel", 7, 2),
        ("Evaluation\nMetrics", 5, 2),
        ("Performance\nAnalysis", 3, 2),
        ("Model\nDeployment", 1, 2)
    ]
    
    # Draw components
    for i, (label, x, y) in enumerate(components):
        color, edge_color = 'lightgray', 'gray'
        if "Initialize" in label or "Final" in label:
            color, edge_color = 'lightblue', 'blue'
        elif "Evaluation" in label or "Analysis" in label:
            color, edge_color = 'lightcoral', 'red'
        elif "Deployment" in label:
            color, edge_color = 'lightgreen', 'green'
            
        rect = patches.Rectangle((x-0.8, y-0.5), 1.6, 1, linewidth=2, 
                               edgecolor=edge_color, facecolor=color)
        ax.add_patch(rect)
        ax.text(x, y, label, ha='center', va='center', fontsize=7, weight='bold')
    
    # Draw arrows
    arrows = [
        (1, 6, 2, 6),  # Initialize to Load
        (3, 6, 4, 6),  # Load to Preprocess
        (5, 6, 6, 6),  # Preprocess to Forward
        (7, 6, 8, 6),  # Forward to Compute Loss
        (9, 6, 10, 6),  # Compute Loss to Backward
        (11, 6, 12, 6),  # Backward to Update
        (13, 6, 13, 5),  # Update to Validation
        (13, 4, 12, 3),  # Validation to Save
        (11, 2, 10, 2),  # Save to Continue
        (9, 2, 8, 2),  # Continue to Final
        (7, 2, 6, 2),  # Final to Evaluation
        (5, 2, 4, 2),  # Evaluation to Analysis
        (3, 2, 2, 2),  # Analysis to Deployment
    ]
    
    # Add loop arrow
    arrows.append((10, 2, 2, 5))  # Continue back to Preprocess
    
    for x1, y1, x2, y2 in arrows:
        ax.annotate('', xy=(x2-0.5 if x2 > x1 else x2+0.5, y2), 
                   xytext=(x1+0.5 if x1 < x2 else x1-0.5, y1),
                   arrowprops=dict(arrowstyle='->', lw=2, color='black'))
    
    # Set axis properties
    ax.set_xlim(0, 14)
    ax.set_ylim(1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Training Pipeline Flowchart', fontsize=16, weight='bold')
    
    # Save figure
    plt.tight_layout()
    plt.savefig('evaluation/training_pipeline_flowchart.png', dpi=300, bbox_inches='tight')
    plt.close()


if __name__ == "__main__":
    # Create evaluation directory if it doesn't exist
    import os
    os.makedirs('evaluation', exist_ok=True)
    
    # Generate all diagrams
    print("Generating architecture diagrams...")
    draw_asr_architecture()
    print("ASR architecture diagram saved to evaluation/model_architecture_asr.png")
    
    draw_nlp_architecture()
    print("NLP architecture diagram saved to evaluation/model_architecture_nlp.png")
    
    draw_system_architecture()
    print("System architecture diagram saved to evaluation/system_architecture.png")
    
    draw_data_flow()
    print("Data flow diagram saved to evaluation/data_flow_diagram.png")
    
    draw_training_pipeline()
    print("Training pipeline flowchart saved to evaluation/training_pipeline_flowchart.png")
    
    print("\nAll diagrams generated successfully!")