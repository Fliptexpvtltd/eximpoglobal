import { useState, useEffect } from 'react';
import { Edit2, Trash2, Eye, EyeOff, Search, Copy, AlertCircle, Check, GripVertical } from 'lucide-react';
import type { User } from '../App';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  moq: number;
  unit?: string;
  images?: string[];
  approval_status: 'pending' | 'approved' | 'rejected';
  available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ProductManagementProps {
  user: User;
  onNavigate: (view: any, data?: any) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function ProductManagement({ user: _user, onNavigate }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'created' | 'price' | 'name' | 'order'>('created');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/products/my/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Fetched products count:', data.data?.length);
      console.log('All products:', data.data);
      if (data.success) {
        const sortedProducts = [...data.data].sort((a, b) => a.display_order - b.display_order);
        setProducts(sortedProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(sortedProducts.map(p => p.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setProducts(products.filter(p => p.id !== productId));
        setMessage({ type: 'success', text: 'Product deleted successfully' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete product' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage({ type: 'error', text: 'Failed to delete product' });
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ available: !product.available })
      });

      const data = await response.json();
      if (data.success) {
        setProducts(products.map(p => p.id === product.id ? { ...p, available: !p.available } : p));
        setMessage({ 
          type: 'success', 
          text: `Product ${!product.available ? 'enabled' : 'disabled'} successfully` 
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage({ type: 'error', text: 'Failed to update product' });
    }
  };

  const handleDuplicate = async (product: Product) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...newProduct } = product;

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newProduct,
          name: `${newProduct.name} (Copy)`
        })
      });

      const data = await response.json();
      if (data.success) {
        setProducts([...products, data.data]);
        setMessage({ type: 'success', text: 'Product duplicated successfully' });
      }
    } catch (error) {
      console.error('Error duplicating product:', error);
      setMessage({ type: 'error', text: 'Failed to duplicate product' });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!window.confirm(`Delete ${selectedProducts.length} product(s)?`)) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      let deletedCount = 0;
      
      for (const productId of selectedProducts) {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) deletedCount++;
      }

      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      setMessage({ type: 'success', text: `${deletedCount} product(s) deleted` });
    } catch (error) {
      console.error('Error bulk deleting:', error);
      setMessage({ type: 'error', text: 'Failed to delete some products' });
    }
  };

  // Filter and sort products
  let filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.approval_status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      const matchesAvailability = availabilityFilter === 'all' || 
                                 (availabilityFilter === 'available' ? p.available : !p.available);
      return matchesSearch && matchesStatus && matchesCategory && matchesAvailability;
    });

  if (sortBy === 'price') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'name') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'order') {
    filteredProducts.sort((a, b) => a.display_order - b.display_order);
  } else {
    filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const stats = {
    total: products.length,
    approved: products.filter(p => p.approval_status === 'approved').length,
    pending: products.filter(p => p.approval_status === 'pending').length,
    available: products.filter(p => p.available).length
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">Manage, edit, and organize your product catalog</p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Back
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={() => onNavigate('add-product')}
          style={{ backgroundColor: '#059669' }}
          className="px-6 py-3 text-white rounded-lg hover:opacity-90 font-medium transition-all"
        >
          + Add New Product
        </button>
        <button
          onClick={() => onNavigate('manage-product-order')}
          style={{ backgroundColor: '#2563eb' }}
          className="px-6 py-3 text-white rounded-lg hover:opacity-90 font-medium transition-all"
        >
          Manage Display Order
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <p className="text-sm text-gray-600">Total Products</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <p className="text-sm text-gray-600">Approved</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <p className="text-sm text-gray-600">Pending Review</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.available}</div>
          <p className="text-sm text-gray-600">Available</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created">Newest First</option>
              <option value="price">Price (Low to High)</option>
              <option value="name">Name (A-Z)</option>
              <option value="order">Display Order</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        {selectedProducts.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 p-4 flex items-center justify-between">
            <p className="text-sm font-medium text-blue-900">
              {selectedProducts.length} product(s) selected
            </p>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
            >
              Delete Selected
            </button>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts(filteredProducts.map(p => p.id));
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                      className="w-4 h-4 border border-gray-300 rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price / MOQ</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Availability</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product.id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                          }
                        }}
                        className="w-4 h-4 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.id.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-900">
                      <div className="text-sm">
                        <p>₹{(Number(product.price) || 0).toFixed(2)}</p>
                        <p className="text-xs text-gray-600">MOQ: {product.moq}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {product.approval_status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Approved
                        </span>
                      )}
                      {product.approval_status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                          Pending
                        </span>
                      )}
                      {product.approval_status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleAvailability(product)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                          product.available
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {product.available ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Available
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        {product.display_order}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onNavigate('edit-product', { productId: product.id })}
                          title="Edit"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(product)}
                          title="Duplicate"
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          title="Delete"
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
