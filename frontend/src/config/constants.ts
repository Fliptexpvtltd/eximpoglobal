// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
  },
  
  // RFQ (Request for Quote)
  RFQ: {
    LIST: '/rfqs',
    CREATE: '/rfqs',
    DETAIL: (id: string) => `/rfqs/${id}`,
    UPDATE: (id: string) => `/rfqs/${id}`,
    DELETE: (id: string) => `/rfqs/${id}`,
    SUBMIT: (id: string) => `/rfqs/${id}/submit`,
  },
  
  // Quotes
  QUOTES: {
    LIST: '/quotes',
    CREATE: '/quotes',
    DETAIL: (id: string) => `/quotes/${id}`,
    UPDATE: (id: string) => `/quotes/${id}`,
    ACCEPT: (id: string) => `/quotes/${id}/accept`,
    REJECT: (id: string) => `/quotes/${id}/reject`,
    BY_RFQ: (rfqId: string) => `/quotes/rfq/${rfqId}`,
  },
  
  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    UPDATE: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },
  
  // Shipments
  SHIPMENTS: {
    LIST: '/shipments',
    DETAIL: (id: string) => `/shipments/${id}`,
    TRACK: (trackingNumber: string) => `/shipments/track/${trackingNumber}`,
    UPDATE: (id: string) => `/shipments/${id}`,
  },
  
  // Suppliers/Sellers
  SUPPLIERS: {
    LIST: '/suppliers',
    DETAIL: (id: string) => `/suppliers/${id}`,
    PROFILE: '/suppliers/profile',
    UPDATE_PROFILE: '/suppliers/profile',
    REVIEWS: (id: string) => `/suppliers/${id}/reviews`,
    PRODUCTS: (id: string) => `/suppliers/${id}/products`,
  },
  
  // Buyers
  BUYERS: {
    PROFILE: '/buyers/profile',
    UPDATE_PROFILE: '/buyers/profile',
    DASHBOARD: '/buyers/dashboard',
  },
  
  // Analytics
  ANALYTICS: {
    BUYER: '/analytics/buyer',
    SELLER: '/analytics/seller',
    SPEND: '/analytics/spend',
    PERFORMANCE: '/analytics/performance',
  },
  
  // Messages/Chat
  MESSAGES: {
    LIST: '/messages',
    CONVERSATION: (id: string) => `/messages/conversation/${id}`,
    SEND: '/messages',
    MARK_READ: (id: string) => `/messages/${id}/read`,
  },
  
  // Documents
  DOCUMENTS: {
    UPLOAD: '/documents/upload',
    LIST: '/documents',
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
    DELETE: (id: string) => `/documents/${id}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  USER_ROLE: 'user_role',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Request Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// User Roles
export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// RFQ Status
export const RFQ_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  QUOTED: 'quoted',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

// Quote Status
export const QUOTE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

// Shipment Status
export const SHIPMENT_STATUS = {
  PENDING: 'pending',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  CUSTOMS: 'customs',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  DELAYED: 'delayed',
} as const;

// Incoterms
export const INCOTERMS = [
  'EXW', 'FCA', 'FAS', 'FOB',
  'CFR', 'CIF', 'CPT', 'CIP',
  'DAP', 'DPU', 'DDP'
] as const;

// Certifications
export const CERTIFICATIONS = [
  'ISO 9001', 'ISO 14001', 'CE', 'FDA',
  'RoHS', 'GOTS', 'FSC', 'TUV',
  'BSCI', 'SA8000', 'GRS', 'OEKO-TEX'
] as const;

// Payment Terms
export const PAYMENT_TERMS = [
  'T/T (Telegraphic Transfer)',
  'L/C (Letter of Credit)',
  'D/P (Documents against Payment)',
  'D/A (Documents against Acceptance)',
  'Escrow',
  'PayPal',
  'Credit Card'
] as const;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALL: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
} as const;
