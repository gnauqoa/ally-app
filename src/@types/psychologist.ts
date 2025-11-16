export enum RelationshipStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum TreatmentPlanStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Psychologist {
  id: number;
  userId: number;
  specialization?: string;
  licenseNumber?: string;
  bio?: string;
  education?: string;
  experience?: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name?: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };
}

export interface PatientPermission {
  id: number;
  relationshipId: number;
  canViewJournals: boolean;
  canViewChats: boolean;
  canViewAssessments: boolean;
  shareAll: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientPsychologist {
  id: number;
  patientId: number;
  psychologistId: number;
  status: RelationshipStatus;
  connectedAt: string;
  createdAt: string;
  updatedAt: string;
  psychologist?: Psychologist;
  patient?: {
    id: number;
    name?: string;
    email: string;
    gender?: string;
    birthYear?: number;
    profileImage?: string;
  };
  permission?: PatientPermission;
}

export interface PsychologistNote {
  id: number;
  psychologistId: number;
  patientId: number;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentPlan {
  id: number;
  psychologistId: number;
  patientId: number;
  title: string;
  description?: string;
  goals?: string[];
  tasks?: string[];
  status: TreatmentPlanStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

