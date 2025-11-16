import { User } from "./auth";
import { ChatSessionStatus, ConsultationMetadata } from "./consultation";

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
  status?: ChatSessionStatus;
  metadata?: ConsultationMetadata;
  createdAt: Date;
  updatedAt: Date;
};

export type ChatMessage = {
  id: number;
  content: string;
  sessionId: number;
  session?: ChatSession;
  role: ChatMessageRole;
  sentiment?: string;
  createdAt: Date;
  updatedAt: Date;
};
