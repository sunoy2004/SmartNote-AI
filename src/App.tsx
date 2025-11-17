import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/hooks/useAuth";

// Public routes (no authentication required)
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Protected routes (authentication required)
import Dashboard from "./pages/Dashboard";
import Record from "./pages/Record";
import NoteDetail from "./pages/NoteDetail";
import Subjects from "./pages/Subjects";
import Settings from "./pages/Settings";
import SubjectSetup from "./pages/SubjectSetup";
import SubjectNotes from "./pages/SubjectNotes";

// Initialize query client
const queryClient = new QueryClient();

// Main application component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        defaultTheme="system" 
        storageKey="ui-theme"
        attribute="class"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/record"
                  element={
                    <ProtectedRoute>
                      <Record />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notes/:id"
                  element={
                    <ProtectedRoute>
                      <NoteDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subjects"
                  element={
                    <ProtectedRoute>
                      <Subjects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subjects/:subjectSlug"
                  element={
                    <ProtectedRoute>
                      <SubjectNotes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subject-setup"
                  element={
                    <ProtectedRoute>
                      <SubjectSetup />
                    </ProtectedRoute>
                  }
                />
                
                {/* Catch-all Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;