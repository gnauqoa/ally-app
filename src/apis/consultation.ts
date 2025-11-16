import axiosInstance from "@/lib/axios";
import { EmotionalFeedback, ChatStats } from "@/@types/consultation";
import { ChatSession } from "@/@types/chat";

export const consultationApi = {
  // Analyze session
  analyzeSession: (sessionId: number) =>
    axiosInstance.post<ChatSession>(`/chat/${sessionId}/analyze`),

  // Generate summary
  generateSummary: (sessionId: number) =>
    axiosInstance.post<{ summary: string }>(`/chat/${sessionId}/summary`),

  // Add emotional feedback
  addFeedback: (
    sessionId: number,
    data: {
      rating: number;
      feelingBetter?: boolean;
      comment?: string;
    }
  ) =>
    axiosInstance.post<EmotionalFeedback>(`/chat/${sessionId}/feedback`, data),

  // Get feedback
  getFeedback: (sessionId: number) =>
    axiosInstance.get<EmotionalFeedback[]>(`/chat/${sessionId}/feedback`),

  // Get chat stats
  getChatStats: () => axiosInstance.get<ChatStats>("/chat/stats"),
};
