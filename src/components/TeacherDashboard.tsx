import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from "./ProgressRing";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  Download,
  Eye,
  BarChart3,
  Clock,
} from "lucide-react";
import { getClassStudents } from "@/lib/store";

interface TeacherDashboardProps {
  classData: {
    name: string;
    totalStudents: number;
    activeStudents: number;
    avgProgress: number;
  };
}

export const TeacherDashboard = ({ classData }: TeacherDashboardProps) => {
  const students = getClassStudents();

  const classInsights = [
    {
      title: "Class Average",
      value: `${classData.avgProgress}%`,
      change: "+0%",
      trend: "up",
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Active Students",
      value: classData.activeStudents,
      change: "+0",
      trend: "up", 
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Need Attention",
      value: students.filter(s => (s.overallProgress ?? 0) < 50).length,
      change: "",
      trend: "down",
      icon: AlertTriangle,
      color: "text-warning"
    },
    {
      title: "Avg Study Time",
      value: `${Math.round(
        students.reduce((acc, s) => acc + (s.studyTimeTodayMinutes || 0), 0) / (students.length || 1)
      )} min`,
      change: "",
      trend: "up",
      icon: Clock,
      color: "text-success"
    }
  ];

  const topicNames = ["Quantitative Aptitude", "Logical Reasoning & DI", "Verbal Ability & RC"] as const;
  const topicAverages = topicNames.map((name) => {
    const vals = students.map((s) => s.topics.find((t) => t.name === name)?.progress || 0);
    const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    return { topic: name, avg, trend: "+0%" };
  });

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
                          color={(student.overallProgress || 0) < 50 ? "warning" : "primary"}
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
                  {topicAverages.map((topic, index) => (
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
                              color={(student.overallProgress || 0) < 50 ? "warning" : "success"}
                            />
                            <div>
                              <h3 className="font-semibold flex items-center space-x-2">
                                <span>{student.name}</span>
                                {(student.overallProgress || 0) < 50 && (
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
                            <p className="font-semibold">{student.topics?.[0]?.recentScore ?? 0}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Time Spent</p>
                            <p className="font-semibold">{student.studyTimeTodayMinutes ?? 0}min</p>
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
                              progress={value as number}
                              size="sm"
                              showPercentage={false}
                              color={(value as number) >= 80 ? "success" : (value as number) >= 60 ? "warning" : "error"}
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
                    { metric: "Daily Active Students", value: "--", trend: "" },
                    { metric: "Avg Session Duration", value: "--", trend: "" },
                    { metric: "Practice Completion Rate", value: "--", trend: "" },
                    { metric: "Question Accuracy", value: "--", trend: "" }
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
                {[{ student: "Shriraksha", issue: "Low retention scores", suggestion: "Implement spaced repetition for key concepts", priority: "high" }].map((intervention, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{intervention.student}</h3>
                      <Badge className="bg-warning text-warning-foreground">{intervention.priority} priority</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Issue:</strong> {intervention.issue}
                    </p>
                    <p className="text-sm">
                      <strong>Suggestion:</strong> {intervention.suggestion}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" className="btn-gradient">Create Action Plan</Button>
                      <Button size="sm" variant="outline">Send to Parent</Button>
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
