import api, { ApiResponse, PaginatedResponse } from './api';
import { API_ENDPOINTS } from '@/config/constants';
import { Product } from './productService';

export interface Supplier {
  id: string;
  companyName: string;
  email: string;
  country: string;
  city?: string;
  address?: string;
  phone?: string;
  website?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  establishedYear?: number;
  employeeCount?: string;
  certifications: string[];
  categories: string[];
  images?: string[];
  rating?: number;
  reviewCount?: number;
  responseRate?: number;
  responseTime?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierReview {
  id: string;
  supplierId: string;
  buyerId: string;
  buyerName: string;
  orderId?: string;
  rating: number;
  comment: string;
  productQuality: number;
  communication: number;
  shipping: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierFilters {
  country?: string;
  category?: string;
  certifications?: string[];
  verified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class SupplierService {
  // Get all suppliers
  async getSuppliers(filters?: SupplierFilters): Promise<ApiResponse<PaginatedResponse<Supplier>>> {
    return api.get<PaginatedResponse<Supplier>>(API_ENDPOINTS.SUPPLIERS.LIST, filters);
  }

  // Get single supplier by ID
  async getSupplierById(id: string): Promise<ApiResponse<Supplier>> {
    return api.get<Supplier>(API_ENDPOINTS.SUPPLIERS.DETAIL(id));
  }

  // Get supplier profile (current user)
  async getProfile(): Promise<ApiResponse<Supplier>> {
    return api.get<Supplier>(API_ENDPOINTS.SUPPLIERS.PROFILE);
  }

  // Update supplier profile
  async updateProfile(data: Partial<Supplier>): Promise<ApiResponse<Supplier>> {
    return api.put<Supplier>(API_ENDPOINTS.SUPPLIERS.UPDATE_PROFILE, data);
  }

  // Get supplier reviews
  async getSupplierReviews(supplierId: string): Promise<ApiResponse<SupplierReview[]>> {
    return api.get<SupplierReview[]>(API_ENDPOINTS.SUPPLIERS.REVIEWS(supplierId));
  }

  // Get supplier products
  async getSupplierProducts(supplierId: string, filters?: { page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return api.get<PaginatedResponse<Product>>(API_ENDPOINTS.SUPPLIERS.PRODUCTS(supplierId), filters);
  }
}

export const supplierService = new SupplierService();
export default supplierService;
