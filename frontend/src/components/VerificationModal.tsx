import { useState } from 'react';
import { toast } from 'sonner';
import { X, Upload, FileText, Check, AlertCircle, Building2, CreditCard, User, FileCheck } from 'lucide-react';
import type { User } from '../App';

interface VerificationModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type VerificationStep = 'documents' | 'company' | 'banking' | 'review';

interface DocumentUpload {
  type: string;
  file: File | null;
  preview: string | null;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export function VerificationModal({ user, isOpen, onClose, onComplete }: VerificationModalProps) {
  const [currentStep, setCurrentStep] = useState<VerificationStep>('documents');
  const [documents, setDocuments] = useState<Record<string, DocumentUpload>>({
    businessLicense: { type: 'Business License', file: null, preview: null, status: 'pending' },
    taxCertificate: { type: 'Tax Certificate / GST', file: null, preview: null, status: 'pending' },
    addressProof: { type: 'Address Proof', file: null, preview: null, status: 'pending' },
    bankStatement: { type: 'Bank Statement', file: null, preview: null, status: 'pending' },
    identityProof: { type: 'Identity Proof (Passport/ID)', file: null, preview: null, status: 'pending' },
  });

  const [companyInfo, setCompanyInfo] = useState({
    legalName: '',
    registrationNumber: '',
    taxId: '',
    yearEstablished: '',
    businessType: '',
    industry: '',
    employeeCount: '',
    annualRevenue: '',
    website: '',
    description: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [bankingInfo, setBankingInfo] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    swiftCode: '',
    accountType: '',
    currency: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (documentKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload PDF, JPG, or PNG files only');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments(prev => ({
          ...prev,
          [documentKey]: {
            ...prev[documentKey],
            file,
            preview: reader.result as string,
            status: 'uploaded'
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDocument = (documentKey: string) => {
    setDocuments(prev => ({
      ...prev,
      [documentKey]: {
        ...prev[documentKey],
        file: null,
        preview: null,
        status: 'pending'
      }
    }));
  };

  const handleSubmit = async () => {
    // Validate all required documents are uploaded
    const requiredDocs = ['businessLicense', 'taxCertificate', 'identityProof'];
    const missingDocs = requiredDocs.filter(key => !documents[key].file);
    
    if (missingDocs.length > 0) {
      toast.error('Please upload all required documents: Business License, Tax Certificate, and Identity Proof');
      return;
    }

    // Validate company info
    if (!companyInfo.legalName || !companyInfo.registrationNumber || !companyInfo.taxId) {
      toast.error('Please fill in all required company information');
      setCurrentStep('company');
      return;
    }

    // Validate banking info
    if (!bankingInfo.accountName || !bankingInfo.accountNumber || !bankingInfo.bankName) {
      toast.error('Please fill in all required banking information');
      setCurrentStep('banking');
      return;
    }

    // Simulate API call
    try {
      setShowSuccess(true);
      setTimeout(() => {
        onComplete();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Verification submission failed:', error);
      toast.error('Failed to submit verification. Please try again.');
    }
  };

  const renderDocuments = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Document Requirements</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• All documents must be clear and readable</li>
              <li>• Accepted formats: PDF, JPG, PNG (Max 5MB per file)</li>
              <li>• Documents should be recent (issued within last 6 months)</li>
              <li>• Required documents are marked with asterisk (*)</li>
            </ul>
          </div>
        </div>
      </div>

      {Object.entries(documents).map(([key, doc]) => {
        const isRequired = ['businessLicense', 'taxCertificate', 'identityProof'].includes(key);
        return (
          <div key={key} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">
                  {doc.type}
                  {isRequired && <span className="text-red-500 ml-1">*</span>}
                </span>
              </div>
              {doc.status === 'uploaded' && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Uploaded
                </span>
              )}
            </div>

            {doc.preview ? (
              <div className="relative">
                {doc.file?.type.includes('image') ? (
                  <img src={doc.preview} alt={doc.type} className="w-full h-32 object-cover rounded border" />
                ) : (
                  <div className="w-full h-32 bg-gray-50 rounded border flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => removeDocument(key)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                  <label className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                    Replace
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(key, e)}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(key, e)}
                />
              </label>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderCompany = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Company Information</h4>
            <p className="text-sm text-blue-800">
              This information will be used to verify your company's legitimacy and appears on your profile.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Legal Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={companyInfo.legalName}
            onChange={(e) => setCompanyInfo({ ...companyInfo, legalName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter legal company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type <span className="text-red-500">*</span>
          </label>
          <select
            value={companyInfo.businessType}
            onChange={(e) => setCompanyInfo({ ...companyInfo, businessType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select type</option>
            <option value="sole-proprietorship">Sole Proprietorship</option>
            <option value="partnership">Partnership</option>
            <option value="pvt-ltd">Private Limited</option>
            <option value="public-ltd">Public Limited</option>
            <option value="llp">LLP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry <span className="text-red-500">*</span>
          </label>
          <select
            value={companyInfo.industry}
            onChange={(e) => setCompanyInfo({ ...companyInfo, industry: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select industry</option>
            <option value="textiles">Textiles & Apparel</option>
            <option value="electronics">Electronics & Technology</option>
            <option value="machinery">Machinery & Equipment</option>
            <option value="automotive">Automotive Parts</option>
            <option value="chemicals">Chemicals & Materials</option>
            <option value="spices">Spices</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Registration Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={companyInfo.registrationNumber}
            onChange={(e) => setCompanyInfo({ ...companyInfo, registrationNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="CIN/Registration number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax ID / GST Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={companyInfo.taxId}
            onChange={(e) => setCompanyInfo({ ...companyInfo, taxId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter GST/Tax ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year Established</label>
          <input
            type="number"
            value={companyInfo.yearEstablished}
            onChange={(e) => setCompanyInfo({ ...companyInfo, yearEstablished: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="YYYY"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Employees</label>
          <select
            value={companyInfo.employeeCount}
            onChange={(e) => setCompanyInfo({ ...companyInfo, employeeCount: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select range</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-500">201-500</option>
            <option value="500+">500+</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={companyInfo.website}
            onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.example.com"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
          <textarea
            value={companyInfo.description}
            onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of your business"
          />
        </div>

        <div className="col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-2">Registered Address</h3>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={companyInfo.address}
            onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Street address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={companyInfo.city}
            onChange={(e) => setCompanyInfo({ ...companyInfo, city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="City"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State/Province <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={companyInfo.state}
            onChange={(e) => setCompanyInfo({ ...companyInfo, state: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="State"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={companyInfo.postalCode}
            onChange={(e) => setCompanyInfo({ ...companyInfo, postalCode: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Postal code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={companyInfo.country}
            onChange={(e) => setCompanyInfo({ ...companyInfo, country: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select country</option>
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="CN">China</option>
            <option value="GB">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="JP">Japan</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderBanking = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Banking Information</h4>
            <p className="text-sm text-blue-800">
              Your banking details are securely stored and used for payment processing only.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Holder Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={bankingInfo.accountName}
            onChange={(e) => setBankingInfo({ ...bankingInfo, accountName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="As per bank records"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={bankingInfo.bankName}
            onChange={(e) => setBankingInfo({ ...bankingInfo, bankName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Bank name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name</label>
          <input
            type="text"
            value={bankingInfo.branchName}
            onChange={(e) => setBankingInfo({ ...bankingInfo, branchName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Branch name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={bankingInfo.accountNumber}
            onChange={(e) => setBankingInfo({ ...bankingInfo, accountNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Account number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
          <select
            value={bankingInfo.accountType}
            onChange={(e) => setBankingInfo({ ...bankingInfo, accountType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select type</option>
            <option value="savings">Savings</option>
            <option value="current">Current</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
          <input
            type="text"
            value={bankingInfo.ifscCode}
            onChange={(e) => setBankingInfo({ ...bankingInfo, ifscCode: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="IFSC Code (for Indian banks)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SWIFT/BIC Code</label>
          <input
            type="text"
            value={bankingInfo.swiftCode}
            onChange={(e) => setBankingInfo({ ...bankingInfo, swiftCode: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="SWIFT/BIC Code (for international)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={bankingInfo.currency}
            onChange={(e) => setBankingInfo({ ...bankingInfo, currency: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select currency</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CNY">CNY - Chinese Yuan</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">Security Notice</p>
            <p>Your banking information is encrypted and stored securely. We never share this information with third parties without your consent.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReview = () => {
    const uploadedDocs = Object.values(documents).filter(doc => doc.file).length;
    const totalDocs = Object.keys(documents).length;
    const completionPercentage = Math.round((uploadedDocs / totalDocs) * 100);

    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 mb-1">Ready for Review</h4>
              <p className="text-sm text-green-800">
                Please review all information before submitting. Our verification team will review your application within 24-48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Documents Uploaded</span>
                <span className="font-medium text-gray-900">{uploadedDocs} / {totalDocs}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all"
                  style={{ 
                    width: `${completionPercentage}%`,
                    backgroundColor: completionPercentage === 100 ? '#10b981' : '#3b82f6'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{uploadedDocs}</p>
            <p className="text-sm text-gray-600">Documents</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <Building2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {companyInfo.legalName ? '✓' : '—'}
            </p>
            <p className="text-sm text-gray-600">Company Info</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {bankingInfo.accountNumber ? '✓' : '—'}
            </p>
            <p className="text-sm text-gray-600">Banking Info</p>
          </div>
        </div>

        {/* Information Review */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Legal Name</p>
              <p className="font-medium text-gray-900">{companyInfo.legalName || '—'}</p>
            </div>
            <div>
              <p className="text-gray-600">Business Type</p>
              <p className="font-medium text-gray-900">{companyInfo.businessType || '—'}</p>
            </div>
            <div>
              <p className="text-gray-600">Registration Number</p>
              <p className="font-medium text-gray-900">{companyInfo.registrationNumber || '—'}</p>
            </div>
            <div>
              <p className="text-gray-600">Tax ID</p>
              <p className="font-medium text-gray-900">{companyInfo.taxId || '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Account Name</p>
              <p className="font-medium text-gray-900">{bankingInfo.accountName || '—'}</p>
            </div>
            <div>
              <p className="text-gray-600">Bank Name</p>
              <p className="font-medium text-gray-900">{bankingInfo.bankName || '—'}</p>
            </div>
            <div>
              <p className="text-gray-600">Account Number</p>
              <p className="font-medium text-gray-900">
                {bankingInfo.accountNumber ? '••••' + bankingInfo.accountNumber.slice(-4) : '—'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">IFSC / SWIFT</p>
              <p className="font-medium text-gray-900">
                {bankingInfo.ifscCode || bankingInfo.swiftCode || '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">What happens next?</p>
              <ul className="space-y-1">
                <li>• Our team will review your documents and information</li>
                <li>• You'll receive an email notification once verification is complete</li>
                <li>• Typical review time: 24-48 hours</li>
                <li>• If additional information is needed, we'll contact you</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const steps = [
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'banking', label: 'Banking', icon: CreditCard },
    { id: 'review', label: 'Review', icon: FileCheck },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Verification</h2>
              <p className="text-gray-600 mt-1">Verify your account to access all features</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-sm mt-2 font-medium ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 'documents' && renderDocuments()}
          {currentStep === 'company' && renderCompany()}
          {currentStep === 'banking' && renderBanking()}
          {currentStep === 'review' && renderReview()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-between">
          <button
            onClick={() => {
              const prevIndex = currentStepIndex - 1;
              if (prevIndex >= 0) {
                setCurrentStep(steps[prevIndex].id as VerificationStep);
              }
            }}
            disabled={currentStepIndex === 0}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save & Exit
            </button>
            
            {currentStepIndex < steps.length - 1 ? (
              <button
                onClick={() => {
                  const nextIndex = currentStepIndex + 1;
                  setCurrentStep(steps[nextIndex].id as VerificationStep);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FileCheck className="w-5 h-5" />
                Submit for Verification
              </button>
            )}
          </div>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Verification Submitted!</h3>
              <p className="text-gray-600">
                We'll review your information and notify you within 24-48 hours.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
