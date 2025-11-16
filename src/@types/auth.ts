import { AxiosResponse } from "axios";

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export type AuthStateStorage = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LogoutRequest = {
  refreshToken: string;
};

export type AuthResponse = AxiosResponse<{
  user: User;
  tokens: {
    access: {
      token: string;
      expiresIn: number;
    };
    refresh: {
      token: string;
      expiresIn: number;
    };
  };
}>;

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  PSYCHOLOGIST = "PSYCHOLOGIST",
}
