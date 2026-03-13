import { useState, useEffect } from 'react';
import { GripVertical, Save, RotateCcw, Check, AlertCircle } from 'lucide-react';
import type { User } from '../App';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  images?: string[];
  approval_status: 'pending' | 'approved' | 'rejected';
  display_order: number;
}

interface ProductOrderManagerProps {
  user: User;
  onBack: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function ProductOrderManager({ user: _user, onBack }: ProductOrderManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

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
      if (data.success) {
        // Sort by display_order
        const sorted = [...data.data].sort((a, b) => a.display_order - b.display_order);
        setProducts(sorted);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedItem === null || draggedItem === targetIndex) {
      setDraggedItem(null);
      return;
    }

    const newProducts = [...products];
    const draggedProduct = newProducts[draggedItem];
    newProducts.splice(draggedItem, 1);
    newProducts.splice(targetIndex, 0, draggedProduct);
    
    setProducts(newProducts);
    setDraggedItem(null);
    setHasChanges(true);
    setMessage(null);
  };

  const handlePositionChange = (index: number, newPosition: number) => {
    const maxPosition = products.length;
    if (newPosition < 1 || newPosition > maxPosition) return;

    const newProducts = [...products];
    const currentPos = index + 1;

    if (newPosition > currentPos) {
      // Moving down
      for (let i = index; i < newPosition - 1; i++) {
        newProducts[i] = newProducts[i + 1];
      }
    } else {
      // Moving up
      for (let i = index; i > newPosition - 1; i--) {
        newProducts[i] = newProducts[i - 1];
      }
    }
    newProducts[newPosition - 1] = products[index];

    setProducts(newProducts);
    setHasChanges(true);
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const reorderData = products.map((product, index) => ({
        id: product.id,
        order: index // 0-based order
      }));

      const response = await fetch(`${API_BASE_URL}/products/my/products/reorder`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ products: reorderData })
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Product order updated successfully!' });
        setHasChanges(false);
        // Update local display_order for each product
        const updatedProducts = products.map((product, index) => ({
          ...product,
          display_order: index
        }));
        setProducts(updatedProducts);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update product order' });
      }
    } catch (error) {
      console.error('Error saving product order:', error);
      setMessage({ type: 'error', text: 'Failed to save product order' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchProducts();
    setHasChanges(false);
    setMessage(null);
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
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Product Order</h1>
          <p className="text-gray-600 mt-2">Drag products to reorder how they appear in your catalog and on supplier profiles</p>
        </div>
        <button
          onClick={onBack}
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

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg">You have no products yet</p>
        </div>
      ) : (
        <>
          {/* Products List */}
          <div className="space-y-3">
            {products.map((product, index) => (
              <div
                key={product.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`bg-white border-2 rounded-lg p-4 transition-all cursor-move ${
                  draggedItem === index
                    ? 'opacity-50 border-blue-400 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Drag Handle */}
                  <div className="flex-shrink-0">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {product.category} • ₹{(Number(product.price) || 0).toFixed(2)}
                    </p>
                  </div>

                  {/* Position Input */}
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-600">Position:</label>
                    <input
                      type="number"
                      min="1"
                      max={products.length}
                      value={index + 1}
                      onChange={(e) => handlePositionChange(index, parseInt(e.target.value) || 1)}
                      className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">of {products.length}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    {product.approval_status === 'approved' && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Approved
                      </span>
                    )}
                    {product.approval_status === 'pending' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                        Pending
                      </span>
                    )}
                    {product.approval_status === 'rejected' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                hasChanges
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-600 cursor-not-allowed'
              }`}
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {hasChanges && (
              <button
                onClick={handleReset}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Drag products to reorder them, or use the position number input. Products will display in this order on your catalog and in your supplier profile.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
