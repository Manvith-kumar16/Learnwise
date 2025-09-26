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

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl gradient-text">LearnWise</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('#features')}>Features</Button>
          <Button variant="ghost" onClick={() => navigate('#about')}>About</Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>Sign In</Button>
          <Button className="btn-gradient" onClick={() => navigate('/dashboard')}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <Badge className="mb-6 bg-accent text-accent-foreground animate-bounce-in">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Adaptive Learning
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Learn Smarter with
            <span className="gradient-text block mt-2">LearnWise</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
            Our AI adapts to your learning pace, identifies weak areas, and creates personalized practice sessions for maximum learning efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in [animation-delay:400ms]">
            <Button size="lg" className="btn-gradient text-lg px-8 py-4" onClick={() => navigate('/dashboard')}>
              Start Learning Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4" onClick={() => navigate('/practice')}>
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in [animation-delay:600ms]">
            {[
              { icon: Target, title: "Adaptive Difficulty", desc: "Questions adjust to your skill level in real-time" },
              { icon: Brain, title: "AI-Powered Analytics", desc: "Deep insights into your learning patterns" },
              { icon: TrendingUp, title: "Proven Results", desc: "Students improve 3x faster with our system" }
            ].map((feature, index) => (
              <Card key={index} className="card-elevated border-0 animate-float" style={{animationDelay: `${index * 0.5}s`}}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Excel</h2>
            <p className="text-xl text-muted-foreground">Comprehensive tools for students, teachers, and parents</p>
          </div>

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
                <div key={index} className="flex items-start space-x-4 animate-fade-in" style={{animationDelay: `${index * 200}ms`}}>
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="card-elevated border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-hero p-8 text-primary-foreground">
                  <h3 className="text-2xl font-bold mb-4">See Your Progress</h3>
                  <div className="space-y-4">
                    {[
                      { subject: "Quantitative Aptitude", progress: 85, color: "bg-white" },
                      { subject: "Logical Reasoning", progress: 72, color: "bg-white/80" },
                      { subject: "Verbal Ability", progress: 91, color: "bg-white/60" }
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
            </Card>
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
            <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold gradient-text">LearnWise</span>
          </div>
          <p>© 2025 LearnWise. Empowering learners with AI-driven education.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;