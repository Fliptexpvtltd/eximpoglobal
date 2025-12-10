import api, { ApiResponse, PaginatedResponse } from './api';
import { API_ENDPOINTS } from '@/config/constants';

export interface RFQLineItem {
  productId?: string;
  productName: string;
  quantity: number;
  unit: string;
  specifications?: string;
  targetPrice?: number;
}

export interface RFQ {
  id: string;
  buyerId: string;
  buyerName?: string;
  title: string;
  description: string;
  lineItems: RFQLineItem[];
  targetPrice?: number;
  deliveryAddress: string;
  deliveryDate: string;
  paymentTerms: string;
  incoterm: string;
  certifications?: string[];
  documents?: string[];
  status: 'draft' | 'submitted' | 'quoted' | 'accepted' | 'rejected' | 'expired';
  quoteCount?: number;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRFQData {
  title: string;
  description: string;
  lineItems: RFQLineItem[];
  targetPrice?: number;
  deliveryAddress: string;
  deliveryDate: string;
  paymentTerms: string;
  incoterm: string;
  certifications?: string[];
  expiryDate: string;
}

export interface UpdateRFQData extends Partial<CreateRFQData> {
  status?: RFQ['status'];
}

export interface RFQFilters {
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class RFQService {
  // Get all RFQs (for sellers) or user's RFQs (for buyers)
  async getRFQs(filters?: RFQFilters): Promise<ApiResponse<PaginatedResponse<RFQ>>> {
    return api.get<PaginatedResponse<RFQ>>(API_ENDPOINTS.RFQ.LIST, filters);
  }

  // Get single RFQ by ID
  async getRFQById(id: string): Promise<ApiResponse<RFQ>> {
    return api.get<RFQ>(API_ENDPOINTS.RFQ.DETAIL(id));
  }

  // Create new RFQ
  async createRFQ(data: CreateRFQData): Promise<ApiResponse<RFQ>> {
    return api.post<RFQ>(API_ENDPOINTS.RFQ.CREATE, data);
  }

  // Update RFQ
  async updateRFQ(id: string, data: UpdateRFQData): Promise<ApiResponse<RFQ>> {
    return api.put<RFQ>(API_ENDPOINTS.RFQ.UPDATE(id), data);
  }

  // Delete RFQ
  async deleteRFQ(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.RFQ.DELETE(id));
  }

  // Submit RFQ (change status from draft to submitted)
  async submitRFQ(id: string): Promise<ApiResponse<RFQ>> {
    return api.post<RFQ>(API_ENDPOINTS.RFQ.SUBMIT(id));
  }
}

export const rfqService = new RFQService();
export default rfqService;
