export enum ChatSessionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  NEEDS_FOLLOW_UP = 'NEEDS_FOLLOW_UP'
}

export enum PriorityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ConsultationMetadata {
  id: number;
  sessionId: number;
  problemCategory?: string;
  priorityLevel?: PriorityLevel;
  needsSpecialist: boolean;
  relatedAssessments?: string[];
  aiSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmotionalFeedback {
  id: number;
  sessionId: number;
  userId: number;
  rating: number;
  feelingBetter?: boolean;
  comment?: string;
  createdAt: string;
}

export interface ChatStats {
  totalSessions: number;
  byStatus: Record<string, number>;
  commonProblems: Record<string, number>;
}

