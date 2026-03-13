import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { User, UserRole } from '../App';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface PendingAction {
  type: 'create-rfq' | 'order-sample' | 'view-quotes' | 'create-po' | 'chat' | 'view-dashboard' | 'view-orders' | 'browse-catalog';
  data?: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authStep: 'login' | 'role-selection';
  pendingAction: PendingAction | null;
  pendingSignupData: { email: string; password: string; fullName: string; phone: string; countryCode: string } | null;
  login: (email: string, password: string, rememberMe?: boolean) => void;
  signup: (email: string, password: string, fullName: string, phone: string, countryCode: string) => void;
  selectRole: (role: UserRole, companyName: string, industry: string) => void;
  googleAuth: (credential: string) => Promise<void>;
  logout: () => void;
  requireAuth: (action: PendingAction) => void;
  closeAuthModal: () => void;
  executePendingAction: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'login' | 'role-selection'>('login');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [pendingSignupData, setPendingSignupData] = useState<{ email: string; password: string; fullName: string; phone: string; countryCode: string } | null>(null);

  // Load user from token on mount
  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return; // No token, nothing to load
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const loadedUser: User = {
            id: data.data.id,
            email: data.data.email,
            name: data.data.fullName,
            role: data.data.role as UserRole,
            companyName: data.data.companyName,
            kycStatus: data.data.verified ? 'approved' : 'pending',
          };
          setUser(loadedUser);
        } else {
          // Token invalid or expired, clear it
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        }
      } catch (error) {
        console.error('❌ Error loading user from token:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromToken();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token based on rememberMe choice
        if (rememberMe) {
          localStorage.setItem('token', data.data.token);
          sessionStorage.removeItem('token'); // Clear session storage
        } else {
          sessionStorage.setItem('token', data.data.token);
          localStorage.removeItem('token'); // Clear local storage
        }
        
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
        toast.success(`Welcome back, ${newUser.name}!`);
        
        // Execute pending action
        setTimeout(() => {
          executePendingAction();
        }, 100);
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const signup = (email: string, password: string, fullName: string, phone: string, countryCode: string) => {
    setPendingSignupData({ email, password, fullName, phone, countryCode });
    setAuthStep('role-selection');
  };

  const selectRole = async (role: UserRole, companyName: string, industry: string) => {
    if (!pendingSignupData) {
      toast.error('Signup data missing. Please start over.');
      return;
    }

    try {
      // Check if this is a Google sign-in user
      const googleTempToken = sessionStorage.getItem('googleTempToken');
      const isGoogleUser = !!googleTempToken;

      const endpoint = isGoogleUser 
        ? `${API_BASE_URL}/auth/google/complete-registration`
        : `${API_BASE_URL}/auth/register`;

      const body = isGoogleUser 
        ? {
            tempToken: googleTempToken,
            role,
            companyName,
            industry
          }
        : {
            email: pendingSignupData.email,
            password: pendingSignupData.password,
            fullName: pendingSignupData.fullName,
            phone: pendingSignupData.phone,
            role: role,
            companyName,
            country: pendingSignupData.countryCode.replace('+', ''),
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear Google temp token if it exists
        sessionStorage.removeItem('googleTempToken');
        
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
        toast.success('Account created successfully! Welcome to EximpoGlobal!');
        
        setTimeout(() => {
          executePendingAction();
        }, 100);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setPendingAction(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    toast.success('Logged out successfully');
  };

  const googleAuth = async (credential: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.isNewUser) {
          // New user - needs role selection
          setPendingSignupData({
            email: data.user.email,
            password: '', // No password for Google auth
            fullName: data.user.name,
            phone: '',
            countryCode: '+91'
          });
          // Store temp token
          sessionStorage.setItem('googleTempToken', data.tempToken);
          setAuthStep('role-selection');
        } else {
          // Existing user - complete login
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
          
          setTimeout(() => {
            executePendingAction();
          }, 100);
        }
      } else {
        toast.error(data.message || 'Google sign-in failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  const requireAuth = (action: PendingAction) => {
    if (!user) {
      setPendingAction(action);
      setIsAuthModalOpen(true);
      setAuthStep('login');
      // Dispatch event to navigate to auth page
      window.dispatchEvent(new CustomEvent('navigate-to-auth'));
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
      isLoading,
      isAuthModalOpen,
      authStep,
      pendingAction,
      pendingSignupData,
      login,
      signup,
      selectRole,
      googleAuth,
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
