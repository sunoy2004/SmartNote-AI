import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, Copy, Calendar, Tag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotes, Note } from "@/hooks/useNotes";
import { downloadNoteAsPdf, copyToClipboard, shareNote } from "@/lib/exportUtils";

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getNote } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getNote(id);
      setNote(data);
      setLoading(false);
    };

    fetchNote();
  }, [id, getNote]);

  const handleCopy = () => {
    if (!note) return;
    const payload = `${note.title}\n\nSummary:\n${note.summary}\n\nNotes:\n${note.notes}\n\nTranscript:\n${note.transcript}`;
    copyToClipboard(payload);
    toast({
      title: "Copied to clipboard",
      description: "Note content has been copied",
    });
  };

  const handleExport = async () => {
    if (!note) return;
    await downloadNoteAsPdf({
      title: note.title,
      summary: note.summary,
      content: note.notes,
      transcript: note.transcript,
      subject: note.subject,
      date: note.createdAt?.toISOString() ?? new Date().toISOString(),
    });
    toast({
      title: "Exported to PDF",
      description: "Your note has been downloaded",
    });
  };

  const handleShare = async () => {
    if (!note) return;
    await shareNote({
      title: note.title,
      summary: note.summary,
      content: note.notes,
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!note) {
    return (
      <DashboardLayout>
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Note not found.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {note.createdAt ? note.createdAt.toLocaleString() : "Just now"}
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <Badge variant="secondary">{note.subject}</Badge>
                </div>
              </div>
            </div>
          </div>

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
            <p className="text-sm leading-relaxed">
              {note.summary || "No summary available."}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
              {note.notes || "No structured notes yet."}
            </pre>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Full Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm leading-relaxed">
                {note.transcript || "Transcript not available."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NoteDetail;
