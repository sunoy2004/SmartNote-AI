import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, Copy, Calendar, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data - TODO: Replace with Firebase data
  const note = {
    id: 1,
    title: "Introduction to Quantum Mechanics",
    subject: "Physics",
    date: "2024-01-15T10:30:00",
    content: `• Quantum mechanics fundamentals
• Wave-particle duality
  - Light exhibits both wave and particle properties
  - Demonstrated by double-slit experiment
• Heisenberg Uncertainty Principle
  - Cannot simultaneously know position and momentum with perfect accuracy
  - Δx × Δp ≥ ℏ/2
• Key Applications
  - Semiconductor physics
  - Laser technology
  - Quantum computing`,
    summary: "Introduction to quantum mechanics covering wave-particle duality, the Heisenberg uncertainty principle, and key applications in modern technology.",
    transcript: "Today we'll discuss the fundamentals of quantum mechanics. One of the most fascinating aspects is wave-particle duality, where light and matter exhibit properties of both waves and particles...",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content);
    toast({
      title: "Copied to clipboard",
      description: "Note content has been copied",
    });
  };

  const handleExport = () => {
    // TODO: Implement PDF export
    toast({
      title: "Exporting to PDF",
      description: "Your note will be downloaded shortly",
    });
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    toast({
      title: "Share link copied",
      description: "Share this note with your study group",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(note.date).toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <Badge variant="secondary">{note.subject}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="shadow-md border-secondary/20 bg-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="h-8 w-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                ✨
              </div>
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{note.summary}</p>
          </CardContent>
        </Card>

        {/* Note Content */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {note.content}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Transcript */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Full Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm leading-relaxed">{note.transcript}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NoteDetail;
