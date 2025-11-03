import axiosInstance from "@/lib/axios";
import { AxiosResponse } from "axios";
import {
  Quiz,
  QuizListResponse,
  QuizResult,
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
 * Submit quiz answers and get results
 */
export const submitQuiz = async (
  data: SubmitQuizRequest
): Promise<AxiosResponse<QuizResult>> =>
  axiosInstance.post(`/quizzes/submit`, data);
