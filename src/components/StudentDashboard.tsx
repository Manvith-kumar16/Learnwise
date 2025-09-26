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
import { useProgress } from "@/context/ProgressContext";

const iconForTopic = (topicName: string) => {
  if (topicName.startsWith("Quantitative")) return Brain;
  if (topicName.startsWith("Logical")) return Target;
  if (topicName.startsWith("Verbal")) return BookOpen;
  return Brain;
};

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { student, topics, diagnostics, todaysPlan } = useProgress();

  const studyTime = student?.studyTimeTodayMinutes ?? 0;
  const overall = (student?.overallProgress ?? 0) || (topics.length ? Math.round(topics.reduce((a, t) => a + (t.progress || 0), 0) / topics.length) : 0);
  const questionsCompleted = (student?.totalQuestions ?? 0) || (topics.length ? topics.reduce((a, t) => a + (t.questionsCompleted || 0), 0) : 0);

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {student?.name || 'Student'}! 👋</h1>
            <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span>{student?.level || 'Beginner'}</span>
            </Badge>
            <Badge className="bg-gradient-primary text-primary-foreground">
              🔥 {student?.streak ?? 0} day streak
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Questions Completed", value: questionsCompleted, icon: CheckCircle, color: "text-success" },
            { label: "Current Streak", value: `${student?.streak ?? 0} days`, icon: Calendar, color: "text-primary" },
            { label: "Study Time Today", value: `${studyTime} min`, icon: Clock, color: "text-warning" },
            { label: "Overall Progress", value: `${overall}%`, icon: TrendingUp, color: "text-success" }
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
                {topics.map((topic, index) => {
                  const Icon = iconForTopic(topic.name);
                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary-foreground" />
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
                  );
                })}
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
                {[{ name: 'Listening', key: 'listening' }, { name: 'Grasping', key: 'grasping' }, { name: 'Retention', key: 'retention' }, { name: 'Application', key: 'application' }].map((d, index) => {
                  const score = (diagnostics as any)?.[d.key] ?? 0;
                  const color = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'primary';
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{d.name}</span>
                        <span className="text-sm font-semibold">{score}%</span>
                      </div>
                      <ProgressRing
                        progress={score}
                        size="sm"
                        color={color as any}
                        showPercentage={false}
                        className="w-full"
                      />
                    </div>
                  );
                })}
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
