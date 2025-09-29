import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { useEffect, useMemo, useState } from "react";

const iconForTopic = (topicName: string) => {
  if (topicName.startsWith("Quantitative")) return Brain;
  if (topicName.startsWith("Logical")) return Target;
  if (topicName.startsWith("Verbal")) return BookOpen;
  return Brain;
};

const subjectKeyForTopic = (topicName: string) => {
  if (topicName.startsWith("Quantitative")) return "QA";
  if (topicName.startsWith("Logical")) return "LRDI";
  if (topicName.startsWith("Verbal")) return "VARC";
  return "QA";
};

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { student, topics, todaysPlan, refresh } = useProgress();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const baseStudyTime = student?.studyTimeTodayMinutes ?? 0;
  const overall = Math.max(0, Math.min(100, (student?.overallProgress ?? 0) || (topics.length ? Math.round(topics.reduce((a, t) => a + (t.progress || 0), 0) / topics.length) : 0)));
  const questionsCompleted = (student?.totalQuestions ?? 0) || (topics.length ? topics.reduce((a, t) => a + (t.questionsCompleted || 0), 0) : 0);

  // Realtime ticker and storage sync
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    const onStorage = () => refresh();
    const onVisibility = () => refresh();
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(id);
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refresh]);

  // Compute live study-time delta if a practice session is active today
  const liveStart = useMemo(() => Number(localStorage.getItem('active_practice_started_at')) || 0, [now]);
  const isSameDay = (a: Date, b: Date) => a.toISOString().slice(0,10) === b.toISOString().slice(0,10);
  const liveDeltaMins = useMemo(() => {
    if (!liveStart) return 0;
    const started = new Date(liveStart);
    const today = new Date(now);
    if (!isSameDay(started, today)) return 0;
    return Math.max(0, Math.floor((now - liveStart) / 60000));
  }, [liveStart, now]);
  const studyTime = baseStudyTime + liveDeltaMins;

  // Formatting helpers
  const fmtNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);
  const fmtStreak = (d: number) => `${d} ${d === 1 ? 'day' : 'days'}`;
  const fmtDuration = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    if (hours < 24) return `${hours} h${minutes ? ` ${minutes} min` : ''}`;
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days} d${remHours ? ` ${remHours} h` : ''}`;
  };

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
            { label: "Questions Completed", value: fmtNumber(questionsCompleted), icon: CheckCircle, color: "text-success" },
            { label: "Current Streak", value: fmtStreak(student?.streak ?? 0), icon: Calendar, color: "text-primary" },
            { label: "Study Time Today", value: fmtDuration(studyTime), icon: Clock, color: "text-warning" },
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topics grid */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-elevated border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Topics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topics.map((topic, index) => {
                    const Icon = iconForTopic(topic.name);
                    const active = selectedIndex === index;
                    return (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-transform hover:scale-[1.01] ${active ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setSelectedIndex(active ? null : index)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                                <Icon className="w-5 h-5 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="font-semibold leading-tight">{topic.name}</p>
                                <p className="text-xs text-muted-foreground">Recent {topic.recentScore}%</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">{topic.progress}%</Badge>
                          </div>
                          <Progress value={topic.progress} className="h-2" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected topic details */}
            {selectedIndex !== null && topics[selectedIndex] && (
              <Card className="card-elevated border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {(() => { const I = iconForTopic(topics[selectedIndex].name); return <I className="w-5 h-5" />; })()}
                    <span>Topic Progress • {topics[selectedIndex].name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-semibold">{topics[selectedIndex].progress}%</span>
                    </div>
                    <Progress value={topics[selectedIndex].progress} className="h-2" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topics[selectedIndex].subTopics.map((st, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{st}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{topics[selectedIndex].questionsCompleted} questions completed • Recent {topics[selectedIndex].recentScore}%</p>
                    <Button className="btn-gradient" onClick={() => navigate(`/practice?subject=${subjectKeyForTopic(topics[selectedIndex].name)}`)}>
                      <Play className="w-4 h-4 mr-2" /> Practice Topic
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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
          <div className="space-y-6 lg:col-span-2">
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
                <Button variant="outline" className="w-full" onClick={() => navigate('/goals')}>
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
