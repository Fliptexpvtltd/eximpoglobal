import { useState, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, CheckCircle, Award, TrendingUp, Package, Users, Building } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PublicNavigation } from './PublicNavigation';
import { useAuth } from '../contexts/AuthContext';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface SupplierProfileProps {
  supplierId: string;
  user?: any;
  activeMode?: 'buyer' | 'seller';
  onBack: () => void;
}

export function SupplierProfile({ supplierId, user: propUser, activeMode = 'buyer', onBack }: SupplierProfileProps) {
  const { user: authUser } = useAuth();
  const user = propUser || authUser;
  const effectiveRole = user?.role === 'both' ? activeMode : (user?.role || 'buyer');
  const isSeller = effectiveRole === 'seller';
  const themeColor = isSeller ? '#059669' : '#2563eb';
  const [supplier, setSupplier] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupplier();
    fetchProducts();
  }, [supplierId]);

  const fetchSupplier = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}`);
      const data = await response.json();
      
      if (data.success) {
        setSupplier(data.data);
      }
    } catch (error) {
      console.error('Error fetching supplier:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}/products`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading supplier profile...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl mb-2">Supplier Not Found</h3>
          <p className="text-gray-600">The supplier profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const reviews = supplier?.reviews || [];
  const productCategories = [
    { name: 'Electronics', count: products.filter((p: any) => p.category === 'electronics').length },
    { name: 'Textiles', count: products.filter((p: any) => p.category === 'textiles').length },
    { name: 'Machinery', count: products.filter((p: any) => p.category === 'machinery').length },
    { name: 'Other', count: products.filter((p: any) => !['electronics', 'textiles', 'machinery'].includes(p.category)).length },
  ].filter(cat => cat.count > 0);

  return (
    <>
      {!user && <PublicNavigation />}
      
      <div className={user ? "space-y-6" : "max-w-7xl mx-auto px-4 py-6 space-y-6"}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Catalog
        </button>
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="px-8 pb-8">
          <div className="flex items-start gap-6 -mt-16 mb-6">
            <div className="w-32 h-32 bg-white rounded-xl shadow-lg flex items-center justify-center border-4 border-white">
              <Building className="w-16 h-16 text-blue-600" />
            </div>
            
            <div className="flex-1 pt-20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl">{supplier.company_name || 'Supplier'}</h1>
                    {supplier.is_verified && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Verified</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{supplier.business_type || 'Manufacturer'} in {supplier.country || 'N/A'}</span>
                    </div>
                    {supplier.year_established && (
                      <>
                        <span>•</span>
                        <span>Since {supplier.year_established}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl">{supplier.rating || 0}</span>
                    </div>
                    <span className="text-gray-600">({supplier.review_count || 0} reviews)</span>
                  </div>
                </div>
                
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Contact Supplier
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">Response Rate</span>
              </div>
              <div className="text-2xl">{supplier.response_rate || 0}%</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">Total Products</span>
              </div>
              <div className="text-2xl">{products.length}</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-gray-600">Employees</span>
              </div>
              <div className="text-2xl">{supplier.employee_count || 'N/A'}</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-orange-600" />
                <span className="text-gray-600">Response Time</span>
              </div>
              <div className="text-2xl">{supplier.response_time || 'N/A'}</div>
            </div>
          </div>
        </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl mb-4">About Company</h2>
            <p className="text-gray-700 mb-6">{supplier.description || 'No description available.'}</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="mb-3 text-gray-900">Main Products</h3>
                <div className="space-y-2">
                  {(supplier.main_products || []).map((product: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      {product}
                    </div>
                  ))}
                  {(!supplier.main_products || supplier.main_products.length === 0) && (
                    <div className="text-gray-500 text-sm">No products listed</div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="mb-3 text-gray-900">Certifications</h3>
                <div className="space-y-2">
                  {(supplier.certifications || []).map((cert: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                      {cert}
                    </div>
                  ))}
                  {(!supplier.certifications || supplier.certifications.length === 0) && (
                    <div className="text-gray-500 text-sm">No certifications listed</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl mb-4">Products</h2>
            {products.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>No products available from this supplier</p>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {products.slice(0, 6).map((product: any, index: number) => (
                <div key={index} className="rounded-lg overflow-hidden border border-gray-200 p-4">
                  <ImageWithFallback
                    src={product.images?.[0] || ''}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <div className="text-sm text-gray-900 mb-1">{product.name}</div>
                  <div className="text-sm text-blue-600">{product.price ? `₹${parseFloat(product.price).toLocaleString()}` : 'Contact Supplier'}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl">Customer Reviews ({supplier.review_count || 0})</h2>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl">{supplier.rating || 0}</span>
              </div>
            </div>
            
            {reviews.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>No reviews yet</p>
              </div>
            )}
            
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="mb-1">{review.author}</div>
                      <div className="text-sm text-gray-600">{review.country}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <div className="text-xs text-gray-500">{review.date}</div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              View All Reviews
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="mb-4">Certifications</h3>
            <div className="space-y-3">
              {(supplier.certifications || []).map((cert) => (
                <div key={cert} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Award className="w-5 h-5 text-green-600" />
                  <span className="text-green-900">{cert}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="mb-4">Product Categories</h3>
            <div className="space-y-3">
              {productCategories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <span className="text-gray-700">{category.name}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={onBack} className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              View All Products
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-blue-900 mb-3">Trade Assurance</h3>
            <p className="text-sm text-blue-700 mb-4">
              This supplier is protected by our buyer protection program
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Verified business license</span>
              </div>
              <div className="flex items-center gap-2 text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Factory audit completed</span>
              </div>
              <div className="flex items-center gap-2 text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Quality guarantee</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
