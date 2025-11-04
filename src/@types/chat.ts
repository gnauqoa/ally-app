import { User } from "./auth";

export enum ChatMessageRole {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
  SYSTEM = "SYSTEM",
}

export type ChatSession = {
  id: number;
  title: string;
  userId: string;
  user?: User;
  messages?: ChatMessage[];
  totalMessages: number;
  latestMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ChatMessage = {
  id: number;
  content: string;
  sessionId: number;
  session?: ChatSession;
  role: ChatMessageRole;
  createdAt: Date;
  updatedAt: Date;
};
