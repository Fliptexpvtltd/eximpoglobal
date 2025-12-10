import api, { ApiResponse, PaginatedResponse } from './api';
import { API_ENDPOINTS } from '@/config/constants';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  specifications?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  rfqId?: string;
  quoteId?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  depositAmount: number;
  depositPaid: boolean;
  finalPaymentAmount: number;
  finalPaymentPaid: boolean;
  paymentTerms: string;
  incoterm: string;
  deliveryAddress: string;
  deliveryDate: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  documents?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  quoteId: string;
  deliveryAddress: string;
  deliveryDate: string;
  notes?: string;
}

export interface UpdateOrderStatusData {
  status: Order['status'];
  notes?: string;
}

export interface OrderFilters {
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class OrderService {
  // Get all orders
  async getOrders(filters?: OrderFilters): Promise<ApiResponse<PaginatedResponse<Order>>> {
    return api.get<PaginatedResponse<Order>>(API_ENDPOINTS.ORDERS.LIST, filters);
  }

  // Get single order by ID
  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return api.get<Order>(API_ENDPOINTS.ORDERS.DETAIL(id));
  }

  // Create new order from quote
  async createOrder(data: CreateOrderData): Promise<ApiResponse<Order>> {
    return api.post<Order>(API_ENDPOINTS.ORDERS.CREATE, data);
  }

  // Update order
  async updateOrder(id: string, data: Partial<CreateOrderData>): Promise<ApiResponse<Order>> {
    return api.put<Order>(API_ENDPOINTS.ORDERS.UPDATE(id), data);
  }

  // Update order status
  async updateOrderStatus(id: string, data: UpdateOrderStatusData): Promise<ApiResponse<Order>> {
    return api.patch<Order>(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), data);
  }

  // Cancel order
  async cancelOrder(id: string, reason?: string): Promise<ApiResponse<Order>> {
    return api.post<Order>(API_ENDPOINTS.ORDERS.CANCEL(id), { reason });
  }
}

export const orderService = new OrderService();
export default orderService;
