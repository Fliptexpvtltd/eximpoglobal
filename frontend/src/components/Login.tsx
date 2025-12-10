import { useState } from 'react';
import { Globe, ShieldCheck, Truck, TrendingUp, Smartphone } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, fullName: string, phone: string, countryCode: string) => void;
  onMobilePreview?: () => void;
  isModal?: boolean;
}

const countryCodes = [
  { code: '+1', country: 'US/CA', flag: 'US', name: 'United States' },
  { code: '+44', country: 'UK', flag: 'GB', name: 'United Kingdom' },
  { code: '+91', country: 'India', flag: 'IN', name: 'India' },
  { code: '+86', country: 'China', flag: 'CN', name: 'China' },
  { code: '+81', country: 'Japan', flag: 'JP', name: 'Japan' },
  { code: '+49', country: 'Germany', flag: 'DE', name: 'Germany' },
  { code: '+33', country: 'France', flag: 'FR', name: 'France' },
  { code: '+971', country: 'UAE', flag: 'AE', name: 'UAE' },
  { code: '+65', country: 'Singapore', flag: 'SG', name: 'Singapore' },
  { code: '+61', country: 'Australia', flag: 'AU', name: 'Australia' },
];

export function Login({ onLogin, onSignup, onMobilePreview, isModal = false }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignIn) {
      onLogin(email, password);
    } else {
      // Signup
      if (!fullName || !phone) {
        alert('Please fill in all fields');
        return;
      }
      onSignup(email, password, fullName, countryCode + phone, countryCode);
    }
  };

  // Modal mode - simplified layout
  if (isModal) {
    return (
      <div className="py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <div>
              <label className="block mb-2 text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block mb-2 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@company.com"
              required
            />
          </div>
          
          {!isSignIn && (
            <div>
              <label className="block mb-2 text-gray-700">Mobile Number</label>
              <div className="flex gap-2">
                <div className="relative flex-shrink-0 w-32">
                  <img 
                    src={`https://flagcdn.com/28x21/${countryCodes.find(c => c.code === countryCode)?.flag.toLowerCase()}.png`}
                    alt="flag"
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none w-6 h-4 rounded-sm"
                  />
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
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
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234567890"
                  required
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block mb-2 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isSignIn ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isSignIn ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    );
  }

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
        
        {/* Right side - Login Form */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
                <span className="text-2xl text-gray-900">GlobalTrade</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl mb-2 text-center">
                {isSignIn ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-gray-600 text-center mb-8">
                {isSignIn ? 'Sign in to your account' : 'Start trading globally today'}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isSignIn && (
                  <div>
                    <label className="block mb-2 text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label className="block mb-2 text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@company.com"
                    required
                  />
                </div>
                
                {!isSignIn && (
                  <div>
                    <label className="block mb-2 text-gray-700">Mobile Number</label>
                    <div className="flex gap-2">
                      <div className="relative flex-shrink-0 w-32">
                        <img 
                          src={`https://flagcdn.com/28x21/${countryCodes.find(c => c.code === countryCode)?.flag.toLowerCase()}.png`}
                          alt="flag"
                          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none w-6 h-4 rounded-sm"
                        />
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
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
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1234567890"
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block mb-2 text-gray-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                {isSignIn && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-blue-600 hover:text-blue-700">
                      Forgot password?
                    </button>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isSignIn ? 'Sign In' : 'Continue'}
                </button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-sm text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm">Google</span>
                  </button>
                  
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-sm">LinkedIn</span>
                  </button>
                </div>
              </div>
              
              <p className="mt-6 text-center text-sm text-gray-600">
                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => isSignIn ? onSignup() : setIsSignIn(true)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {isSignIn ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
            
            <p className="mt-6 text-center text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
            
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
