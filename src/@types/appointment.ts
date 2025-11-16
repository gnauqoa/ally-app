export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export interface Appointment {
  id: number;
  psychologistId: number;
  patientId: number;
  scheduledAt: string;
  duration: number;
  status: AppointmentStatus;
  notes?: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
  psychologist?: {
    id: number;
    user: {
      id: number;
      name?: string;
      email: string;
      profileImage?: string;
    };
  };
  patient?: {
    id: number;
    name?: string;
    email: string;
    profileImage?: string;
  };
}

