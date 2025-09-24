import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "./ProgressRing";
import { 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp, 
  Play, 
  Calendar,
  Award,
  Clock,
  BarChart3,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StudentDashboardProps {
  student: {
    name: string;
    totalQuestions: number;
    streak: number;
    level: string;
  };
}

export const StudentDashboard = ({ student }: StudentDashboardProps) => {
  const navigate = useNavigate();
  const topics = [
    {
      name: "Quantitative Aptitude",
      progress: 75,
      subTopics: ["Percentages", "Ratios", "Profit & Loss"],
      recentScore: 85,
      questionsCompleted: 156,
      icon: Brain
    },
    {
      name: "Logical Reasoning & DI",
      progress: 60,
      subTopics: ["Data Interpretation", "Puzzles", "Coding-Decoding"],
      recentScore: 72,
      questionsCompleted: 98,
      icon: Target
    },
    {
      name: "Verbal Ability & RC",
      progress: 85,
      subTopics: ["Reading Comprehension", "Grammar", "Vocabulary"],
      recentScore: 91,
      questionsCompleted: 134,
      icon: BookOpen
    }
  ];

  const diagnostics = [
    { name: "Listening", score: 82, color: "success" as const },
    { name: "Grasping", score: 76, color: "primary" as const },
    { name: "Retention", score: 88, color: "success" as const },
    { name: "Application", score: 71, color: "warning" as const }
  ];

  const todaysPlan = [
    { topic: "Percentages", questions: 15, difficulty: "Adaptive", estimated: "20 min" },
    { topic: "Data Interpretation", questions: 10, difficulty: "Moderate", estimated: "25 min" },
    { topic: "Reading Comprehension", questions: 5, difficulty: "Difficult", estimated: "15 min" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {student.name}! 👋</h1>
            <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span>{student.level}</span>
            </Badge>
            <Badge className="bg-gradient-primary text-primary-foreground">
              🔥 {student.streak} day streak
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Questions Completed", value: student.totalQuestions, icon: CheckCircle, color: "text-success" },
            { label: "Current Streak", value: `${student.streak} days`, icon: Calendar, color: "text-primary" },
            { label: "Study Time Today", value: "45 min", icon: Clock, color: "text-warning" },
            { label: "Overall Progress", value: "73%", icon: TrendingUp, color: "text-success" }
          ].map((stat, index) => (
            <Card key={index} className="card-elevated border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Topics Progress */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-elevated border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Topic Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {topics.map((topic, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                          <topic.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{topic.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {topic.questionsCompleted} questions completed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-success">Recent: {topic.recentScore}%</p>
                        </div>
                        <ProgressRing 
                          progress={topic.progress} 
                          size="sm"
                          showPercentage={false}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 ml-13">
                      {topic.subTopics.map((subTopic, subIndex) => (
                        <Badge key={subIndex} variant="outline" className="text-xs">
                          {subTopic}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-13 btn-gradient"
                      onClick={() => navigate('/practice')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue Practice
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Today's Practice Plan */}
            <Card className="card-elevated border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Today's Practice Plan</span>
                  </div>
                  <Badge className="bg-gradient-primary text-primary-foreground">
                    Est. 60 min
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysPlan.map((plan, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
                    <div>
                      <h4 className="font-medium">{plan.topic}</h4>
                      <p className="text-sm text-muted-foreground">
                        {plan.questions} questions • {plan.difficulty} difficulty
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">
                        {plan.estimated}
                      </Badge>
                      <Button size="sm" className="btn-gradient" onClick={() => navigate('/practice')}>
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Diagnostics & Sidebar */}
          <div className="space-y-6">
            {/* Four Fundamentals */}
            <Card className="card-elevated border-0">
              <CardHeader>
                <CardTitle>Learning Diagnostics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {diagnostics.map((diagnostic, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{diagnostic.name}</span>
                      <span className="text-sm font-semibold">{diagnostic.score}%</span>
                    </div>
                    <ProgressRing
                      progress={diagnostic.score}
                      size="sm"
                      color={diagnostic.color}
                      showPercentage={false}
                      className="w-full"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-elevated border-0">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full btn-gradient" onClick={() => navigate('/practice')}>
                  <Play className="w-4 h-4 mr-2" />
                  Quick Practice (10 min)
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/teacher')}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Detailed Report
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/practice')}>
                  <Target className="w-4 h-4 mr-2" />
                  Set Learning Goals
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Badge */}
            <Card className="card-elevated border-0 bg-gradient-hero text-primary-foreground overflow-hidden">
              <CardContent className="p-6 text-center relative">
                <Award className="w-12 h-12 mx-auto mb-3 animate-float" />
                <h3 className="font-bold mb-2">Great Progress!</h3>
                <p className="text-sm text-primary-foreground/90 mb-4">
                  You've improved your accuracy by 15% this week
                </p>
                <Badge className="bg-primary-foreground text-primary">
                  Keep it up! 🚀
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};