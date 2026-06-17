import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Plus, X, Save, AlertCircle } from 'lucide-react';
import type { User } from '../App';
import { CarSpecsForm, defaultCarSpecs } from './CarSpecsForm';
import type { CarSpecs } from './CarSpecsForm';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface AddProductProps {
  user: User;
  activeMode: 'buyer' | 'seller';
  onBack: () => void;
  onSuccess?: () => void;
}

export function AddProduct({ user, activeMode, onBack, onSuccess }: AddProductProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    hsCode: '',
    description: '',
    price: '',
    currency: 'USD',
    moq: '',
    unit: 'pieces',
    leadTime: '',
    origin: 'China',
    incoterms: ['FOB', 'CIF', 'EXW'] as string[],
    specifications: '',
    features: '',
    certifications: [] as string[],
    customization: false,
    sampleAvailable: true,
    samplePrice: '',
    packagingDetails: '',
    shippingWeight: '',
    dimensions: { length: '', width: '', height: '' },
  });

  const [newCertification, setNewCertification] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [carSpecs, setCarSpecs] = useState<CarSpecs>(defaultCarSpecs);

  const isAutomotive = formData.category === 'Automotive';

  const categories = [
    'Electronics',
    'Textiles & Apparel',
    'Machinery & Equipment',
    'Pharma',
    'Automotive',
    'Spices',
    'Polymers',
    'Construction Materials',
    'Medical & Healthcare',
    'Toys & Sports',
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'CNY', 'INR', 'JPY'];
  const units = ['pieces', 'sets', 'kg', 'tons', 'meters', 'liters'];
  const countries = ['China', 'India', 'Vietnam', 'Thailand', 'Turkey', 'USA', 'Germany', 'Italy'];

  const handleAddCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification)) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification.trim()],
      });
      setNewCertification('');
    }
  };

  const handleRemoveCertification = (cert: string) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((c) => c !== cert),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload image files only');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Show loading toast
      const uploadingToast = toast.loading('Uploading image...');

      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
          toast.error('Authentication required. Please login again.', { id: uploadingToast });
          return;
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('image', file);

        const uploadUrl = `${API_BASE_URL}/uploads/products/image`;

        // Upload to backend
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (data.success && data.file) {
          setImages([...images, data.file.url]);
          toast.success('Image uploaded successfully', { id: uploadingToast });
        } else {
          console.error('❌ Upload failed:', data);
          toast.error(data.message || 'Failed to upload image', { id: uploadingToast });
        }
      } catch (error) {
        console.error('❌ Image upload error:', error);
        toast.error('Failed to upload image. Please try again.', { id: uploadingToast });
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication required. Please login again.');
        return;
      }

      // Prepare product data for API
      const isAutomotiveSubmit = formData.category === 'Automotive';
      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        moq: isAutomotiveSubmit ? 1 : (formData.moq ? parseInt(formData.moq) : null),
        unit: isAutomotiveSubmit ? 'unit' : formData.unit,
        incoterms: isAutomotiveSubmit ? [] : formData.incoterms,
        certifications: formData.certifications,
        images: images,
        specifications: {
          hsCode: formData.hsCode,
          leadTime: formData.leadTime,
          originCountry: formData.origin,
          features: formData.features,
          specifications: formData.specifications,
          customization: formData.customization,
          sampleAvailable: isAutomotiveSubmit ? false : formData.sampleAvailable,
          samplePrice: formData.samplePrice ? parseFloat(formData.samplePrice) : null,
          packaging: formData.packagingDetails,
          shippingWeight: formData.shippingWeight,
          dimensions: formData.dimensions,
          // Car-specific fields (only populated for Automotive)
          ...(isAutomotiveSubmit ? {
            make: carSpecs.make,
            model: carSpecs.model,
            year: carSpecs.year,
            mileage: carSpecs.mileage,
            engineCC: carSpecs.engineCC,
            transmission: carSpecs.transmission,
            fuelType: carSpecs.fuelType,
            bodyType: carSpecs.bodyType,
            condition: carSpecs.condition,
            exteriorColor: carSpecs.exteriorColor,
            vin: carSpecs.vin,
          } : {}),
        },
      };

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Product submitted successfully! Pending admin approval.');
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            onBack();
          }
        }, 2000);
      } else {
        console.error('❌ Server error response:', data);
        console.error('❌ Error message:', data.message);
        console.error('❌ Error details:', data.error);
        if (response.status === 403) {
          toast.error('Access forbidden. You must be logged in as a Seller to add products.');
        } else {
          toast.error(data.message || 'Failed to create product');
        }
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.');
    }
  };

  const isSeller = activeMode === 'seller';
  const themeColor = isSeller ? '#059669' : '#2563eb';

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs">✓</span>
          </div>
          <div>
            <p className="text-green-900 font-medium">Product submitted successfully!</p>
            <p className="text-green-700 text-sm mt-1">Your product is pending admin approval. It will appear in the catalog once approved.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-xl text-white" style={{ background: `linear-gradient(to right, ${themeColor}, ${isSeller ? '#047857' : '#1e40af'})` }}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Catalog
        </button>
        <h1 className="text-2xl md:text-3xl mb-2">Add New Product</h1>
        <p className="text-base md:text-xl opacity-90">List a new product in your catalog</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Premium Wireless Earbuds"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HS Code
                </label>
                <input
                  type="text"
                  value={formData.hsCode}
                  onChange={(e) => setFormData({ ...formData, hsCode: e.target.value })}
                  placeholder="e.g., 8518.30.20"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Provide a comprehensive description that will appear in the "Description" tab
              </p>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                placeholder="Provide a detailed description of your product, including manufacturing details, quality measures, and unique selling points..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Features
              </label>
              <p className="text-xs text-gray-500 mb-2">
                List the main features and benefits (one per line)
              </p>
              <textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                rows={5}
                placeholder="Example:&#10;Pre-shrunk fabric for size stability&#10;Double-stitched seams for durability&#10;Environmentally friendly production&#10;Available in multiple colors and sizes"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {isAutomotive && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
              You are listing an <strong>Automotive</strong> product. Fill in the Vehicle Details section below. Buyers will contact you to inquire — no MOQ or sample ordering applies.
            </p>
          )}

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Specifications
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Enter detailed specifications that will appear in the "Specifications" tab
              </p>
              <textarea
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                rows={5}
                placeholder="Example:&#10;Material: 100% Organic Cotton&#10;Weight: 180 GSM&#10;Sizes Available: XS to 3XL&#10;Color Options: 15+ colors&#10;Production Capacity: 10,000 units/month"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Details (Automotive only) */}
        {isAutomotive && (
          <CarSpecsForm specs={carSpecs} onChange={setCarSpecs} />
        )}

        {/* Pricing & Order Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {isAutomotive ? 'Asking Price' : 'Pricing & Order Details'}
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00 (Leave empty if price varies)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
            </div>

            {!isAutomotive && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order Quantity (MOQ) <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={formData.moq}
                  onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                  placeholder="100 (Leave empty if flexible)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
            )}

            {!isAutomotive && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Time <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.leadTime}
                  onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                  placeholder="e.g., 15-30 days (Leave empty if varies)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country of Origin <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
            )}
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Product Images</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="space-y-2">
                <div className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden group bg-gray-100">
                  <img 
                    src={image} 
                    alt={`Product ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded z-10">
                      Main
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 break-all bg-gray-50 p-2 rounded">
                  <a href={image} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                    {image.length > 60 ? `${image.substring(0, 60)}...` : image}
                  </a>
                </div>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-600">Upload</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          
          <p className="text-sm text-gray-500">
            Upload at least 3 images. First image will be the main product image. Recommended size: 800x800px
          </p>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Certifications & Standards</h2>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCertification())}
              placeholder="e.g., CE, ISO 9001, FDA"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleAddCertification}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.certifications.map((cert) => (
              <span
                key={cert}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                {cert}
                <button
                  type="button"
                  onClick={() => handleRemoveCertification(cert)}
                  className="hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {formData.certifications.length === 0 && (
              <p className="text-sm text-gray-500">No certifications added yet</p>
            )}
          </div>
        </div>

        {/* Additional Options — hidden for Automotive */}
        {!isAutomotive && <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Additional Options</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Customization Available</p>
                <p className="text-sm text-gray-500">Accept custom orders with specific requirements</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.customization}
                  onChange={(e) => setFormData({ ...formData, customization: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Sample Available</p>
                <p className="text-sm text-gray-500">Offer product samples to potential buyers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sampleAvailable}
                  onChange={(e) => setFormData({ ...formData, sampleAvailable: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {!isAutomotive && formData.sampleAvailable && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample Price ({formData.currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.samplePrice}
                  onChange={(e) => setFormData({ ...formData, samplePrice: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>}

        {/* Shipping Details — hidden for Automotive */}
        {!isAutomotive && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping & Incoterms</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supported Incoterms
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Select shipping terms you can offer (will appear in "Shipping & Incoterms" tab)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['FOB', 'CIF', 'EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DDP'].map((term) => (
                  <label key={term} className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.incoterms?.includes(term) || false}
                      onChange={(e) => {
                        const currentTerms = formData.incoterms || [];
                        if (e.target.checked) {
                          setFormData({ ...formData, incoterms: [...currentTerms, term] });
                        } else {
                          setFormData({ ...formData, incoterms: currentTerms.filter(t => t !== term) });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium">{term}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Packaging Details
              </label>
              <textarea
                value={formData.packagingDetails}
                onChange={(e) => setFormData({ ...formData, packagingDetails: e.target.value })}
                rows={2}
                placeholder="Describe how the product will be packaged (e.g., Individual poly bags, 50 units per carton)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Weight (kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.shippingWeight}
                onChange={(e) => setFormData({ ...formData, shippingWeight: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Dimensions (cm)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  value={formData.dimensions.length}
                  onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, length: e.target.value } })}
                  placeholder="Length"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, width: e.target.value } })}
                  placeholder="Width"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, height: e.target.value } })}
                  placeholder="Height"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Important Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-900 mb-1">Review Before Publishing</p>
            <p className="text-sm text-yellow-700">
              Please ensure all information is accurate and complete. Once published, your product will be visible to all buyers on the platform.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Publish Product
          </button>
        </div>
      </form>
    </div>
  );
}


