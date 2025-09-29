import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

import { useAuth } from "@/context/AuthContext";
import { getStudent, saveStudent } from "@/lib/store";

const ROLES: Array<{ value: "student" | "teacher" | "parent" | "admin"; label: string }> = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "parent", label: "Parent" },
  { value: "admin", label: "Admin" },
];

const Settings = () => {
  const navigate = useNavigate();
  const { user, signIn, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"student" | "teacher" | "parent" | "admin">("student");

  // Load current user details
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setName(user.name || "");
    setEmail(user.email || "");
    setRole(user.role);
  }, [user, navigate]);

  const isDirty = useMemo(() => {
    if (!user) return false;
    return user.name !== name || user.role !== role;
  }, [user, name, role]);

  const handleSave = () => {
    if (!user) return;

    // Update AuthContext (also writes to localStorage)
    signIn({ email: user.email, name, role });

    // Update associated student record's name/role, if it exists
    const rec = getStudent(user.email);
    if (rec) {
      saveStudent({ ...rec, name, role });
    }

    toast.success("Settings saved");
  };

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user ? { name: user.name, role: user.role, notifications: 0 } : undefined} />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* Profile */}
        <Card className="card-elevated border-0">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} readOnly disabled />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="btn-gradient" disabled={!isDirty} onClick={handleSave}>
                Save changes
              </Button>
              <Button variant="outline" disabled={!isDirty} onClick={() => {
                if (!user) return; setName(user.name); setRole(user.role);
              }}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="card-elevated border-0">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-w-xs">
              <Label>Theme</Label>
              <Select value={theme as string} onValueChange={(v) => setTheme(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle>Danger zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="text-sm text-muted-foreground">Sign out of this device.</p>
              <Button variant="destructive" onClick={handleSignOut}>Sign out</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
