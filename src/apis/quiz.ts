import axiosInstance from "@/lib/axios";
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
  userId?: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  totalScore: number;
  level: string;
  resultJson: {
    [key: string]: number;
  };
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

/**
 * Get all quizzes with pagination
 */
export const getQuizzes = async (
  page = 1,
  limit = 10
): Promise<QuizListResponse> =>
  await axiosInstance.get("/quizzes", {
    params: { page, limit },
  });

/**
 * Get a single quiz by ID
 */
export const getQuizById = async (
  quizId: string
): Promise<AxiosResponse<Quiz>> =>
  axiosInstance.get(`/quizzes/${quizId}`);

/**
 * Create a new quiz
 */
export const createQuiz = async (
  quizData: CreateQuizRequest
): Promise<AxiosResponse<Quiz>> =>
  axiosInstance.post("/quizzes", quizData);

/**
 * Update an existing quiz
 */
export const updateQuiz = async (
  quizId: string,
  quizData: UpdateQuizRequest
): Promise<AxiosResponse<Quiz>> =>
  axiosInstance.patch(`/quizzes/${quizId}`, quizData);

/**
 * Delete a quiz
 */
export const deleteQuiz = async (
  quizId: string
): Promise<AxiosResponse<void>> =>
  axiosInstance.delete(`/quizzes/${quizId}`);

/**
 * Submit quiz answers and get results
 */
export const submitQuiz = async (
  data: SubmitQuizRequest
): Promise<AxiosResponse<QuizResult>> =>
  axiosInstance.post(`/quizzes/submit`, data);

/**
 * Get quiz results for current user
 */
export const getMyResults = async (
  page = 1,
  limit = 10
): Promise<
  AxiosResponse<{
    data: QuizResult[];
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      totalItems: number;
    };
  }>
> =>
  axiosInstance.get("/quizzes/results/me", {
    params: { page, limit },
  });

/**
 * Get a specific quiz result
 */
export const getResultById = async (
  resultId: string
): Promise<AxiosResponse<QuizResult>> =>
  axiosInstance.get(`/quizzes/results/${resultId}`);

/**
 * Get all results for a specific quiz
 */
export const getQuizResults = async (
  quizId: string,
  page = 1,
  limit = 10
): Promise<
  AxiosResponse<{
    data: QuizResult[];
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      totalItems: number;
    };
  }>
> =>
  axiosInstance.get(`/quizzes/${quizId}/results`, {
    params: { page, limit },
  });
