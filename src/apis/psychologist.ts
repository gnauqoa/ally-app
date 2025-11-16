import axiosInstance from '@/lib/axios';
import { 
  Psychologist, 
  PatientPsychologist, 
  PsychologistNote, 
  TreatmentPlan,
  RelationshipStatus,
  TreatmentPlanStatus
} from '@/@types/psychologist';

export const psychologistApi = {
  // Profile
  getProfile: () => axiosInstance.get<Psychologist>('/psychologists/profile'),
  
  upsertProfile: (data: {
    specialization?: string;
    licenseNumber?: string;
    bio?: string;
    education?: string;
    experience?: number;
  }) => axiosInstance.post<Psychologist>('/psychologists/profile', data),

  // Search
  searchPsychologists: (params?: {
    search?: string;
    specialization?: string;
    verified?: boolean;
    limit?: number;
    offset?: number;
  }) => axiosInstance.get<{ psychologists: Psychologist[]; total: number }>('/psychologists/search', { params }),

  // Relationships
  connectPatient: (patientId: number) => 
    axiosInstance.post<PatientPsychologist>('/psychologists/patients', { patientId }),

  getMyPatients: (status?: RelationshipStatus) => 
    axiosInstance.get<PatientPsychologist[]>('/psychologists/patients', { params: { status } }),

  getMyPsychologists: (status?: RelationshipStatus) => 
    axiosInstance.get<PatientPsychologist[]>('/psychologists/my-psychologists', { params: { status } }),

  updateRelationshipStatus: (relationshipId: number, status: RelationshipStatus) => 
    axiosInstance.patch<PatientPsychologist>(`/psychologists/relationships/${relationshipId}/status`, { status }),

  updatePermissions: (relationshipId: number, permissions: {
    canViewJournals?: boolean;
    canViewChats?: boolean;
    canViewAssessments?: boolean;
    shareAll?: boolean;
  }) => axiosInstance.patch(`/psychologists/relationships/${relationshipId}/permissions`, permissions),

  // Notes
  createNote: (data: { patientId: number; content: string; isPrivate?: boolean }) => 
    axiosInstance.post<PsychologistNote>('/psychologists/notes', data),

  getPatientNotes: (patientId: number) => 
    axiosInstance.get<PsychologistNote[]>(`/psychologists/notes/patient/${patientId}`),

  updateNote: (noteId: number, data: { content?: string; isPrivate?: boolean }) => 
    axiosInstance.patch<PsychologistNote>(`/psychologists/notes/${noteId}`, data),

  deleteNote: (noteId: number) => 
    axiosInstance.delete(`/psychologists/notes/${noteId}`),

  // Treatment Plans
  createTreatmentPlan: (data: {
    patientId: number;
    title: string;
    description?: string;
    goals?: string[];
    tasks?: string[];
    startDate?: string;
    endDate?: string;
  }) => axiosInstance.post<TreatmentPlan>('/psychologists/treatment-plans', data),

  getPatientTreatmentPlans: (patientId: number, status?: TreatmentPlanStatus) => 
    axiosInstance.get<TreatmentPlan[]>(`/psychologists/treatment-plans/patient/${patientId}`, { params: { status } }),

  updateTreatmentPlan: (planId: number, data: Partial<TreatmentPlan>) => 
    axiosInstance.patch<TreatmentPlan>(`/psychologists/treatment-plans/${planId}`, data),

  deleteTreatmentPlan: (planId: number) => 
    axiosInstance.delete(`/psychologists/treatment-plans/${planId}`),

  // Patient Overview
  getPatientOverview: (patientId: number) => 
    axiosInstance.get(`/psychologists/patients/${patientId}/overview`),
};

