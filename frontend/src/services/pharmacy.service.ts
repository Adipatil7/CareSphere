import api from '@/lib/api';
import type {
  InventoryResponse,
  AddInventoryRequest,
  UpdateInventoryRequest,
  FulfillmentResponse,
} from '@/types';

export const pharmacyService = {
  async searchMedicine(name: string): Promise<InventoryResponse[]> {
    const res = await api.get<InventoryResponse[]>(`/api/pharmacy/inventory/${encodeURIComponent(name)}`);
    return res.data;
  },

  async getChemistInventory(chemistId: string): Promise<InventoryResponse[]> {
    const res = await api.get<InventoryResponse[]>(`/api/pharmacy/inventory/chemist/${chemistId}`);
    return res.data;
  },

  async addInventory(data: AddInventoryRequest): Promise<InventoryResponse> {
    const res = await api.post<InventoryResponse>('/api/pharmacy/inventory', data);
    return res.data;
  },

  async updateInventory(data: UpdateInventoryRequest): Promise<InventoryResponse> {
    const res = await api.put<InventoryResponse>('/api/pharmacy/inventory/update', data);
    return res.data;
  },

  async fulfillPrescription(prescriptionId: string, chemistId: string): Promise<FulfillmentResponse> {
    const res = await api.post<FulfillmentResponse>(
      `/api/pharmacy/prescriptions/${prescriptionId}/fulfill`,
      { chemistId }
    );
    return res.data;
  },

  async getFulfillmentStatus(prescriptionId: string): Promise<FulfillmentResponse> {
    const res = await api.get<FulfillmentResponse>(`/api/pharmacy/prescriptions/${prescriptionId}/status`);
    return res.data;
  },
};
