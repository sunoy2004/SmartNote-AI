import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Subjects = () => {
  const { toast } = useToast();
  const [newSubject, setNewSubject] = useState("");

  // Mock data - TODO: Replace with Firebase data
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Mathematics", noteCount: 12, color: "bg-primary" },
    { id: 2, name: "Physics", noteCount: 8, color: "bg-secondary" },
    { id: 3, name: "Computer Science", noteCount: 15, color: "bg-accent" },
    { id: 4, name: "Biology", noteCount: 6, color: "bg-destructive" },
  ]);

  const addSubject = () => {
    if (newSubject.trim() && !subjects.find(s => s.name === newSubject.trim())) {
      const newSubjectObj = {
        id: subjects.length + 1,
        name: newSubject.trim(),
        noteCount: 0,
        color: "bg-primary",
      };
      setSubjects([...subjects, newSubjectObj]);
      setNewSubject("");
      toast({
        title: "Subject Added",
        description: `${newSubjectObj.name} has been added to your subjects`,
      });
    }
  };

  const removeSubject = (id: number, name: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    toast({
      title: "Subject Removed",
      description: `${name} has been removed`,
    });
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
                onKeyPress={(e) => e.key === "Enter" && addSubject()}
                className="flex-1"
              />
              <Button onClick={addSubject}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="shadow-md hover:shadow-lg transition-smooth group relative"
            >
              <button
                onClick={() => removeSubject(subject.id, subject.name)}
                className="absolute top-4 right-4 p-1 hover:bg-destructive/10 rounded-full transition-smooth opacity-0 group-hover:opacity-100"
              >
                <X className="h-4 w-4 text-destructive" />
              </button>

              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 ${subject.color} rounded-xl flex items-center justify-center text-primary-foreground`}>
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{subject.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      {subject.noteCount} notes
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Link to={`/subjects/${subject.name.toLowerCase().replace(" ", "-")}`}>
                  <Button variant="outline" className="w-full">
                    View Notes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Subjects Yet</h3>
            <p className="text-muted-foreground">
              Add your first subject to start organizing your notes
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Subjects;
