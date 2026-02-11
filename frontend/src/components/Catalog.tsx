import { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, CheckCircle, X } from 'lucide-react';
import type { Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PublicNavigation } from './PublicNavigation';
import { useAuth } from '../contexts/AuthContext';

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
  const [priceRange, setPriceRange] = useState([0, 100000]);
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
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
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
          description: p.description,
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
    ((priceRange[0] !== 0 || priceRange[1] !== 100000) ? 1 : 0);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory('All Categories');
    setPriceRange([0, 100000]);
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
      
      {!user && (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 py-6 md:py-20">
            <div className="text-center space-y-3 md:space-y-4">
              <h1 className="text-2xl md:text-5xl">Global Trade Made Simple</h1>
              <p className="text-base md:text-xl text-blue-100 max-w-3xl mx-auto">
                Connect with verified buyers and sellers worldwide. Source products, request quotes, and manage international shipments all in one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4">
                <button 
                  type="button"
                  onClick={() => requireAuth({ type: 'browse-catalog' })}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Start Buying
                </button>
                <button 
                  type="button"
                  onClick={() => requireAuth({ type: 'browse-catalog' })}
                  className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors border border-blue-500"
                >
                  Start Selling
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={user ? "space-y-6" : "max-w-7xl mx-auto px-4 py-6 space-y-6"}>
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
        
        {!user && (
          <div>
            <h2 className="text-xl md:text-2xl mb-2">Featured Products</h2>
            <p className="text-gray-600">Browse our curated selection of products from verified suppliers</p>
          </div>
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
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
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
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  {product.origin}
                  <span className="text-gray-400">•</span>
                  <span>HS: {product.hsCode}</span>
                </div>
                
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
                
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
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
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  Lead time: {product.leadTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}
