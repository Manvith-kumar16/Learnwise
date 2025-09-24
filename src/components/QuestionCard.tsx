import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Timer, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  text: string;
  options: string[];
  answer: number;
  difficulty: "very_easy" | "easy" | "moderate" | "difficult";
  tags: string[];
  explanation?: string;
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedOption: number, isCorrect: boolean) => void;
  timeLimit?: number;
  showHints?: boolean;
}

export const QuestionCard = ({ 
  question, 
  onAnswer, 
  timeLimit = 60,
  showHints = true 
}: QuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  const difficultyColors = {
    very_easy: "bg-success text-success-foreground",
    easy: "bg-warning text-warning-foreground", 
    moderate: "bg-primary text-primary-foreground",
    difficult: "bg-error text-error-foreground"
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (showResult) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === question.answer;
    setShowResult(true);
    
    // Trigger animation based on result
    setTimeout(() => {
      onAnswer(selectedOption, isCorrect);
    }, 2000);
  };

  const progressPercentage = ((timeLimit - timeRemaining) / timeLimit) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto card-elevated border-0 overflow-hidden">
      <CardHeader className="bg-gradient-subtle border-b">
        <div className="flex items-center justify-between mb-4">
          <Badge className={cn("text-xs font-medium", difficultyColors[question.difficulty])}>
            {question.difficulty.replace('_', ' ').toUpperCase()}
          </Badge>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{timeRemaining}s</span>
          </div>
        </div>
        
        <Progress value={progressPercentage} className="h-1 mb-4" />
        
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Question Text */}
        <div className="text-lg leading-relaxed">
          {question.text}
        </div>

        {/* Hint Section */}
        {showHint && (
          <Card className="bg-accent/30 border-accent animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Hint</h4>
                  <p className="text-sm text-muted-foreground">
                    For percentage problems, remember: (Part/Whole) × 100 = Percentage
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            let buttonVariant: "outline" | "default" = "outline";
            let className = "";
            
            if (showResult) {
              if (index === question.answer) {
                className = "border-success bg-success/10 text-success animate-bounce-in";
              } else if (index === selectedOption && index !== question.answer) {
                className = "border-error bg-error/10 text-error animate-shake";
              }
            } else if (selectedOption === index) {
              buttonVariant = "default";
              className = "bg-primary text-primary-foreground";
            }

            return (
              <Button
                key={index}
                variant={buttonVariant}
                className={cn(
                  "w-full p-4 h-auto text-left justify-start transition-all duration-300",
                  className
                )}
                onClick={() => handleOptionSelect(index)}
                disabled={showResult}
              >
                <div className="flex items-start space-x-3 w-full">
                  <span className="font-semibold text-sm min-w-[24px]">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && index === question.answer && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                  {showResult && index === selectedOption && index !== question.answer && (
                    <XCircle className="w-5 h-5 text-error" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {/* Result Explanation */}
        {showResult && question.explanation && (
          <Card className="bg-accent/30 border-accent animate-slide-up">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-primary" />
                Explanation
              </h4>
              <p className="text-sm text-muted-foreground">
                {question.explanation}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          {!showResult && (
            <>
              <div className="flex space-x-2">
                {showHints && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                    className="text-muted-foreground"
                  >
                    <HelpCircle className="w-4 h-4 mr-1" />
                    Hint
                  </Button>
                )}
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="btn-gradient px-8"
              >
                Submit Answer
              </Button>
            </>
          )}
          
          {showResult && (
            <Button
              onClick={() => window.location.reload()}
              className="btn-gradient ml-auto"
            >
              Next Question
            </Button>
          )}
        </div>
      </CardContent>

      {/* Success/Error Animation Overlay */}
      {showResult && (
        <div className="absolute inset-0 pointer-events-none">
          {selectedOption === question.answer ? (
            <div className="absolute top-4 right-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-success rounded-full animate-confetti"
                  style={{
                    left: `${Math.random() * 20}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 bg-error/5 animate-fade-in" />
          )}
        </div>
      )}
    </Card>
  );
};