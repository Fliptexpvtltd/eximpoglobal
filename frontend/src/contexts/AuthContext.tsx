import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../App';

interface PendingAction {
  type: 'create-rfq' | 'order-sample' | 'view-quotes' | 'create-po' | 'chat' | 'view-dashboard' | 'view-orders' | 'browse-catalog';
  data?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  authStep: 'login' | 'role-selection';
  pendingAction: PendingAction | null;
  pendingSignupData: { email: string; password: string; fullName: string; phone: string; countryCode: string } | null;
  login: (email: string, password: string) => void;
  signup: (email: string, password: string, fullName: string, phone: string, countryCode: string) => void;
  selectRole: (role: UserRole, companyName: string, industry: string) => void;
  logout: () => void;
  requireAuth: (action: PendingAction) => void;
  closeAuthModal: () => void;
  executePendingAction: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'login' | 'role-selection'>('login');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [pendingSignupData, setPendingSignupData] = useState<{ email: string; password: string; fullName: string; phone: string; countryCode: string } | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token
        localStorage.setItem('token', data.data.token);
        
        // Create user object
        const newUser: User = {
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.fullName,
          role: data.data.user.role as UserRole,
          companyName: data.data.user.companyName,
          kycStatus: data.data.user.verified ? 'approved' : 'pending',
        };
        
        setUser(newUser);
        setIsAuthModalOpen(false);
        setAuthStep('login');
        
        // Execute pending action
        setTimeout(() => {
          executePendingAction();
        }, 100);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const signup = (email: string, password: string, fullName: string, phone: string, countryCode: string) => {
    setPendingSignupData({ email, password, fullName, phone, countryCode });
    setAuthStep('role-selection');
  };

  const selectRole = async (role: UserRole, companyName: string, industry: string) => {
    if (!pendingSignupData) {
      alert('Signup data missing. Please start over.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: pendingSignupData.email,
          password: pendingSignupData.password,
          fullName: pendingSignupData.fullName,
          phone: pendingSignupData.phone,
          role: role === 'both' ? 'buyer' : role,
          companyName,
          country: pendingSignupData.countryCode.replace('+', ''),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.data.token);
        
        const newUser: User = {
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.fullName,
          role: data.data.user.role as UserRole,
          companyName: data.data.user.companyName,
          kycStatus: data.data.user.verified ? 'approved' : 'pending',
        };
        
        setUser(newUser);
        setIsAuthModalOpen(false);
        setAuthStep('login');
        setPendingSignupData(null);
        
        setTimeout(() => {
          executePendingAction();
        }, 100);
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setPendingAction(null);
  };

  const requireAuth = (action: PendingAction) => {
    if (!user) {
      setPendingAction(action);
      setIsAuthModalOpen(true);
      setAuthStep('login');
    } else {
      // User is already authenticated, execute immediately
      executePendingAction(action);
    }
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthStep('login');
    setPendingAction(null);
  };

  const executePendingAction = (action?: PendingAction) => {
    const actionToExecute = action || pendingAction;
    if (actionToExecute) {
      // Dispatch custom event with pending action
      window.dispatchEvent(new CustomEvent('execute-pending-action', { 
        detail: actionToExecute 
      }));
      setPendingAction(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthModalOpen,
      authStep,
      pendingAction,
      pendingSignupData,
      login,
      signup,
      selectRole,
      logout,
      requireAuth,
      closeAuthModal,
      executePendingAction,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
