import axiosInstance from "@/lib/axios";
import {
  Psychologist,
  PatientPsychologist,
  PsychologistNote,
  TreatmentPlan,
  RelationshipStatus,
  TreatmentPlanStatus,
} from "@/@types/psychologist";

// Profile
export const getProfile = () =>
  axiosInstance.get<Psychologist>("/psychologists/profile");

export const upsertProfile = (data: {
  specialization?: string;
  licenseNumber?: string;
  bio?: string;
  education?: string;
  experience?: number;
}) => axiosInstance.post<Psychologist>("/psychologists/profile", data);

// Search
export const searchPsychologists = (params?: {
  search?: string;
  specialization?: string;
  verified?: boolean;
  limit?: number;
  offset?: number;
}) =>
  axiosInstance.get<{ psychologists: Psychologist[]; total: number }>(
    "/psychologists/search",
    { params }
  );

// Relationships
export const connectPatient = (patientId: number) =>
  axiosInstance.post<PatientPsychologist>("/psychologists/patients", {
    patientId,
  });

export const getMyPatients = (status?: RelationshipStatus) =>
  axiosInstance.get<PatientPsychologist[]>("/psychologists/patients", {
    params: { status },
  });

export const getMyPsychologists = (status?: RelationshipStatus) =>
  axiosInstance.get<PatientPsychologist[]>("/psychologists/my-psychologists", {
    params: { status },
  });

export const updateRelationshipStatus = (
  relationshipId: number,
  status: RelationshipStatus
) =>
  axiosInstance.patch<PatientPsychologist>(
    `/psychologists/relationships/${relationshipId}/status`,
    { status }
  );

export const updatePermissions = (
  relationshipId: number,
  permissions: {
    canViewJournals?: boolean;
    canViewChats?: boolean;
    canViewAssessments?: boolean;
    shareAll?: boolean;
  }
) =>
  axiosInstance.patch(
    `/psychologists/relationships/${relationshipId}/permissions`,
    permissions
  );

// Notes
export const createNote = (data: {
  patientId: number;
  content: string;
  isPrivate?: boolean;
}) => axiosInstance.post<PsychologistNote>("/psychologists/notes", data);

export const getPatientNotes = (patientId: number) =>
  axiosInstance.get<PsychologistNote[]>(
    `/psychologists/notes/patient/${patientId}`
  );

export const updateNote = (
  noteId: number,
  data: { content?: string; isPrivate?: boolean }
) =>
  axiosInstance.patch<PsychologistNote>(`/psychologists/notes/${noteId}`, data);

export const deleteNote = (noteId: number) =>
  axiosInstance.delete(`/psychologists/notes/${noteId}`);

// Treatment Plans
export const createTreatmentPlan = (data: {
  patientId: number;
  title: string;
  description?: string;
  goals?: string[];
  tasks?: string[];
  startDate?: string;
  endDate?: string;
}) => axiosInstance.post<TreatmentPlan>("/psychologists/treatment-plans", data);

export const getPatientTreatmentPlans = (
  patientId: number,
  status?: TreatmentPlanStatus
) =>
  axiosInstance.get<TreatmentPlan[]>(
    `/psychologists/treatment-plans/patient/${patientId}`,
    { params: { status } }
  );

export const updateTreatmentPlan = (
  planId: number,
  data: Partial<TreatmentPlan>
) =>
  axiosInstance.patch<TreatmentPlan>(
    `/psychologists/treatment-plans/${planId}`,
    data
  );

export const deleteTreatmentPlan = (planId: number) =>
  axiosInstance.delete(`/psychologists/treatment-plans/${planId}`);

// Patient Overview
export const getPatientOverview = (patientId: number) =>
  axiosInstance.get(`/psychologists/patients/${patientId}/overview`);
