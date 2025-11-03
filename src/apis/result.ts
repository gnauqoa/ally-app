import axiosInstance from "@/lib/axios";
import { Result } from "@/@types/result";
import { PaginationResponse } from "@/@types/api";
import { AxiosResponse } from "axios";

/**
 * Get quiz results for current user
 */
export const getMyResults = async (
  page = 1,
  limit = 10,
  code = ""
): Promise<PaginationResponse<Result>> =>
  await axiosInstance.get("/results", {
    params: { page, limit, code },
  });

/**
 * Get a specific quiz result
 */
export const getResultById = async (
  resultId: string
): Promise<AxiosResponse<Result>> =>
  await axiosInstance.get(`/results/${resultId}`);
