import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, BookOpen, Calendar, Plus, FileText, Clock } from "lucide-react";
import { useNotes, toDate } from "@/hooks/useNotes";
import { useSubjects } from "@/hooks/useSubjects";
import { slugify } from "@/lib/utils";

const Dashboard = () => {
  const { notes, loading: notesLoading } = useNotes();
  const { subjects, loading: subjectsLoading } = useSubjects();

  const totalDuration = notes.reduce((total, note) => total + (note.durationMs || 0), 0);
  const totalHours = (totalDuration / (1000 * 60 * 60)).toFixed(1);
  const noteCountBySubject = subjects.map((subject) => ({
    ...subject,
    count: notes.filter((note) => note.subject === subject.name).length,
  }));
  const recentNotes = notes.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
          <p className="text-muted-foreground">
            Ready to capture your next brilliant idea?
          </p>
        </div>
        <Link to="/record">
          <Button variant="hero" size="lg" className="w-full md:w-auto transition-transform hover:scale-105 active:scale-95">
            <Mic className="h-5 w-5 mr-2" />
            Start Recording
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Notes</p>
                <p className="text-2xl font-bold">{notes.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last update: {recentNotes[0]?.createdAt ? (toDate(recentNotes[0].createdAt)?.toLocaleDateString() || "—") : "—"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                <p className="text-2xl font-bold">
                  {Number.isNaN(Number(totalHours)) ? "0.0" : totalHours}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on recorded note duration
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subjects</p>
                <p className="text-2xl font-bold">{subjects.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Add more subjects from the Subjects page
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects and Recent Notes */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subjects */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Your Subjects</CardTitle>
              <Link to="/subjects">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading subjects...</p>
                ) : subjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No subjects yet. Add your first subject to get started.
                  </p>
                ) : (
                  noteCountBySubject.map((subject) => (
                    <Link
                      key={subject.id}
                      to={`/subjects/${slugify(subject.name)}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${subject.color ?? "bg-primary"}`}></div>
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {subject.count ?? 0} notes
                      </Badge>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/record">
                <Button variant="outline" className="w-full justify-start transition-colors">
                  <Mic className="h-4 w-4 mr-2" />
                  Record New Note
                </Button>
              </Link>
              <Link to="/subjects">
                <Button variant="outline" className="w-full justify-start transition-colors">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Manage Subjects
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline" className="w-full justify-start transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notes */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Recent Notes</CardTitle>
              <Link to="/record">
                <Button variant="ghost" size="sm">
                  New Recording
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notesLoading ? (
                  <p className="text-sm text-muted-foreground">Loading your notes...</p>
                ) : recentNotes.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    You haven&apos;t recorded any notes yet.
                  </div>
                ) : (
                  recentNotes.map((note) => (
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;