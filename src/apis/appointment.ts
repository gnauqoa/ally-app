import axiosInstance from '@/lib/axios';
import { Appointment, AppointmentStatus } from '@/@types/appointment';

export const appointmentApi = {
  createAppointment: (data: {
    patientId: number;
    scheduledAt: string;
    duration?: number;
    notes?: string;
    meetingLink?: string;
  }) => axiosInstance.post<Appointment>('/appointments', data),

  getPsychologistAppointments: (params?: {
    patientId?: number;
    status?: AppointmentStatus;
    from?: string;
    to?: string;
  }) => axiosInstance.get<Appointment[]>('/appointments/psychologist', { params }),

  getPatientAppointments: (params?: {
    psychologistId?: number;
    status?: AppointmentStatus;
    from?: string;
    to?: string;
  }) => axiosInstance.get<Appointment[]>('/appointments/patient', { params }),

  updateAppointment: (id: number, data: Partial<Appointment>) => 
    axiosInstance.patch<Appointment>(`/appointments/${id}`, data),

  cancelAppointment: (id: number, role?: 'psychologist' | 'patient') => 
    axiosInstance.post<Appointment>(`/appointments/${id}/cancel`, null, { params: { role } }),
};

