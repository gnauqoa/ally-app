import { Quiz } from "./quiz";

export type ResultJson = {
  questionId: number;
  score: number;
  optionId: number[];
};

export interface Result {
  id: number;
  quizId: number;
  userId: number;
  totalScore: number;
  level: string;
  resultJson: ResultJson[];
  interpretation?: string;
  recommendations?: string[];
  previousResultId?: number;
  comparisonWithPrevious?: string;
  historicalTrend?: {
    improving: boolean;
    analysis: string;
  };
  quiz?: Quiz;
  createdAt: string;
  updatedAt: string;
}

export interface HistoricalResults {
  quizCode: string;
  quizName: string;
  results: Result[];
  trend?: {
    improving: boolean;
    analysis: string;
  };
}

export interface ResultComparison {
  current: Result;
  previous: Result;
  comparison: {
    scoreChange: number;
    percentageChange: number;
    analysis: string;
  };
}
