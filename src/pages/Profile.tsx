import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Target, Flame, BookOpen, Clock, TrendingUp, Award, Star } from "lucide-react";

import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { student, topics } = useProgress();
  const [achievements, setAchievements] = useState<Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    earned: boolean;
    date?: string;
  }>>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    // Calculate achievements based on student progress
    if (!student) return;
    
    const totalQuestions = student.totalQuestions || 0;
    const streak = student.streak || 0;
    const overallProgress = student.overallProgress || 0;
    
    setAchievements([
      {
        id: "first-steps",
        title: "First Steps",
        description: "Complete your first practice session",
        icon: <Star className="w-5 h-5" />,
        earned: totalQuestions > 0,
        date: totalQuestions > 0 ? "Earned" : undefined
      },
      {
        id: "centurion",
        title: "Centurion",
        description: "Answer 100 questions",
        icon: <Trophy className="w-5 h-5" />,
        earned: totalQuestions >= 100,
        date: totalQuestions >= 100 ? "Earned" : undefined
      },
      {
        id: "week-warrior",
        title: "Week Warrior",
        description: "Maintain a 7-day streak",
        icon: <Flame className="w-5 h-5" />,
        earned: streak >= 7,
        date: streak >= 7 ? "Earned" : undefined
      },
      {
        id: "half-way",
        title: "Halfway There",
        description: "Reach 50% overall progress",
        icon: <Target className="w-5 h-5" />,
        earned: overallProgress >= 50,
        date: overallProgress >= 50 ? "Earned" : undefined
      },
      {
        id: "dedicated",
        title: "Dedicated Learner",
        description: "Study for 60 minutes in a day",
        icon: <Clock className="w-5 h-5" />,
        earned: (student.studyTimeTodayMinutes || 0) >= 60,
        date: (student.studyTimeTodayMinutes || 0) >= 60 ? "Earned Today" : undefined
      },
      {
        id: "master",
        title: "Subject Master",
        description: "Achieve 80% progress in any subject",
        icon: <Award className="w-5 h-5" />,
        earned: topics.some(t => t.progress >= 80),
        date: topics.some(t => t.progress >= 80) ? "Earned" : undefined
      }
    ]);
  }, [student, topics]);

  if (!user || !student) {
    return null;
  }

  const initials = user.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const earnedCount = achievements.filter(a => a.earned).length;
  const achievementProgress = (earnedCount / achievements.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={{ name: user.name, role: user.role, notifications: 0 }} />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Card className="card-elevated border-0 flex-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                    <Badge variant="outline">{student.level || "Beginner"}</Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-primary hover:text-primary-foreground transition-all"
                  onClick={() => {
                    console.log("Navigating to settings for profile editing...");
                    navigate("/settings", { state: { fromProfile: true } });
                  }}
                >
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="card-elevated border-0 w-full md:w-80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-8 h-8 text-orange-500" />
                  <span className="text-3xl font-bold">{student.streak || 0}</span>
                  <span className="text-muted-foreground">days</span>
                </div>
                {student.streak >= 7 && (
                  <Badge className="bg-orange-500 text-white">On Fire!</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-elevated border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Total Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{student.totalQuestions || 0}</p>
            </CardContent>
          </Card>

          <Card className="card-elevated border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Study Time Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{student.studyTimeTodayMinutes || 0} min</p>
            </CardContent>
          </Card>

          <Card className="card-elevated border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{student.overallProgress || 0}%</p>
            </CardContent>
          </Card>

          <Card className="card-elevated border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="w-4 h-4" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{earnedCount}/{achievements.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Subject Progress */}
        <Card className="card-elevated border-0">
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topics.map((topic, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{topic.name}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {topic.questionsCompleted || 0} questions
                    </span>
                    <Badge variant={topic.progress >= 70 ? "default" : "outline"}>
                      {topic.progress}%
                    </Badge>
                  </div>
                </div>
                <Progress value={topic.progress} className="h-2" />
                {topic.recentScore > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Recent score: {topic.recentScore}%
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="card-elevated border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Achievements</CardTitle>
              <div className="flex items-center gap-2">
                <Progress value={achievementProgress} className="w-24 h-2" />
                <span className="text-sm text-muted-foreground">
                  {earnedCount}/{achievements.length}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    achievement.earned
                      ? "bg-gradient-subtle border-primary"
                      : "bg-muted/30 border-border opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.earned ? "bg-primary/10 text-primary" : "bg-muted"
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.description}
                      </p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-primary mt-2">{achievement.date}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Diagnostics */}
        {student.diagnostics && (
          <Card className="card-elevated border-0">
            <CardHeader>
              <CardTitle>Learning Diagnostics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(student.diagnostics).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{key}</span>
                      <span className="text-sm text-muted-foreground">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;