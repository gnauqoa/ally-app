import { PaginationResponse } from "@/@types/api";
import { ChatMessage, ChatSession } from "@/@types/chat";
import { ChatSessionStatus, ChatStats, EmotionalFeedback } from "@/@types/consultation";
import axiosInstance from "@/lib/axios";
import { AxiosResponse } from "axios";

export const getChatSessions = (status?: ChatSessionStatus): Promise<PaginationResponse<ChatSession>> =>
  axiosInstance.get("/chat", { params: status ? { status } : {} });

export const createChatSession = ({
  title,
  content,
  modelContent,
}: {
  title: string;
  content: string;
  modelContent: string;
}): Promise<AxiosResponse<ChatSession>> =>
  axiosInstance.post("/chat", { title, content, modelContent });

export const updateChatSession = ({
  sessionId,
  title,
}: {
  sessionId: number;
  title: string;
}): Promise<AxiosResponse<ChatSession>> =>
  axiosInstance.patch(`/chat/${sessionId}`, { title });

export const deleteChatSession = (
  sessionId: number
): Promise<AxiosResponse<void>> => axiosInstance.delete(`/chat/${sessionId}`);

export const createChatMessage = async ({
  sessionId,
  content,
  modelContent,
}: {
  sessionId: number;
  content: string;
  modelContent: string;
}): Promise<AxiosResponse<ChatMessage[]>> =>
  axiosInstance.post(`/chat/${sessionId}/messages`, {
    content,
    modelContent,
  });

export const getChatSessionMessages = (
  sessionId: number
): Promise<AxiosResponse<ChatSession>> =>
  axiosInstance.get(`/chat/${sessionId}`);

export const analyzeSession = (sessionId: number): Promise<AxiosResponse<ChatSession>> =>
  axiosInstance.post(`/chat/${sessionId}/analyze`);

export const generateSummary = (sessionId: number): Promise<AxiosResponse<ChatSession>> =>
  axiosInstance.post(`/chat/${sessionId}/summary`);

export const addEmotionalFeedback = (
  sessionId: number,
  data: {
    rating: number;
    feelingBetter?: boolean;
    comment?: string;
  }
): Promise<AxiosResponse<EmotionalFeedback>> =>
  axiosInstance.post(`/chat/${sessionId}/feedback`, data);

export const getEmotionalFeedback = (
  sessionId: number
): Promise<AxiosResponse<EmotionalFeedback>> =>
  axiosInstance.get(`/chat/${sessionId}/feedback`);

export const getChatStats = (): Promise<AxiosResponse<ChatStats>> =>
  axiosInstance.get('/chat/stats');
