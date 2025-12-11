import { useState } from 'react';
import { Plus, X, Upload, Calendar } from 'lucide-react';
import type { User, Product, RFQ } from '../App';

interface RFQBuilderProps {
  initialProduct: Product | null;
  user: User | null;
  onSubmit: (rfq: RFQ) => void;
  onCancel: () => void;
}

const incoterms = ['EXW', 'FOB', 'CFR', 'CIF', 'DAP', 'DDP'];

const certifications = [
  'CE', 'FDA', 'ISO 9001', 'ISO 14001', 'RoHS', 'REACH', 
  'GOTS', 'OEKO-TEX', 'FSC', 'TUV', 'UL'
];

interface LineItem {
  productName: string;
  quantity: number;
  specifications: string;
  targetPrice?: number;
}

export function RFQBuilder({ initialProduct, user, onSubmit, onCancel }: RFQBuilderProps) {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    initialProduct 
      ? { 
          productName: initialProduct.name, 
          quantity: initialProduct.moq, 
          specifications: '' 
        }
      : { productName: '', quantity: 0, specifications: '' }
  ]);
  
  const [incoterm, setIncoterm] = useState('FOB');
  const [destinationPort, setDestinationPort] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [requiredCerts, setRequiredCerts] = useState<string[]>([]);
  const [deadline, setDeadline] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [packagingRequirements, setPackagingRequirements] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const addLineItem = () => {
    setLineItems([...lineItems, { productName: '', quantity: 0, specifications: '' }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const toggleCertification = (cert: string) => {
    if (requiredCerts.includes(cert)) {
      setRequiredCerts(requiredCerts.filter(c => c !== cert));
    } else {
      setRequiredCerts([...requiredCerts, cert]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      const rfqData = {
        title: lineItems.map(item => item.productName).join(', '),
        description: additionalRequirements || 'RFQ Request',
        category: initialProduct?.category || 'General',
        lineItems: lineItems.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          unit: 'units',
          specifications: item.specifications || ''
        })),
        deliveryDate: deadline || null,
        deliveryLocation: `${destinationPort}, ${destinationCountry}` || null,
        incoterms: incoterm,
        paymentTerms: 'Net 30'
      };

      const response = await fetch('/api/rfqs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rfqData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('RFQ created successfully!');
        const rfq: RFQ = {
          id: data.data.id,
          buyerId: user?.id || '1',
          products: lineItems.map(item => ({
            productId: 'p1',
            quantity: item.quantity,
            specifications: item.specifications,
          })),
          incoterm,
          destinationPort,
          targetPrice: lineItems[0].targetPrice,
          deadline,
          status: 'sent',
          createdAt: new Date().toISOString().split('T')[0],
        };
        onSubmit(rfq);
      } else {
        alert('Failed to create RFQ: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating RFQ:', error);
      alert('Failed to create RFQ. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      <div>
        <h1 className="text-2xl md:text-3xl mb-2">Create Request for Quote</h1>
        <p className="text-base md:text-xl text-gray-600">Provide detailed requirements to receive accurate quotes</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <h2 className="text-lg md:text-xl">Product Details</h2>
            <button
              type="button"
              onClick={addLineItem}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
          
          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-gray-900">Product {index + 1}</h3>
                  {lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 text-gray-700">Product Name</label>
                    <input
                      type="text"
                      value={item.productName}
                      onChange={(e) => updateLineItem(index, 'productName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., Organic Cotton T-Shirts"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-700">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700">Specifications & Requirements</label>
                  <textarea
                    value={item.specifications}
                    onChange={(e) => updateLineItem(index, 'specifications', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24"
                    placeholder="Describe product specifications, materials, colors, sizes, etc."
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-gray-700">Target Price per Unit (Optional)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      value={item.targetPrice || ''}
                      onChange={(e) => updateLineItem(index, 'targetPrice', parseFloat(e.target.value))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0.00"
                    />
                    <span className="text-gray-600">INR</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Shipping & Terms</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-700">Preferred Incoterm</label>
              <select
                value={incoterm}
                onChange={(e) => setIncoterm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                {incoterms.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {incoterm === 'FOB' && 'Free on Board - Seller delivers to port'}
                {incoterm === 'CIF' && 'Cost, Insurance & Freight included'}
                {incoterm === 'EXW' && 'Ex Works - Buyer arranges pickup'}
                {incoterm === 'DDP' && 'Delivered Duty Paid - Door to door'}
              </p>
            </div>
            
            <div>
              <label className="block mb-2 text-gray-700">Destination Country</label>
              <select
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select country</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Australia">Australia</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-gray-700">Destination Port/City</label>
              <input
                type="text"
                value={destinationPort}
                onChange={(e) => setDestinationPort(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Los Angeles, Hamburg"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-gray-700">Quote Deadline</label>
              <div className="relative">
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Certifications & Compliance</h2>
          
          <div>
            <label className="block mb-3 text-gray-700">Required Certifications</label>
            <div className="flex flex-wrap gap-2">
              {certifications.map(cert => (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleCertification(cert)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    requiredCerts.includes(cert)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cert}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Additional Requirements</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-700">Packaging Requirements</label>
              <textarea
                value={packagingRequirements}
                onChange={(e) => setPackagingRequirements(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24"
                placeholder="Specify packaging materials, labeling, branding requirements, etc."
              />
            </div>
            
            <div>
              <label className="block mb-2 text-gray-700">Additional Notes</label>
              <textarea
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32"
                placeholder="Any other requirements, quality standards, inspection needs, delivery preferences, etc."
              />
            </div>
            
            <div>
              <label className="block mb-2 text-gray-700">Attachments (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">
                  Technical drawings, specifications, samples (Max 10MB each)
                </p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setAttachments(Array.from(e.target.files));
                    }
                  }}
                />
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-blue-900 mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">1.</span>
              <span>Your RFQ will be sent to verified suppliers matching your requirements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">2.</span>
              <span>Suppliers will respond with detailed quotes within your deadline</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">3.</span>
              <span>Compare quotes side-by-side and negotiate terms directly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">4.</span>
              <span>Accept a quote to convert it into a purchase order</span>
            </li>
          </ul>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send RFQ to Suppliers
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
