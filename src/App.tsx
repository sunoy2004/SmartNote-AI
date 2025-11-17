import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

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
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/record" element={<Record />} />
              <Route path="/notes/:id" element={<NoteDetail />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/subject-setup" element={<SubjectSetup />} />
              
              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;