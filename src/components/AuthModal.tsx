import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { UserAccount, Language } from '../types';
import { setStoredUser } from '../utils/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSuccess?: (user: UserAccount) => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSuccess,
  initialMode = 'signin',
}) => {
  const isNe = lang === 'ne';
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password Flow States
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtpHint, setGeneratedOtpHint] = useState<string | null>(null);

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setOtpCode('');
    setErrorMsg('');
    setSuccessMsg('');
    setGeneratedOtpHint(null);
    setForgotStep(1);
  };

  const handleSwitchMode = (newMode: 'signin' | 'signup' | 'forgot') => {
    resetForm();
    setMode(newMode);
  };

  // 1-Click Demo Logins for fast testing
  const handleQuickLogin = (demoType: 'citizen_ramesh' | 'citizen_umesh' | 'admin_inspector') => {
    setErrorMsg('');
    if (demoType === 'citizen_ramesh') {
      setEmail('ramesh@example.com');
      setPassword('Nepal@123');
    } else if (demoType === 'citizen_umesh') {
      setEmail('umeshprovidhy@gmail.com');
      setPassword('Nepal@123');
    } else if (demoType === 'admin_inspector') {
      setEmail('admin@scamdefense.gov.np');
      setPassword('admin123');
    }
  };

  // Submit Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setStoredUser(data.user);
        if (data.user.role === 'admin') {
          sessionStorage.setItem('scam_admin_auth', 'true');
        }
        if (onSuccess) onSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || (isNe ? 'लगइन हुन सकेन' : 'Failed to sign in'));
      }
    } catch {
      setErrorMsg(isNe ? 'सर्भरसँग सम्पर्क हुन सकेन' : 'Connection to server failed');
    } finally {
      setLoading(false);
    }
  };

  // Submit Sign Up (User Create)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg(isNe ? 'कृपया पूरा नाम राख्नुहोस्' : 'Please provide your full name');
      return;
    }
    if (!email.trim()) {
      setErrorMsg(isNe ? 'कृपया इमेल राख्नुहोस्' : 'Please provide your email');
      return;
    }
    if (password.length < 6) {
      setErrorMsg(isNe ? 'पासवर्ड कम्तीमा ६ अक्षरको हुनुपर्छ' : 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(isNe ? 'दुवै पासवर्ड मिलेनन्' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setStoredUser(data.user);
        setSuccessMsg(isNe ? 'खाता सफलतापूर्वक तयार भयो!' : 'Account created successfully!');
        if (onSuccess) onSuccess(data.user);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMsg(data.error || (isNe ? 'दर्ता हुन सकेन' : 'Failed to register account'));
      }
    } catch {
      setErrorMsg(isNe ? 'सर्भरसँग सम्पर्क हुन सकेन' : 'Connection to server failed');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Step 1: Request Code
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email.trim()) {
      setErrorMsg(isNe ? 'कृपया दर्ता भएको इमेल वा फोन नम्बर राख्नुहोस्' : 'Please enter your registered email or phone');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: email.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedOtpHint(data.code);
        setOtpCode(data.code || '123456');
        setForgotStep(2);
        setSuccessMsg(data.message || (isNe ? 'प्रमाणीकरण कोड तयार भयो' : 'Verification code generated'));
      } else {
        setErrorMsg(data.error || (isNe ? 'प्रयोगकर्ता फेला परेन' : 'User not found'));
      }
    } catch {
      setErrorMsg(isNe ? 'सर्भरसँग सम्पर्क हुन सकेन' : 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpCode.trim()) {
      setErrorMsg(isNe ? 'कृपया ६ अंकको कोड राख्नुहोस्' : 'Please enter the 6-digit code');
      return;
    }
    if (password.length < 6) {
      setErrorMsg(isNe ? 'नयाँ पासवर्ड कम्तीमा ६ अक्षरको हुनुपर्छ' : 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(isNe ? 'दुवै पासवर्ड मिलेनन्' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: email.trim(),
          code: otpCode.trim(),
          newPassword: password.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(isNe ? 'पासवर्ड सफलतापूर्वक परिवर्तन भयो! अब लगइन गर्नुहोस्।' : 'Password updated! You can now log in.');
        setTimeout(() => {
          handleSwitchMode('signin');
        }, 1500);
      } else {
        setErrorMsg(data.error || (isNe ? 'पासवर्ड रिसेट हुन सकेन' : 'Reset failed'));
      }
    } catch {
      setErrorMsg(isNe ? 'सर्भरसँग सम्पर्क हुन सकेन' : 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-cyan-800/60 rounded-3xl shadow-2xl overflow-hidden p-6 text-slate-100 space-y-5">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 shadow-inner">
              {mode === 'signin' && <User className="w-5 h-5" />}
              {mode === 'signup' && <Sparkles className="w-5 h-5" />}
              {mode === 'forgot' && <KeyRound className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {mode === 'signin' && (isNe ? 'नागरिक / प्रयोगकर्ता लगइन' : 'Sign In to Account')}
                {mode === 'signup' && (isNe ? 'नयाँ खाता खोल्नुहोस् (Sign Up)' : 'Create New Account')}
                {mode === 'forgot' && (isNe ? 'पासवर्ड रिसेट (Forgot Password)' : 'Reset Your Password')}
              </h3>
              <p className="text-xs text-slate-400">
                {isNe
                  ? 'सुरक्षा जाँच र उजुरी इतिहास सुरक्षित राख्न'
                  : 'Track your checks and fraud reports securely'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* =========================================
            TAB 1: SIGN IN (लगइन)
           ========================================= */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {isNe ? 'इमेल वा मोबाइल नम्बर *' : 'Email or Mobile Number *'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com वा 98XXXXXXXX"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {isNe ? 'पासवर्ड *' : 'Password *'}
                </label>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('forgot')}
                  className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                >
                  {isNe ? 'पासवर्ड बिर्सनुभयो?' : 'Forgot Password?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? (isNe ? 'लगइन हुँदैछ...' : 'Signing in...') : (isNe ? 'साइन इन गर्नुहोस्' : 'Sign In')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Logins strip */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                {isNe ? '⚡ द्रुत परीक्षण खाता (Quick 1-Click Demo Accounts):' : '⚡ Quick 1-Click Demo Accounts:'}
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('citizen_umesh')}
                  className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 text-left truncate cursor-pointer transition-colors"
                >
                  👤 उमेश शर्मा (Citizen)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('citizen_ramesh')}
                  className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 text-left truncate cursor-pointer transition-colors"
                >
                  👤 रमेश अधिकारी (Citizen)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin_inspector')}
                  className="col-span-2 p-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 text-left truncate cursor-pointer transition-colors font-medium"
                >
                  🛡️ इन्स्पेक्टर सन्तोष थापा (Cyber Bureau Admin)
                </button>
              </div>
            </div>

            {/* Switch to Signup */}
            <div className="text-center pt-2 text-xs text-slate-400">
              <span>{isNe ? 'खाता छैन? ' : "Don't have an account? "}</span>
              <button
                type="button"
                onClick={() => handleSwitchMode('signup')}
                className="text-cyan-400 font-bold hover:underline cursor-pointer"
              >
                {isNe ? 'नयाँ खाता खोल्नुहोस् (Sign Up)' : 'Register Here'}
              </button>
            </div>
          </form>
        )}

        {/* =========================================
            TAB 2: SIGN UP (नयाँ खाता)
           ========================================= */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {isNe ? 'पूरा नाम (Full Name) *' : 'Full Name *'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="जस्तै: रमेश शर्मा"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {isNe ? 'इमेल ठेगाना (Email) *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {isNe ? 'मोबाइल फोन नम्बर (Phone Number)' : 'Mobile Phone Number'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {isNe ? 'पासवर्ड *' : 'Password *'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="कम्तीमा ६ अक्षर"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {isNe ? 'पुनः पासवर्ड *' : 'Confirm Password *'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="दोहोर्याउनुहोस्"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
            >
              <span>{loading ? (isNe ? 'खाता तयार हुँदैछ...' : 'Registering...') : (isNe ? 'खाता खोल्नुहोस् (Register)' : 'Create Account')}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            {/* Switch to Sign In */}
            <div className="text-center pt-2 text-xs text-slate-400">
              <span>{isNe ? 'पहिले नै खाता छ? ' : 'Already have an account? '}</span>
              <button
                type="button"
                onClick={() => handleSwitchMode('signin')}
                className="text-cyan-400 font-bold hover:underline cursor-pointer"
              >
                {isNe ? 'साइन इन गर्नुहोस्' : 'Sign In'}
              </button>
            </div>
          </form>
        )}

        {/* =========================================
            TAB 3: FORGOT PASSWORD (पासवर्ड रिसेट)
           ========================================= */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            {forgotStep === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isNe
                    ? 'तपाईंको दर्ता भएको इमेल वा फोन नम्बर राख्नुहोस्। हामी पासवर्ड रिसेट गर्न ६ अंकको कोड उपलब्ध गराउनेछौँ।'
                    : 'Enter your registered email or phone to receive a 6-digit password reset verification code.'}
                </p>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    {isNe ? 'दर्ता भएको इमेल वा फोन *' : 'Registered Email or Phone *'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="umeshprovidhy@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <span>{loading ? (isNe ? 'कोड पठाउँदै...' : 'Sending Code...') : (isNe ? 'प्रमाणीकरण कोड माग्नुहोस्' : 'Get Verification Code')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                {generatedOtpHint && (
                  <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-700/60 text-cyan-200 text-xs">
                    <span className="font-bold block mb-0.5">{isNe ? '💡 परीक्षणका लागि कोड (OTP):' : '💡 Demo Verification OTP:'}</span>
                    <span className="font-mono text-base font-extrabold text-white tracking-widest">{generatedOtpHint}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {isNe ? '६ अंकको प्रमाणीकरण कोड *' : '6-Digit Verification Code *'}
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white text-center tracking-widest focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {isNe ? 'नयाँ पासवर्ड (New Password) *' : 'New Password *'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="कम्तीमा ६ अक्षर"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {isNe ? 'नयाँ पासवर्ड पुनः राख्नुहोस् *' : 'Confirm New Password *'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="दोहोर्याउनुहोस्"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <span>{loading ? (isNe ? 'पासवर्ड बदल्दै...' : 'Updating...') : (isNe ? 'नयाँ पासवर्ड सेभ गर्नुहोस्' : 'Save New Password')}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Back to Sign In */}
            <div className="text-center pt-2 text-xs">
              <button
                type="button"
                onClick={() => handleSwitchMode('signin')}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                {isNe ? '← साइन इनमा फर्कनुहोस्' : '← Back to Sign In'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
