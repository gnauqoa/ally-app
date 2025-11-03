import { AxiosResponse } from "axios";

export type PaginationMeta = {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
};

export type PaginationResponse<T> = AxiosResponse<{
  data: T[];
  pagination: PaginationMeta;
}>;
