import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { completePracticeSession, ensureStudentRecord, getAuthUser, getStudent, StudentRecord, TopicProgress } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";

type ProgressContextType = {
  student: StudentRecord | null;
  topics: TopicProgress[];
  diagnostics: StudentRecord["diagnostics"] | null;
  todaysPlan: { topic: string; questions: number; difficulty: string; estimated: string }[];
  refresh: () => void;
  completeSession: (params: { correct: number; incorrect: number; timeMinutes?: number }) => void;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [student, setStudent] = useState<StudentRecord | null>(null);

  const load = () => {
    if (!user) {
      setStudent(null);
      return;
    }
    ensureStudentRecord(user.email, user.name);
    const s = getStudent(user.email);
    setStudent(s);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const completeSession: ProgressContextType["completeSession"] = ({ correct, incorrect, timeMinutes }) => {
    if (!user) return;
    const updated = completePracticeSession(user.email, { correct, incorrect, timeMinutes });
    setStudent(updated);
  };

  const todaysPlan = useMemo(() => {
    // Very simple plan: fixed times, topics derived from student's weakest areas (lowest progress)
    if (!student) return [];
    const sorted = [...(student.topics || [])].sort((a, b) => a.progress - b.progress);
    const pick = (name: string) => name.split(" ")[0];
    return [
      { topic: student.topics?.[0]?.subTopics?.[0] || "Percentages", questions: 15, difficulty: "Adaptive", estimated: "20 min" },
      { topic: sorted?.[1]?.subTopics?.[0] || "Data Interpretation", questions: 10, difficulty: "Moderate", estimated: "25 min" },
      { topic: sorted?.[2]?.subTopics?.[0] || "Reading Comprehension", questions: 5, difficulty: "Difficult", estimated: "15 min" },
    ];
  }, [student]);

  const value: ProgressContextType = {
    student,
    topics: student?.topics || [],
    diagnostics: student?.diagnostics || null,
    todaysPlan,
    refresh: load,
    completeSession,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
};
