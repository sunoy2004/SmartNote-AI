import { useState, useRef, useCallback } from "react";

interface UseRecorderReturn {
  isRecording: boolean;
  transcript: string;
  interimTranscript: string;
  audioBlob: Blob | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
  error: string | null;
}

/**
 * Hook for real-time audio recording and transcription
 * Uses Web Speech API for browser-based transcription
 * 
 * @returns Recording state and controls
 */
export const useRecorder = (): UseRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const start = useCallback(() => {
    setError(null);
    setTranscript("");
    setInterimTranscript("");
    audioChunksRef.current = [];

    // Check for Web Speech API support
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari."
      );
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      if (final) {
        setTranscript((prev) => prev + final);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      // Restart recognition if still recording
      // Use a ref to track recording state to avoid stale closure
      if (recognitionRef.current === recognition) {
        try {
          recognition.start();
        } catch (err) {
          // Recognition already started or stopped
        }
      }
    };

    recognitionRef.current = recognition;

    // Start audio recording (optional - for saving audio file)
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          setAudioBlob(blob);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        recognition.start();
        setIsRecording(true);
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
        setError("Could not access microphone. Please check permissions.");
      });
  }, [isRecording]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    setIsRecording(false);
  }, [isRecording]);

  const reset = useCallback(() => {
    stop();
    setTranscript("");
    setInterimTranscript("");
    setAudioBlob(null);
    setError(null);
  }, [stop]);

  return {
    isRecording,
    transcript,
    interimTranscript,
    audioBlob,
    start,
    stop,
    reset,
    error,
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

