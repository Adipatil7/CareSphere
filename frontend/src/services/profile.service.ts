import api from '@/lib/api';
import type {
  DoctorProfileResponse,
  DoctorSearchResponse,
  DoctorAvailabilityResponse,
  UpdateDoctorProfileRequest,
} from '@/types';

export const profileService = {
  async getProfile(userId: string): Promise<DoctorProfileResponse> {
    const res = await api.get(`/api/profiles/profiles/${userId}`);
    return res.data;
  },

  async updateDoctorProfile(
    userId: string,
    data: UpdateDoctorProfileRequest
  ): Promise<DoctorProfileResponse> {
    const res = await api.put<DoctorProfileResponse>(
      `/api/profiles/profiles/doctor/${userId}`,
      data
    );
    return res.data;
  },

  async searchDoctors(specialization: string): Promise<DoctorSearchResponse[]> {
    const res = await api.get<DoctorSearchResponse[]>('/api/profiles/doctors/search', {
      params: { specialization },
    });
    return res.data;
  },

  async getDoctorAvailability(doctorId: string): Promise<DoctorAvailabilityResponse[]> {
    const res = await api.get<DoctorAvailabilityResponse[]>(
      `/api/profiles/doctors/${doctorId}/availability`
    );
    return res.data;
  },
};
