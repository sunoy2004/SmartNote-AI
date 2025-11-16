import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, Brain, Sparkles, BookOpen, Zap } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              SmartNote AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="hero">Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary font-medium">
              <Sparkles className="h-4 w-4" />
              AI-Powered Note Taking
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Record Less.
              <br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Understand More.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Transform your lectures into organized, categorized notes automatically. 
              Focus on learning while AI handles the note-taking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Login
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl rounded-full"></div>
            <img 
              src={heroImage} 
              alt="SmartNote AI Interface" 
              className="relative rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Students Love SmartNote AI</h2>
          <p className="text-xl text-muted-foreground">Everything you need to ace your studies</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-smooth border border-border">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-Time Recording</h3>
            <p className="text-muted-foreground">
              Record lectures and see live transcriptions with instant AI-generated notes.
            </p>
          </div>
          <div className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-smooth border border-border">
            <div className="h-12 w-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Categorization</h3>
            <p className="text-muted-foreground">
              AI automatically detects and organizes notes by subject for easy access.
            </p>
          </div>
          <div className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-smooth border border-border">
            <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Auto-Summary</h3>
            <p className="text-muted-foreground">
              Get concise summaries of your notes instantly, perfect for quick revision.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-hero rounded-3xl p-12 text-center text-primary-foreground shadow-lg">
          <Zap className="h-16 w-16 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Note-Taking?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already using SmartNote AI
          </p>
          <Link to="/signup">
            <Button 
              size="lg" 
              className="bg-background text-primary hover:bg-background/90 shadow-lg"
            >
              Start Free Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2024 SmartNote AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-smooth">Privacy</a>
            <a href="#" className="hover:text-primary transition-smooth">Terms</a>
            <a href="#" className="hover:text-primary transition-smooth">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
