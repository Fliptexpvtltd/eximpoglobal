import api, { ApiResponse } from './api';
import { API_ENDPOINTS } from '@/config/constants';

export interface BuyerAnalytics {
  totalSpend: number;
  totalOrders: number;
  activeRFQs: number;
  activeSuppliers: number;
  spendByCategory: Array<{ category: string; amount: number }>;
  monthlySpend: Array<{ month: string; amount: number }>;
  topSuppliers: Array<{ 
    supplierId: string;
    supplierName: string;
    totalOrders: number;
    totalSpend: number;
  }>;
  countryDistribution: Array<{ country: string; count: number }>;
}

export interface SellerAnalytics {
  totalRevenue: number;
  totalOrders: number;
  activeRFQs: number;
  activeProducts: number;
  revenueByCategory: Array<{ category: string; revenue: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    unitsSold: number;
    revenue: number;
  }>;
  topBuyers: Array<{
    buyerId: string;
    buyerName: string;
    totalOrders: number;
    totalRevenue: number;
  }>;
  ordersByStatus: Array<{ status: string; count: number }>;
}

export interface SpendAnalytics {
  period: string;
  startDate: string;
  endDate: string;
  totalSpend: number;
  categories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export interface PerformanceMetrics {
  averageOrderValue: number;
  orderFulfillmentRate: number;
  averageDeliveryTime: number;
  customerSatisfactionScore: number;
  repeatOrderRate: number;
  conversionRate: number;
}

class AnalyticsService {
  // Get buyer analytics
  async getBuyerAnalytics(period?: string): Promise<ApiResponse<BuyerAnalytics>> {
    return api.get<BuyerAnalytics>(API_ENDPOINTS.ANALYTICS.BUYER, { period });
  }

  // Get seller analytics
  async getSellerAnalytics(period?: string): Promise<ApiResponse<SellerAnalytics>> {
    return api.get<SellerAnalytics>(API_ENDPOINTS.ANALYTICS.SELLER, { period });
  }

  // Get spend analytics
  async getSpendAnalytics(startDate?: string, endDate?: string): Promise<ApiResponse<SpendAnalytics>> {
    return api.get<SpendAnalytics>(API_ENDPOINTS.ANALYTICS.SPEND, {
      startDate,
      endDate,
    });
  }

  // Get performance metrics
  async getPerformanceMetrics(): Promise<ApiResponse<PerformanceMetrics>> {
    return api.get<PerformanceMetrics>(API_ENDPOINTS.ANALYTICS.PERFORMANCE);
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
