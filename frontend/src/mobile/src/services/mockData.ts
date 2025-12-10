import { Product, RFQ, Quote, PO, Shipment, Conversation } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Industrial LED Panel 600x600',
    category: 'Electronics',
    hsCode: '8539.50.00',
    price: 45.50,
    currency: 'INR',
    moq: 500,
    leadTime: '25-30 days',
    supplierId: 'sup-1',
    supplierName: 'Shenzhen Tech Industries',
    supplierRating: 4.8,
    origin: 'China',
    certifications: ['CE', 'RoHS', 'ISO9001'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    description: 'High-efficiency LED panel for commercial and industrial use. Energy-saving design with long lifespan.',
    variants: [
      { name: 'Color Temperature', value: '3000K/4000K/6000K' },
      { name: 'Power', value: '40W/48W' }
    ]
  },
  {
    id: '2',
    name: 'Cotton T-Shirt Basic',
    category: 'Textiles',
    hsCode: '6109.10.00',
    price: 3.20,
    currency: 'INR',
    moq: 1000,
    leadTime: '20-25 days',
    supplierId: 'sup-2',
    supplierName: 'Bangladesh Textiles Ltd',
    supplierRating: 4.5,
    origin: 'Bangladesh',
    certifications: ['GOTS', 'OEKO-TEX'],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    description: '100% organic cotton t-shirt. Available in multiple sizes and colors.',
    variants: [
      { name: 'Size', value: 'S/M/L/XL/XXL' },
      { name: 'Color', value: 'White/Black/Navy/Grey' }
    ]
  },
  {
    id: '3',
    name: 'Hydraulic Press Machine',
    category: 'Machinery',
    hsCode: '8462.10.00',
    price: 12500,
    currency: 'INR',
    moq: 1,
    leadTime: '45-60 days',
    supplierId: 'sup-3',
    supplierName: 'German Engineering GmbH',
    supplierRating: 4.9,
    origin: 'Germany',
    certifications: ['CE', 'ISO9001', 'TÜV'],
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400',
    description: 'Industrial hydraulic press with 100-ton capacity. Precision engineering for manufacturing.',
    variants: [
      { name: 'Capacity', value: '50T/100T/200T' },
      { name: 'Table Size', value: '1000x800mm/1200x1000mm' }
    ]
  },
  {
    id: '4',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    hsCode: '8518.30.00',
    price: 1545,
    currency: 'INR',
    moq: 500,
    leadTime: '15-20 days',
    supplierId: 'sup-1',
    supplierName: 'Shenzhen Tech Industries',
    supplierRating: 4.8,
    origin: 'China',
    certifications: ['CE', 'FCC', 'RoHS'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    description: 'Premium wireless headphones with noise cancellation and long battery life.',
    variants: [
      { name: 'Color', value: 'Black/White/Blue' },
      { name: 'Battery', value: '20hrs/30hrs' }
    ]
  },
  {
    id: '5',
    name: 'Stainless Steel Water Bottle',
    category: 'Consumer Goods',
    hsCode: '7323.93.00',
    price: 485,
    currency: 'INR',
    moq: 300,
    leadTime: '18-22 days',
    supplierId: 'sup-4',
    supplierName: 'Vietnam Manufacturing Co',
    supplierRating: 4.6,
    origin: 'Vietnam',
    certifications: ['FDA', 'LFGB'],
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    description: 'Double-wall insulated stainless steel bottle. Keeps drinks hot or cold for hours.',
    variants: [
      { name: 'Size', value: '500ml/750ml/1000ml' },
      { name: 'Color', value: 'Silver/Black/Red/Blue' }
    ]
  },
  {
    id: '6',
    name: 'Solar Panel 300W',
    category: 'Energy',
    hsCode: '8541.40.00',
    price: 15020,
    currency: 'INR',
    moq: 100,
    leadTime: '30-35 days',
    supplierId: 'sup-5',
    supplierName: 'India Solar Tech',
    supplierRating: 4.7,
    origin: 'India',
    certifications: ['IEC', 'CE', 'ISO9001'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
    description: 'Monocrystalline solar panel with high efficiency. Perfect for residential and commercial use.',
    variants: [
      { name: 'Power', value: '250W/300W/350W' },
      { name: 'Type', value: 'Mono/Poly' }
    ]
  }
];

export const mockRFQs: RFQ[] = [
  {
    id: 'rfq-1',
    buyerId: '1',
    products: [
      {
        productId: '1',
        productName: 'Industrial LED Panel 600x600',
        quantity: 1000,
        specifications: 'Need 4000K color temperature, 48W power'
      }
    ],
    incoterm: 'FOB',
    destinationPort: 'Los Angeles, USA',
    targetPrice: 42,
    deadline: '2025-11-20',
    status: 'quoted',
    createdAt: '2025-11-01'
  },
  {
    id: 'rfq-2',
    buyerId: '1',
    products: [
      {
        productId: '2',
        productName: 'Cotton T-Shirt Basic',
        quantity: 5000,
        specifications: 'Mixed sizes: 1000 S, 1500 M, 1500 L, 1000 XL. White color only.'
      }
    ],
    incoterm: 'CIF',
    destinationPort: 'Hamburg, Germany',
    deadline: '2025-11-25',
    status: 'sent',
    createdAt: '2025-11-05'
  },
  {
    id: 'rfq-3',
    buyerId: '1',
    products: [
      {
        productId: '4',
        productName: 'Wireless Bluetooth Headphones',
        quantity: 2000,
        specifications: 'Need black color with 30hrs battery life'
      }
    ],
    incoterm: 'EXW',
    destinationPort: 'Shenzhen, China',
    targetPrice: 16,
    deadline: '2025-11-18',
    status: 'draft',
    createdAt: '2025-11-08'
  }
];

export const mockQuotes: Quote[] = [
  {
    id: 'quote-1',
    rfqId: 'rfq-1',
    supplierId: 'sup-1',
    supplierName: 'Shenzhen Tech Industries',
    unitPrice: 3630,
    currency: 'INR',
    incoterm: 'FOB',
    leadTime: '25 days',
    validUntil: '2025-11-30',
    paymentTerms: '30% deposit, 70% before shipment',
    freightCost: 2500,
    insurance: 150,
    totalCost: 46150,
    status: 'pending'
  },
  {
    id: 'quote-2',
    rfqId: 'rfq-1',
    supplierId: 'sup-6',
    supplierName: 'Guangzhou Lighting Co',
    unitPrice: 3490,
    currency: 'INR',
    incoterm: 'FOB',
    leadTime: '30 days',
    validUntil: '2025-11-28',
    paymentTerms: '50% deposit, 50% before shipment',
    freightCost: 2800,
    insurance: 160,
    totalCost: 44760,
    status: 'pending'
  },
  {
    id: 'quote-3',
    rfqId: 'rfq-1',
    supplierId: 'sup-7',
    supplierName: 'Taiwan Electronics Ltd',
    unitPrice: 3690,
    currency: 'INR',
    incoterm: 'FOB',
    leadTime: '20 days',
    validUntil: '2025-12-05',
    paymentTerms: '30% deposit, 70% on delivery',
    freightCost: 2400,
    insurance: 145,
    totalCost: 46745,
    status: 'pending'
  }
];

export const mockPOs: PO[] = [
  {
    id: 'po-1',
    buyerId: '1',
    supplierId: 'sup-1',
    supplierName: 'Shenzhen Tech Industries',
    quoteId: 'quote-1',
    items: [
      {
        productName: 'Industrial LED Panel 600x600',
        quantity: 1000,
        unitPrice: 43.50,
        total: 43500
      }
    ],
    totalAmount: 3851460,
    currency: 'INR',
    depositPercent: 30,
    depositAmount: 13845,
    balanceAmount: 32305,
    incoterm: 'FOB',
    deliveryWindow: '2025-12-15 to 2025-12-25',
    paymentMethod: 'escrow',
    status: 'in_production',
    createdAt: '2025-11-10'
  },
  {
    id: 'po-2',
    buyerId: '1',
    supplierId: 'sup-4',
    supplierName: 'Vietnam Manufacturing Co',
    quoteId: 'quote-4',
    items: [
      {
        productName: 'Stainless Steel Water Bottle',
        quantity: 1000,
        unitPrice: 5.60,
        total: 5600
      }
    ],
    totalAmount: 567650,
    currency: 'INR',
    depositPercent: 50,
    depositAmount: 3400,
    balanceAmount: 3400,
    incoterm: 'CIF',
    deliveryWindow: '2025-12-01 to 2025-12-10',
    paymentMethod: 'lc',
    status: 'shipped',
    createdAt: '2025-10-25'
  },
  {
    id: 'po-3',
    buyerId: '1',
    supplierId: 'sup-2',
    supplierName: 'Bangladesh Textiles Ltd',
    quoteId: 'quote-5',
    items: [
      {
        productName: 'Cotton T-Shirt Basic',
        quantity: 5000,
        unitPrice: 3.10,
        total: 15500
      }
    ],
    totalAmount: 1519650,
    currency: 'INR',
    depositPercent: 30,
    depositAmount: 5460,
    balanceAmount: 12740,
    incoterm: 'FOB',
    deliveryWindow: '2025-11-20 to 2025-11-30',
    paymentMethod: 'oa',
    status: 'pending_payment',
    createdAt: '2025-11-08'
  }
];

export const mockShipments: Shipment[] = [
  {
    id: 'ship-1',
    poId: 'po-2',
    mode: 'sea',
    originPort: 'Ho Chi Minh, Vietnam',
    destinationPort: 'Los Angeles, USA',
    forwarder: 'Maersk Line',
    containerType: '20ft',
    trackingNumber: 'MAEU123456789',
    status: 'in_transit',
    milestones: [
      {
        name: 'Booking Confirmed',
        date: '2025-11-12',
        location: 'Ho Chi Minh',
        completed: true
      },
      {
        name: 'Container Loaded',
        date: '2025-11-15',
        location: 'Ho Chi Minh Port',
        completed: true
      },
      {
        name: 'Vessel Departed',
        date: '2025-11-16',
        location: 'Ho Chi Minh',
        completed: true
      },
      {
        name: 'In Transit',
        date: '2025-11-25',
        location: 'Pacific Ocean',
        completed: true
      },
      {
        name: 'Arrived at Port',
        date: '2025-12-05',
        location: 'Los Angeles',
        completed: false
      },
      {
        name: 'Customs Clearance',
        date: '2025-12-06',
        location: 'Los Angeles',
        completed: false
      },
      {
        name: 'Delivered',
        date: '2025-12-08',
        location: 'Warehouse',
        completed: false
      }
    ],
    eta: '2025-12-05',
    documents: [
      { name: 'Bill of Lading', type: 'pdf', url: '#' },
      { name: 'Commercial Invoice', type: 'pdf', url: '#' },
      { name: 'Packing List', type: 'pdf', url: '#' },
      { name: 'Certificate of Origin', type: 'pdf', url: '#' }
    ]
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantId: 'sup-1',
    participantName: 'Shenzhen Tech Industries',
    participantRole: 'Supplier',
    lastMessage: 'The production is on schedule. Expected completion by Nov 20.',
    lastMessageTime: '2025-11-08T10:30:00',
    unreadCount: 2
  },
  {
    id: 'conv-2',
    participantId: 'sup-2',
    participantName: 'Bangladesh Textiles Ltd',
    participantRole: 'Supplier',
    lastMessage: 'We can offer a 5% discount for orders above 10,000 units.',
    lastMessageTime: '2025-11-07T15:45:00',
    unreadCount: 0
  },
  {
    id: 'conv-3',
    participantId: 'sup-4',
    participantName: 'Vietnam Manufacturing Co',
    participantRole: 'Supplier',
    lastMessage: 'Shipment has been dispatched. Tracking number: MAEU123456789',
    lastMessageTime: '2025-11-06T09:20:00',
    unreadCount: 1
  }
];
