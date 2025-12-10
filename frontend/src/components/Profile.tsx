import { useState } from 'react';
import { User, Building2, Mail, Phone, MapPin, Shield, CreditCard, Settings, LogOut, ChevronDown, ChevronUp, Menu } from 'lucide-react';
import type { User as UserType } from '../App';

interface ProfileProps {
  user: UserType;
  onLogout: () => void;
}

export function Profile({ user, onLogout }: ProfileProps) {
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(true);
  const [additionalInfoOpen, setAdditionalInfoOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-2">Profile</h1>
        <p className="text-base md:text-xl text-gray-600">Manage your account settings</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" />
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

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setAccountSettingsOpen(!accountSettingsOpen)}
          className="w-full px-6 py-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors md:cursor-default md:hover:bg-white"
        >
          <div className="flex items-center gap-2">
            <Menu className="w-5 h-5 text-gray-600 md:hidden" />
            <h3 className="text-lg">Account Settings</h3>
          </div>
          <div className="md:hidden">
            {accountSettingsOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </button>
        
        <div className={`divide-y divide-gray-200 ${
          accountSettingsOpen ? 'block' : 'hidden md:block'
        }`}>
          <button className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <User className="w-5 h-5 text-gray-600" />
            <span className="flex-1 text-left">Edit Profile</span>
          </button>
          
          <button className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <Building2 className="w-5 h-5 text-gray-600" />
            <span className="flex-1 text-left">Company Details</span>
          </button>
          
          <button className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <Shield className="w-5 h-5 text-gray-600" />
            <span className="flex-1 text-left">KYC Verification</span>
            {user.kycStatus === 'pending' && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Pending</span>
            )}
          </button>
          
          <button className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <span className="flex-1 text-left">Payment Methods</span>
          </button>
          
          <button className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="flex-1 text-left">Preferences</span>
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setAdditionalInfoOpen(!additionalInfoOpen)}
          className="w-full px-6 py-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors md:cursor-default md:hover:bg-white"
        >
          <div className="flex items-center gap-2">
            <Menu className="w-5 h-5 text-gray-600 md:hidden" />
            <h3 className="text-lg">About EximpoGlobal</h3>
          </div>
          <div className="md:hidden">
            {additionalInfoOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </button>
        
        <div className={`p-6 ${
          additionalInfoOpen ? 'block' : 'hidden md:block'
        }`}>
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
      </div>

      {/* Logout */}
      <button 
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}
