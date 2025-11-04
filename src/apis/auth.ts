// src/services/auth.service.ts
import { AuthResponse, RegisterRequest, LogoutRequest, User } from "@/@types/auth";
import { LoginRequest } from "@/@types/auth";
import axiosInstance from "@/lib/axios";
import { AxiosResponse } from "axios";

export const login = async (credentials: LoginRequest): Promise<AuthResponse> =>
  axiosInstance.post("/auth/login", credentials);

export const register = async (credentials: RegisterRequest): Promise<AuthResponse> =>
  axiosInstance.post("/auth/register", credentials);

export const getProfile = async (): Promise<AxiosResponse<User>> =>
  axiosInstance.get("/auth/me");

export const logout = async (credentials: LogoutRequest): Promise<void> =>
  axiosInstance.post("/auth/logout", credentials);
