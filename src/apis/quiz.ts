import axiosInstance from "@/lib/axios";
import { AxiosResponse } from "axios";
import { Quiz, SubmitQuizRequest } from "@/@types/quiz";
import { Result } from "@/@types/result";
import { PaginationResponse } from "@/@types/api";

/**
 * Get all quizzes with pagination
 */
export const getQuizzes = async (
  page = 1,
  limit = 10
): Promise<PaginationResponse<Quiz>> =>
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
): Promise<AxiosResponse<Result>> =>
  axiosInstance.post(`/quizzes/submit`, data);
