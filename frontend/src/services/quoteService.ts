import api, { ApiResponse, PaginatedResponse } from './api';
import { API_ENDPOINTS } from '@/config/constants';

export interface QuoteLineItem {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  specifications?: string;
  leadTime?: string;
}

export interface Quote {
  id: string;
  rfqId: string;
  rfqTitle?: string;
  sellerId: string;
  sellerName: string;
  sellerCountry?: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  paymentTerms: string;
  incoterm: string;
  leadTime: string;
  validUntil: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  certifications?: string[];
  documents?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuoteData {
  rfqId: string;
  lineItems: QuoteLineItem[];
  shippingCost: number;
  tax: number;
  paymentTerms: string;
  incoterm: string;
  leadTime: string;
  validUntil: string;
  notes?: string;
  certifications?: string[];
}

export interface QuoteFilters {
  rfqId?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class QuoteService {
  // Get all quotes (sellers see their own, buyers see quotes for their RFQs)
  async getQuotes(filters?: QuoteFilters): Promise<ApiResponse<PaginatedResponse<Quote>>> {
    return api.get<PaginatedResponse<Quote>>(API_ENDPOINTS.QUOTES.LIST, filters);
  }

  // Get single quote by ID
  async getQuoteById(id: string): Promise<ApiResponse<Quote>> {
    return api.get<Quote>(API_ENDPOINTS.QUOTES.DETAIL(id));
  }

  // Get quotes for a specific RFQ
  async getQuotesByRFQ(rfqId: string): Promise<ApiResponse<Quote[]>> {
    return api.get<Quote[]>(API_ENDPOINTS.QUOTES.BY_RFQ(rfqId));
  }

  // Create new quote (sellers only)
  async createQuote(data: CreateQuoteData): Promise<ApiResponse<Quote>> {
    return api.post<Quote>(API_ENDPOINTS.QUOTES.CREATE, data);
  }

  // Update quote (sellers only, before acceptance)
  async updateQuote(id: string, data: Partial<CreateQuoteData>): Promise<ApiResponse<Quote>> {
    return api.put<Quote>(API_ENDPOINTS.QUOTES.UPDATE(id), data);
  }

  // Accept quote (buyers only)
  async acceptQuote(id: string): Promise<ApiResponse<Quote>> {
    return api.post<Quote>(API_ENDPOINTS.QUOTES.ACCEPT(id));
  }

  // Reject quote (buyers only)
  async rejectQuote(id: string, reason?: string): Promise<ApiResponse<Quote>> {
    return api.post<Quote>(API_ENDPOINTS.QUOTES.REJECT(id), { reason });
  }
}

export const quoteService = new QuoteService();
export default quoteService;
