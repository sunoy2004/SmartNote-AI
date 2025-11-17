import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, BookOpen, Calendar, TrendingUp, Plus, FileText, Clock } from "lucide-react";

// Mock data
const recentNotes = [
  {
    id: 1,
    title: "Quantum Mechanics Fundamentals",
    subject: "Physics",
    date: "2024-01-15",
    summary: "Discussed wave-particle duality, Schrödinger equation, and quantum states...",
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

const stats = [
  { label: "Total Notes", value: "24", icon: FileText, change: "+12%" },
  { label: "Study Hours", value: "18", icon: Clock, change: "+5%" },
  { label: "Subjects", value: "5", icon: BookOpen, change: "+1" },
];

const Dashboard = () => {
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
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last week
                </p>
              </CardContent>
            </Card>
          );
        })}
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
                {subjects.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${subject.color}`}></div>
                      <span className="font-medium">{subject.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {subject.noteCount} notes
                    </Badge>
                  </div>
                ))}
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
                  Add New Subject
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
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <Link key={note.id} to={`/notes/${note.id}`} className="block">
                    <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">{note.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {note.subject}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{note.summary}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(note.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;