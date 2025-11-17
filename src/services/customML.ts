/**
 * Custom ML Service for SmartNote-AI
 * Integrates the custom voice-to-notes models with the React frontend
 */

// Import necessary utilities
import { generatePersonalizedSummary as originalGeneratePersonalizedSummary } from "./summary";
import { detectSubject as originalDetectSubject } from "./subjectDetector";

// API endpoint for the Python server
const API_BASE_URL = "http://localhost:5000";

// Types for our custom ML models
interface ASRResult {
  transcript: string;
  confidence: number;
}

interface SummarizationResult {
  summary: string;
  notes: string;
}

interface SubjectDetectionResult {
  subject: string;
  confidence: number;
}

/**
 * Check if the Python API server is available
 * @returns Promise that resolves to true if server is available
 */
const isPythonServerAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.ml_models_available === true;
    }
    return false;
  } catch (error) {
    console.warn("Python API server not available:", error);
    return false;
  }
};

/**
 * Transcribe audio using the custom ASR model
 * @param audioBlob - Audio data to transcribe
 * @returns Promise with transcription result
 */
export const transcribeWithCustomASR = async (audioBlob: Blob): Promise<ASRResult> => {
  try {
    // Check if Python server is available
    const serverAvailable = await isPythonServerAvailable();
    if (!serverAvailable) {
      throw new Error("Python API server not available");
    }
    
    // Create FormData to send audio file
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    
    // Call the Python API
    const response = await fetch(`${API_BASE_URL}/transcribe`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return {
      transcript: data.transcript,
      confidence: data.confidence,
    };
  } catch (error) {
    console.error("ASR transcription failed:", error);
    throw new Error("Failed to transcribe audio with custom ASR model");
  }
};

/**
 * Generate notes and summary using the custom NLP model
 * @param transcript - Text to process
 * @param preference - User preference level
 * @returns Promise with summarization result
 */
export const generateNotesWithCustomNLP = async (
  transcript: string,
  preference: "Beginner" | "Intermediate" | "Advanced" = "Intermediate"
): Promise<SummarizationResult> => {
  try {
    // Check if Python server is available
    const serverAvailable = await isPythonServerAvailable();
    if (!serverAvailable) {
      throw new Error("Python API server not available");
    }
    
    // Call the Python API
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: transcript,
        preference: preference,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return {
      notes: data.notes,
      summary: data.summary,
    };
  } catch (error) {
    console.error("NLP processing failed:", error);
    throw new Error("Failed to generate notes with custom NLP model");
  }
};

/**
 * Detect subject using the custom model
 * @param transcript - Text to analyze
 * @param subjects - Available subjects
 * @returns Promise with subject detection result
 */
export const detectSubjectWithCustomModel = async (
  transcript: string,
  subjects: string[]
): Promise<SubjectDetectionResult> => {
  try {
    // For subject detection, we'll use the original implementation for now
    // In a full implementation, this would call a custom Python model
    const result = originalDetectSubject(transcript, subjects);
    
    return {
      subject: result.subject,
      confidence: result.confidence
    };
  } catch (error) {
    console.error("Subject detection failed:", error);
    throw new Error("Failed to detect subject with custom model");
  }
};

/**
 * Process audio through the complete pipeline
 * @param audioBlob - Audio data to process
 * @param subjects - Available subjects
 * @param preference - User preference level
 * @returns Promise with complete processing result
 */
export const processAudioWithCustomModels = async (
  audioBlob: Blob,
  subjects: string[],
  preference: "Beginner" | "Intermediate" | "Advanced" = "Intermediate"
): Promise<{
  transcript: string;
  notes: string;
  summary: string;
  subject: string;
  confidence: number;
}> => {
  try {
    // Check if Python server is available
    const serverAvailable = await isPythonServerAvailable();
    if (!serverAvailable) {
      throw new Error("Python API server not available");
    }
    
    // Create FormData to send audio file
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    
    // For a complete pipeline, we would send both audio and text data
    // For now, we'll call the individual services
    
    // Step 1: Transcribe audio
    const asrResult = await transcribeWithCustomASR(audioBlob);
    
    // Step 2: Generate notes and summary
    const nlpResult = await generateNotesWithCustomNLP(asrResult.transcript, preference);
    
    // Step 3: Detect subject
    const subjectResult = await detectSubjectWithCustomModel(asrResult.transcript, subjects);
    
    return {
      transcript: asrResult.transcript,
      notes: nlpResult.notes,
      summary: nlpResult.summary,
      subject: subjectResult.subject,
      confidence: subjectResult.confidence
    };
  } catch (error) {
    console.error("Complete pipeline processing failed:", error);
    throw new Error("Failed to process audio with custom models");
  }
};

/**
 * Check if custom models are available
 * @returns Boolean indicating if custom models can be used
 */
export const areCustomModelsAvailable = (): boolean => {
  // In a real implementation, this would check if the Python environment is available
  // For now, we'll return false to indicate that the custom models are not yet fully integrated
  // When you're ready to enable the custom models, change this to return true
  return true;
};

/**
 * Fallback to original services if custom models are not available
 * @param transcript - Text to process
 * @param subjects - Available subjects
 * @param preference - User preference level
 * @returns Processing result using original services
 */
export const processWithFallback = (
  transcript: string,
  subjects: string[],
  preference: "Beginner" | "Intermediate" | "Advanced" = "Intermediate"
) => {
  const notes = originalGeneratePersonalizedSummary(transcript, preference);
  const summary = originalGeneratePersonalizedSummary(transcript, "Intermediate");
  const subjectResult = originalDetectSubject(transcript, subjects);
  
  return {
    notes,
    summary,
    subject: subjectResult.subject,
    confidence: subjectResult.confidence
  };
};