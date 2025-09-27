import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ListChecks } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PARTS_COUNT = 10;
const PER_PART = 10;

const PROGRESS_KEY = "qa_part_progress";

const usePartProgress = () => {
  const [map, setMap] = useState<Record<number, number>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      setMap(raw ? JSON.parse(raw) : {});
    } catch {
      setMap({});
    }
  }, []);
  return map;
};

const PracticeParts = () => {
  const navigate = useNavigate();
  const progress = usePartProgress();

  const parts = useMemo(() => Array.from({ length: PARTS_COUNT }, (_, i) => ({
    index: i,
    title: `Part ${i + 1}`,
    questions: PER_PART,
    mix: { easy: 4, moderate: 3, hard: 3 },
    percent: Math.max(0, Math.min(100, Math.round(progress?.[i] ?? 0)))
  })), [progress]);

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/practice')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-bold">Quantitative Aptitude • Parts</h1>
          </div>
          <Badge className="bg-gradient-primary text-primary-foreground">
            <ListChecks className="w-4 h-4 mr-1" /> 10 parts
          </Badge>
        </div>

        <Card className="card-elevated border-0">
          <CardHeader>
            <CardTitle>Choose a Part</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {parts.map((p) => (
                <button
                  key={p.index}
                  className="w-full text-left px-4 py-3 hover:bg-accent/30 transition flex items-center justify-between"
                  onClick={() => navigate(`/practice?part=${p.index + 1}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-7 text-muted-foreground font-medium">{p.index + 1}.</div>
                    <div>
                      <div className="font-semibold">{p.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.questions} questions • Mix: {p.mix.easy}E {p.mix.moderate}M {p.mix.hard}H
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 w-48">
                    <span className="text-xs text-muted-foreground w-10 text-right">{p.percent}%</span>
                    <Progress value={p.percent} className="h-2 flex-1" />
                    <Badge variant="outline" className="w-14 justify-center">Mix</Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PracticeParts;

