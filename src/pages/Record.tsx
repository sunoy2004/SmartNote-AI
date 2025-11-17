import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Save, Sparkles, Volume2, FileText, BookOpen, Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRecorder } from "@/hooks/useRecorder";
import { generatePersonalizedSummary, generateStructuredNotes } from "@/services/summary";
import { detectSubject } from "@/services/subjectDetector";
import { useSubjects } from "@/hooks/useSubjects";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase/config";
// Import our custom ML service
import { processWithFallback, areCustomModelsAvailable } from "@/services/customML";
import { useAuth } from "@/hooks/useAuth";

const Record = () => {
  const navigate = useNavigate();

  const {
    isRecording, 
    transcript, 
    interimTranscript, 
    audioBlob, // Add audioBlob to the destructuring
    start, 
    stop,
    error
  } = useRecorder();
  
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [detectedSubject, setDetectedSubject] = useState("General");
  const [subjectConfidence, setSubjectConfidence] = useState(0);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [pendingSubject, setPendingSubject] = useState("General");
  const [isSubjectLocked, setIsSubjectLocked] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [showSaveSuccessDialog, setShowSaveSuccessDialog] = useState(false);
  const recordingStartRef = useRef<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [aiError, setAiError] = useState<string | null>(null);
  const { toast } = useToast();
  const { subjects, getSubjectNames } = useSubjects();
  const { user } = useAuth();

  useEffect(() => {
    setPendingSubject(detectedSubject);
  }, [detectedSubject]);

  // Generate notes and summary in real-time as transcript updates
  useEffect(() => {
    if (transcript) {
      try {
        // Clear any previous AI errors
        setAiError(null);
        
        // Use custom ML models if available, otherwise fallback to original services
        if (areCustomModelsAvailable()) {
          // In a real implementation, we would process with custom models
          // For now, we'll use the fallback
          const result = processWithFallback(transcript, getSubjectNames(), "Beginner");
          setNotes(result.notes);
          setSummary(result.summary);
          if (!isSubjectLocked) {
            setDetectedSubject(result.subject);
            setSubjectConfidence(result.confidence);
          }
        } else {
          // Generate notes using the summary service
          const generatedNotes = generateStructuredNotes(transcript);
          setNotes(generatedNotes);
          
          // Generate summary
          const generatedSummary = generatePersonalizedSummary(transcript, "Intermediate");
          setSummary(generatedSummary);
          
          // Detect subject
          const subjectNames = getSubjectNames();
          if (subjectNames.length > 0 && !isSubjectLocked) {
            const { subject, confidence } = detectSubject(transcript, subjectNames);
            setDetectedSubject(subject);
            setSubjectConfidence(confidence);
          }
        }
      } catch (err) {
        const error = err as Error;
        console.error("AI processing error:", error);
        setAiError("Failed to generate notes. Please try again.");
        toast({
          title: "AI Processing Error",
          description: "Failed to generate notes. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [transcript, getSubjectNames, toast, isSubjectLocked]);

  // Handle errors from the recorder
  useEffect(() => {
    if (error) {
      toast({
        title: "Recording Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Handle AI errors
  useEffect(() => {
    if (aiError) {
      toast({
        title: "AI Processing Error",
        description: aiError,
        variant: "destructive",
      });
    }
  }, [aiError, toast]);

  const startRecording = () => {
    setNotes("");
    setSummary("");
    setAiError(null);
    setDetectedSubject("General");
    setSubjectConfidence(0);
    setIsSubjectLocked(false);
    setPendingSubject(subjects[0]?.name || "General");
    recordingStartRef.current = Date.now();
    setRecordingDuration(0);
    start();
    toast({
      title: "Recording Started",
      description: "Speak clearly for best results",
    });
  };

  const stopRecording = () => {
    stop();
    if (recordingStartRef.current) {
      setRecordingDuration(Date.now() - recordingStartRef.current);
      recordingStartRef.current = null;
    }
    toast({
      title: "Recording Stopped",
      description: "Your notes have been generated",
    });
  };

  const fullTranscript = transcript + (interimTranscript ? " " + interimTranscript : "");

  const handleSubjectUpdate = () => {
    if (!pendingSubject) {
      toast({
        title: "No subject selected",
        description: "Please select a subject before applying.",
        variant: "destructive",
      });
      return;
    }

    setDetectedSubject(pendingSubject);
    setSubjectConfidence(1);
    setIsSubjectLocked(true);
    setIsSubjectDialogOpen(false);
    toast({
      title: "Subject updated",
      description: `${pendingSubject} will be used for saving these notes.`,
    });
  };

  const saveNotes = async () => {
    if (!fullTranscript.trim()) {
      toast({
        title: "Nothing to save",
        description: "Record some audio before saving notes.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login required",
        description: "Please sign in to save your notes.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const sanitizedTranscript = transcript.trim() || fullTranscript.trim();
    const summaryPreview = summary.trim().split(/[\n.]/).find(Boolean);
    const notesPreview = notes.trim().split("\n").find(Boolean);
    const transcriptPreview = sanitizedTranscript.split(/[.!?]/).find(Boolean);
    const generatedTitle =
      (summaryPreview || notesPreview || transcriptPreview || "").trim().slice(0, 80) ||
      `SmartNote AI Entry - ${new Date().toLocaleString()}`;
    const wordCount = fullTranscript.split(/\s+/).filter(Boolean).length;
    const durationMs =
      recordingDuration > 0 ? recordingDuration : Math.max(Math.round(wordCount * 400), 30000);

    try {
      setIsSavingNote(true);

      let audioUrl: string | null = null;
      if (audioBlob && audioBlob.size > 0) {
        try {
          const audioRef = ref(storage, `users/${user.uid}/audio/${Date.now()}.webm`);
          const snapshot = await uploadBytes(audioRef, audioBlob, {
            contentType: "audio/webm",
          });
          audioUrl = await getDownloadURL(snapshot.ref);
          console.log("✅ Audio uploaded successfully:", audioUrl);
        } catch (uploadError: any) {
          console.error("❌ Audio upload failed:", uploadError);
          
          // Check if it's a CORS error
          const isCorsError = uploadError?.code === "storage/unauthorized" || 
                             uploadError?.message?.includes("CORS") ||
                             uploadError?.message?.includes("preflight");
          
          if (isCorsError) {
            console.warn("⚠️ CORS error detected. Audio upload skipped. Notes will be saved without audio.");
            toast({
              title: "Audio upload skipped",
              description: "CORS configuration needed. Notes saved without audio file.",
              variant: "default",
            });
          } else {
            toast({
              title: "Audio upload failed",
              description: "Notes will be saved without the audio file.",
              variant: "destructive",
            });
          }
        }
      }

      // Use the locked subject if available, otherwise use detected subject
      const finalSubject = isSubjectLocked ? detectedSubject : detectedSubject;

      const notesRef = collection(db, "users", user.uid, "notes");
      const docRef = await addDoc(notesRef, {
        subject: finalSubject,
        subjectConfidence,
        title: generatedTitle,
        transcript: sanitizedTranscript,
        summary: summary.trim() || "No summary generated.",
        notes: notes.trim() || "No notes generated.",
        createdAt: serverTimestamp(),
        durationMs,
        audioUrl,
        stats: {
          words: wordCount,
          characters: fullTranscript.length,
        },
      });

      console.log("✅ Note saved successfully with ID:", docRef.id);

      // Show success dialog popup
      setShowSaveSuccessDialog(true);

      // Also show toast notification
      toast({
        title: "Notes saved successfully!",
        description: `Added to ${finalSubject}`,
      });

      // Reset the form after successful save
      setTimeout(() => {
        setShowSaveSuccessDialog(false);
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("❌ Error saving notes:", err);
      
      // Better error handling for Firestore errors
      let errorMessage = "Failed to save notes. Please try again.";
      
      if (err && typeof err === "object" && "code" in err) {
        const firestoreError = err as { code: string; message: string };
        switch (firestoreError.code) {
          case "permission-denied":
            errorMessage = "Permission denied. Please make sure Firestore rules are deployed and you're logged in.";
            break;
          case "unavailable":
            errorMessage = "Firestore is unavailable. Please check your internet connection.";
            break;
          case "failed-precondition":
            errorMessage = "Operation failed. Please try again.";
            break;
          default:
            errorMessage = firestoreError.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast({
        title: "Failed to save notes",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Real-Time Recording</h1>
          <p className="text-muted-foreground">
            AI will automatically transcribe, take notes, and detect your subject
          </p>
        </div>

        {subjects.length === 0 && (
          <Card className="border border-amber-300 bg-amber-50 text-amber-900">
            <CardContent className="p-4 text-sm">
              You haven&apos;t added any subjects yet. Recordings will be saved
              under <strong>General</strong>. Add subjects later to organize
              your notes.
            </CardContent>
          </Card>
        )}

        {/* Recording Control */}
        <div className="flex justify-center">
          <Card className={`w-full max-w-md shadow-lg transition-all duration-300 ${
            isRecording 
              ? "border-accent ring-4 ring-accent/20 animate-pulse-glow" 
              : "border-border hover:shadow-xl"
          }`}>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="relative mx-auto w-32 h-32">
                  {isRecording ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
                      <div className="absolute inset-4 bg-accent/40 rounded-full animate-ping" style={{ animationDelay: "0.2s" }} />
                      <Mic className="relative h-16 w-16 text-accent animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
                      <Mic className="h-16 w-16 text-primary-foreground" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {isRecording ? "Recording in Progress..." : "Ready to Record"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRecording
                      ? "AI is listening and generating notes"
                      : "Click the button below to start"}
                  </p>
                </div>

                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "recording"}
                  onClick={isRecording ? stopRecording : startRecording}
                  className="w-full transition-transform hover:scale-105 active:scale-95"
                >
                  {isRecording ? (
                    <>
                      <Square className="h-5 w-5 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Volume2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Words</p>
                  <p className="text-lg font-semibold">{fullTranscript.split(/\s+/).filter(Boolean).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Characters</p>
                  <p className="text-lg font-semibold">{fullTranscript.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                  <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p className="text-lg font-semibold truncate max-w-[120px]">{detectedSubject}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Live Transcript */}
          <Card className="shadow-md border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className={`h-2 w-2 rounded-full ${isRecording ? "bg-accent animate-pulse" : "bg-muted"}`} />
                Live Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] p-4 bg-muted/30 rounded-lg border border-border">
                {fullTranscript ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{fullTranscript}</p>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Volume2 className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-center">Transcript will appear here as you speak...</p>
                    <p className="text-xs mt-2 text-center">Start recording to see live transcription</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Generated Notes */}
          <Card className="shadow-md border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Generated Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                {notes ? (
                  <div className="text-sm leading-relaxed whitespace-pre-line">{notes}</div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Lightbulb className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-center">AI will generate organized notes here...</p>
                    <p className="text-xs mt-2 text-center">Notes will appear as you speak</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary and Subject Detection */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-md border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-secondary" />
                Auto-Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20 min-h-[120px]">
                {summary ? (
                  <p className="text-sm">{summary}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Summary will be generated automatically
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-accent" />
                Subject Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20 flex items-center justify-between min-h-[120px]">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Detected Subject:</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-accent text-accent-foreground text-base px-4 py-1">
                      {detectedSubject}
                    </Badge>
                    {subjectConfidence > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ({Math.round(subjectConfidence * 100)}% confidence)
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (subjects.length === 0) {
                      toast({
                        title: "No subjects available",
                        description: "Add at least one subject to change classification.",
                        variant: "destructive",
                      });
                      navigate("/subjects");
                      return;
                    }
                    setPendingSubject(detectedSubject);
                    setIsSubjectDialogOpen(true);
                  }}
                >
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        {(transcript || notes) && (
          <div className="flex justify-center pt-4">
            <Button 
              size="lg" 
              variant="hero" 
              onClick={saveNotes} 
              disabled={isSavingNote}
              className="min-w-[220px] transition-transform hover:scale-105 active:scale-95 disabled:opacity-70"
            >
              {isSavingNote ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Notes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Subject</DialogTitle>
            <DialogDescription>
              Select the correct subject so your notes are organized properly.
            </DialogDescription>
          </DialogHeader>
          
          {subjects.length > 0 ? (
            <Select value={pendingSubject} onValueChange={setPendingSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">
              You don&apos;t have any subjects yet.{" "}
              <Button variant="link" className="px-1" onClick={() => navigate("/subjects")}>
                Add subjects
              </Button>
              to keep things organized.
            </p>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubjectUpdate} disabled={subjects.length === 0}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog Popup */}
      <Dialog open={showSaveSuccessDialog} onOpenChange={setShowSaveSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Notes Saved!</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your notes have been successfully saved to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-4">
              <Save className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Record;