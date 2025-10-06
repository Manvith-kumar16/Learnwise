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
  Flame,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "@/context/ProgressContext";
import { useEffect, useMemo, useState } from "react";
import { 
  FadeIn, 
  ScrollReveal, 
  AnimatedCard,
  StaggerContainer,
  StaggerItem,
  AnimatedButton,
  LoadingSpinner
} from "@/components/ui/animated";
import { DashboardSkeleton } from "@/components/ui/skeleton-loader";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const baseStudyTime = student?.studyTimeTodayMinutes ?? 0;
  const overall = Math.max(
    0, 
    Math.min(
      100, 
      (student?.overallProgress ?? 0) || 
      (topics.length ? Math.round(topics.reduce((a, t) => a + (t.progress || 0), 0) / topics.length) : 0)
    )
  );
  const questionsCompleted = (student?.totalQuestions ?? 0) || (topics.length ? topics.reduce((a, t) => a + (t.questionsCompleted || 0), 0) : 0);

  // Animate number for "Questions Completed"
  const [animatedQuestions, setAnimatedQuestions] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = 0; // Target value for animation
    const duration = 1000; // in ms
    const increment = end / (duration / 16); // approx 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setAnimatedQuestions(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, []);

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

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <FadeIn className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {student?.name || 'Student'}! 👋</h1>
            <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
          </div>
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Badge variant="outline" className="flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span>{student?.level || 'Beginner'}</span>
            </Badge>
            <Badge className="bg-gradient-primary text-primary-foreground animate-float">
              🔥 {student?.streak ?? 0} day streak
            </Badge>
          </motion.div>
        </FadeIn>

        {/* Quick Stats */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
  { label: "Questions Completed", value: animatedQuestions, icon: CheckCircle, color: "text-success" },
  { label: "Current Streak", value: fmtStreak(student?.streak ?? 0), icon: Flame, color: "text-orange-500" }, // ✅ fire icon
  { label: "Study Time Today", value: fmtDuration(studyTime), icon: Clock, color: "text-warning" },
  { label: "Overall Progress", value: `${overall}%`, icon: TrendingUp, color: "text-success" }
].map((stat, index) => (
  <StaggerItem key={index}>
    <AnimatedCard className="card-elevated h-full" hoverable={true}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <motion.p 
              className="text-2xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
            >
              {typeof stat.value === 'number' ? fmtNumber(stat.value) : stat.value}
            </motion.p>
          </div>
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
          >
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </motion.div>
        </div>
      </CardContent>
    </AnimatedCard>
  </StaggerItem>
))}

        </StaggerContainer>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topics grid */}
          <div className="lg:col-span-2 space-y-6">
            <ScrollReveal animation="fade">
              <Card className="card-elevated border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Topics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topics.map((topic, index) => {
                    const Icon = iconForTopic(topic.name);
                    const active = selectedIndex === index;
                    return (
                      <StaggerItem key={index}>
                        <AnimatedCard
                          className={`topic-card cursor-pointer ${active ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => setSelectedIndex(active ? null : index)}
                          hoverable={true}
                        >
                          <CardContent className="p-4">
                         <div className="flex items-center justify-between mb-2">
  <div className="flex items-center space-x-2">
    <motion.div 
      className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
    >
      <Icon className="w-5 h-5 text-primary-foreground" />
    </motion.div>
    <div>
      <p className="font-semibold leading-tight">{topic.name}</p>
      <p className="text-xs text-muted-foreground">Recent {topic.recentScore}%</p>
    </div>
  </div>
  {/* 🔄 Now showing recentScore instead of progress */}
  <Badge variant="outline" className="text-xs">{topic.recentScore}%</Badge>
</div>

                          <motion.div
  initial={{ scaleX: 0 }}
  animate={{ scaleX: 1 }}
  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
  style={{ transformOrigin: "left" }}
>
  <Progress value={topic.recentScore} className="h-2" />
</motion.div>

                        </CardContent>
                      </AnimatedCard>
                    </StaggerItem>
                    );
                  })}
                  </StaggerContainer>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Selected topic details */}
            <AnimatePresence>
              {selectedIndex !== null && topics[selectedIndex] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="card-elevated border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {(() => { 
                          const I = iconForTopic(topics[selectedIndex].name); 
                          return <I className="w-5 h-5" />; 
                        })()}
                        <span>Topic Progress • {topics[selectedIndex].name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress bar (Recent Performance) */}
<div>
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-muted-foreground">Recent Performance</span>
    <span className="text-sm font-semibold">
      {topics[selectedIndex].recentScore}%
    </span>
  </div>
  <Progress 
    value={topics[selectedIndex].recentScore} 
    className="h-2" 
    colorMode="recent"   // ✅ tells Progress.tsx to apply red/yellow/green
  />
</div>


                      {/* Subtopics */}
                      <div className="flex flex-wrap gap-2">
                        {topics[selectedIndex].subTopics.map((st, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{st}</Badge>
                        ))}
                      </div>

                      {/* Questions Completed + Practice button */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {topics[selectedIndex].questionsCompleted} questions completed • Recent {topics[selectedIndex].recentScore}%
                        </p>

                        <AnimatedButton 
                          variant="glow" 
                          className="btn-gradient flex items-center whitespace-nowrap" 
                          onClick={() => navigate(`/practice?subject=${subjectKeyForTopic(topics[selectedIndex].name)}`)}
                        >
                          <Play className="w-4 h-4 mr-2" /> 
                          Practice Topic
                        </AnimatedButton>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

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
              <CardContent 
                className="p-6 text-center relative" 
                style={{ color: "white" }}
              >
                <Award 
                  className="w-12 h-12 mx-auto mb-3 animate-float" 
                  style={{ color: "white" }} 
                />
                <h3 className="font-bold mb-2" style={{ color: "white" }}>
                  Great Progress!
                </h3>
                <p className="text-sm mb-4" style={{ color: "white" }}>
                  You've improved your accuracy by 15% this week
                </p>
                <Badge style={{ backgroundColor: "white", color: "black" }}>
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
