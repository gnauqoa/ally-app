import axiosInstance from "@/lib/axios";
import { AxiosResponse } from "axios";
import { Result, HistoricalResults, ResultComparison } from "@/@types/result";
import { PaginationResponse } from "@/@types/api";

/**
 * Get all user results with pagination
 */
export const getMyResults = async (
  page = 1,
  limit = 10,
  code?: string
): Promise<PaginationResponse<Result>> => {
  const params: any = { page, limit };
  if (code) params.code = code;
  return axiosInstance.get("/results", { params });
};

/**
 * Get a single result by ID
 */
export const getResultById = async (
  resultId: number
): Promise<AxiosResponse<Result>> => 
  axiosInstance.get(`/results/${resultId}`);

/**
 * Get historical results for a quiz
 */
export const getHistoricalResults = async (
  quizId: number
): Promise<AxiosResponse<HistoricalResults>> =>
  axiosInstance.get(`/results/quiz/${quizId}/history`);

/**
 * Compare two results
 */
export const compareResults = async (
  resultId: number,
  compareWithId: number
): Promise<AxiosResponse<ResultComparison>> =>
  axiosInstance.get(`/results/${resultId}/compare/${compareWithId}`);

/**
 * Get result history for all quizzes
 */
export const getQuizResultsHistory = async (): Promise<
  AxiosResponse<HistoricalResults[]>
> => axiosInstance.get("/results/history");

