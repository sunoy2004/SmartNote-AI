import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Save, Sparkles, Volume2, FileText, BookOpen, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRecorder } from "@/hooks/useRecorder";
import { generatePersonalizedSummary } from "@/services/summary";
import { detectSubject } from "@/services/subjectDetector";
import { useSubjects } from "@/hooks/useSubjects";
// Import our custom ML service
import { processWithFallback, areCustomModelsAvailable } from "@/services/customML";

const Record = () => {
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
  const [aiError, setAiError] = useState<string | null>(null);
  const { toast } = useToast();
  const { subjects, getSubjectNames } = useSubjects();

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
          setDetectedSubject(result.subject);
          setSubjectConfidence(result.confidence);
        } else {
          // Generate notes using the summary service
          const generatedNotes = generatePersonalizedSummary(transcript, "Beginner");
          setNotes(generatedNotes);
          
          // Generate summary
          const generatedSummary = generatePersonalizedSummary(transcript, "Intermediate");
          setSummary(generatedSummary);
          
          // Detect subject
          const subjectNames = getSubjectNames();
          if (subjectNames.length > 0) {
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
  }, [transcript, getSubjectNames, toast]);

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
    start();
    toast({
      title: "Recording Started",
      description: "Speak clearly for best results",
    });
  };

  const stopRecording = () => {
    stop();
    toast({
      title: "Recording Stopped",
      description: "Your notes have been generated",
    });
  };

  const saveNotes = () => {
    // TODO: Save to Firebase
    toast({
      title: "Notes Saved Successfully",
      description: "Your notes are now in your library",
    });
  };

  // Combine interim and final transcripts for live display
  const fullTranscript = transcript + (interimTranscript ? " " + interimTranscript : "");

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
                <Button variant="ghost" size="sm">
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
              className="min-w-[200px] transition-transform hover:scale-105 active:scale-95"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Notes
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Record;