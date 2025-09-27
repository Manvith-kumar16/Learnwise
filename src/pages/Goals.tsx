import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "@/context/ProgressContext";

const Goals = () => {
  const navigate = useNavigate();
  const { todaysPlan } = useProgress();

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>Back</Button>
            <h1 className="text-2xl font-bold">Set Your Learning Goals</h1>
          </div>
        </div>

        <Card className="card-elevated border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Today's Practice Plan</span>
              </div>
              <Badge className="bg-gradient-primary text-primary-foreground">Est. 60 min</Badge>
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
                  <Badge variant="outline" className="text-xs">{plan.estimated}</Badge>
                  <Button size="sm" className="btn-gradient" onClick={() => navigate('/practice')}>
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Goals;

