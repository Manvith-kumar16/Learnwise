import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from "./ProgressRing";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  Download,
  Eye,
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

  // 🔹 Export all students report as CSV
  const exportReport = () => {
    const csvContent = [
      ["Name", "Email", "Progress", "Study Time"],
      ...students.map((s) => [
        s.name,
        s.email,
        s.overallProgress + "%",
        (s.studyTimeTodayMinutes || 0) + " min",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "class_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // 🔹 Export a class summary report (txt)
  const generateClassReport = () => {
    const report = `
Class Report - ${classData.name}
--------------------------------
Total Students: ${classData.totalStudents}
Active Students: ${classData.activeStudents}
Average Progress: ${classData.avgProgress}%

Students:
${students.map((s) => `- ${s.name} (${s.email}) : ${s.overallProgress}% progress, ${s.studyTimeTodayMinutes || 0} min`).join("\n")}
`;
    const blob = new Blob([report], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "class_summary.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // 🔹 View student details (can replace with modal later)
  const viewStudent = (student: any) => {
    alert(
      `Viewing details for ${student.name}\nEmail: ${student.email}\nProgress: ${student.overallProgress}%`
    );
  };

  // 🔹 Generate student report (txt)
  const generateStudentReport = (student: any) => {
    const report = `
Student Report
---------------
Name: ${student.name}
Email: ${student.email}
Progress: ${student.overallProgress}%
Study Time: ${student.studyTimeTodayMinutes || 0} min
Diagnostics: ${JSON.stringify(student.diagnostics, null, 2)}
`;
    const blob = new Blob([report], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.name}_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
  value: (() => {
    // Only include students who actually studied today
    const activeStudents = students.filter(s => s.studyTimeTodayMinutes && s.studyTimeTodayMinutes > 0);

    // Calculate total time spent today by all students
    const totalTime = activeStudents.reduce(
      (acc, s) => acc + (s.studyTimeTodayMinutes || 0),
      0
    );

    // Compute average time (avoid division by zero)
    const avgMinutes = activeStudents.length > 0 ? totalTime / activeStudents.length : 0;

    // Show hours if large enough, else show minutes
    if (avgMinutes >= 60) {
      const hours = (avgMinutes / 360).toFixed(1);
      return `${hours} min`;
    } else {
      return `${Math.round(avgMinutes)} min`;
    }
  })(),

  change: (() => {
    // Example: compare to yesterday (if available)
    const avgToday =
      students.reduce((acc, s) => acc + (s.studyTimeTodayMinutes || 0), 0) /
      (students.length || 1);
    const avgYesterday =
      students.reduce((acc, s) => acc + (s.studyTimeYesterdayMinutes || 0), 0) /
      (students.length || 1);

    if (!avgYesterday) return "+0%";

    const diff = ((avgToday - avgYesterday) / avgYesterday) * 100;
    const sign = diff >= 0 ? "+" : "-";
    return `${sign}${Math.abs(diff).toFixed(1)}%`;
  })(),

  trend: (() => {
    const avgToday =
      students.reduce((acc, s) => acc + (s.studyTimeTodayMinutes || 0), 0) /
      (students.length || 1);
    const avgYesterday =
      students.reduce((acc, s) => acc + (s.studyTimeYesterdayMinutes || 0), 0) /
      (students.length || 1);
    return avgToday >= avgYesterday ? "up" : "down";
  })(),

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

  // ---------- Engagement Metrics (Dynamic) ----------
  const dailyActiveStudents = students.filter(s => s.studyTimeTodayMinutes && s.studyTimeTodayMinutes > 0).length;
  const avgSessionDuration = Math.round(
    students.reduce((acc, s) => acc + (s.studyTimeTodayMinutes || 0), 0) / (students.length || 1)
  );
  const practiceCompletionRate = Math.round(
    students.reduce((acc, s) => acc + (s.overallProgress || 0), 0) / (students.length || 1)
  );
  const questionAccuracy = Math.round(
    students.reduce((acc, s) => acc + (s.diagnostics?.accuracy || 0), 0) / (students.length || 1)
  );

  const engagementMetrics = [
    { metric: "Daily Active Students", value: dailyActiveStudents, trend: "+5%" },
    { metric: "Avg Session Duration", value: `${avgSessionDuration} min`, trend: "+2%" },
    { metric: "Practice Completion Rate", value: `${practiceCompletionRate}%`, trend: "-1%" },
    { metric: "Question Accuracy", value: `${questionAccuracy}%`, trend: "+3%" }
  ];
  // -------------------------------------------------

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
            <Button variant="outline" onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="btn-gradient" onClick={generateClassReport}>
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
                            <Button size="sm" variant="outline" onClick={() => viewStudent(student)}>
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => generateStudentReport(student)}>
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
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { day: "Mon", progress: 45 },
                          { day: "Tue", progress: 52 },
                          { day: "Wed", progress: 60 },
                          { day: "Thu", progress: 65 },
                          { day: "Fri", progress: 70 },
                          { day: "Sat", progress: 75 },
                          { day: "Sun", progress: 80 },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="progress"
                          stroke="#4F46E5"
                          strokeWidth={3}
                          dot={{ r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Metrics */}
              <Card className="card-elevated border-0">
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {engagementMetrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <span className="font-medium">{metric.metric}</span>
                      <div className="text-right">
                        <span className="font-semibold">{metric.value}</span>
                        <span
                          className={`ml-2 text-sm ${
                            metric.trend.startsWith("+") ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {metric.trend}
                        </span>
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
