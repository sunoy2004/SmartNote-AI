import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, BookOpen, Clock, Plus, FileText } from "lucide-react";

const Dashboard = () => {
  // Mock data - TODO: Replace with Firebase data
  const recentNotes = [
    {
      id: 1,
      title: "Introduction to Quantum Mechanics",
      subject: "Physics",
      date: "2024-01-15",
      summary: "Covered wave-particle duality, Heisenberg uncertainty principle...",
    },
    {
      id: 2,
      title: "Data Structures: Binary Trees",
      subject: "Computer Science",
      date: "2024-01-14",
      summary: "Discussed tree traversal algorithms, BST operations...",
    },
    {
      id: 3,
      title: "Calculus: Integration Techniques",
      subject: "Mathematics",
      date: "2024-01-13",
      summary: "Learned substitution method, integration by parts...",
    },
  ];

  const subjects = [
    { name: "Mathematics", noteCount: 12, color: "bg-primary" },
    { name: "Physics", noteCount: 8, color: "bg-secondary" },
    { name: "Computer Science", noteCount: 15, color: "bg-accent" },
  ];

  return (
    <DashboardLayout>
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
            <Button variant="hero" size="lg" className="w-full md:w-auto">
              <Mic className="h-5 w-5 mr-2" />
              Start Recording
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-sm hover:shadow-md transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">35</div>
              <p className="text-xs text-muted-foreground">+4 this week</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.length}</div>
              <p className="text-xs text-muted-foreground">Active subjects</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Your Subjects</h2>
            <Link to="/subjects">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Link key={subject.name} to={`/subjects/${subject.name.toLowerCase().replace(" ", "-")}`}>
                <Card className="hover:shadow-md transition-smooth cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 ${subject.color} rounded-xl flex items-center justify-center text-primary-foreground opacity-80 group-hover:opacity-100 transition-smooth`}>
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {subject.noteCount} notes
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Notes Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Notes</h2>
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <Link key={note.id} to={`/notes/${note.id}`}>
                <Card className="hover:shadow-md transition-smooth cursor-pointer">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{note.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" />
                          {new Date(note.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {note.subject}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {note.summary}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
