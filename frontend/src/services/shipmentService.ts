import api, { ApiResponse, PaginatedResponse } from './api';
import { API_ENDPOINTS } from '@/config/constants';

export interface ShipmentLocation {
  location: string;
  timestamp: string;
  status: string;
  description?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'customs' | 'out_for_delivery' | 'delivered' | 'delayed';
  origin: string;
  destination: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  currentLocation?: string;
  trackingHistory: ShipmentLocation[];
  documents?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentFilters {
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class ShipmentService {
  // Get all shipments
  async getShipments(filters?: ShipmentFilters): Promise<ApiResponse<PaginatedResponse<Shipment>>> {
    return api.get<PaginatedResponse<Shipment>>(API_ENDPOINTS.SHIPMENTS.LIST, filters);
  }

  // Get single shipment by ID
  async getShipmentById(id: string): Promise<ApiResponse<Shipment>> {
    return api.get<Shipment>(API_ENDPOINTS.SHIPMENTS.DETAIL(id));
  }

  // Track shipment by tracking number
  async trackShipment(trackingNumber: string): Promise<ApiResponse<Shipment>> {
    return api.get<Shipment>(API_ENDPOINTS.SHIPMENTS.TRACK(trackingNumber));
  }

  // Update shipment (sellers only)
  async updateShipment(id: string, data: Partial<Shipment>): Promise<ApiResponse<Shipment>> {
    return api.put<Shipment>(API_ENDPOINTS.SHIPMENTS.UPDATE(id), data);
  }
}

export const shipmentService = new ShipmentService();
export default shipmentService;
