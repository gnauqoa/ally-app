import axiosInstance from '@/lib/axios';
import { Journal, JournalReminder, EmotionTrend, JournalStats, JournalStatus } from '@/@types/journal';

export const journalApi = {
  // Create journal entry
  createJournal: (data: {
    date: string;
    title?: string;
    content: string;
    wordCount?: number;
    writingDuration?: number;
    status?: JournalStatus;
  }) => axiosInstance.post<Journal>('/journals', data),

  // Get all journals
  getJournals: (params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => axiosInstance.get<{ journals: Journal[]; total: number }>('/journals', { params }),

  // Get journal by ID
  getJournalById: (id: number) => axiosInstance.get<Journal>(`/journals/${id}`),

  // Get journal by date
  getJournalByDate: (date: string) => axiosInstance.get<Journal>(`/journals/date/${date}`),

  // Update journal
  updateJournal: (id: number, data: Partial<Journal>) => 
    axiosInstance.patch<Journal>(`/journals/${id}`, data),

  // Delete journal
  deleteJournal: (id: number) => axiosInstance.delete(`/journals/${id}`),

  // Analyze journal
  analyzeJournal: (id: number) => 
    axiosInstance.post<Journal>(`/journals/${id}/analyze`),

  // Get emotion trend
  getEmotionTrend: (days?: number) => 
    axiosInstance.get<EmotionTrend[]>('/journals/trend', { params: { days } }),

  // Get journal stats
  getJournalStats: () => axiosInstance.get<JournalStats>('/journals/stats'),

  // Generate prompts
  generatePrompts: () => 
    axiosInstance.get<{ prompts: string[] }>('/journals/prompts'),

  // Reminders
  upsertReminder: (data: { time: string; enabled?: boolean; days: number[] }) => 
    axiosInstance.post<JournalReminder>('/journals/reminders', data),

  getReminders: () => 
    axiosInstance.get<JournalReminder[]>('/journals/reminders'),

  deleteReminder: (id: number) => 
    axiosInstance.delete(`/journals/reminders/${id}`),
};

