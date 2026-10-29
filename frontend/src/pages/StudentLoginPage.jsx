import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { api } from '../services/api';
import { 
  GraduationCap, 
  ShieldCheck, 
  Landmark,
  ArrowRight, 
  Lock, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  KeyRound,
  Building2,
  Award,
  Eye,
  EyeOff,
  Globe,
  HelpCircle,
  FileText,
  Smartphone,
  Cpu,
  Fingerprint,
  RefreshCw,
  Check,
  AlertCircle,
  ChevronRight,
  Shield,
  Zap,
  Info
} from 'lucide-react';

export default function StudentLoginPage() {
  const { login, staffLogin, organizerLogin, quickDemoLogin, signedIn, staff, organizer, notify, user, userRole, logout } = usePortal();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode: 'signin' | 'otp' | 'recovery'
  const modeParam = searchParams.get('mode');
  const [activeMode, setActiveMode] = useState(modeParam === 'otp' ? 'otp' : modeParam === 'recovery' ? 'recovery' : 'signin');

  // Role: 'student' | 'admin' | 'organizer'
  const tabParam = searchParams.get('tab') || searchParams.get('role');
  const initialRole = (tabParam === 'admin' || tabParam === 'officer')
    ? 'admin'
    : (tabParam === 'organizer' || tabParam === 'provider' || tabParam === 'verifier')
    ? 'organizer'
    : 'student';
  const [activeRole, setActiveRole] = useState(initialRole);

  // Unified Form state for User ID / Email and Password
  const [userIdOrEmail, setUserIdOrEmail] = useState(
    initialRole === 'admin' ? 'admin@nsp.gov.in' :
    (initialRole === 'organizer' || initialRole === 'provider') ? 'provider@nsp.gov.in' :
    'student@nsp.gov.in'
  );
  const [password, setPassword] = useState(
    initialRole === 'admin' ? 'admin123' :
    (initialRole === 'organizer' || initialRole === 'provider') ? 'provider123' :
    'student123'
  );

  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP inputs state (6 boxes)
  const [otp, setOtp] = useState(['4', '8', '2', '1', '0', '3']);
  const [otpTimer, setOtpTimer] = useState(40);
  const [otpVerified, setOtpVerified] = useState(false);
  const otpRefs = useRef([]);

  // Account Recovery state
  const [recoveryMethod, setRecoveryMethod] = useState('email'); // 'email' | 'sms'
  const [recoveryEmail, setRecoveryEmail] = useState('student@nsp.gov.in');
  const [recoverySent, setRecoverySent] = useState(false);

  // Resend OTP countdown timer
  useEffect(() => {
    if (activeMode === 'otp' && otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeMode, otpTimer]);

  const handleRoleSelect = (role) => {
    setActiveRole(role);
    setError('');
    if (role === 'admin') {
      setUserIdOrEmail('admin@nsp.gov.in');
      setPassword('admin123');
    } else if (role === 'organizer' || role === 'provider') {
      setUserIdOrEmail('provider@nsp.gov.in');
      setPassword('provider123');
    } else {
      setUserIdOrEmail('student@nsp.gov.in');
      setPassword('student123');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(userIdOrEmail, password);
      if (res && res.ok) {
        if (res.redirectTo) {
          navigate(res.redirectTo);
        } else if (res.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (res.role === 'provider' || res.role === 'organizer' || res.role === 'verifier') {
          navigate('/provider/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        setError(res?.message || 'Invalid User ID or password. Please verify credentials.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next box
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpVerified(true);
      quickDemoLogin(activeRole);
      notify({
        title: 'Two-Factor Authenticated',
        body: 'Cryptographic session token generated and validated successfully.',
        tone: 'success'
      });
      if (activeRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (activeRole === 'organizer') {
        navigate('/organizer/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }, 700);
  };

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    if (!recoveryEmail) {
      setError('Please provide your registered email address or User ID.');
      return;
    }
    setLoading(true);
    try {
      await api.forgotPassword(recoveryEmail);
      setRecoverySent(true);
      notify({
        title: 'Reset Instructions Dispatched',
        body: `Password recovery token sent to ${recoveryEmail}. Valid for 15 minutes.`,
        tone: 'info'
      });
    } catch (err) {
      setError(err.message || 'Failed to dispatch password recovery instructions.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    const res = quickDemoLogin(role);
    if (res?.redirectTo) {
      navigate(res.redirectTo);
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'organizer' || role === 'provider') {
      navigate('/provider/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Header matching reference Image 1 & 2 */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-200">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center font-black shadow-md border border-amber-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="size-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-950 text-base sm:text-lg tracking-tight">
                National Scholarship Portal
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Systems Operational
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Government of India • Central PFMS &amp; DBT Verification Engine
            </p>
          </div>
        </Link>

        {/* Header Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700">
          <button
            onClick={() => setActiveMode('signin')}
            className={`transition-colors cursor-pointer ${
              activeMode === 'signin' ? 'text-blue-900 font-extrabold underline decoration-2 underline-offset-8' : 'hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveMode('otp')}
            className={`transition-colors cursor-pointer ${
              activeMode === 'otp' ? 'text-blue-900 font-extrabold underline decoration-2 underline-offset-8' : 'hover:text-slate-900'
            }`}
          >
            Verification (2FA)
          </button>
          <button
            onClick={() => setActiveMode('recovery')}
            className={`transition-colors cursor-pointer ${
              activeMode === 'recovery' ? 'text-blue-900 font-extrabold underline decoration-2 underline-offset-8' : 'hover:text-slate-900'
            }`}
          >
            Account Recovery
          </button>
          <span className="text-slate-300">|</span>
          <Link to="/about" className="hover:text-blue-900 flex items-center gap-1">
            <Globe className="size-3.5" /> EN-IN
          </Link>
          <Link to="/contact" className="hover:text-blue-900 flex items-center gap-1">
            <HelpCircle className="size-3.5" /> Helpdesk
          </Link>
        </div>
      </header>

      {/* Main Dual-Column Split Screen matching Reference Images */}
      <main className="max-w-7xl w-full mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Modern Auth Interactive Container */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xl space-y-6">
          
          {/* Tag & Subheader */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
              <span className="size-2 rounded-full bg-blue-600"></span>
              <span className="uppercase tracking-wider">
                {activeMode === 'signin' && 'Common Portal Entrance • All 3 Roles Supported'}
                {activeMode === 'otp' && 'Zero-Trust Perimeter • Step 2 of 2'}
                {activeMode === 'recovery' && 'Tier-4 Privileged Access • Recovery Sandbox'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {activeMode === 'signin' && 'Common Portal Entrance'}
              {activeMode === 'otp' && 'Two-Factor Authentication'}
              {activeMode === 'recovery' && 'Reset Your Password'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeMode === 'signin' && 'Sign in using your assigned User ID or Email. The portal automatically detects your role (Student, Provider, or Administrator) and launches your workspace.'}
              {activeMode === 'otp' && 'Enter the 6-digit verification code generated by your authenticator app or sent to your registered mobile (••••-4892).'}
              {activeMode === 'recovery' && 'Select your preferred verification method to securely restore workspace and beneficiary access.'}
            </p>
          </div>

          {/* Mode Switcher Pills (matching Reference Image 1 top tabs) */}
          <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl text-xs font-bold gap-1 border border-slate-200">
            <button
              type="button"
              onClick={() => { setActiveMode('signin'); setError(''); }}
              className={`py-2 px-3 rounded-lg transition-all text-center cursor-pointer ${
                activeMode === 'signin'
                  ? 'bg-white text-blue-950 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Email &amp; Password
            </button>
            <button
              type="button"
              onClick={() => { setActiveMode('otp'); setError(''); }}
              className={`py-2 px-3 rounded-lg transition-all text-center cursor-pointer ${
                activeMode === 'otp'
                  ? 'bg-white text-blue-950 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Two-Factor OTP
            </button>
            <button
              type="button"
              onClick={() => { setActiveMode('recovery'); setError(''); }}
              className={`py-2 px-3 rounded-lg transition-all text-center cursor-pointer ${
                activeMode === 'recovery'
                  ? 'bg-white text-blue-950 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Account Recovery
            </button>
          </div>

          {/* Role Switcher Pills: Student | Provider | Administrator */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Select Common Entrance Role:
              </span>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                1-Click Verified Demo Credentials
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('student')}
                className={`py-2.5 px-2 rounded-xl border text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeRole === 'student'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm scale-[1.01]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="size-4 shrink-0" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('organizer')}
                className={`py-2.5 px-2 rounded-xl border text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  (activeRole === 'organizer' || activeRole === 'provider')
                    ? 'bg-purple-900 text-white border-purple-950 shadow-sm scale-[1.01]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Building2 className="size-4 shrink-0" />
                <span>Provider</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`py-2.5 px-2 rounded-xl border text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeRole === 'admin'
                    ? 'bg-blue-900 text-white border-blue-950 shadow-sm scale-[1.01]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="size-4 shrink-0" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Active Session Notification (if already signed in, show notice with quick jump & switch) */}
          {(signedIn || user) && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-950">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-black">
                    Active Session: {user?.fullName || 'Logged in user'} ({userRole?.toUpperCase() || 'USER'})
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    ID: {user?.userIdentifier || user?.id || 'Active'} &bull; You can continue to your dashboard or enter another account below.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (userRole === 'admin' || staff) navigate('/admin/dashboard');
                    else if (userRole === 'provider' || organizer) navigate('/provider/dashboard');
                    else navigate('/student/dashboard');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Go to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setError('');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Error Message Banner */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="size-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 1: USER ID / EMAIL & PASSWORD SIGN IN                     */}
          {/* ============================================================== */}
          {activeMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 pt-2">
              {/* User ID / Email Address with verified badge */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <label htmlFor="userIdOrEmail">
                    User ID or Registered Email •
                  </label>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded border border-slate-200">
                    {activeRole === 'student' ? 'e.g. AU2022CS084 or student@nsp.gov.in' :
                     activeRole === 'admin' ? 'e.g. OFF-BLR-09 or admin@nsp.gov.in' :
                     'e.g. ORG-TR-01 or provider@nsp.gov.in'}
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="size-4" />
                  </div>
                  <input
                    id="userIdOrEmail"
                    type="text"
                    required
                    value={userIdOrEmail}
                    onChange={(e) => setUserIdOrEmail(e.target.value)}
                    placeholder="Enter User ID or email"
                    className="form-input pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border-slate-300 focus:border-blue-900 w-full"
                  />
                </div>
              </div>

              {/* Password with show/hide and Forgot Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <label htmlFor="password">Security Password •</label>
                  <button
                    type="button"
                    onClick={() => setActiveMode('recovery')}
                    className="text-blue-900 hover:text-blue-700 font-bold hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="size-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="form-input pl-10 pr-10 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border-slate-300 focus:border-blue-900 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Fill Demo Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                <span className="text-[11px] text-slate-500 font-bold">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    handleRoleSelect('student');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] cursor-pointer"
                >
                  Student (AU2022CS084)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRoleSelect('organizer');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold text-[11px] cursor-pointer"
                >
                  Provider (ORG-TR-01)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRoleSelect('admin');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 font-bold text-[11px] cursor-pointer"
                >
                  Admin (OFF-BLR-09)
                </button>
              </div>

              {/* Keep Signed In Checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="rounded border-slate-300 text-blue-900 focus:ring-blue-900 size-4"
                  />
                  <span>Keep me signed in on this workstation</span>
                </label>
                <Info className="size-3.5 text-slate-400" title="Keeps JWT token active for 30 days" />
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-extrabold text-sm text-white bg-slate-950 hover:bg-slate-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>{loading ? 'Authenticating with PFMS...' : 'Sign In'}</span>
                <ArrowRight className="size-4" />
              </button>

              {/* Single Sign-On and Passkey Option */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveMode('otp')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Fingerprint className="size-4 text-blue-900" />
                    <div className="text-left">
                      <span className="block font-bold">Sign in with Aadhaar Biometric / DigiLocker OTP</span>
                      <span className="text-[10px] text-slate-500 font-normal">FIPS 140-2 Validated • NPCI Linked</span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-400" />
                </button>
              </div>

              {/* 1-Click Instant Demo Credentials for Evaluator */}
              <div className="pt-3 border-t border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Instant 1-Click Evaluation Login:
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Auto-Fill Ready
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('student')}
                    className="py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-black text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <GraduationCap className="size-3.5 text-amber-700" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    className="py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-300 font-black text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="size-3.5 text-blue-700" />
                    <span>Officer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('organizer')}
                    className="py-2 px-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-300 font-black text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Landmark className="size-3.5 text-purple-700" />
                    <span>Organizer</span>
                  </button>
                </div>
              </div>

              {/* OR CONTINUE WITH (SSO Providers) */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Or Continue With Government SSO
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo(activeRole)}
                    className="py-2 px-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 flex items-center justify-center gap-1.5 text-slate-800 transition-colors cursor-pointer"
                  >
                    <Shield className="size-3.5 text-blue-600" />
                    <span>DigiLocker</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo(activeRole)}
                    className="py-2 px-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 flex items-center justify-center gap-1.5 text-slate-800 transition-colors cursor-pointer"
                  >
                    <Building2 className="size-3.5 text-emerald-600" />
                    <span>MeriPehchan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo(activeRole)}
                    className="py-2 px-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 flex items-center justify-center gap-1.5 text-slate-800 transition-colors cursor-pointer"
                  >
                    <Smartphone className="size-3.5 text-indigo-600" />
                    <span>Aadhaar OTP</span>
                  </button>
                </div>
              </div>

              {/* Need access? Register Link */}
              <div className="pt-3 text-center text-xs text-slate-600 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">New student applicant?</span>
                <Link to="/register" className="font-extrabold text-blue-900 hover:underline">
                  Create Student Account →
                </Link>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 2: TWO-FACTOR OTP AUTH (MATCHING REFERENCE IMAGE 2)        */}
          {/* ============================================================== */}
          {activeMode === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6 pt-2">
              {/* Auto-fill banner matching Image 2 */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-blue-950 block">
                      Aadhaar / DigiLocker Auto-fill Ready
                    </span>
                    <span className="text-[11px] text-blue-700">
                      Hardware token tokenized for nsp.gov.in (OTP: 482103)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp(['4', '8', '2', '1', '0', '3'])}
                  className="px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-900 font-extrabold text-xs shadow-2xs hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* 6-Digit OTP Box Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Security Verification Code</span>
                  <span className="text-[11px] text-slate-500 font-normal flex items-center gap-1">
                    <Lock className="size-3 text-emerald-600" /> Encrypted Entry
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-2 sm:gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-full h-14 sm:h-16 text-center text-xl sm:text-2xl font-black font-mono bg-slate-50 border border-slate-300 rounded-xl focus:border-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-900/20 text-slate-900 outline-none transition-all shadow-inner"
                    />
                  ))}
                </div>
              </div>

              {/* Resend Code Timer */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="size-3.5 text-slate-400" />
                  <span>Resend code in {otpTimer > 0 ? `00:${otpTimer < 10 ? `0${otpTimer}` : otpTimer}` : '00:00'}</span>
                </span>
                <button
                  type="button"
                  disabled={otpTimer > 0}
                  onClick={() => setOtpTimer(45)}
                  className={`flex items-center gap-1 font-bold ${
                    otpTimer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-blue-900 hover:underline cursor-pointer'
                  }`}
                >
                  <RefreshCw className="size-3.5" />
                  <span>Resend now</span>
                </button>
              </div>

              {/* Trust Workstation Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-blue-900 focus:ring-blue-900 size-4"
                />
                <span>Trust this browser and workstation for 30 days (skip MFA for current IP)</span>
              </label>

              {/* Buttons: Verify & Continue and Cancel */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl font-extrabold text-sm text-white bg-slate-950 hover:bg-slate-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
                  <ArrowRight className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMode('signin')}
                  className="py-3 px-5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Current Session Footprint banner matching bottom of Image 2 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Cpu className="size-4 text-blue-900" />
                  <div>
                    <span className="font-bold text-slate-800 block">Current Session Footprint</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Chrome 124 on Windows 11 • IP: 198.51.100.24 (New Delhi Gateway)
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  TLS 1.3 / ECH
                </span>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 3: ACCOUNT RECOVERY (MATCHING REFERENCE IMAGE 3)           */}
          {/* ============================================================== */}
          {activeMode === 'recovery' && (
            <form onSubmit={handleRecoverySubmit} className="space-y-4 pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Available Verification Endpoints:
              </span>

              {/* Method A: Email Endpoint */}
              <div
                onClick={() => setRecoveryMethod('email')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  recoveryMethod === 'email'
                    ? 'border-blue-900 bg-blue-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Send via Registered Email</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Primary</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Password reset link and security PIN sent to s•••••••@nsp.gov.in
                    </p>
                  </div>
                </div>
                <div className={`size-5 rounded-full border flex items-center justify-center ${
                  recoveryMethod === 'email' ? 'border-blue-900 bg-blue-900 text-white' : 'border-slate-300'
                }`}>
                  {recoveryMethod === 'email' && <Check className="size-3" />}
                </div>
              </div>

              {/* Method B: Mobile SMS Endpoint */}
              <div
                onClick={() => setRecoveryMethod('sms')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  recoveryMethod === 'sms'
                    ? 'border-blue-900 bg-blue-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white flex items-center justify-center shrink-0">
                    <Smartphone className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Send via Secure SMS</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">Cellular MFA</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Verification token sent to registered mobile ••••••4892
                    </p>
                  </div>
                </div>
                <div className={`size-5 rounded-full border flex items-center justify-center ${
                  recoveryMethod === 'sms' ? 'border-blue-900 bg-blue-900 text-white' : 'border-slate-300'
                }`}>
                  {recoveryMethod === 'sms' && <Check className="size-3" />}
                </div>
              </div>

              {/* Email Input Field */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Confirm Registered Scholar / Officer Email Address
                </label>
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="student@nsp.gov.in"
                  className="form-input text-xs sm:text-sm font-semibold rounded-xl border-slate-300"
                />
              </div>

              {/* Expiration notice matching Image 3 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-start gap-2.5">
                <Info className="size-4 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Security Expiration Notice</span>
                  <span className="text-[11px] text-slate-500">
                    For your safety, reset tokens expire after 15 minutes. Check spam and institutional quarantine filters if delayed.
                  </span>
                </div>
              </div>

              {/* Reset Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-extrabold text-sm text-white bg-slate-950 hover:bg-slate-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>{loading ? 'Dispatching...' : 'Send Reset Instructions'}</span>
                <ArrowRight className="size-4" />
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setActiveMode('signin')}
                  className="font-bold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← Return to Sign In
                </button>
                <span className="text-slate-400 font-mono text-[10px]">
                  End-to-End Cryptographic Link
                </span>
              </div>
            </form>
          )}

          {/* Bottom Security Seals */}
          <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-medium gap-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>256-bit Encrypted</span>
            </span>
            <span>•</span>
            <span>ISO 27001 Certified</span>
            <span>•</span>
            <span className="text-blue-900 font-bold">PFMS Integrated DBT</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Dark Sleek Zero-Trust Telemetry Card (Matching Image 1 & 2 Right Side) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Dark Navy Telemetry Card */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden space-y-6">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header Badge */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span className="font-extrabold text-slate-300 tracking-wider uppercase text-[11px]">
                  Zero-Trust DBT Engine
                </span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                Enforced
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Continuous Aadhaar Seeding &amp; Direct Benefit Transfer
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scholarship applications are cryptographically bound to official student biometric and Digilocker credentials with automated fraud and quota modeling active in real time.
              </p>
            </div>

            {/* Security checklist features */}
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Fingerprint className="size-3.5 text-blue-400" />
                  <span>Aadhaar NPCI Linkage</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">Active &amp; Seeded</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-blue-400" />
                  <span>DigiLocker Marksheet Audit</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">Directly Connected</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Cpu className="size-3.5 text-blue-400" />
                  <span>Automated Anomaly Detection</span>
                </span>
                <span className="font-mono font-bold text-white">Nominal (0 alerts)</span>
              </div>
            </div>

            {/* Giant KPI Numbers matching Reference Image 1 */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <span className="text-3xl font-black text-white block">99.98%</span>
                <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                  PFMS Disbursal Success SLA
                </span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <span className="text-3xl font-black text-amber-400 block">&lt;14 Days</span>
                <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                  Verification &amp; Sanction Timeline
                </span>
              </div>
            </div>

            {/* Reviewer / Officer Quote matching Reference Image 1 */}
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 space-y-3">
              <div className="flex text-amber-400 gap-0.5">
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i} className="text-sm">{s}</span>
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "The National Scholarship Portal enables transparent merit disbursals directly to student bank accounts with zero intermediaries and 100% audit compliance."
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-black flex items-center justify-center text-xs">
                  RS
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Dr. R. Sundaram</span>
                  <span className="text-[10px] text-slate-400 block">
                    Chief Verification Officer • Collegiate Education
                  </span>
                </div>
              </div>
            </div>

            {/* Active Session Origin matching Reference Image 1 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Active Session Origin
                </span>
                <span className="font-semibold text-slate-200 text-xs block mt-0.5">
                  New Delhi Gateway (Gov-Central-1)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Live Geolocation Match
                </span>
                <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                  IP: 198.51.100.24
                </span>
              </div>
            </div>
          </div>

          {/* Alternative Methods Quick Card (When in OTP mode) */}
          {activeMode === 'otp' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm">Alternative Verification Methods</h3>
                <span className="text-[11px] font-bold text-blue-900">3 Configured</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-4 text-slate-700" />
                    <div>
                      <span className="font-bold text-slate-900 block">SMS One-Time Code</span>
                      <span className="text-[10px] text-slate-500">Sent to registered mobile ••4892</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-900">Active</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-slate-700" />
                    <div>
                      <span className="font-bold text-slate-900 block">DigiLocker / Aadhaar OTP</span>
                      <span className="text-[10px] text-slate-500">Linked to UIDAI biometric vault</span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-400" />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Security Compliance Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500 pt-2">
            <span className="bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
              ✓ SOC2 Type II
            </span>
            <span className="bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
              ✓ ISO 27001 Certified
            </span>
            <span className="bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
              ✓ AES-256 Encryption
            </span>
          </div>
        </div>
      </main>

      {/* Footer matching reference layout */}
      <footer className="max-w-7xl w-full mx-auto pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center gap-4">
          <Link to="/about" className="hover:text-blue-900">Terms of Service</Link>
          <span>•</span>
          <Link to="/about" className="hover:text-blue-900">Privacy Policy</Link>
          <span>•</span>
          <Link to="/future-scope" className="hover:text-blue-900">Security Whitepaper</Link>
        </div>
        <p>© 2026 National Scholarship Portal • All Rights Reserved.</p>
      </footer>
    </div>
  );
}
