import api from '@/lib/api';
import type {
  CreateAppointmentRequest,
  AppointmentResponse,
} from '@/types';

export const appointmentService = {
  async create(data: CreateAppointmentRequest): Promise<AppointmentResponse> {
    const res = await api.post<AppointmentResponse>('/api/appointments', data);
    return res.data;
  },

  async getByPatient(patientId: string): Promise<AppointmentResponse[]> {
    const res = await api.get<AppointmentResponse[]>(`/api/appointments/patient/${patientId}`);
    return res.data;
  },

  async getByDoctor(doctorId: string): Promise<AppointmentResponse[]> {
    const res = await api.get<AppointmentResponse[]>(`/api/appointments/doctor/${doctorId}`);
    return res.data;
  },

  async getById(id: string): Promise<AppointmentResponse> {
    const res = await api.get<AppointmentResponse>(`/api/appointments/${id}`);
    return res.data;
  },

  async accept(id: string): Promise<AppointmentResponse> {
    const res = await api.put<AppointmentResponse>(`/api/appointments/${id}/accept`);
    return res.data;
  },

  async cancel(id: string): Promise<AppointmentResponse> {
    const res = await api.put<AppointmentResponse>(`/api/appointments/${id}/cancel`);
    return res.data;
  },

  async complete(id: string): Promise<AppointmentResponse> {
    const res = await api.put<AppointmentResponse>(`/api/appointments/${id}/complete`);
    return res.data;
  },
};
