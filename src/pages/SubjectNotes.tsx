import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, BookOpen } from "lucide-react";
import { useNotes, toDate } from "@/hooks/useNotes";
import { slugify, deslugify } from "@/lib/utils";

const SubjectNotes = () => {
  const navigate = useNavigate();
  const { subjectSlug = "" } = useParams();
  const readableSubject = deslugify(subjectSlug);
  const { notes, loading } = useNotes();

  const subjectNotes = useMemo(() => {
    return notes.filter(
      (note) => slugify(note.subject) === subjectSlug.toLowerCase()
    );
  }, [notes, subjectSlug]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-primary" />
              {readableSubject || "Subject"}
            </h1>
            <p className="text-muted-foreground">
              Review all notes recorded for this subject.
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading notes...</p>
            ) : subjectNotes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You haven&apos;t saved any notes for this subject yet.
              </p>
            ) : (
              <div className="space-y-4">
                {subjectNotes.map((note) => (
                  <Link key={note.id} to={`/notes/${note.id}`} className="block">
                    <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {note.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {note.subject}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {note.summary || "No summary yet"}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {note.createdAt
                              ? (toDate(note.createdAt)?.toLocaleDateString() || "Just now")
                              : "Just now"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SubjectNotes;


