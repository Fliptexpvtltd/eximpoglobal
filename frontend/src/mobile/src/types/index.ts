// Shared types for the mobile application
export type UserRole = 'buyer' | 'seller' | 'both' | 'ops' | 'finance' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyName: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  hsCode: string;
  price: number;
  currency: string;
  moq: number;
  leadTime: string;
  supplierId: string;
  supplierName: string;
  supplierRating: number;
  origin: string;
  certifications: string[];
  image: string;
  description: string;
  variants: Array<{ name: string; value: string }>;
}

export interface RFQ {
  id: string;
  buyerId: string;
  products: Array<{
    productId: string;
    productName?: string;
    quantity: number;
    specifications: string;
  }>;
  incoterm: string;
  destinationPort: string;
  targetPrice?: number;
  deadline: string;
  status: 'draft' | 'sent' | 'quoted' | 'accepted';
  createdAt: string;
}

export interface Quote {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  currency: string;
  incoterm: string;
  leadTime: string;
  validUntil: string;
  paymentTerms: string;
  freightCost?: number;
  insurance?: number;
  totalCost: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface PO {
  id: string;
  buyerId: string;
  supplierId: string;
  supplierName?: string;
  quoteId: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  totalAmount: number;
  currency: string;
  depositPercent: number;
  depositAmount: number;
  balanceAmount: number;
  incoterm: string;
  deliveryWindow: string;
  paymentMethod: 'escrow' | 'lc' | 'oa' | 'dp';
  status: 'draft' | 'pending_payment' | 'in_production' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface Shipment {
  id: string;
  poId: string;
  mode: 'air' | 'sea' | 'rail' | 'courier';
  originPort: string;
  destinationPort: string;
  forwarder: string;
  containerType?: string;
  trackingNumber: string;
  status: 'booked' | 'in_transit' | 'customs' | 'delivered';
  milestones: Array<{
    name: string;
    date: string;
    location: string;
    completed: boolean;
  }>;
  eta: string;
  documents: Array<{
    name: string;
    type: string;
    url: string;
  }>;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
