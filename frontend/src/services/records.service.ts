import api from '@/lib/api';
import type {
  CreateVisitRequest,
  VisitResponse,
  CreatePrescriptionRequest,
  PrescriptionResponse,
} from '@/types';

export const recordsService = {
  async createVisit(data: CreateVisitRequest): Promise<VisitResponse> {
    const res = await api.post<VisitResponse>('/api/records/visits', data);
    return res.data;
  },

  async getPatientRecords(patientId: string): Promise<VisitResponse[]> {
    const res = await api.get<VisitResponse[]>(`/api/records/patients/${patientId}/records`);
    return res.data;
  },

  async createPrescription(data: CreatePrescriptionRequest): Promise<PrescriptionResponse> {
    const res = await api.post<PrescriptionResponse>('/api/records/prescriptions', data);
    return res.data;
  },

  async getPrescription(id: string): Promise<PrescriptionResponse> {
    const res = await api.get<PrescriptionResponse>(`/api/records/prescriptions/${id}`);
    return res.data;
  },
};
