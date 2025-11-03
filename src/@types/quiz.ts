import { AxiosResponse } from "axios";

export interface QuizOption {
  id: number;
  questionId: number;
  text: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: number;
  quizId: number;
  order: number;
  text: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  options: QuizOption[];
}

export interface Quiz {
  id: number;
  code: string;
  name: string;
  description: string;
  totalQuestions: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  questions?: QuizQuestion[];
  results?: QuizResult[];
  userId?: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  totalScore: number;
  level: string;
  resultJson: Record<string, { score: number; optionId: number }[]>;
  quiz: Quiz;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizOptionRequest {
  text: string;
  score: number;
}

export interface CreateQuizQuestionRequest {
  order: number;
  text: string;
  type: string;
  options: CreateQuizOptionRequest[];
}

export interface CreateQuizRequest {
  code: string;
  name: string;
  description: string;
  category: string;
  questions?: CreateQuizQuestionRequest[];
}

export interface UpdateQuizRequest {
  code?: string;
  name?: string;
  description?: string;
  category?: string;
  questions?: CreateQuizQuestionRequest[];
}

export interface QuizAnswer {
  questionId: number;
  selectedOptionIds: number[];
}

export interface SubmitQuizRequest {
  quizId: number;
  answers: QuizAnswer[];
}

export type QuizListResponse = AxiosResponse<{
  data: Quiz[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}>;
