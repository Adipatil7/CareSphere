import api from '@/lib/api';
import type { StartConsultRequest, ConsultSessionResponse } from '@/types';

export const consultationService = {
  async start(data: StartConsultRequest): Promise<ConsultSessionResponse> {
    const res = await api.post<ConsultSessionResponse>('/api/consultations/start', data);
    return res.data;
  },

  async end(roomId: string): Promise<ConsultSessionResponse> {
    const res = await api.post<ConsultSessionResponse>(`/api/consultations/end/${roomId}`);
    return res.data;
  },
};
