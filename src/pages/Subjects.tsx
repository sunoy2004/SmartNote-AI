import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubjects } from "@/hooks/useSubjects";
import { useNotes } from "@/hooks/useNotes";
import { slugify } from "@/lib/utils";

const Subjects = () => {
  const { toast } = useToast();
  const [newSubject, setNewSubject] = useState("");
  const { subjects, addSubject, removeSubject, loading } = useSubjects();
  const { notes } = useNotes();

  const noteCountBySubject = useMemo(() => {
    return notes.reduce<Record<string, number>>((acc, note) => {
      const key = note.subject || "General";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [notes]);

  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;
    const id = await addSubject(newSubject);
    if (id) {
      toast({
        title: "Subject added",
        description: `${newSubject.trim()} has been added to your subjects.`,
      });
      setNewSubject("");
    }
  };

  const handleRemoveSubject = async (subjectId: string, name: string) => {
    const removed = await removeSubject(subjectId);
    if (removed) {
      toast({
        title: "Subject removed",
        description: `${name} has been removed.`,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Subjects</h1>
          <p className="text-muted-foreground">
            Manage your subjects and view all related notes
          </p>
        </div>

        {/* Add Subject */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Add New Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter subject name (e.g., Chemistry)"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
                className="flex-1"
              />
              <Button onClick={handleAddSubject}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Loading your subjects...
            </div>
          ) : subjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Subjects Yet</h3>
              <p className="text-muted-foreground">
                Add your first subject to start organizing your notes
              </p>
            </div>
          ) : (
            subjects.map((subject) => (
              <Card
                key={subject.id}
                className="shadow-md hover:shadow-lg transition-smooth group relative"
              >
                <button
                  onClick={() => handleRemoveSubject(subject.id, subject.name)}
                  className="absolute top-4 right-4 p-1 hover:bg-destructive/10 rounded-full transition-smooth opacity-0 group-hover:opacity-100"
                >
                  <X className="h-4 w-4 text-destructive" />
                </button>

                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 ${subject.color ?? "bg-primary"} rounded-xl flex items-center justify-center text-primary-foreground`}>
                      <BookOpen className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{subject.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        {noteCountBySubject[subject.name] || 0} notes
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Link to={`/subjects/${slugify(subject.name)}`}>
                    <Button variant="outline" className="w-full">
                      View Notes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subjects;
