import { useState } from 'react';
import { ShoppingCart, Store, Truck, Calculator, Shield, ArrowLeft } from 'lucide-react';
import type { UserRole } from '../App';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole, companyName: string, industry: string) => void;
  onBack: () => void;
  isModal?: boolean;
}

const roles = [
  {
    id: 'buyer' as UserRole,
    name: 'Buyer (Importer)',
    description: 'Source products from global suppliers',
    icon: ShoppingCart,
    color: 'blue',
  },
  {
    id: 'seller' as UserRole,
    name: 'Seller (Exporter)',
    description: 'List your products and reach global buyers',
    icon: Store,
    color: 'green',
  },
];

const industries = [
  'Electronics & Technology',
  'Textiles & Apparel',
  'Machinery & Equipment',
  'Polymers',
  'Spices',
  'Automotive & Parts',
  'Pharma',
  'Health & Beauty',
  'Sports & Outdoors',
  'Other',
];

export function RoleSelection({ onSelectRole, onBack, isModal = false }: RoleSelectionProps) {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [businessType, setBusinessType] = useState<'company' | 'individual'>('company');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');

  const handleRoleClick = (role: UserRole) => {
    setSelectedRole(role);
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole && companyName && industry) {
      onSelectRole(selectedRole, companyName, industry);
    }
  };

  if (step === 'details') {
    const detailsContent = (
      <>
        {!isModal && (
          <button
            onClick={() => setStep('role')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        )}
        
        <div className={isModal ? '' : 'bg-white rounded-2xl shadow-xl p-8'}>
            <div className="mb-8">
              <h2 className="text-2xl mb-2">Business Details</h2>
              <p className="text-gray-600">
                Tell us about your business to personalize your experience
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-3 text-gray-700">Business Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setBusinessType('company')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      businessType === 'company'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-center">Company</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setBusinessType('individual')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      businessType === 'individual'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="text-center">Individual</div>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-gray-700">
                  {businessType === 'company' ? 'Company Name' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={businessType === 'company' ? 'Acme Corp' : 'John Doe'}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 text-gray-700">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-900">
                  <span className="block mb-1">📋 Next Steps: KYC Verification</span>
                  <div>After registration, you'll be asked to provide:</div>
                  <ul className="mt-2 ml-4 space-y-1 list-disc text-blue-800">
                    <li>Company registration documents</li>
                    <li>VAT/GST number (if applicable)</li>
                    <li>Bank verification letter</li>
                    <li>Identity verification</li>
                  </ul>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Dashboard
              </button>
            </form>
          </div>
        </>
      );
      
      if (isModal) {
        return detailsContent;
      }
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl">
            {detailsContent}
          </div>
        </div>
      );
    }

  const roleSelectionContent = (
    <>
      {!isModal && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      )}
      
      <div className={isModal ? 'text-center mb-12' : 'text-center mb-12'}>
        <h1 className={isModal ? 'text-xl mb-2' : 'text-3xl mb-3'}>Choose Your Role</h1>
        <p className={isModal ? 'text-sm text-gray-600' : 'text-xl text-gray-600'}>
          How will you be using EximpoGlobal?
        </p>
      </div>
      
      <div className={isModal ? 'grid grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto' : 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto'}>
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => handleRoleClick(role.id)}
              className={isModal 
                ? 'bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-all text-left'
                : 'bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 text-left'
              }
            >
              <div className={isModal
                ? `w-8 h-8 rounded-lg bg-${role.color}-100 flex items-center justify-center mb-2`
                : `w-14 h-14 rounded-xl bg-${role.color}-100 flex items-center justify-center mb-4`
              }>
                <Icon className={isModal ? `w-5 h-5 text-${role.color}-600` : `w-8 h-8 text-${role.color}-600`} />
              </div>
              <h3 className={isModal ? 'text-sm mb-1' : 'text-xl mb-2'}>{role.name}</h3>
              <p className={isModal ? 'text-xs text-gray-600' : 'text-gray-600'}>{role.description}</p>
            </button>
          );
        })}
      </div>
    </>
  );
  
  if (isModal) {
    return roleSelectionContent;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl">
        {roleSelectionContent}
      </div>
    </div>
  );
}
