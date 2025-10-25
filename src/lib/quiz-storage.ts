export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  answers: number[]; // user's answers (indices)
  completedAt: Date;
}

const QUIZ_STORAGE_KEY = "quiz_records";
const QUIZ_RESULTS_STORAGE_KEY = "quiz_results";

export function getQuizzes(): Quiz[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
  if (!stored) return [];
  try {
    const quizzes = JSON.parse(stored);
    return quizzes.map((quiz: any) => ({
      ...quiz,
      createdAt: new Date(quiz.createdAt),
      updatedAt: new Date(quiz.updatedAt),
    }));
  } catch {
    return [];
  }
}

export function getQuiz(id: string): Quiz | null {
  const quizzes = getQuizzes();
  return quizzes.find((q) => q.id === id) || null;
}

export function saveQuiz(quiz: Quiz): void {
  if (typeof window === "undefined") return;
  const quizzes = getQuizzes();
  const existingIndex = quizzes.findIndex((q) => q.id === quiz.id);

  if (existingIndex >= 0) {
    quizzes[existingIndex] = quiz;
  } else {
    quizzes.push(quiz);
  }

  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizzes));
}

export function deleteQuiz(id: string): void {
  if (typeof window === "undefined") return;
  const quizzes = getQuizzes();
  const filtered = quizzes.filter((q) => q.id !== id);
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(filtered));
}

export function getQuizResults(): QuizResult[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(QUIZ_RESULTS_STORAGE_KEY);
  if (!stored) return [];
  try {
    const results = JSON.parse(stored);
    return results.map((result: any) => ({
      ...result,
      completedAt: new Date(result.completedAt),
    }));
  } catch {
    return [];
  }
}

export function saveQuizResult(result: QuizResult): void {
  if (typeof window === "undefined") return;
  const results = getQuizResults();
  results.push(result);
  localStorage.setItem(QUIZ_RESULTS_STORAGE_KEY, JSON.stringify(results));
}

export function getQuizResultsByQuizId(quizId: string): QuizResult[] {
  const results = getQuizResults();
  return results.filter((r) => r.quizId === quizId);
}

