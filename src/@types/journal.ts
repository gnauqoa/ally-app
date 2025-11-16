export enum JournalStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  ANALYZED = 'ANALYZED'
}

export enum Sentiment {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE',
  VERY_NEGATIVE = 'VERY_NEGATIVE'
}

export interface JournalAnalysis {
  id: number;
  journalId: number;
  sentiment: Sentiment;
  emotionScore?: number;
  identifiedIssues?: string[];
  aiRecommendations?: string;
  aiSummary?: string;
  createdAt: string;
}

export interface Journal {
  id: number;
  userId: number;
  date: string;
  title?: string;
  content: string;
  wordCount?: number;
  writingDuration?: number;
  status: JournalStatus;
  createdAt: string;
  updatedAt: string;
  analysis?: JournalAnalysis;
}

export interface JournalReminder {
  id: number;
  userId: number;
  time: string;
  enabled: boolean;
  days: number[];
  createdAt: string;
  updatedAt: string;
}

export interface EmotionTrend {
  date: string;
  sentiment?: Sentiment;
  emotionScore?: number;
}

export interface JournalStats {
  totalEntries: number;
  analyzedEntries: number;
  sentiments: Record<string, number>;
}

