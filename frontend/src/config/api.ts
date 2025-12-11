// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  
  // Products
  products: `${API_BASE_URL}/products`,
  
  // Suppliers
  suppliers: (id: string) => `${API_BASE_URL}/suppliers/${id}`,
  supplierProducts: (id: string) => `${API_BASE_URL}/suppliers/${id}/products`,
  
  // RFQs
  rfqs: `${API_BASE_URL}/rfqs`,
  
  // Quotes
  quotes: (rfqId: string) => `${API_BASE_URL}/quotes/rfq/${rfqId}`,
  acceptQuote: (quoteId: string) => `${API_BASE_URL}/quotes/${quoteId}/accept`,
  
  // Orders
  orders: `${API_BASE_URL}/orders`,
  order: (id: string) => `${API_BASE_URL}/orders/${id}`,
  
  // Shipments
  shipments: `${API_BASE_URL}/shipments`,
  
  // Analytics
  buyerAnalytics: `${API_BASE_URL}/analytics/buyer`,
  sellerAnalytics: `${API_BASE_URL}/analytics/seller`,
};

export default API_BASE_URL;
