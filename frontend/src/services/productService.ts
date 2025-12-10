import api, { ApiResponse, PaginatedResponse } from './api';
import { API_ENDPOINTS } from '@/config/constants';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  supplierId: string;
  supplierName: string;
  supplierCountry: string;
  moq: number;
  moqUnit: string;
  price: number;
  priceUnit: string;
  leadTime: string;
  certifications: string[];
  images: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  certifications?: string[];
  origin?: string;
  inStock?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
}

class ProductService {
  // Get all products with filters
  async getProducts(filters?: ProductFilters): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return api.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS.LIST, filters);
  }

  // Get single product by ID
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return api.get<Product>(API_ENDPOINTS.PRODUCTS.DETAIL(id));
  }

  // Search products
  async searchProducts(query: string, filters?: Omit<ProductFilters, 'search'>): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return api.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS.SEARCH, {
      q: query,
      ...filters,
    });
  }

  // Get product categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return api.get<Category[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES);
  }

  // Get products by category
  async getProductsByCategory(category: string, filters?: Omit<ProductFilters, 'category'>): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return api.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS.BY_CATEGORY(category), filters);
  }
}

export const productService = new ProductService();
export default productService;
