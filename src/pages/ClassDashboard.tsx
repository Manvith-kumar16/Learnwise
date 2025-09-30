import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Calendar, 
  Award, 
  TrendingUp, 
  Clock, 
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  GraduationCap,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { 
  FadeIn, 
  ScrollReveal, 
  AnimatedCard,
  StaggerContainer,
  StaggerItem
} from "@/components/ui/animated";

// Sample data for classes and students
const mockClasses = [
  {
    id: "1",
    name: "Mathematics - Grade 10A",
    subject: "Mathematics",
    students: 28,
    avgProgress: 72,
    nextClass: "Today, 2:00 PM",
    status: "active"
  },
  {
    id: "2",
    name: "Mathematics - Grade 10B",
    subject: "Mathematics",
    students: 25,
    avgProgress: 68,
    nextClass: "Tomorrow, 10:00 AM",
    status: "active"
  },
  {
    id: "3",
    name: "Advanced Math - Grade 11",
    subject: "Mathematics",
    students: 20,
    avgProgress: 85,
    nextClass: "Today, 4:00 PM",
    status: "active"
  }
];

const mockStudents = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@student.com",
    class: "Grade 10A",
    progress: 85,
    lastActive: "2 hours ago",
    questionsCompleted: 145,
    streak: 7,
    status: "active"
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@student.com",
    class: "Grade 10A",
    progress: 72,
    lastActive: "1 day ago",
    questionsCompleted: 98,
    streak: 3,
    status: "active"
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@student.com",
    class: "Grade 10B",
    progress: 91,
    lastActive: "5 minutes ago",
    questionsCompleted: 210,
    streak: 15,
    status: "active"
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@student.com",
    class: "Grade 11",
    progress: 45,
    lastActive: "3 days ago",
    questionsCompleted: 52,
    streak: 0,
    status: "inactive"
  }
];

const ClassDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [showCreateClassDialog, setShowCreateClassDialog] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [newClassSubject, setNewClassSubject] = useState("");

  // Check if user is a teacher
  useEffect(() => {
    if (!user || user.role !== "teacher") {
      toast.error("Access denied. This page is only for teachers.");
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  if (!user || user.role !== "teacher") {
    return null;
  }

  // Filter students based on search and class selection
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Calculate statistics
  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter(s => s.status === "active").length;
  const avgClassProgress = Math.round(mockStudents.reduce((acc, s) => acc + s.progress, 0) / totalStudents);
  const totalQuestions = mockStudents.reduce((acc, s) => acc + s.questionsCompleted, 0);

  const handleAddStudent = () => {
    if (newStudentEmail.trim()) {
      toast.success(`Invitation sent to ${newStudentEmail}`);
      setNewStudentEmail("");
      setShowAddStudentDialog(false);
    }
  };

  const handleCreateClass = () => {
    if (newClassName.trim() && newClassSubject.trim()) {
      toast.success(`Class "${newClassName}" created successfully`);
      setNewClassName("");
      setNewClassSubject("");
      setShowCreateClassDialog(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-success";
    if (progress >= 60) return "text-warning";
    return "text-error";
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-success/20 text-success border-success/50">Active</Badge>;
    }
    return <Badge className="bg-muted text-muted-foreground">Inactive</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation user={{ name: user.name, role: user.role, notifications: 0 }} />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <GraduationCap className="w-8 h-8" />
                Class Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Manage your classes and track student progress</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={showCreateClassDialog} onOpenChange={setShowCreateClassDialog}>
                <DialogTrigger asChild>
                  <Button className="btn-gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Class
                  </Button>
                </DialogTrigger>
                <DialogContent className="dialog-content border-white-strong">
                  <DialogHeader>
                    <DialogTitle>Create New Class</DialogTitle>
                    <DialogDescription>
                      Set up a new class for your students
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="className">Class Name</Label>
                      <Input
                        id="className"
                        placeholder="e.g., Mathematics - Grade 10A"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select value={newClassSubject} onValueChange={setNewClassSubject}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateClassDialog(false)}>
                      Cancel
                    </Button>
                    <Button className="btn-gradient" onClick={handleCreateClass}>
                      Create Class
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showAddStudentDialog} onOpenChange={setShowAddStudentDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="dialog-content border-white-strong">
                  <DialogHeader>
                    <DialogTitle>Add Student to Class</DialogTitle>
                    <DialogDescription>
                      Invite a student to join your class
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Student Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@example.com"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Assign to Class</Label>
                      <Select>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClasses.map(cls => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddStudentDialog(false)}>
                      Cancel
                    </Button>
                    <Button className="btn-gradient" onClick={handleAddStudent}>
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </FadeIn>

        {/* Statistics Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StaggerItem>
            <AnimatedCard className="card-glass h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold">{totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </AnimatedCard>
          </StaggerItem>

          <StaggerItem>
            <AnimatedCard className="card-glass h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Today</p>
                    <p className="text-2xl font-bold">{activeStudents}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </AnimatedCard>
          </StaggerItem>

          <StaggerItem>
            <AnimatedCard className="card-glass h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Progress</p>
                    <p className="text-2xl font-bold">{avgClassProgress}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-warning" />
                </div>
              </CardContent>
            </AnimatedCard>
          </StaggerItem>

          <StaggerItem>
            <AnimatedCard className="card-glass h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Questions</p>
                    <p className="text-2xl font-bold">{totalQuestions}</p>
                  </div>
                  <FileText className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </AnimatedCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Classes Overview */}
        <ScrollReveal>
          <Card className="topic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                My Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockClasses.map((cls) => (
                  <Card key={cls.id} className="card-glass cursor-pointer hover:scale-[1.02] transition-transform">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{cls.name}</h3>
                          <p className="text-sm text-muted-foreground">{cls.students} students</p>
                        </div>
                        <Badge variant="outline">{cls.subject}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Class Progress</span>
                          <span className="font-semibold">{cls.avgProgress}%</span>
                        </div>
                        <Progress value={cls.avgProgress} className="h-2" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Next: {cls.nextClass}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Students Table */}
        <ScrollReveal>
          <Card className="topic-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Students
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 h-9 rounded-lg"
                    />
                  </div>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-40 h-9 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="Grade 10A">Grade 10A</SelectItem>
                      <SelectItem value="Grade 10B">Grade 10B</SelectItem>
                      <SelectItem value="Grade 11">Grade 11</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Streak</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={student.progress} className="w-16 h-2" />
                          <span className={`font-semibold ${getProgressColor(student.progress)}`}>
                            {student.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{student.questionsCompleted}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {student.streak > 0 && <span>🔥</span>}
                          <span>{student.streak} days</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.lastActive}</TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Performance Analytics */}
        <ScrollReveal>
          <Card className="topic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="subjects">By Subject</TabsTrigger>
                  <TabsTrigger value="students">Top Students</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-gradient-subtle border">
                      <p className="text-2xl font-bold text-success">85%</p>
                      <p className="text-sm text-muted-foreground">Pass Rate</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-subtle border">
                      <p className="text-2xl font-bold text-primary">92%</p>
                      <p className="text-sm text-muted-foreground">Attendance</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-subtle border">
                      <p className="text-2xl font-bold text-warning">78%</p>
                      <p className="text-sm text-muted-foreground">Assignment Completion</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-subtle border">
                      <p className="text-2xl font-bold text-accent">4.2</p>
                      <p className="text-sm text-muted-foreground">Avg Grade (out of 5)</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="subjects">
                  <div className="space-y-3">
                    {["Mathematics", "Science", "English"].map((subject) => (
                      <div key={subject} className="flex items-center justify-between p-3 rounded-lg bg-gradient-subtle border">
                        <span className="font-medium">{subject}</span>
                        <div className="flex items-center gap-3">
                          <Progress value={Math.floor(Math.random() * 30) + 70} className="w-32 h-2" />
                          <span className="text-sm font-semibold">{Math.floor(Math.random() * 30) + 70}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="students">
                  <div className="space-y-3">
                    {mockStudents
                      .sort((a, b) => b.progress - a.progress)
                      .slice(0, 3)
                      .map((student, index) => (
                        <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-subtle border">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              index === 0 ? "bg-yellow-500 text-white" : 
                              index === 1 ? "bg-gray-400 text-white" : 
                              "bg-orange-600 text-white"
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.class}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{student.progress}%</p>
                            <p className="text-sm text-muted-foreground">{student.questionsCompleted} questions</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default ClassDashboard;