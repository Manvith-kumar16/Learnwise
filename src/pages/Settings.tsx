import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun, Bell, Shield, Globe, User, Mail } from "lucide-react";

import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const profileSectionRef = useRef<HTMLDivElement>(null);

  // Preference states (these would normally be stored in localStorage or backend)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedEmail, setEditedEmail] = useState(user?.email || "");

  // Load current user details
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Initialize form values with user data
    setEditedName(user.name || "");
    setEditedEmail(user.email || "");
    
    // Auto-scroll to profile section if coming from profile page
    if (location.state?.fromProfile) {
      setTimeout(() => {
        profileSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [user, navigate, location]);

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  const savePreferences = () => {
    // Save preferences to localStorage or backend
    localStorage.setItem('emailNotifications', String(emailNotifications));
    localStorage.setItem('pushNotifications', String(pushNotifications));
    localStorage.setItem('weeklyReports', String(weeklyReports));
    localStorage.setItem('publicProfile', String(publicProfile));
    toast.success("Preferences saved");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user ? { name: user.name, role: user.role, notifications: 0 } : undefined} />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>

        {/* Profile Information */}
        <Card className="card-elevated border-0" ref={profileSectionRef}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter your name"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                placeholder="Enter your email"
                className="rounded-lg"
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => {
                  // Save profile changes
                  toast.success("Profile updated successfully");
                }}
                className="btn-gradient"
              >
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="card-elevated border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how LearnWise looks on your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="theme">Theme</Label>
                <p className="text-sm text-muted-foreground">Select your preferred theme</p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="card-elevated border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Choose what updates you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-notifications">Email notifications</Label>
                <p className="text-sm text-muted-foreground">Receive study reminders and progress updates via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="push-notifications">Push notifications</Label>
                <p className="text-sm text-muted-foreground">Get instant alerts on this device</p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="weekly-reports">Weekly progress reports</Label>
                <p className="text-sm text-muted-foreground">Receive weekly summaries of your learning progress</p>
              </div>
              <Switch
                id="weekly-reports"
                checked={weeklyReports}
                onCheckedChange={setWeeklyReports}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="card-elevated border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy
            </CardTitle>
            <CardDescription>Control your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="public-profile">Public profile</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your learning achievements</p>
              </div>
              <Switch
                id="public-profile"
                checked={publicProfile}
                onCheckedChange={setPublicProfile}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card className="card-elevated border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language & Region
            </CardTitle>
            <CardDescription>Set your language and regional preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="language">Language</Label>
                <p className="text-sm text-muted-foreground">Select your preferred language</p>
              </div>
              <Select defaultValue="english">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="btn-gradient" onClick={savePreferences}>
            Save preferences
          </Button>
        </div>

        {/* Account Management */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
            <CardDescription>Manage your account and session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between pb-4">
              <div>
                <p className="font-medium">View Profile</p>
                <p className="text-sm text-muted-foreground">View your public profile and achievements</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/profile')}>View Profile</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="font-medium text-destructive">Sign Out</p>
                <p className="text-sm text-muted-foreground">Sign out of this device</p>
              </div>
              <Button variant="destructive" onClick={handleSignOut}>Sign out</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
