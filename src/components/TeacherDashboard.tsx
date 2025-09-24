import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from "./ProgressRing";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  BookOpen, 
  FileText,
  Download,
  Eye,
  BarChart3,
  Clock,
  Target,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  overallProgress: number;
  recentScore: number;
  timeSpent: number;
  needsAttention: boolean;
  diagnostics: {
    listening: number;
    grasping: number;
    retention: number;
    application: number;
  };
}

interface TeacherDashboardProps {
  classData: {
    name: string;
    totalStudents: number;
    activeStudents: number;
    avgProgress: number;
  };
}

export const TeacherDashboard = ({ classData }: TeacherDashboardProps) => {
  const students: Student[] = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.j@email.com",
      overallProgress: 85,
      recentScore: 92,
      timeSpent: 120,
      needsAttention: false,
      diagnostics: { listening: 88, grasping: 82, retention: 90, application: 80 }
    },
    {
      id: "2", 
      name: "Sarah Chen",
      email: "sarah.c@email.com",
      overallProgress: 92,
      recentScore: 88,
      timeSpent: 95,
      needsAttention: false,
      diagnostics: { listening: 90, grasping: 94, retention: 89, application: 95 }
    },
    {
      id: "3",
      name: "Mike Rodriguez", 
      email: "mike.r@email.com",
      overallProgress: 45,
      recentScore: 62,
      timeSpent: 45,
      needsAttention: true,
      diagnostics: { listening: 65, grasping: 45, retention: 50, application: 40 }
    },
    {
      id: "4",
      name: "Emma Davis",
      email: "emma.d@email.com", 
      overallProgress: 78,
      recentScore: 85,
      timeSpent: 110,
      needsAttention: false,
      diagnostics: { listening: 82, grasping: 75, retention: 80, application: 75 }
    }
  ];

  const classInsights = [
    {
      title: "Class Average",
      value: `${classData.avgProgress}%`,
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Active Students",
      value: classData.activeStudents,
      change: "+2",
      trend: "up", 
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Need Attention",
      value: students.filter(s => s.needsAttention).length,
      change: "-1",
      trend: "down",
      icon: AlertTriangle,
      color: "text-warning"
    },
    {
      title: "Avg Study Time",
      value: "95 min",
      change: "+15 min",
      trend: "up",
      icon: Clock,
      color: "text-success"
    }
  ];

  const interventionSuggestions = [
    {
      student: "Mike Rodriguez",
      issue: "Low retention scores", 
      suggestion: "Implement spaced repetition for key concepts",
      priority: "high"
    },
    {
      student: "Emma Davis",
      issue: "Slower application speed",
      suggestion: "Focus on timed practice sessions",
      priority: "medium"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Class Dashboard</h1>
            <p className="text-muted-foreground mt-1">{classData.name} • {classData.totalStudents} students</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="btn-gradient">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {classInsights.map((insight, index) => (
            <Card key={index} className="card-elevated border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{insight.title}</p>
                    <p className="text-2xl font-bold">{insight.value}</p>
                    <p className={`text-xs ${insight.color} flex items-center mt-1`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {insight.change} this week
                    </p>
                  </div>
                  <insight.icon className={`w-8 h-8 ${insight.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Class Overview</TabsTrigger>
            <TabsTrigger value="students">Student Details</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="interventions">Interventions</TabsTrigger>
          </TabsList>

          {/* Class Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Class Heatmap */}
              <Card className="card-elevated border-0">
                <CardHeader>
                  <CardTitle>Performance Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {students.map((student, index) => (
                      <div key={index} className="text-center space-y-2">
                        <ProgressRing 
                          progress={student.overallProgress}
                          size="sm"
                          color={student.needsAttention ? "warning" : "primary"}
                        />
                        <p className="text-xs font-medium truncate">{student.name.split(' ')[0]}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Topic Performance */}
              <Card className="card-elevated border-0">
                <CardHeader>
                  <CardTitle>Topic Performance Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { topic: "Quantitative Aptitude", avg: 78, trend: "+12%" },
                    { topic: "Logical Reasoning", avg: 72, trend: "+8%" },
                    { topic: "Verbal Ability", avg: 85, trend: "+15%" }
                  ].map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{topic.topic}</p>
                        <p className="text-sm text-success">Class avg: {topic.avg}% {topic.trend}</p>
                      </div>
                      <ProgressRing progress={topic.avg} size="sm" showPercentage={false} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Student Details Tab */}
          <TabsContent value="students">
            <Card className="card-elevated border-0">
              <CardHeader>
                <CardTitle>Student Performance Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-3">
                            <ProgressRing 
                              progress={student.overallProgress}
                              size="sm"
                              color={student.needsAttention ? "warning" : "success"}
                            />
                            <div>
                              <h3 className="font-semibold flex items-center space-x-2">
                                <span>{student.name}</span>
                                {student.needsAttention && (
                                  <AlertTriangle className="w-4 h-4 text-warning" />
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Recent Score</p>
                            <p className="font-semibold">{student.recentScore}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Time Spent</p>
                            <p className="font-semibold">{student.timeSpent}min</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="w-4 h-4 mr-1" />
                              Report
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Four Fundamentals */}
                      <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
                        {Object.entries(student.diagnostics).map(([key, value], diagIndex) => (
                          <div key={diagIndex} className="text-center">
                            <p className="text-xs text-muted-foreground capitalize mb-1">{key}</p>
                            <ProgressRing 
                              progress={value}
                              size="sm"
                              showPercentage={false}
                              color={value >= 80 ? "success" : value >= 60 ? "warning" : "error"}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-elevated border-0">
                <CardHeader>
                  <CardTitle>Learning Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <BarChart3 className="w-16 h-16 mb-4" />
                    <p>Interactive analytics chart would be rendered here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated border-0">
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { metric: "Daily Active Students", value: "89%", trend: "+5%" },
                    { metric: "Avg Session Duration", value: "28 min", trend: "+12%" },
                    { metric: "Practice Completion Rate", value: "92%", trend: "+8%" },
                    { metric: "Question Accuracy", value: "76%", trend: "+15%" }
                  ].map((metric, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{metric.metric}</span>
                      <div className="text-right">
                        <span className="font-semibold">{metric.value}</span>
                        <span className="text-success text-sm ml-2">{metric.trend}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interventions Tab */}
          <TabsContent value="interventions">
            <Card className="card-elevated border-0">
              <CardHeader>
                <CardTitle>AI-Generated Intervention Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {interventionSuggestions.map((intervention, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{intervention.student}</h3>
                      <Badge 
                        className={
                          intervention.priority === "high" ? "bg-error text-error-foreground" :
                          intervention.priority === "medium" ? "bg-warning text-warning-foreground" :
                          "bg-success text-success-foreground"
                        }
                      >
                        {intervention.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Issue:</strong> {intervention.issue}
                    </p>
                    <p className="text-sm">
                      <strong>Suggestion:</strong> {intervention.suggestion}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" className="btn-gradient">
                        Create Action Plan
                      </Button>
                      <Button size="sm" variant="outline">
                        Send to Parent
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};