import { PaginationResponse } from "@/@types/api";
import { ChatMessage, ChatSession } from "@/@types/chat";
import axiosInstance from "@/lib/axios";
import { AxiosResponse } from "axios";

export const getChatSessions = (): Promise<PaginationResponse<ChatSession>> =>
  axiosInstance.get("/chat");

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
