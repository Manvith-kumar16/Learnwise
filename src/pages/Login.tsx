import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, GraduationCap } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as "student" | "teacher",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (form.role === "teacher" && !form.password.trim()) {
      newErrors.password = "Teacher access code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) {
      toast.error("Please correct the highlighted errors");
      return;
    }

    try {
      await signIn({
        email: form.email.trim(),
        name: form.name.trim(),
        role: form.role,
      });

      navigate(form.role === "teacher" ? "/class-dashboard" : "/dashboard");
    } catch (error) {
      toast.error("Sign in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <Card className="w-full max-w-lg topic-card">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
            <img src="/logobg.png" alt="LearnWise Logo" className="w-16 h-16" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to LearnWise</CardTitle>
          <CardDescription className="text-base mt-2">
            Sign in to continue your learning journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label>I am a...</Label>
            <RadioGroup
              value={form.role}
              onValueChange={(value) => handleChange("role", value as typeof form.role)}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <RadioGroupItem value="student" id="student" className="peer sr-only" />
                  <Label
                    htmlFor="student"
                    className="flex flex-col items-center justify-center p-6 rounded-xl border-2 cursor-pointer transition-all hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                  >
                    <User className="w-8 h-8 mb-2" />
                    <span className="font-semibold text-lg">Student</span>
                    <span className="text-xs text-muted-foreground mt-1">Learn & Practice</span>
                  </Label>
                </div>

                <div className="relative">
                  <RadioGroupItem value="teacher" id="teacher" className="peer sr-only" />
                  <Label
                    htmlFor="teacher"
                    className="flex flex-col items-center justify-center p-6 rounded-xl border-2 cursor-pointer transition-all hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                  >
                    <GraduationCap className="w-8 h-8 mb-2" />
                    <span className="font-semibold text-lg">Teacher</span>
                    <span className="text-xs text-muted-foreground mt-1">Manage Classes</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              autoComplete="name"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              autoComplete="email"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Teacher Access Code */}
          {form.role === "teacher" && (
            <div className="space-y-2">
              <Label htmlFor="password">Teacher Access Code *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your teacher access code"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                autoComplete="current-password"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              <p className="text-xs text-muted-foreground">
                Contact your institution admin if you don&apos;t have an access code
              </p>
            </div>
          )}

          {/* Role-specific message */}
          <div className="p-3 rounded-lg bg-muted/50 border">
            <p className="text-sm text-muted-foreground">
              {form.role === "student" &&
                "Access personalized learning paths and track your progress"}
              {form.role === "teacher" &&
                "Manage classes, track student progress, and create assignments"}
            </p>
          </div>

          {/* Submit */}
          <Button className="w-full btn-gradient" onClick={handleContinue} size="lg">
            Sign In as {form.role.charAt(0).toUpperCase() + form.role.slice(1)}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?
              <Button
                variant="link"
                className="text-primary p-0 ml-1"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
