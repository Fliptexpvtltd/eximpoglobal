import { useState, useEffect } from 'react';
import { ArrowLeft, Package, DollarSign, TrendingUp, Calendar, User, Building, MapPin, FileText, Image as ImageIcon, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  moq: number;
  lead_time: string;
  origin_country: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  supplier_id: string;
  supplier_name: string;
  supplier_email: string;
  supplier_company: string;
  images: string[];
  created_at: string;
  updated_at: string;
  certifications?: string[] | string; // Array or string
  specifications?: any; // JSONB object with various fields
}

export function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.data);
      } else {
        showAlert('error', 'Failed to fetch product details');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      showAlert('error', 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProduct = async (status: 'approved' | 'rejected') => {
    if (!product) return;
    
    if (status === 'rejected' && !rejectionReason.trim()) {
      showAlert('error', 'Please provide a reason for rejection');
      return;
    }
    
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/products/${productId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status,
          rejectionReason: status === 'rejected' ? rejectionReason : null
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showAlert('success', `Product ${status} successfully`);
        setRejectionReason('');
        fetchProductDetail(); // Refresh product details
      } else {
        showAlert('error', data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error approving product:', error);
      showAlert('error', 'Failed to update product');
    } finally {
      setActionLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h3>
        <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
        <Button onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 border-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 border-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 border-red-600 bg-red-50';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertTriangle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-1">Product ID: {product.id}</p>
          </div>
        </div>
        <Badge className={`${getStatusColor(product.approval_status)} px-4 py-2`}>
          {getStatusIcon(product.approval_status)}
          <span className="ml-2 font-medium capitalize">{product.approval_status}</span>
        </Badge>
      </div>

      {/* Alert */}
      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <Card className="border-2 border-dashed">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Product Approval</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {product.approval_status === 'pending' && 'Review this product and approve or reject it'}
                  {product.approval_status === 'approved' && 'This product is currently approved and visible in the catalog'}
                  {product.approval_status === 'rejected' && 'This product has been rejected and is not visible in the catalog'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {product.approval_status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleApproveProduct('approved')}
                      disabled={actionLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Product
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleApproveProduct('rejected')}
                      disabled={actionLoading}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Product
                    </Button>
                  </>
                )}
                {product.approval_status === 'approved' && (
                  <Button
                    variant="outline"
                    onClick={() => handleApproveProduct('rejected')}
                    disabled={actionLoading}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Revoke Approval
                  </Button>
                )}
                {product.approval_status === 'rejected' && (
                  <Button
                    onClick={() => handleApproveProduct('approved')}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Product
                  </Button>
                )}
              </div>
            </div>
            
            {/* Rejection Reason Textarea */}
            {(product.approval_status === 'pending' || product.approval_status === 'approved') && (
              <div className="pt-4 border-t">
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (Required for rejection)
                </label>
                <textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide specific feedback to help the seller improve their product listing (e.g., unclear images, missing specifications, incorrect pricing...)"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This reason will be sent to the seller via email to help them understand what needs to be improved.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No images available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Product Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{product.description || 'No description available'}</p>
            </CardContent>
          </Card>

          {/* Specifications */}
          {product.specifications && (
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {typeof product.specifications === 'object' ? (
                    Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-start">
                        <span className="font-medium text-gray-700 min-w-[180px] capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-gray-600">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{String(product.specifications)}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certifications */}
          {product.certifications && (
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(product.certifications) ? (
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">{String(product.certifications)}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 mr-2" />
                  <span className="text-sm">Price</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  ${product.price ? parseFloat(product.price).toFixed(2) : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Package className="h-5 w-5 mr-2" />
                  <span className="text-sm">MOQ</span>
                </div>
                <span className="font-semibold text-gray-900">{product.moq || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  <span className="text-sm">Lead Time</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {(product.specifications && typeof product.specifications === 'object' && (product.specifications as any).leadTime) || 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Category & Origin */}
          <Card>
            <CardHeader>
              <CardTitle>Category & Origin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Category</label>
                <div className="mt-1">
                  <Badge variant="secondary" className="text-sm">{product.category}</Badge>
                </div>
              </div>
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  <label className="text-sm">Origin Country</label>
                </div>
                <span className="font-medium text-gray-900">{product.origin_country || 'Not specified'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Company</label>
                <p className="font-medium text-gray-900">{product.supplier_company}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Contact Name</label>
                <p className="font-medium text-gray-900">{product.supplier_name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-blue-600">{product.supplier_email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Supplier ID</label>
                <p className="text-gray-700 font-mono text-sm">{product.supplier_id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Created</label>
                <p className="text-gray-900">
                  {new Date(product.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Last Updated</label>
                <p className="text-gray-900">
                  {new Date(product.updated_at).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
