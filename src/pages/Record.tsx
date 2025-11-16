import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Save, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import recordingVisual from "@/assets/recording-visual.jpg";

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [detectedSubject, setDetectedSubject] = useState("Physics");
  const { toast } = useToast();

  const startRecording = () => {
    setIsRecording(true);
    // TODO: Implement actual recording with Web Speech API or Firebase
    toast({
      title: "Recording Started",
      description: "Speak clearly for best results",
    });

    // Simulated transcript update
    setTimeout(() => {
      setTranscript("Today we'll discuss the fundamentals of quantum mechanics...");
      setNotes("• Quantum mechanics fundamentals\n• Wave-particle duality concept\n• Key principles and applications");
      setSummary("Introduction to quantum mechanics covering wave-particle duality and fundamental principles.");
    }, 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
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
          <Card className={`w-full max-w-md shadow-lg ${isRecording ? "border-accent animate-pulse-glow" : ""}`}>
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
                    <div className="w-full h-full rounded-full bg-gradient-primary flex items-center justify-center">
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
                  className="w-full"
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

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Live Transcript */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 bg-accent rounded-full animate-pulse" />
                Live Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] p-4 bg-muted/50 rounded-lg">
                {transcript ? (
                  <p className="text-sm leading-relaxed">{transcript}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Transcript will appear here as you speak...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Generated Notes */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Generated Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                {notes ? (
                  <div className="text-sm leading-relaxed whitespace-pre-line">{notes}</div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    AI will generate organized notes here...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary and Subject Detection */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Auto-Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
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

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Subject Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Detected Subject:</p>
                  <Badge className="bg-accent text-accent-foreground text-base px-4 py-1">
                    {detectedSubject}
                  </Badge>
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
          <div className="flex justify-center">
            <Button size="lg" variant="hero" onClick={saveNotes} className="min-w-[200px]">
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
