import axiosInstance from "@/lib/axios";
import { AxiosResponse } from "axios";
import {
  Quiz,
  QuizListResponse,
  QuizResult,
  CreateQuizRequest,
  UpdateQuizRequest,
  SubmitQuizRequest,
} from "@/@types/quiz";

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
): Promise<AxiosResponse<Quiz>> => axiosInstance.get(`/quizzes/${quizId}`);

/**
 * Create a new quiz
 */
export const createQuiz = async (
  quizData: CreateQuizRequest
): Promise<AxiosResponse<Quiz>> => axiosInstance.post("/quizzes", quizData);

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
): Promise<AxiosResponse<void>> => axiosInstance.delete(`/quizzes/${quizId}`);

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
