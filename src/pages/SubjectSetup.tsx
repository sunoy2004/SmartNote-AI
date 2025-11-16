import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SubjectSetup = () => {
  const [subjects, setSubjects] = useState<string[]>([
    "Mathematics",
    "Physics",
    "Computer Science",
  ]);
  const [newSubject, setNewSubject] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter((s) => s !== subject));
  };

  const handleContinue = () => {
    if (subjects.length === 0) {
      toast({
        title: "Add at least one subject",
        description: "You need to add subjects to organize your notes",
        variant: "destructive",
      });
      return;
    }

    // TODO: Save subjects to Firebase
    toast({
      title: "Subjects saved!",
      description: "Your learning journey begins now",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-up">
        <div className="text-center mb-8">
          <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Set Up Your Subjects</h1>
          <p className="text-muted-foreground">
            Add the subjects you're studying. AI will use these to organize your notes automatically.
          </p>
        </div>

        <Card className="shadow-lg border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader>
            <CardTitle>Your Subjects</CardTitle>
            <CardDescription>
              Add all the subjects you're taking this semester
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="Enter subject name (e.g., Biology)"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSubject()}
                className="flex-1"
              />
              <Button onClick={addSubject} variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-muted/50 rounded-lg">
              {subjects.length === 0 ? (
                <p className="text-muted-foreground text-sm w-full text-center">
                  No subjects added yet. Add your first subject above.
                </p>
              ) : (
                subjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant="secondary"
                    className="px-4 py-2 text-sm flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 transition-smooth"
                  >
                    {subject}
                    <button
                      onClick={() => removeSubject(subject)}
                      className="hover:text-destructive transition-smooth"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <p className="text-sm text-accent-foreground">
                💡 <strong>Tip:</strong> AI will automatically detect which subject your notes belong to 
                based on the content you're recording!
              </p>
            </div>

            <Button 
              onClick={handleContinue} 
              className="w-full" 
              variant="hero"
              size="lg"
            >
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubjectSetup;
