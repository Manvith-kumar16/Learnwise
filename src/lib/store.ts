/* Utilities for local storage-backed app data: auth user, students, and classes */
import { addDays, isSameDay, subDays } from "date-fns";

export type Role = "student" | "teacher" | "parent" | "admin";

export type Diagnostics = {
  listening: number;
  grasping: number;
  retention: number;
  application: number;
};

export type TopicProgress = {
  name: string;
  progress: number; // 0-100
  subTopics: string[];
  recentScore: number; // 0-100
  questionsCompleted: number;
};

export type StudentRecord = {
  id: string; // same as email for simplicity
  name: string;
  email: string;
  role: Role;
  level: string;
  totalQuestions: number;
  streak: number;
  overallProgress: number; // derived avg of topics
  studyTimeTodayMinutes: number;
  diagnostics: Diagnostics;
  topics: TopicProgress[];
  classId?: string; // e.g., 'placement-prep'
  lastSessionDate?: string; // ISO date (yyyy-mm-dd)
};

export type ClassRecord = {
  id: string;
  name: string;
  studentEmails: string[]; // list of student identifiers (emails)
};

export type AuthUser = {
  name: string;
  email: string;
  role: Role;
};

const AUTH_USER_KEY = "auth_user";
const STUDENT_PREFIX = "student_data_";
const CLASS_PREFIX = "class_data_";

// Helpers
const isoDay = (d: Date = new Date()) => d.toISOString().slice(0, 10);

const defaultTopics = (): TopicProgress[] => [
  {
    name: "Quantitative Aptitude",
    progress: 0,
    subTopics: ["Percentages", "Ratios", "Profit & Loss"],
    recentScore: 0,
    questionsCompleted: 0,
  },
  {
    name: "Logical Reasoning & DI",
    progress: 0,
    subTopics: ["Data Interpretation", "Puzzles", "Coding-Decoding"],
    recentScore: 0,
    questionsCompleted: 0,
  },
  {
    name: "Verbal Ability & RC",
    progress: 0,
    subTopics: ["Reading Comprehension", "Grammar", "Vocabulary"],
    recentScore: 0,
    questionsCompleted: 0,
  },
];

const computeOverallProgress = (topics: TopicProgress[]) => {
  if (!topics?.length) return 0;
  const sum = topics.reduce((acc, t) => acc + (t.progress || 0), 0);
  return Math.round(sum / topics.length);
};

export const getAuthUser = (): AuthUser | null => {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
};

export const setAuthUser = (user: AuthUser | null) => {
  if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_USER_KEY);
};

export const studentKey = (email: string) => `${STUDENT_PREFIX}${email.toLowerCase()}`;
export const classKey = (classId: string) => `${CLASS_PREFIX}${classId}`;

export const getStudent = (email: string): StudentRecord | null => {
  const raw = localStorage.getItem(studentKey(email));
  return raw ? (JSON.parse(raw) as StudentRecord) : null;
};

export const saveStudent = (student: StudentRecord) => {
  const updated = {
    ...student,
    overallProgress: computeOverallProgress(student.topics),
  };
  localStorage.setItem(studentKey(student.email), JSON.stringify(updated));
  return updated;
};

export const ensureStudentRecord = (email: string, name: string, opts?: Partial<StudentRecord>): StudentRecord => {
  const existing = getStudent(email);
  if (existing) return existing;
  const student: StudentRecord = {
    id: email,
    email,
    name,
    role: "student",
    level: opts?.level ?? "Beginner",
    totalQuestions: opts?.totalQuestions ?? 0,
    streak: opts?.streak ?? 0,
    overallProgress: 0,
    studyTimeTodayMinutes: 0,
    diagnostics: opts?.diagnostics ?? { listening: 0, grasping: 0, retention: 0, application: 0 },
    topics: opts?.topics ?? defaultTopics(),
    classId: opts?.classId ?? "placement-prep",
    lastSessionDate: opts?.lastSessionDate ?? undefined,
  };
  return saveStudent(student);
};

export const getClass = (classId: string): ClassRecord | null => {
  const raw = localStorage.getItem(classKey(classId));
  return raw ? (JSON.parse(raw) as ClassRecord) : null;
};

export const saveClass = (cls: ClassRecord) => {
  localStorage.setItem(classKey(cls.id), JSON.stringify(cls));
  return cls;
};

// Seed a default class with the provided sample students if needed
export const ensureDefaultClass = (classId = "placement-prep", name = "Placement preparation") => {
  let cls = getClass(classId);
  if (!cls) {
    cls = {
      id: classId,
      name,
      studentEmails: [
        "shrirakshapacharya@gmail.com",
        "navamirbhat@gmail.com",
        "manvithkumar.u@gmail.com",
        "likhith@gmail.com",
      ],
    };
    saveClass(cls);
  }

  // Ensure base student records exist with initial values
  ensureStudentRecord("shrirakshapacharya@gmail.com", "Shriraksha P Acharya", {
    topics: [
      { name: "Quantitative Aptitude", progress: 10, subTopics: ["Percentages", "Ratios", "Profit & Loss"], recentScore: 10, questionsCompleted: 156 },
      { name: "Logical Reasoning & DI", progress: 10, subTopics: ["Data Interpretation", "Puzzles", "Coding-Decoding"], recentScore: 10, questionsCompleted: 98 },
      { name: "Verbal Ability & RC", progress: 10, subTopics: ["Reading Comprehension", "Grammar", "Vocabulary"], recentScore: 10, questionsCompleted: 134 },
    ],
    diagnostics: { listening: 10, grasping: 10, retention: 10, application: 10 },
  });
  ensureStudentRecord("navamirbhat@gmail.com", "Navami", {
    topics: [
      { name: "Quantitative Aptitude", progress: 10, subTopics: ["Percentages", "Ratios", "Profit & Loss"], recentScore: 10, questionsCompleted: 40 },
      { name: "Logical Reasoning & DI", progress: 10, subTopics: ["Data Interpretation", "Puzzles", "Coding-Decoding"], recentScore: 10, questionsCompleted: 32 },
      { name: "Verbal Ability & RC", progress: 10, subTopics: ["Reading Comprehension", "Grammar", "Vocabulary"], recentScore: 10, questionsCompleted: 28 },
    ],
    diagnostics: { listening: 10, grasping: 10, retention: 10, application: 10 },
  });
  ensureStudentRecord("manvithkumar.u@gmail.com", "Manvith", {
    topics: [
      { name: "Quantitative Aptitude", progress: 10, subTopics: ["Percentages", "Ratios", "Profit & Loss"], recentScore: 10, questionsCompleted: 24 },
      { name: "Logical Reasoning & DI", progress: 10, subTopics: ["Data Interpretation", "Puzzles", "Coding-Decoding"], recentScore: 10, questionsCompleted: 18 },
      { name: "Verbal Ability & RC", progress: 10, subTopics: ["Reading Comprehension", "Grammar", "Vocabulary"], recentScore: 10, questionsCompleted: 12 },
    ],
    diagnostics: { listening: 65, grasping: 45, retention: 50, application: 40 },
  });
  ensureStudentRecord("likhith@email.com", "Likhith", {
    topics: [
      { name: "Quantitative Aptitude", progress: 78, subTopics: ["Percentages", "Ratios", "Profit & Loss"], recentScore: 85, questionsCompleted: 60 },
      { name: "Logical Reasoning & DI", progress: 78, subTopics: ["Data Interpretation", "Puzzles", "Coding-Decoding"], recentScore: 80, questionsCompleted: 40 },
      { name: "Verbal Ability & RC", progress: 78, subTopics: ["Reading Comprehension", "Grammar", "Vocabulary"], recentScore: 88, questionsCompleted: 34 },
    ],
    diagnostics: { listening: 82, grasping: 75, retention: 80, application: 75 },
  });

  return cls;
};

export const getClassStudents = (classId = "placement-prep"): StudentRecord[] => {
  const cls = ensureDefaultClass(classId);
  const emails = cls?.studentEmails ?? [];
  return emails
    .map((email) => getStudent(email) || ensureStudentRecord(email, email.split("@")[0]))
    .map((s) => ({ ...s, overallProgress: computeOverallProgress(s.topics) }));
};

export const getClassOverview = (classId = "placement-prep") => {
  const students = getClassStudents(classId);
  const totalStudents = students.length;
  const avgProgress = students.length
    ? Math.round(students.reduce((acc, s) => acc + (s.overallProgress || 0), 0) / students.length)
    : 0;
  // active if answered any questions in last 7 days or studyTimeToday > 0
  const sevenDaysAgo = subDays(new Date(), 7);
  const activeStudents = students.filter((s) => {
    const last = s.lastSessionDate ? new Date(s.lastSessionDate) : null;
    return (s.totalQuestions > 0) || (last && last >= sevenDaysAgo);
  }).length;
  const needAttention = students.filter((s) => (s.overallProgress ?? 0) < 50).length;
  return { totalStudents, avgProgress, activeStudents, needAttention };
};

export const completePracticeSession = (
  email: string,
  params: { correct: number; incorrect: number; timeMinutes?: number; subject?: 'QA' | 'LRDI' | 'VARC' }
) => {
  const student = getStudent(email);
  if (!student) return null;
  const totalAttempted = (params.correct ?? 0) + (params.incorrect ?? 0);
  const nowDay = isoDay();
  const lastDay = student.lastSessionDate;
  let newStreak = student.streak || 0;
  if (!lastDay) newStreak = 1;
  else {
    const last = new Date(lastDay);
    if (isSameDay(last, new Date())) newStreak = newStreak; // same day, keep
    else if (isSameDay(addDays(last, 1), new Date())) newStreak = newStreak + 1; // consecutive day
    else newStreak = 1; // reset
  }

  // simple progress update heuristic (subject-specific)
  const accuracy = totalAttempted ? params.correct / totalAttempted : 0;
  const progressBump = Math.round(accuracy * 5); // small incremental bump per session
  const recentScore = Math.round(accuracy * 100);

  const subjectNameMap: Record<string, string> = {
    QA: 'Quantitative Aptitude',
    LRDI: 'Logical Reasoning & DI',
    VARC: 'Verbal Ability & RC',
  };
  const targetName = params.subject ? subjectNameMap[params.subject] : student.topics[0]?.name;

  const updatedTopics = student.topics.map((t) => {
    if (t.name !== targetName) return { ...t };
    const questionsInc = totalAttempted; // all attempted counted towards selected subject
    const newQ = (t.questionsCompleted || 0) + questionsInc;
    const newProg = Math.min(100, (t.progress || 0) + progressBump);
    const newRecent = Math.max(0, Math.min(100, recentScore));
    return { ...t, questionsCompleted: newQ, progress: newProg, recentScore: newRecent };
  });

  const updated: StudentRecord = {
    ...student,
    totalQuestions: (student.totalQuestions || 0) + totalAttempted,
    streak: newStreak,
    studyTimeTodayMinutes: (student.studyTimeTodayMinutes || 0) + (params.timeMinutes ?? totalAttempted * 2),
    topics: updatedTopics,
    lastSessionDate: nowDay,
  };

  return saveStudent(updated);
};

export const addStudentToClass = (classId: string, email: string) => {
  const cls = getClass(classId) || { id: classId, name: "Placement preparation", studentEmails: [] };
  if (!cls.studentEmails.includes(email)) {
    cls.studentEmails.push(email);
    saveClass(cls);
  }
  return cls;
};
