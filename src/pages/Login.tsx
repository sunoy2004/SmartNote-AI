import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loginWithEmail, hasUserCompletedOnboarding } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if Firebase is properly configured
      const { auth } = await import("@/firebase/config");
      if (!auth) {
        throw new Error("Firebase is not properly configured. Please check your environment variables.");
      }

      const credential = await loginWithEmail(email, password);
      const loggedInUser = credential.user;

      toast({
        title: "Login successful",
        description: `Welcome back, ${loggedInUser.displayName || "there"}!`,
      });

      const hasSubjects = await hasUserCompletedOnboarding(loggedInUser.uid);
      navigate(hasSubjects ? "/dashboard" : "/subject-setup", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      const error = err as Error;
      
      // Provide more helpful error messages
      let errorMessage = error.message || "Please check your credentials and try again.";
      
      // Check for Firebase config errors
      if (errorMessage.includes("api-key-not-valid") || errorMessage.includes("mock")) {
        errorMessage = "Firebase configuration error. Please contact support.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Brain className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              SmartNote AI
            </span>
          </Link>
        </div>

        <Card className="shadow-lg border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-smooth"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-smooth"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                variant="hero"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">New to SmartNote AI? </span>
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
