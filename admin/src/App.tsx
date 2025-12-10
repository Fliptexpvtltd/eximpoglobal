import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminLogin } from './components/AdminLogin';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './components/AdminDashboard';
import { UserManagement } from './components/UserManagement';
import { ProductManagement } from './components/ProductManagement';
import { RFQManagement } from './components/RFQManagement';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout currentView={currentView} onNavigate={setCurrentView}>
      {currentView === 'dashboard' && (
        <AdminDashboard user={user as any} onNavigate={setCurrentView} />
      )}
      
      {currentView === 'users' && (
        <UserManagement />
      )}
      
      {currentView === 'products' && (
        <ProductManagement />
      )}
      
      {currentView === 'rfqs' && (
        <RFQManagement />
      )}
      
      {currentView === 'orders' && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600 mt-2">Coming soon...</p>
        </div>
      )}
      
      {currentView === 'analytics' && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600 mt-2">Coming soon...</p>
        </div>
      )}
      
      {currentView === 'settings' && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600 mt-2">Coming soon...</p>
        </div>
      )}
    </AdminLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
