import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminLogin } from './components/AdminLogin';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './components/AdminDashboard';
import { UserManagement } from './components/UserManagement';
import { ProductManagement } from './components/ProductManagement';
import { ProductDetail } from './components/ProductDetail';
import { RFQManagement } from './components/RFQManagement';
import { OrderManagement } from './components/OrderManagement';
import { AnalyticsPage } from './components/AnalyticsPage';
import { SettingsPage } from './components/SettingsPage';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

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
      
      {currentView === 'products' && !selectedProductId && (
        <ProductManagement onViewProduct={(productId) => setSelectedProductId(productId)} />
      )}
      
      {currentView === 'products' && selectedProductId && (
        <ProductDetail 
          productId={selectedProductId} 
          onBack={() => setSelectedProductId(null)} 
        />
      )}
      
      {currentView === 'rfqs' && (
        <RFQManagement />
      )}
      
      {currentView === 'orders' && (
        <OrderManagement />
      )}
      
      {currentView === 'analytics' && (
        <AnalyticsPage />
      )}
      
      {currentView === 'settings' && (
        <SettingsPage />
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
