import api from '@/lib/api';
import type { InventoryResponse } from '@/types';

export const pharmacyService = {
  async searchMedicine(name: string): Promise<InventoryResponse[]> {
    const res = await api.get<InventoryResponse[]>(`/api/pharmacy/inventory/${encodeURIComponent(name)}`);
    return res.data;
  },
};
