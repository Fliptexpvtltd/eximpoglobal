import { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, CheckCircle, X } from 'lucide-react';
import type { Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PublicNavigation } from './PublicNavigation';
import { useAuth } from '../contexts/AuthContext';
import { ApplicationsSlider } from './ApplicationsSlider';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface CatalogProps {
  onViewProduct: (product: Product) => void;
  onViewSupplier: (supplierId: string) => void;
  onNavigate?: (view: string) => void;
  user?: any;
  activeMode?: 'buyer' | 'seller';
}

export function Catalog({ onViewProduct, onViewSupplier, onNavigate, user, activeMode = 'buyer' }: CatalogProps) {
  const { requireAuth } = useAuth();
  const effectiveRole = user?.role === 'both' ? activeMode : (user?.role || 'buyer');
  const isSeller = effectiveRole === 'seller';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [currency, setCurrency] = useState('INR');

  // Currency conversion rates (base: INR)
  const currencyRates: Record<string, number> = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    KES: 1.54,
    TZS: 28.2,
    UGX: 45.8,
    GNF: 103.5,
    RWF: 15.8,
  };

  // Currency symbols
  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    KES: 'KSh',
    TZS: 'TSh',
    UGX: 'USh',
    GNF: 'FG',
    RWF: 'FRw',
  };

  const convertPrice = (price: number, fromCurrency: string = 'INR'): number => {
    if (!price) return 0;
    // Convert from INR to selected currency
    const convertedPrice = price * currencyRates[currency];
    return Math.round(convertedPrice * 100) / 100; // Round to 2 decimal places
  };

  const formatPrice = (price: number): string => {
    if (!price) return 'Contact Supplier';
    const converted = convertPrice(price);
    const symbol = currencySymbols[currency];
    return `${symbol}${converted.toLocaleString()}`;
  };

  useEffect(() => {
    fetchProducts();
  }, [isSeller]);

  const fetchProducts = async () => {
    try {
      // For sellers, show only their products. For buyers, show all approved products
      const endpoint = isSeller ? `${API_BASE_URL}/products/my/products` : `${API_BASE_URL}/products?limit=200`;
      const options: RequestInit = isSeller ? {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      } : {};
      
      const response = await fetch(endpoint, options);
      const data = await response.json();
      
      if (data.success) {
        // Transform API data to match Product interface
        const transformedProducts = data.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          hsCode: p.specifications?.hsCode || '',
          price: p.price ? parseFloat(p.price) : 0,
          currency: 'USD',
          moq: p.moq,
          leadTime: p.specifications?.leadTime || 'Contact Supplier',
          supplierId: p.supplier_id,
          supplierName: p.supplier_name || 'Unknown Supplier',
          supplierRating: 4.5,
          origin: p.specifications?.originCountry || p.supplier_country || 'Unknown',
          certifications: p.certifications || [],
          image: p.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770',
          images: p.images || [],
          description: p.description,
          specifications: p.specifications || {},
          variants: [],
        }));
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All Categories', ...Array.from(new Set(products.map(p => p.category)))];

  // Calculate active filter count
  const activeFilterCount = (selectedCategory !== 'All Categories' ? 1 : 0) + 
    ((priceRange[0] !== 0 || priceRange[1] !== 10000000) ? 1 : 0);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory('All Categories');
    setPriceRange([0, 10000000]);
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    // Include products with price 0 (null in DB) or within the price range
    const matchesPrice = product.price === 0 || (product.price >= priceRange[0] && product.price <= priceRange[1]);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavigation onNavigate={onNavigate} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!user && <PublicNavigation onNavigate={onNavigate} />}
      
      {!user && selectedCategory === 'All Categories' && !searchTerm && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
            <div className="text-center max-w-3xl mx-auto">
              {/* Text + CTAs */}
              <div className="space-y-5">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Trusted Global<br />
                  <span className="text-blue-600">Trade Platform</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-lg">
                  Connect with verified buyers and sellers worldwide. Source products, request quotes, and manage international shipments — all in one platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                  <button
                    type="button"
                    onClick={() => requireAuth({ type: 'browse-catalog' })}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-100"
                  >
                    Start Buying
                  </button>
                  <button
                    type="button"
                    onClick={() => requireAuth({ type: 'browse-catalog' })}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors border-2 border-blue-200"
                  >
                    Start Selling
                  </button>
                </div>
                {/* Trust stats */}
                <div className="flex gap-6 pt-2 justify-center">
                  <div>
                    <div className="text-xl font-bold text-gray-900">500+</div>
                    <div className="text-xs text-gray-500">Verified Suppliers</div>
                  </div>
                  <div className="border-l border-gray-200 pl-6">
                    <div className="text-xl font-bold text-gray-900">50+</div>
                    <div className="text-xs text-gray-500">Countries</div>
                  </div>
                  <div className="border-l border-gray-200 pl-6">
                    <div className="text-xl font-bold text-gray-900">10K+</div>
                    <div className="text-xs text-gray-500">Products Listed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={user ? "space-y-6 pb-6" : "max-w-7xl mx-auto px-4 py-6 space-y-6 pb-6"}>
        {user && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl mb-2 font-bold text-gray-900">
                  {isSeller ? 'My Products' : 'Browse Products'}
                </h1>
                <p className="text-base md:text-xl text-gray-600">
                  {isSeller ? 'Manage your product listings and inventory' : 'Discover verified suppliers from around the world'}
                </p>
              </div>
              {isSeller && (
                <button 
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  + Add Product
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Homepage: 3 Big Category Cards */}
        {selectedCategory === 'All Categories' && !searchTerm && !isSeller && (
          <div id="shop-by-category" className="py-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-2">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                label: 'Automotive',
                displayLabel: 'Cars',
                desc: 'Cars, SUVs & Commercial Vehicles',
                img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
                count: products.filter(p => p.category === 'Automotive').length,
              },
              {
                label: 'Polymers',
                displayLabel: 'Polymers',
                desc: 'Plastics, Resins & Raw Materials',
                img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
                count: products.filter(p => p.category === 'Polymers').length,
              },
              {
                label: 'Spices',
                displayLabel: 'Spices',
                desc: 'Premium Spices & Agri Commodities',
                img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
                count: products.filter(p => p.category === 'Spices').length,
              },
            ].map(card => (
              <button
                key={card.label}
                onClick={() => setSelectedCategory(card.label)}
                className="relative h-64 rounded-2xl overflow-hidden group text-left shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={card.img}
                  alt={card.displayLabel}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)' }} />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="text-white text-2xl font-bold mb-1 drop-shadow-lg">{card.displayLabel}</div>
                  <div className="text-white text-sm mb-3 opacity-90 drop-shadow">{card.desc}</div>
                  {card.count > 0 && (
                    <div className="text-white text-xs mb-3 opacity-75">{card.count} products available</div>
                  )}
                  <div className="inline-flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-full w-fit transition-colors" style={{ background: 'rgba(255,255,255,0.25)' }}>
                    Explore {card.displayLabel} →
                  </div>
                </div>
              </button>
            ))}
          </div>
          </div>
        )}

      {(isSeller || selectedCategory !== 'All Categories' || !!searchTerm) && (<>
        {!isSeller && selectedCategory !== 'All Categories' && (
          <button
            onClick={() => setSelectedCategory('All Categories')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 font-medium text-sm transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            All Categories
          </button>
        )}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, HS codes, or suppliers..."
            className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${isSeller ? 'focus:ring-emerald-500' : 'focus:ring-blue-500'} focus:border-transparent`}
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 relative"
          >
            <Filter className="w-5 h-5" />
            <span className="md:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span 
                className="absolute -top-2 -right-2 w-6 h-6 text-white rounded-full text-xs flex items-center justify-center"
                style={{ backgroundColor: isSeller ? '#059669' : '#2563eb' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
          
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={`flex-1 md:flex-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${isSeller ? 'focus:ring-emerald-500' : 'focus:ring-blue-500'} focus:border-transparent`}
          >
            <option value="INR">₹ INR (India)</option>
            <option value="USD">$ USD (United States)</option>
            <option value="EUR">€ EUR (Europe)</option>
            <option value="GBP">£ GBP (United Kingdom)</option>
            <option value="KES">KSh KES (Kenya)</option>
            <option value="TZS">TSh TZS (Tanzania)</option>
            <option value="UGX">USh UGX (Uganda)</option>
            <option value="GNF">FG GNF (Guinea)</option>
            <option value="RWF">FRw RWF (Rwanda)</option>
          </select>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category 
                ? isSeller
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Filters</h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear All
              </button>
              <button 
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="mb-3 text-gray-900">Category</h4>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <h4 className="mb-3 text-gray-900">Price Range ({currency === 'INR' ? '₹' : '$'})</h4>
              <div className="space-y-3">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000000])}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredProducts.length} products found
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => onViewProduct(product)}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-white rounded-full text-sm flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {product.supplierRating}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewSupplier(product.supplierId);
                  }}
                  className="text-sm text-gray-600 hover:text-blue-600 mb-3 flex items-center gap-1"
                >
                  {product.supplierName}
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                </button>
                
                {product.category === 'Automotive' ? (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-4 flex-wrap">
                    {(product as any).specifications?.year && (
                      <span className="font-medium text-gray-800">{(product as any).specifications.year}</span>
                    )}
                    {(product as any).specifications?.make && (
                      <><span className="text-gray-400">•</span><span>{(product as any).specifications.make}</span></>
                    )}
                    {(product as any).specifications?.model && (
                      <><span className="text-gray-400">•</span><span>{(product as any).specifications.model}</span></>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    {product.origin}
                    <span className="text-gray-400">•</span>
                    <span>HS: {product.hsCode}</span>
                  </div>
                )}

                {product.category === 'Automotive' ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(product as any).specifications?.bodyType && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{(product as any).specifications.bodyType.charAt(0).toUpperCase() + (product as any).specifications.bodyType.slice(1)}</span>
                    )}
                    {(product as any).specifications?.fuelType && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">{(product as any).specifications.fuelType.charAt(0).toUpperCase() + (product as any).specifications.fuelType.slice(1)}</span>
                    )}
                    {(product as any).specifications?.transmission && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">{(product as any).specifications.transmission.charAt(0).toUpperCase() + (product as any).specifications.transmission.slice(1)}</span>
                    )}
                    {(product as any).specifications?.engineCC && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{Number((product as any).specifications.engineCC).toLocaleString()} cc</span>
                    )}
                    {(product as any).specifications?.exteriorColor && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">{(product as any).specifications.exteriorColor}</span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.certifications.slice(0, 3).map(cert => (
                      <span key={cert} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {cert}
                      </span>
                    ))}
                    {product.certifications.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{product.certifications.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  {product.category === 'Automotive' ? (
                    <>
                      <div>
                        <div className="text-sm text-gray-600">
                          {(product as any).specifications?.condition
                            ? ((product as any).specifications.condition === 'certified'
                              ? 'Certified Pre-Owned'
                              : (product as any).specifications.condition.charAt(0).toUpperCase() +
                                (product as any).specifications.condition.slice(1))
                            : 'Vehicle'}
                        </div>
                        <div className="text-2xl text-blue-600">
                          {product.price ? formatPrice(product.price) : 'On Request'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Mileage</div>
                        <div className="text-gray-900">
                          {(product as any).specifications?.mileage
                            ? `${Number((product as any).specifications.mileage).toLocaleString()} km`
                            : 'N/A'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                  <div>
                    <div className="text-sm text-gray-600">From</div>
                    <div className="text-2xl text-blue-600">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">MOQ</div>
                    <div className="text-gray-900">
                      {product.moq ? `${product.moq} units` : 'Flexible'}
                    </div>
                  </div>
                    </>
                  )}
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  {product.category === 'Automotive'
                    ? ((product as any).specifications?.transmission
                      ? (product as any).specifications.transmission.charAt(0).toUpperCase() +
                        (product as any).specifications.transmission.slice(1) + ' · ' +
                        ((product as any).specifications?.fuelType || '')
                      : 'Contact seller for details')
                    : `Lead time: ${product.leadTime}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>)}
      </div>
      
      {/* Applications Slider Section */}
      <ApplicationsSlider />
    </>
  );
}
