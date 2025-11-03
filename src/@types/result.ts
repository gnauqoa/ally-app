import { Quiz } from "./quiz";

export interface Result {
  id: string;
  quizId: string;
  userId: string;
  totalScore: number;
  level: string;
  resultJson: Record<string, { score: number; optionId: number }[]>;
  quiz?: Quiz;
  createdAt: string;
  updatedAt: string;
}
