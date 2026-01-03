import { useState, useEffect } from 'react';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
import { toast } from 'sonner';
import { Globe, ShieldCheck, Truck, TrendingUp, Smartphone } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string, rememberMe?: boolean) => void;
  onSignup: (email: string, password: string, fullName: string, phone: string, countryCode: string) => void;
  onGoogleAuth?: (credential: string) => void;
  onMobilePreview?: () => void;
  onForgotPassword?: () => void;
  isModal?: boolean;
}

const countryCodes = [
  { code: '+1', country: 'US/CA', flag: 'us', name: 'United States', pattern: /^1/ },
  { code: '+44', country: 'UK', flag: 'gb', name: 'United Kingdom', pattern: /^44/ },
  { code: '+91', country: 'India', flag: 'in', name: 'India', pattern: /^91/ },
  { code: '+86', country: 'China', flag: 'cn', name: 'China', pattern: /^86/ },
  { code: '+81', country: 'Japan', flag: 'jp', name: 'Japan', pattern: /^81/ },
  { code: '+49', country: 'Germany', flag: 'de', name: 'Germany', pattern: /^49/ },
  { code: '+33', country: 'France', flag: 'fr', name: 'France', pattern: /^33/ },
  { code: '+971', country: 'UAE', flag: 'ae', name: 'UAE', pattern: /^971/ },
  { code: '+65', country: 'Singapore', flag: 'sg', name: 'Singapore', pattern: /^65/ },
  { code: '+61', country: 'Australia', flag: 'au', name: 'Australia', pattern: /^61/ },
];

export function Login({ onLogin, onSignup, onGoogleAuth, onMobilePreview, onForgotPassword, isModal = false }: LoginProps) {
  const [step, setStep] = useState<'email' | 'password' | 'signup'>('email');
  const [emailExists, setEmailExists] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Initialize Google Sign-In
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      console.log('Attempting to initialize Google Sign-In');
      console.log('User Agent:', navigator.userAgent);
      console.log('Google available:', typeof (window as any).google);
      
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        console.log('Google Sign-In library loaded');
        const googleButton = document.getElementById('googleSignInButton');
        if (googleButton) {
          console.log('Google button container found');
          (window as any).google.accounts.id.initialize({
            client_id: '651479721750-80l0ekebtn6088mocnaitr2qkti9pg2r.apps.googleusercontent.com',
            callback: handleGoogleResponse
          });
          
          // Render Google button
          (window as any).google.accounts.id.renderButton(
            googleButton,
            { 
              theme: 'outline', 
              size: 'large',
              width: 350,
              text: 'continue_with'
            }
          );
          console.log('Google Sign-In button rendered');
        } else {
          console.log('Google button container NOT found');
        }
      } else {
        console.log('Google Sign-In library NOT loaded');
      }
    };

    // Try to initialize immediately
    initializeGoogleSignIn();

    // If Google library isn't loaded yet, retry after a delay
    const timer = setTimeout(() => {
      initializeGoogleSignIn();
    }, 500);

    return () => clearTimeout(timer);
  }, [step]); // Re-run when step changes

  const handleGoogleResponse = async (response: any) => {
    try {
      if (onGoogleAuth) {
        onGoogleAuth(response.credential);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  // Auto-detect country code when user types phone number
  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    setPhone(digitsOnly);
    
    // Try to detect country code from the number
    for (const country of countryCodes) {
      if (country.pattern.test(digitsOnly)) {
        setCountryCode(country.code);
        break;
      }
    }
  };

  const checkEmailExists = async (emailValue: string) => {
    if (!emailValue || !emailValue.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailValue }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailExists(data.exists);
        setStep(data.exists ? 'password' : 'signup');
      } else {
        toast.error(data.message || 'Error checking email');
      }
    } catch (error) {
      console.error('Email check error:', error);
      toast.error('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkEmailExists(email);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 Login attempt:', { email, password: '***', rememberMe });
    onLogin(email, password, rememberMe);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    onSignup(email, password, fullName, countryCode + phone, countryCode);
  };

  const handleBack = () => {
    setStep('email');
    setPassword('');
    setFullName('');
    setPhone('');
  };

  // Modal mode - simplified layout
  if (isModal) {
    return (
      <div className="py-2">
        {/* Step 1: Email Only */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome to Eximpo Global</h2>
              <p className="text-lg sm:text-base text-gray-600">Enter your email to continue</p>
            </div>

            <div>
              <label className="block mb-2 text-lg sm:text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@company.com"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 text-lg sm:text-base font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        )}

        {/* Step 2a: Password for existing users */}
        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <button
              type="button"
              onClick={handleBack}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-4"
            >
              ← Back
            </button>

            <div className="mb-6">
              <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
              <p className="text-gray-600 text-lg sm:text-sm">{email}</p>
            </div>

            <div>
              <label className="block mb-2 text-lg sm:text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 text-lg sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-base sm:text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-base sm:text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 text-lg sm:text-base font-medium rounded-lg hover:bg-blue-700 transition-colors mt-2"
            >
              Sign In
            </button>
          </form>
        )}

        {/* Step 2b: Full signup for new users */}
        {step === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-5">
            <button
              type="button"
              onClick={handleBack}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-4"
            >
              ← Back
            </button>

            <div className="mb-6">
              <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
              <p className="text-gray-600 text-lg sm:text-sm">{email}</p>
            </div>

            <div>
              <label className="block mb-2 text-lg sm:text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-5 py-4 text-lg sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
                required
                autoFocus
              />
            </div>
            
            <div>
              <label className="block mb-2 text-lg sm:text-sm font-medium text-gray-700">Mobile Number</label>
              <div className="flex gap-2">
                <div className="relative flex-shrink-0">
                  <img 
                    src={`https://flagcdn.com/24x18/${countryCodes.find(c => c.code === countryCode)?.flag}.png`}
                    alt="flag"
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none w-6 h-4 rounded-sm"
                  />
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="pl-12 pr-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer font-medium"
                    style={{ minWidth: '140px' }}
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234567890"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-lg sm:text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 text-lg sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Create a strong password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 text-lg sm:text-base font-medium rounded-lg hover:bg-blue-700 transition-colors mt-2"
            >
              Create Account
            </button>
          </form>
        )}
      </div>
    );
  }

  // Full page layout (non-modal)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left side - Branding & Value Props */}
        <div className="hidden lg:flex flex-col justify-center px-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <Globe className="w-12 h-12" />
              <span className="text-3xl">EximpoGlobal</span>
            </div>
            
            <h1 className="text-4xl mb-6">
              Connect with verified suppliers worldwide
            </h1>
            
            <p className="text-xl mb-12 text-blue-100">
              Streamline international trade with integrated sourcing, payments, shipping, and compliance.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 rounded-lg p-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl mb-1">Verified Suppliers</h3>
                  <p className="text-blue-100">KYC-verified exporters with factory audits and certifications</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 rounded-lg p-3">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl mb-1">End-to-End Tracking</h3>
                  <p className="text-blue-100">Real-time shipment visibility from factory to delivery</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 rounded-lg p-3">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl mb-1">Smart Trade Finance</h3>
                  <p className="text-blue-100">Escrow protection and milestone payments for safe transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Auth Form */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
                <span className="text-2xl text-gray-900">GlobalTrade</span>
              </div>
            </div>
            
            <div className="sm:bg-white sm:rounded-2xl sm:shadow-xl sm:p-8">
              {/* Step 1: Email Only */}
              {step === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome to Eximpo</h2>
                    <p className="text-lg sm:text-base text-gray-600">Enter your email to continue</p>
                  </div>

                  <div>
                    <label className="block mb-2 text-lg sm:text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="you@company.com"
                      required
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 text-base font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 mb-6"
                  >
                    {isLoading ? 'Checking...' : 'Continue'}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-white text-sm text-gray-500">Or</span>
                    </div>
                  </div>

                  <div id="googleSignInButton" className="flex justify-center mt-6"></div>
                </form>
              )}

              {/* Step 2a: Password for existing users */}
              {step === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-4"
                  >
                    ← Back
                  </button>

                  <div className="mb-6">
                    <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                    <p className="text-gray-600 text-lg sm:text-sm">{email}</p>
                  </div>

                  <div>
                    <label className="block mb-2 text-lg sm:text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="rememberMeFull"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="rememberMeFull" className="ml-2 text-base sm:text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-base sm:text-sm text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 text-base font-medium rounded-lg hover:bg-blue-700 transition-colors mt-2"
                  >
                    Sign In
                  </button>
                </form>
              )}

              {/* Step 2b: Full signup for new users */}
              {step === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="space-y-5">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-4"
                  >
                    ← Back
                  </button>

                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
                    <p className="text-gray-600 text-sm">{email}</p>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">Mobile Number</label>
                    <div className="flex gap-2">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={`https://flagcdn.com/24x18/${countryCodes.find(c => c.code === countryCode)?.flag}.png`}
                          alt="flag"
                          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none w-6 h-4 rounded-sm"
                        />
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="pl-12 pr-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer font-medium"
                          style={{ minWidth: '140px' }}
                        >
                          {countryCodes.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1234567890"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Create a strong password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 text-base font-medium rounded-lg hover:bg-blue-700 transition-colors mt-2"
                  >
                    Create Account
                  </button>
                </form>
              )}

              <p className="mt-6 text-center text-xs text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
            
            {onMobilePreview && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onMobilePreview}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-5 h-5" />
                  <span>📱 Preview Mobile App</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

