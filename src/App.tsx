import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import PracticeParts from "./pages/PracticeParts";
import Goals from "./pages/Goals";
import Teacher from "./pages/Teacher";
import NotFound from "./pages/NotFound";
import WorkingLogin from '@/pages/WorkingLogin';
import Login from '@/pages/Login';
import LoginTest from '@/pages/LoginTest';
import SimpleTest from '@/pages/SimpleTest';
import InputDiagnostics from '@/pages/InputDiagnostics';
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ClassDashboard from "./pages/ClassDashboard";
import { AuthProvider } from "@/context/AuthContext";
import { ProgressProvider } from "@/context/ProgressContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <ProgressProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/practice/parts" element={<PracticeParts />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/teacher" element={<Teacher />} />
                <Route path="/login" element={<WorkingLogin />} />
                <Route path="/login-old" element={<Login />} />
                <Route path="/login-test" element={<LoginTest />} />
                <Route path="/simple-test" element={<SimpleTest />} />
                <Route path="/diagnostics" element={<InputDiagnostics />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/class-dashboard" element={<ClassDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ProgressProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
