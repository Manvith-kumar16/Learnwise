import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressRing } from "@/components/ProgressRing";
import { 
  ArrowLeft, 
  Settings, 
  Target,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Sample question data - in real app this would come from API
const sampleQuestions = [
  {
    id: "1",
    text: "If 25% of a number is 150, what is 40% of the same number?",
    options: ["200", "240", "300", "360"],
    answer: 1,
    difficulty: "easy" as const,
    tags: ["percentages", "basic-calculation"],
    explanation: "If 25% = 150, then 100% = 150 ÷ 0.25 = 600. Therefore, 40% of 600 = 600 × 0.40 = 240."
  },
  {
    id: "2", 
    text: "A shop offers a 20% discount on a shirt priced at ₹800. After the discount, a 5% tax is added. What is the final price?",
    options: ["₹672", "₹680", "₹690", "₹700"],
    answer: 0,
    difficulty: "moderate" as const,
    tags: ["percentages", "discount", "tax"],
    explanation: "Price after 20% discount = 800 × 0.8 = ₹640. Adding 5% tax = 640 × 1.05 = ₹672."
  }
];

const Practice = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    totalTime: 0,
    streak: 0
  });
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const currentQuestion = sampleQuestions[currentQuestionIndex];

  const handleAnswer = (selectedOption: number, isCorrect: boolean) => {
    setSessionStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    // Move to next question or complete session
    setTimeout(() => {
      if (currentQuestionIndex < sampleQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setIsSessionComplete(true);
      }
    }, 2000);
  };

  const restartSession = () => {
    setCurrentQuestionIndex(0);
    setSessionStats({ correct: 0, incorrect: 0, totalTime: 0, streak: 0 });
    setIsSessionComplete(false);
  };

  if (isSessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="card-elevated border-0 text-center">
            <CardContent className="p-8">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4 animate-bounce-in" />
                <h2 className="text-3xl font-bold mb-2">Session Complete! 🎉</h2>
                <p className="text-muted-foreground">Great work on your practice session</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <ProgressRing 
                    progress={(sessionStats.correct / (sessionStats.correct + sessionStats.incorrect)) * 100}
                    size="lg"
                    color="success"
                  />
                  <p className="text-sm text-muted-foreground mt-2">Accuracy</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Correct:</span>
                    <Badge className="bg-success text-success-foreground">
                      {sessionStats.correct}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Incorrect:</span>
                    <Badge className="bg-error text-error-foreground">
                      {sessionStats.incorrect}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Streak:</span>
                    <Badge className="bg-primary text-primary-foreground">
                      {sessionStats.streak}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={restartSession} className="w-full btn-gradient">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Practice Again
                </Button>
                <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="font-bold">Quantitative Aptitude • Percentages</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {sampleQuestions.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-gradient-primary text-primary-foreground">
              <Target className="w-4 h-4 mr-1" />
              Adaptive Mode
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-background/50 px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentQuestionIndex + 1) / sampleQuestions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestionIndex + 1) / sampleQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Session Stats */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="card-elevated border-0">
              <CardContent className="p-3 text-center">
                <CheckCircle className="w-6 h-6 text-success mx-auto mb-1" />
                <p className="font-bold text-lg">{sessionStats.correct}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </CardContent>
            </Card>
            
            <Card className="card-elevated border-0">
              <CardContent className="p-3 text-center">
                <XCircle className="w-6 h-6 text-error mx-auto mb-1" />
                <p className="font-bold text-lg">{sessionStats.incorrect}</p>
                <p className="text-xs text-muted-foreground">Incorrect</p>
              </CardContent>
            </Card>
            
            <Card className="card-elevated border-0">
              <CardContent className="p-3 text-center">
                <Target className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="font-bold text-lg">{sessionStats.streak}</p>
                <p className="text-xs text-muted-foreground">Streak</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="px-4 pb-8">
        <QuestionCard 
          question={currentQuestion}
          onAnswer={handleAnswer}
          timeLimit={120}
          showHints={true}
        />
      </div>
    </div>
  );
};

export default Practice;