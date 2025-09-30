import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  BookOpen, 
  BarChart3, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  FadeIn, 
  ScrollReveal, 
  Typewriter, 
  AnimatedCard,
  StaggerContainer,
  StaggerItem,
  AnimatedButton
} from "@/components/ui/animated";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleSignIn = () => {
    if (user) {
      // User is already logged in, go directly to dashboard
      navigate(user.role === 'teacher' ? '/class-dashboard' : '/dashboard');
    } else {
      // User is not logged in, go to login page
      navigate('/login');
    }
  };
  
  const handleGetStarted = () => {
    if (user) {
      // User is already logged in, go directly to dashboard
      navigate(user.role === 'teacher' ? '/class-dashboard' : '/dashboard');
    } else {
      // User is not logged in, go to signup
      navigate('/signup');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
<nav className="flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <img 
            src="/logobg.png" 
            alt="LearnWise Logo" 
            className="w-15 h-8" 
            style={{minWidth: '60px', minHeight: '60px'}}
          />
          <span className="font-bold text-3xl gradient-text">LearnWise</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</Button>
          <Button variant="ghost" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About</Button>
          <Button variant="outline" onClick={handleSignIn}>
            {user ? 'Go to Dashboard' : 'Sign In'}
          </Button>
          <Button className="btn-gradient" onClick={handleGetStarted}>
            {user ? 'Continue Learning' : 'Get Started'}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <FadeIn delay={0.2}>
            <Badge className="mb-6 bg-accent text-accent-foreground">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Adaptive Learning
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Learn Smarter with
              <span className="gradient-text block mt-2 animate-gradient">
                <Typewriter text="LearnWise" delay={0.5} />
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.4} direction="up">
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our AI adapts to your learning pace, identifies weak areas, and creates personalized practice sessions for maximum learning efficiency.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <AnimatedButton 
                variant="glow"
                className="btn-gradient text-lg px-8 py-4" 
                onClick={handleGetStarted}
              >
                {user ? 'Continue Learning' : 'Start Learning Free'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </AnimatedButton>
              <AnimatedButton 
                variant="scale"
                className="border border-border text-lg px-8 py-4 bg-background" 
                onClick={() => user ? navigate('/practice') : document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {user ? 'Practice Now' : 'Learn More'}
              </AnimatedButton>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Target, title: "Adaptive Difficulty", desc: "Questions adjust to your skill level in real-time" },
              { icon: Brain, title: "AI-Powered Analytics", desc: "Deep insights into your learning patterns" },
              { icon: TrendingUp, title: "Proven Results", desc: "Students improve 3x faster with our system" }
            ].map((feature, index) => (
              <StaggerItem key={index}>
                <AnimatedCard className="card-glass h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      className="w-12 h-12 rounded-lg bg-gradient-primary mx-auto mb-4 flex items-center justify-center"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </motion.div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-background">
        <div className="container mx-auto">
          <ScrollReveal className="text-center mb-16" animation="fade">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Excel</h2>
            <p className="text-xl text-muted-foreground">Comprehensive tools for students, teachers, and parents</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  icon: BookOpen,
                  title: "Multi-Topic Learning",
                  desc: "Quantitative Aptitude, Logical Reasoning, Verbal Ability & Reading Comprehension"
                },
                {
                  icon: Brain,
                  title: "Intelligent Adaptation",
                  desc: "Our AI analyzes your responses and adjusts difficulty for optimal learning"
                },
                {
                  icon: BarChart3,
                  title: "Comprehensive Analytics",
                  desc: "Track progress across 4 fundamentals: Listening, Grasping, Retention, Application"
                },
                {
                  icon: Users,
                  title: "Teacher & Parent Dashboards",
                  desc: "Real-time insights and intervention suggestions for educators and families"
                }
              ].map((feature, index) => (
                <ScrollReveal key={index} animation="slide" className="flex items-start space-x-4">
                  <motion.div 
                    className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal animation="scale">
              <AnimatedCard className="topic-card overflow-hidden" hoverable={true}>
                <CardContent className="p-0">
                <div className="bg-gradient-hero p-8 text-primary-foreground">
                  <h3 className="text-2xl font-bold mb-4">See Your Progress</h3>
                  <div className="space-y-4">
                    {[
                      { subject: "Quantitative Aptitude", progress: 30, color: "bg-white" },
                      { subject: "Logical Reasoning", progress: 52, color: "bg-white/80" },
                      { subject: "Verbal Ability", progress: 76, color: "bg-white/60" }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.subject}</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    "✓ Personalized difficulty adjustment",
                    "✓ Weak area identification", 
                    "✓ Targeted practice recommendations",
                    "✓ Real-time performance analytics"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                </CardContent>
              </AnimatedCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-20 bg-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-4xl font-bold">About LearnWise</h2>
            <p className="text-lg text-muted-foreground">
              LearnWise is an adaptive, AI-powered learning platform that personalizes practice and provides clear analytics for learners and teachers. It focuses on four fundamentals: Listening, Grasping, Retention, and Application.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join thousands of students who've accelerated their academic success with AdaptiveAce
          </p>
          <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={() => navigate('/dashboard')}>
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t bg-background">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center space-x-2 mb-4">
          
              <img 
            src="/logobg.png" 
            alt="LearnWise Logo" 
            className="w-8 h-8" 
            style={{minWidth: '60px', minHeight: '60px'}}
          />
          
            <span className="font-semibold gradient-text">LearnWise</span>
          </div>
          <p>© 2025 LearnWise. Empowering learners with AI-driven education.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;