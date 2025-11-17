import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Mic, BookOpen, Zap, Sparkles, User, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import heroImage from "@/assets/hero-image.jpg";
import { useEffect, useState } from "react";

// Feature data
const features = [
  {
    icon: Mic,
    title: "Real-Time Recording",
    description: "Record lectures and see live transcriptions with instant AI-generated notes.",
    color: "primary"
  },
  {
    icon: Brain,
    title: "Smart Categorization",
    description: "AI automatically detects and organizes notes by subject for easy access.",
    color: "secondary"
  },
  {
    icon: BookOpen,
    title: "Auto-Summary",
    description: "Get concise summaries of your notes instantly, perfect for quick revision.",
    color: "accent"
  }
];

// How it works steps
const steps = [
  {
    number: "1",
    title: "Start Recording",
    description: "Click record and start speaking. Our AI listens to every word."
  },
  {
    number: "2",
    title: "AI Processing",
    description: "Real-time transcription and intelligent note generation."
  },
  {
    number: "3",
    title: "Review & Save",
    description: "Access your organized notes anytime, anywhere."
  }
];

const Landing = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary animate-pulse" />
              <span className="text-xl font-bold">SmartNote AI</span>
            </div>
            <div className="h-10 w-24 bg-muted rounded-full animate-pulse"></div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-20">
          <div className="h-96 bg-muted rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              SmartNote AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10 rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="default">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 container-padding section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary font-medium">
              <Sparkles className="h-4 w-4" />
              AI-Powered Note Taking
            </div>
            <h1 className="heading-1">
              Record Less.
              <br />
              <span className="text-gradient">
                Understand More.
              </span>
            </h1>
            <p className="body-text max-w-lg">
              Transform your lectures into organized, categorized notes automatically. 
              Focus on learning while AI handles the note-taking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button variant="hero" size="lg" className="w-full sm:w-auto transition-transform hover:scale-105 active:scale-95">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto transition-transform hover:scale-105 active:scale-95">
                  Login
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl rounded-full"></div>
            <div className="relative rounded-2xl shadow-xl overflow-hidden border border-border">
              <img 
                src={heroImage} 
                alt="SmartNote AI Interface" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Why Students Love SmartNote AI</h2>
            <p className="body-text max-w-2xl mx-auto">Everything you need to ace your studies</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-border hover:border-primary/30 card-hover"
                >
                  <div className={`h-12 w-12 bg-${feature.color}/10 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 text-${feature.color}`} />
                  </div>
                  <h3 className="heading-3 mb-3">{feature.title}</h3>
                  <p className="body-text">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container-padding section-padding">
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4">How It Works</h2>
          <p className="body-text max-w-2xl mx-auto">Simple steps to transform your learning experience</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-primary">{step.number}</span>
              </div>
              <h3 className="heading-3 mb-3">{step.title}</h3>
              <p className="body-text">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-padding section-padding">
        <div className="bg-gradient-hero rounded-3xl p-8 md:p-12 text-center text-primary-foreground shadow-lg">
          <Zap className="h-16 w-16 mx-auto mb-6 animate-pulse" />
          <h2 className="heading-2 mb-4">Ready to Transform Your Note-Taking?</h2>
          <p className="body-text mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students already using SmartNote AI
          </p>
          <Link to="/signup">
            <Button 
              size="lg" 
              className="bg-background text-primary hover:bg-background/90 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Start Free Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-medium">SmartNote AI</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            © 2024 SmartNote AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;