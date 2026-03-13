import { useState, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, CheckCircle, Shield, Award, Clock, Package, FileText, MessageSquare, TrendingUp, Users, Truck } from 'lucide-react';
import type { Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PublicNavigation } from './PublicNavigation';
import { useAuth } from '../contexts/AuthContext';
import { PageSEO } from './PageSEO';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ProductDetailProps {
  product: Product;
  user?: any;
  activeMode?: 'buyer' | 'seller';
  autoOpenCheckout?: boolean;
  onAutoOpenCheckoutComplete?: () => void;
  onCreateRFQ: (product: Product) => void;
  onOrderSample: (product: Product) => void;
  onViewSupplier: (supplierId: string) => void;
  onContactSupplier: (supplierId: string) => void;
  onNavigateToCheckout: () => void;
  onBack: () => void;
}

const sampleOrdering = {
  available: true,
  price: 50,
  leadTime: '3-5 days',
};

const shippingOptions = [
  { incoterm: 'EXW', description: 'Ex Works - Buyer arranges pickup from factory', estimatedCost: 0 },
  { incoterm: 'FOB', description: 'Free on Board - Seller delivers to port', estimatedCost: 250 },
  { incoterm: 'CIF', description: 'Cost, Insurance & Freight included', estimatedCost: 450 },
  { incoterm: 'DDP', description: 'Delivered Duty Paid - Door to door', estimatedCost: 850 },
];

export function ProductDetail({ 
  product, 
  user: propUser, 
  activeMode = 'buyer', 
  autoOpenCheckout = false,
  onAutoOpenCheckoutComplete,
  onCreateRFQ, 
  onOrderSample, 
  onViewSupplier, 
  onContactSupplier,
  onNavigateToCheckout, 
  onBack 
}: ProductDetailProps) {
  // Use full product price for sample order
  const calculatedSamplePrice = product.price || 0;
  
  const { user: authUser } = useAuth();
  const user = propUser || authUser;
  const effectiveRole = user?.role === 'both' ? activeMode : (user?.role || 'buyer');
  const isSeller = effectiveRole === 'seller';
  const themeColor = isSeller ? '#059669' : '#2563eb';
  
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');
  const [seoData, setSeoData] = useState<any>(null);

  // Auto-open checkout if flag is set (after login redirect)
  useEffect(() => {
    if (autoOpenCheckout && user) {
      onNavigateToCheckout();
      onAutoOpenCheckoutComplete?.();
    }
  }, [autoOpenCheckout, user, onNavigateToCheckout, onAutoOpenCheckoutComplete]);

  // Fetch SEO data from backend
  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/seo/page/product?productId=${product.id}`);
        const data = await response.json();
        if (data.success) {
          setSeoData(data.seoData);
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
      }
    };

    if (product.id) {
      fetchSEOData();
    }
  }, [product.id]);

  return (
    <PageSEO seoData={seoData}>
      <>
        {!user && <PublicNavigation />}
        
        <div className={user ? "space-y-6 pb-20 lg:pb-6" : "max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-6 space-y-6"}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Catalog</span>
          <span className="sm:hidden">Back</span>
        </button>
      
        {/* Main Product Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 lg:h-96 object-cover"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <button key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-500 transition-colors">
                    <ImageWithFallback
                      src={product.image}
                      alt={`${product.name} ${i}`}
                      className="w-full h-16 lg:h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Middle Column - Product Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>{product.category}</span>
                <span>•</span>
                <span>HS: {product.hsCode}</span>
              </div>
              <h1 className="text-2xl md:text-3xl mb-3">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              {/* Certifications */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.certifications.slice(0, 3).map((cert) => (
                  <div key={cert} className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
                    <Shield className="w-3 h-3" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>

              {/* Price Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-blue-600 mb-1">Unit Price (FOB)</div>
                    <div className="text-3xl text-blue-900">₹{product.price}</div>
                    <div className="text-xs text-blue-700 mt-1">{product.currency}</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-600 mb-1">Min. Order</div>
                    <div className="text-3xl text-blue-900">{product.moq}</div>
                    <div className="text-xs text-blue-700 mt-1">units</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Lead Time</span>
                  </div>
                  <span className="text-blue-900">{product.leadTime}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => onCreateRFQ(product)}
                  className="col-span-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Request Quote
                </button>
                <button 
                  onClick={() => onContactSupplier(product.supplierId)}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="hidden sm:inline">Contact</span>
                </button>
                <button 
                  onClick={() => {
                    if (!user) {
                      onOrderSample(product); // This will call requireAuth in App.tsx
                      return;
                    }
                    onNavigateToCheckout();
                  }}
                  className="px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  <span className="hidden sm:inline">Sample</span>
                </button>
              </div>
            </div>

            {/* Supplier Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => onViewSupplier(product.supplierId)}
                className="w-full text-left hover:bg-gray-50 p-6 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg">{product.supplierName}</h3>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{product.origin}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg">{product.supplierRating}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl text-blue-600 mb-1">8+</div>
                    <div className="text-xs text-gray-600">Years</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-green-600 mb-1">96%</div>
                    <div className="text-xs text-gray-600">On-Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-purple-600 mb-1">42</div>
                    <div className="text-xs text-gray-600">Products</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-blue-600 flex items-center justify-center gap-1">
                  View Full Profile →
                </div>
              </button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Sample Order */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Sample Order
                </h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Sample Price</span>
                    <span className="text-xl">₹{calculatedSamplePrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-gray-900">{sampleOrdering.leadTime}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (!user) {
                      onOrderSample(product); // This will call requireAuth in App.tsx
                      return;
                    }
                    onNavigateToCheckout();
                  }}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Order Sample
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Shipping calculated at checkout
                </p>
              </div>
              
              {/* Trade Assurance */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-5">
                <div className="flex items-start gap-3 mb-4">
                  <Award className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-green-900 mb-1">Trade Assurance</h3>
                    <p className="text-sm text-green-700">
                      Protected by buyer guarantee
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    On-time shipment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    Quality inspection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    Secure escrow payment
                  </li>
                </ul>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-5">
                <h3 className="text-purple-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Product Insights
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-700">Monthly Orders</span>
                    <span className="text-purple-900">150+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-700">Repeat Buyers</span>
                    <span className="text-purple-900">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-700">Reviews</span>
                    <span className="text-purple-900">4.8/5 (120)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 px-4 md:px-6 py-3 md:py-4 whitespace-nowrap transition-colors font-medium ${
                  activeTab === 'description'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`flex-1 px-4 md:px-6 py-3 md:py-4 whitespace-nowrap transition-colors font-medium ${
                  activeTab === 'specifications'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Specifications
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-6">
            {activeTab === 'description' && (
              <div className="w-full">
                <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-900">Product Description</h2>
                <div className="w-full">
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                    {product.description || 'No description available.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="w-full">
                <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-900">Technical Specifications</h2>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200">
                        <div className="text-xs md:text-sm font-medium text-gray-600 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm md:text-base text-gray-900 font-medium break-words">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No specifications available.</p>
                )}

                <div className="mt-6 md:mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 md:p-5">
                  <h3 className="text-sm md:text-base font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 md:w-5 md:h-5" />
                    Quality Certifications
                  </h3>
                  {product.certifications && product.certifications.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                      {product.certifications.map((cert) => (
                        <div key={cert} className="flex items-center gap-2 text-amber-800 text-xs md:text-sm">
                          <CheckCircle className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                          <span className="break-words">{cert}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-amber-700 text-xs md:text-sm">No certifications listed.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
    </PageSEO>
  );
}
