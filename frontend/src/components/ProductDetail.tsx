import { useState } from 'react';
import { ArrowLeft, Star, MapPin, CheckCircle, Shield, Award, Clock, Package, FileText, MessageSquare, TrendingUp, Users, Truck } from 'lucide-react';
import type { Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PublicNavigation } from './PublicNavigation';
import { useAuth } from '../contexts/AuthContext';

interface ProductDetailProps {
  product: Product;
  user?: any;
  activeMode?: 'buyer' | 'seller';
  onCreateRFQ: (product: Product) => void;
  onOrderSample: (product: Product) => void;
  onViewSupplier: (supplierId: string) => void;
  onContactSupplier: (supplierId: string) => void;
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

const specifications = [
  { label: 'Material', value: '100% Organic Cotton' },
  { label: 'Weight', value: '180-200 GSM' },
  { label: 'Colors Available', value: '15+ colors' },
  { label: 'Sizes', value: 'XS, S, M, L, XL, XXL, XXXL' },
  { label: 'Packaging', value: 'Individual poly bags, 100 pcs/carton' },
  { label: 'Customization', value: 'Logo printing, embroidery available' },
];

export function ProductDetail({ product, user: propUser, activeMode = 'buyer', onCreateRFQ, onOrderSample, onViewSupplier, onContactSupplier, onBack }: ProductDetailProps) {
  const { user: authUser } = useAuth();
  const user = propUser || authUser;
  const effectiveRole = user?.role === 'both' ? activeMode : (user?.role || 'buyer');
  const isSeller = effectiveRole === 'seller';
  const themeColor = isSeller ? '#059669' : '#2563eb';
  
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping'>('description');

  return (
    <>
      {!user && <PublicNavigation />}
      
      <div className={user ? "space-y-6" : "max-w-7xl mx-auto px-4 py-6 space-y-6"}>
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
                <button className="px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2">
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
                    <span className="text-xl">₹{sampleOrdering.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-gray-900">{sampleOrdering.leadTime}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onOrderSample(product)}
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
              
              {/* Cost Calculator */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="mb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Landed Cost
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Calculate total including duties & shipping
                </p>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3">
                  <option>Select destination</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                  <option>Australia</option>
                </select>
                <button className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200">
                  Calculate
                </button>
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
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-4 whitespace-nowrap transition-colors ${
                  activeTab === 'description'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-6 py-4 whitespace-nowrap transition-colors ${
                  activeTab === 'specifications'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-6 py-4 whitespace-nowrap transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Shipping & Incoterms
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="max-w-4xl">
                <h2 className="text-2xl mb-4">Product Description</h2>
                <div className="prose max-w-none text-gray-700 space-y-4">
                  <p>
                    Our premium organic cotton t-shirts are manufactured in our ISO 9001 certified facility with strict quality control measures. Each piece is made from 100% GOTS certified organic cotton, ensuring both environmental sustainability and exceptional comfort.
                  </p>
                  <p>
                    Perfect for brands looking for high-quality basics, these t-shirts offer excellent print and embroidery surfaces. Available in a wide range of colors and sizes, with customization options to match your brand identity.
                  </p>
                  <h3 className="text-xl mt-6 mb-3">Key Features:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Pre-shrunk fabric for size stability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Double-stitched seams for durability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Reinforced neck and shoulder seams</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Environmentally friendly production process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Available in regular and premium weight options</span>
                    </li>
                  </ul>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h4 className="text-blue-900 mb-2">Why Choose Our Products?</h4>
                    <p className="text-blue-800 text-sm">
                      With over 8 years of experience in textile manufacturing and export, we've served 500+ satisfied customers across 30+ countries. Our commitment to quality and timely delivery has earned us a 96% on-time delivery rate and 4.8/5 customer satisfaction score.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-4xl">
                <h2 className="text-2xl mb-6">Technical Specifications</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {specifications.map((spec) => (
                    <div key={spec.label} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">{spec.label}</div>
                      <div className="text-lg text-gray-900">{spec.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-5">
                  <h3 className="text-amber-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Quality Certifications
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {product.certifications.map((cert) => (
                      <div key={cert} className="flex items-center gap-2 text-amber-800 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-4xl">
                <h2 className="text-2xl mb-4">Shipping Options & Incoterms</h2>
                <p className="text-gray-600 mb-6">
                  Choose from multiple shipping options based on your needs. All prices are estimates and will be confirmed in your quote.
                </p>
                <div className="space-y-4">
                  {shippingOptions.map((option) => (
                    <div key={option.incoterm} className="border border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xl mb-1">{option.incoterm}</div>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                        </div>
                        <div className="text-xl text-blue-600 whitespace-nowrap ml-4">
                          {option.estimatedCost === 0 ? 'Included' : `+₹${option.estimatedCost}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="mb-3">Need help choosing?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Not sure which Incoterm is right for you? Our trade specialists can help you choose the best shipping option based on your location and requirements.
                  </p>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Contact Trade Specialist
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
