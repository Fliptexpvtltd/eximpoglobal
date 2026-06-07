import { useState, useEffect } from 'react';
import { User, Building2, Mail, Phone, MapPin, Shield, Settings, LogOut, Upload, Check, X, FileText, Calendar, Globe, Briefcase, Hash, AlertCircle, Save, Camera, Trash2 } from 'lucide-react';
import type { User as UserType } from '../App';
import api from '../services/api';
import { toast } from 'sonner';

interface ProfileProps {
  user: UserType;
  activeMode?: 'buyer' | 'seller';
  onLogout: () => void;
}

export function Profile({ user, activeMode = 'buyer', onLogout }: ProfileProps) {
  const effectiveRole = user?.role === 'both' ? activeMode : (user?.role || 'buyer');
  const isSeller = effectiveRole === 'seller';
  const themeColor = isSeller ? '#059669' : '#2563eb';
  const themeBgLight = isSeller ? '#d1fae5' : '#dbeafe';
  
  const [activeSection, setActiveSection] = useState<'overview' | 'edit-profile' | 'company' | 'kyc' | 'preferences'>('overview');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    position: '',
    department: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: user?.country || ''
  });

  // Company form data
  const [companyData, setCompanyData] = useState({
    companyName: user?.companyName || '',
    legalName: '',
    businessType: '',
    industry: '',
    yearEstablished: '',
    employeeCount: '',
    registrationNumber: '',
    taxId: '',
    website: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });



  // Preferences
  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'USD',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    orderUpdates: true,
    priceAlerts: true
  });

  // Fetch profile stats on mount
  useEffect(() => {
    fetchUserStats();
    fetchCompanyDetails();
    fetchPreferences();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/auth/profile/stats');
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await api.delete('/auth/account');
      if (response.success) {
        toast.success('Account deleted successfully');
        // Clear auth and logout
        setTimeout(() => {
          onLogout();
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      const response = await api.get('/auth/profile/company');
      if (response.success && response.data) {
        setCompanyData(prev => ({
          ...prev,
          legalName: response.data.legal_name || '',
          businessType: response.data.business_type || '',
          industry: response.data.industry || '',
          yearEstablished: response.data.year_established || '',
          employeeCount: response.data.employee_count || '',
          registrationNumber: response.data.registration_number || '',
          taxId: response.data.tax_id || '',
          website: response.data.website || '',
          description: response.data.description || '',
          address: response.data.address || '',
          city: response.data.city || '',
          state: response.data.state || '',
          zipCode: response.data.zip_code || '',
          country: response.data.company_country || response.data.country || ''
        }));
      }
    } catch (error) {
      console.error('Failed to fetch company details:', error);
    }
  };



  const fetchPreferences = async () => {
    try {
      const response = await api.get('/auth/profile/preferences');
      if (response.success && response.data) {
        setPreferences({
          language: response.data.language || 'en',
          currency: response.data.currency || 'USD',
          timezone: response.data.timezone || 'America/New_York',
          dateFormat: response.data.date_format || 'MM/DD/YYYY',
          emailNotifications: response.data.email_notifications !== undefined ? response.data.email_notifications : true,
          smsNotifications: response.data.sms_notifications || false,
          marketingEmails: response.data.marketing_emails || false,
          orderUpdates: response.data.order_updates !== undefined ? response.data.order_updates : true,
          priceAlerts: response.data.price_alerts !== undefined ? response.data.price_alerts : true
        });
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    }
  };

  const handleSaveCompany = async () => {
    setLoading(true);
    try {
      const response = await api.put('/auth/profile/company', {
        legalName: companyData.legalName,
        businessType: companyData.businessType,
        industry: companyData.industry,
        yearEstablished: companyData.yearEstablished,
        employeeCount: companyData.employeeCount,
        registrationNumber: companyData.registrationNumber,
        taxId: companyData.taxId,
        website: companyData.website,
        description: companyData.description,
        address: companyData.address,
        city: companyData.city,
        state: companyData.state,
        zipCode: companyData.zipCode,
        country: companyData.country
      });
      
      if (response.success) {
        toast.success('Company details updated successfully');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update company details');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      const response = await api.put('/auth/profile/preferences', {
        language: preferences.language,
        currency: preferences.currency,
        timezone: preferences.timezone,
        dateFormat: preferences.dateFormat,
        emailNotifications: preferences.emailNotifications,
        smsNotifications: preferences.smsNotifications,
        marketingEmails: preferences.marketingEmails,
        orderUpdates: preferences.orderUpdates,
        priceAlerts: preferences.priceAlerts
      });
      
      if (response.success) {
        toast.success('Preferences updated successfully');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Render section content
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'edit-profile':
        return renderEditProfile();
      case 'company':
        return renderCompanyDetails();
      case 'kyc':
        return renderKYC();
      case 'preferences':
        return renderPreferences();
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <>
      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: themeBgLight }}>
              <User className="w-10 h-10" style={{ color: themeColor }} />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl mb-1">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                user.role === 'buyer' ? 'bg-blue-100 text-blue-800' :
                user.role === 'seller' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                user.kycStatus === 'approved' ? 'bg-green-100 text-green-800' :
                user.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                KYC: {user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Building2 className="w-5 h-5 text-gray-600" />
            <div>
              <div className="text-sm text-gray-600">Company</div>
              <div className="text-gray-900">{user.companyName}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="text-gray-900 truncate">{user.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats?.activeOrders || 0}
          </div>
          <div className="text-sm text-gray-600">Active Orders</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats?.totalOrders || 0}
          </div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${stats?.totalSpent ? (stats.totalSpent / 1000000).toFixed(1) + 'M' : stats?.totalRevenue ? (stats.totalRevenue / 1000000).toFixed(1) + 'M' : '0'}
          </div>
          <div className="text-sm text-gray-600">{isSeller ? 'Total Revenue' : 'Total Spent'}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats?.onTimeRate || 0}%
          </div>
          <div className="text-sm text-gray-600">On-Time Rate</div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">About EximpoGlobal</h3>
        <p className="text-gray-600 mb-4">
          Version 1.0.0 (MVP)
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Your trusted platform for international trade. Connect with verified buyers and sellers worldwide.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="text-blue-600 hover:text-blue-700 text-sm text-left">
            Terms of Service
          </button>
          <button className="text-blue-600 hover:text-blue-700 text-sm text-left">
            Privacy Policy
          </button>
          <button className="text-blue-600 hover:text-blue-700 text-sm text-left">
            Help Center
          </button>
        </div>
      </div>
    </>
  );

  const renderEditProfile = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <input
              type="text"
              value={profileData.position}
              onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <input
            type="text"
            value={profileData.department}
            onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={profileData.address}
            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={profileData.city}
              onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
            <input
              type="text"
              value={profileData.state}
              onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
            <input
              type="text"
              value={profileData.zipCode}
              onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <select
            value={profileData.country}
            onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Canada</option>
            <option>Australia</option>
            <option>Germany</option>
            <option>France</option>
            <option>India</option>
            <option>China</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setActiveSection('overview')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompanyDetails = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Company Details</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={companyData.companyName}
              onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Legal Name</label>
            <input
              type="text"
              value={companyData.legalName}
              onChange={(e) => setCompanyData({ ...companyData, legalName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
            <select
              value={companyData.businessType}
              onChange={(e) => setCompanyData({ ...companyData, businessType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Corporation</option>
              <option>LLC</option>
              <option>Partnership</option>
              <option>Sole Proprietorship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={companyData.industry}
              onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Manufacturing</option>
              <option>Electronics</option>
              <option>Textiles</option>
              <option>Automotive</option>
              <option>Spices</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year Established</label>
            <input
              type="text"
              value={companyData.yearEstablished}
              onChange={(e) => setCompanyData({ ...companyData, yearEstablished: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee Count</label>
            <select
              value={companyData.employeeCount}
              onChange={(e) => setCompanyData({ ...companyData, employeeCount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>1-10</option>
              <option>11-50</option>
              <option>50-200</option>
              <option>200-500</option>
              <option>500+</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
            <input
              type="text"
              value={companyData.registrationNumber}
              onChange={(e) => setCompanyData({ ...companyData, registrationNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
            <input
              type="text"
              value={companyData.taxId}
              onChange={(e) => setCompanyData({ ...companyData, taxId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={companyData.website}
            onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
          <textarea
            value={companyData.description}
            onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setActiveSection('overview')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCompany}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderKYC = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">KYC Verification</h2>
      
      {/* KYC Status */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${
        user.kycStatus === 'approved' ? 'bg-green-50 border-green-200' :
        user.kycStatus === 'pending' ? 'bg-yellow-50 border-yellow-200' :
        'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-3">
          {user.kycStatus === 'approved' && <Check className="w-6 h-6 text-green-600" />}
          {user.kycStatus === 'pending' && <AlertCircle className="w-6 h-6 text-yellow-600" />}
          {user.kycStatus === 'rejected' && <X className="w-6 h-6 text-red-600" />}
          <div>
            <h3 className={`font-bold ${
              user.kycStatus === 'approved' ? 'text-green-900' :
              user.kycStatus === 'pending' ? 'text-yellow-900' :
              'text-red-900'
            }`}>
              KYC Status: {user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)}
            </h3>
            <p className={`text-sm ${
              user.kycStatus === 'approved' ? 'text-green-700' :
              user.kycStatus === 'pending' ? 'text-yellow-700' :
              'text-red-700'
            }`}>
              {user.kycStatus === 'approved' && 'Your account is fully verified'}
              {user.kycStatus === 'pending' && 'Your documents are under review (typically 24-48 hours)'}
              {user.kycStatus === 'rejected' && 'Please resubmit your documents'}
            </p>
          </div>
        </div>
      </div>

      {/* Required Documents */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 mb-4">Required Documents</h3>
        
        {/* Business License */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Business License</p>
                <p className="text-sm text-gray-500">Valid business registration document</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Approved</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Uploaded: Nov 15, 2024</span>
          </div>
        </div>

        {/* Tax Certificate */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Tax Certificate</p>
                <p className="text-sm text-gray-500">Tax registration or EIN document</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Approved</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Uploaded: Nov 15, 2024</span>
          </div>
        </div>

        {/* Bank Statement */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Bank Statement</p>
                <p className="text-sm text-gray-500">Last 3 months business bank statement</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Pending</span>
          </div>
          <button className="mt-2 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        {/* Identity Proof */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Identity Proof</p>
                <p className="text-sm text-gray-500">Director/Owner ID (Passport, License, etc.)</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Approved</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Uploaded: Nov 15, 2024</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> All documents should be clear, recent (within 3 months), and show complete information. 
          Accepted formats: PDF, JPG, PNG (max 5MB per file).
        </p>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>
      
      <div className="space-y-6">
        {/* Regional Settings */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Regional Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={preferences.currency}
                onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CNY">CNY - Chinese Yuan</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
              <select
                value={preferences.dateFormat}
                onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            {Object.entries({
              emailNotifications: 'Email Notifications',
              smsNotifications: 'SMS Notifications',
              marketingEmails: 'Marketing & Promotional Emails',
              orderUpdates: 'Order Status Updates',
              priceAlerts: 'Price Alerts & Special Offers'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                <span className="text-gray-900">{label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences[key as keyof typeof preferences] as boolean}
                    onChange={(e) => setPreferences({ ...preferences, [key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setActiveSection('overview')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePreferences}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <p className="text-green-900 font-medium">Changes saved successfully!</p>
        </div>
      )}

      <div className="p-6 rounded-xl text-white" style={{ background: `linear-gradient(to right, ${themeColor}, ${isSeller ? '#047857' : '#1e40af'})` }}>
        <h1 className="text-2xl md:text-3xl mb-2">{isSeller ? 'Seller Profile' : 'Buyer Profile'}</h1>
        <p className="text-base md:text-xl opacity-90">Manage your account settings and preferences</p>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white rounded-xl border border-gray-200 p-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeSection === 'overview'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSection('edit-profile')}
            className={`px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeSection === 'edit-profile'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveSection('company')}
            className={`px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeSection === 'company'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Company
          </button>
          <button
            onClick={() => setActiveSection('kyc')}
            className={`px-4 py-3 rounded-lg transition-colors text-sm font-medium relative ${
              activeSection === 'kyc'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            KYC
            {user.kycStatus === 'pending' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveSection('preferences')}
            className={`px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeSection === 'preferences'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Preferences
          </button>
        </div>
      </div>

      {/* Content Area */}
      {renderContent()}

      {/* Logout & Delete Account */}
      <div className="space-y-2">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
        
        <button 
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Delete Account
        </button>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Account?</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              This action cannot be undone. All your data including orders, products, messages, and profile information will be permanently deleted.
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-800">
                <strong>Email:</strong> {user?.email}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
