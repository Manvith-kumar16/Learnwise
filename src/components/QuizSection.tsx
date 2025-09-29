// src/components/QuizSection.tsx
import { useState } from "react";
import { QuestionCard } from "./QuestionCard";     // adjust path if different

interface Question {
  id: string;
  text: string;
  options: string[];
  answer: number;
  difficulty: "very_easy" | "easy" | "moderate" | "difficult";
  tags: string[];
  explanation?: string;
}

interface QuizSectionProps {
  difficulty: Question["difficulty"];
  allQuestions: Question[];
  onSectionComplete: () => void;
}

export default function QuizSection({
  difficulty,
  allQuestions,
  onSectionComplete,
}: QuizSectionProps) {
  const questions = allQuestions.filter(q => q.difficulty === difficulty);

  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentQ, setCurrentQ] = useState<Question | null>(
    () => pickRandom(questions, [])
  );

  function pickRandom(pool: Question[], exclude: string[]) {
    const remaining = pool.filter(q => !exclude.includes(q.id));
    if (!remaining.length) return null;
    return remaining[Math.floor(Math.random() * remaining.length)];
  }

  const handleAnswer = (selected: number, isCorrect: boolean) => {
    if (!currentQ) return;
    setUsedIds(prev => [...prev, currentQ.id]);

    if (isCorrect) {
      const newCount = correctCount + 1;
      setCorrectCount(newCount);
      if (newCount === 10) {
        onSectionComplete();
        return;
      }
    }

    setCurrentQ(pickRandom(questions, [...usedIds, currentQ.id]));
  };

  if (!currentQ) {
    return <div className="p-6 text-center">No more questions available.</div>;
  }

  return <QuestionCard question={currentQ} onAnswer={handleAnswer} />;
}
