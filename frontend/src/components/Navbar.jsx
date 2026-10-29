import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { usePWA } from '../context/PWAContext';
import { 
  GraduationCap, 
  Bell, 
  User, 
  ShieldCheck, 
  Landmark,
  LogOut, 
  Menu, 
  X, 
  CheckCircle2, 
  FileText,
  Check,
  Sparkles,
  Smartphone,
  Download,
  Wifi,
  WifiOff,
  Search,
  Scale,
  Heart,
  ChevronDown,
  Building2,
  IndianRupee,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const { 
    user,
    userRole,
    currentUser,
    signedIn, 
    account, 
    profile,
    unreadCount, 
    notifications, 
    markAllRead, 
    logout, 
    staff, 
    staffLogout,
    organizer,
    organizerLogout,
    backendConnected,
    quickDemoLogin,
    wishlist = [],
    compareList = [],
    applications = [],
    scholarships = []
  } = usePortal();

  const { 
    effectiveOnline, 
    isSimulatedOffline, 
    toggleSimulateOffline, 
    canInstall, 
    installApp 
  } = usePWA();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  
  // Flipkart Mega Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  // Handle outside clicks to close search suggestions and menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search suggestions (Max 6)
  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase().trim();
    return scholarships.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.provider.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery, scholarships]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      navigate(`/scholarships?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSuggestion = (schemeId) => {
    setSearchQuery('');
    setSearchFocused(false);
    navigate(`/scholarships/${schemeId}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-header shadow-xs">
      {/* Top National Announcement & 3-User Role Switcher Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-3 sm:px-4 border-b border-slate-800">
        <div className="portal-container flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${!effectiveOnline ? 'bg-amber-400 animate-ping' : backendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`}></span>
            <span className="font-semibold text-white truncate text-[11px] sm:text-xs">
              National Scholarship Portal • AY 2026-27
            </span>
            {backendConnected && (
              <span className="hidden xl:inline-flex text-[9px] px-2 py-0.2 rounded font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                ● Live API Synced
              </span>
            )}
          </div>

          {/* 3 User Types Quick Switcher (For Viva / Demo Review) */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/90 p-0.5 sm:p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono font-bold px-1.5 hidden md:inline">
              Role Perspective:
            </span>
            <button
              onClick={() => { quickDemoLogin('student'); navigate('/student/dashboard'); }}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                signedIn && !staff && !organizer
                  ? 'bg-amber-400 text-slate-950 shadow-xs scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
              }`}
              title="1-Click Switch: Student / Beneficiary Dashboard"
            >
              <GraduationCap className="size-3 text-current" />
              <span>1. Student</span>
            </button>

            <button
              onClick={() => { quickDemoLogin('admin'); navigate('/admin/dashboard'); }}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                staff
                  ? 'bg-blue-600 text-white shadow-xs scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
              }`}
              title="1-Click Switch: Verification Officer Desk"
            >
              <ShieldCheck className="size-3 text-current" />
              <span>2. Officer</span>
            </button>

            <button
              onClick={() => { quickDemoLogin('organizer'); navigate('/organizer/dashboard'); }}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                organizer
                  ? 'bg-purple-600 text-white shadow-xs scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
              }`}
              title="1-Click Switch: Scheme Provider / Trust Desk"
            >
              <Building2 className="size-3 text-current" />
              <span>3. Provider</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2.5 text-[11px] text-slate-400">
            {canInstall && (
              <button
                onClick={installApp}
                className="text-amber-300 hover:text-white flex items-center gap-1 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/40 font-bold transition-all cursor-pointer text-[10px]"
                title="Install PWA on your device"
              >
                <Download className="size-3" />
                <span>PWA App</span>
              </button>
            )}
            <button
              onClick={toggleSimulateOffline}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer border ${
                isSimulatedOffline 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Toggle Offline Simulation"
            >
              {isSimulatedOffline ? <WifiOff className="size-2.5" /> : <Wifi className="size-2.5" />}
              <span>{isSimulatedOffline ? 'Offline' : 'Offline Test'}</span>
            </button>
            <Link to="/future-scope" className="text-amber-400 hover:underline flex items-center gap-1 font-semibold text-[10px]">
              DPI Sandbox
            </Link>
          </div>
        </div>
      </div>

      {/* Main Flipkart-Style Mega Navbar */}
      <div className="portal-container flex items-center justify-between h-20 gap-3 sm:gap-6">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform border border-amber-500/20">
            <GraduationCap className="size-5 sm:size-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 leading-none">
                National Scholarship
              </span>
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.2 rounded font-mono shadow-2xs">
                PLUS
              </span>
            </div>
            <span className="text-[11px] font-semibold text-amber-600 tracking-wide mt-0.5">
              One Nation • One Portal
            </span>
          </div>
        </Link>

        {/* Central Flipkart-Style Search Bar */}
        <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl relative">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <div className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Search for 82 scholarships, states, categories, min marks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm font-medium transition-all shadow-2xs placeholder:text-slate-400"
              />
              <Search className="size-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="absolute right-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Flipkart Auto-Suggestions Dropdown */}
          {searchFocused && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-100">
              <div className="px-3.5 py-2 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Scholarships ({searchSuggestions.length})</span>
                <span className="text-blue-700">Instant Lookup</span>
              </div>
              {searchSuggestions.map((scheme) => (
                <div
                  key={scheme.id}
                  onClick={() => handleSelectSuggestion(scheme.id)}
                  className="p-3 hover:bg-blue-50/70 transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{scheme.name}</p>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                      <Building2 className="size-3 text-slate-400 shrink-0" />
                      <span>{scheme.provider}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-blue-700 font-medium">{scheme.category}</span>
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-xs font-extrabold text-emerald-700 font-mono">
                      ₹{scheme.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[9px] text-slate-400">/ year</span>
                  </div>
                </div>
              ))}
              <div 
                onClick={handleSearchSubmit}
                className="p-2.5 text-center bg-slate-50 hover:bg-slate-100 text-xs font-bold text-blue-900 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View all results for "{searchQuery}"</span>
                <ArrowRight className="size-3" />
              </div>
            </div>
          )}
        </div>

        {/* Right Flipkart-Style Action Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Compare Schemes Link with Badge */}
          <Link
            to="/compare"
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
              isActive('/compare') 
                ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="Side-by-side scholarship comparison"
          >
            <Scale className="size-4.5 text-blue-800" />
            <span className="hidden xl:inline">Compare</span>
            {compareList.length > 0 && (
              <span className="size-4.5 bg-blue-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {compareList.length}
              </span>
            )}
          </Link>

          {/* Wishlist Link with Badge */}
          <Link
            to="/wishlist"
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
              isActive('/wishlist') 
                ? 'bg-rose-50 text-rose-900 border border-rose-200' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="Shortlisted saved scholarships"
          >
            <Heart className={`size-4.5 text-rose-500 ${wishlist.length > 0 ? 'fill-rose-500' : ''}`} />
            <span className="hidden xl:inline">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="size-4.5 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* My Applications (Flipkart "Orders" analog) */}
          <Link
            to={signedIn ? "/student/dashboard" : "/login?tab=student"}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
              isActive('/student/dashboard') 
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="My Applied Schemes & Tracking"
          >
            <FileText className="size-4.5 text-emerald-700" />
            <span className="hidden xl:inline">My Desk</span>
            {applications.length > 0 && (
              <span className="size-4.5 bg-emerald-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {applications.length}
              </span>
            )}
          </Link>

          {/* Notifications Button & Drawer */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 relative transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 size-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                  <span className="font-bold text-sm">Notifications &amp; Alerts</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="size-3" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-sm text-slate-500">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs transition-colors ${
                          !n.read ? 'bg-amber-50/60 font-medium' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold ${
                            n.tone === 'success' ? 'text-emerald-700' :
                            n.tone === 'warning' ? 'text-amber-700' :
                            n.tone === 'danger' ? 'text-rose-700' : 'text-blue-700'
                          }`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{n.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Role Switcher Menu (Flipkart Profile Dropdown) */}
          <div className="relative">
            {signedIn || staff || organizer || user ? (
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-900 transition-all cursor-pointer border border-slate-300 shadow-xs"
              >
                <div className={`w-7 h-7 rounded-lg text-white flex items-center justify-center font-black text-xs shadow-xs ${
                  (userRole === 'admin' || staff)
                    ? 'bg-emerald-700'
                    : (userRole === 'provider' || organizer)
                    ? 'bg-purple-700'
                    : 'bg-blue-900'
                }`}>
                  {(userRole === 'admin' || staff) ? 'A' : (userRole === 'provider' || organizer) ? 'P' : 'S'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-xs truncate max-w-[100px]">
                      {(currentUser?.fullName || staff?.fullName || organizer?.fullName || profile?.fullName || 'User').split(' ')[0]}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-black tracking-wide uppercase ${
                      (userRole === 'admin' || staff)
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : (userRole === 'provider' || organizer)
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {(userRole === 'admin' || staff) ? 'Admin' : (userRole === 'provider' || organizer) ? 'Provider' : 'Student'}
                    </span>
                  </div>
                  <span className="block text-[10px] text-slate-400 font-mono">
                    ID: {currentUser?.userIdentifier || (userRole === 'admin' ? 'OFF-BLR-09' : userRole === 'provider' ? 'ORG-TR-01' : profile?.registrationNumber || 'AU2022CS084')}
                  </span>
                </div>
                <ChevronDown className="size-3 text-slate-400" />
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 shadow-xs transition-all hover:scale-105"
              >
                <User className="size-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Account Dropdown Drawer */}
            {accountMenuOpen && (signedIn || staff || organizer || user) && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-4 bg-slate-950 text-white space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      (userRole === 'admin' || staff)
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : (userRole === 'provider' || organizer)
                        ? 'bg-purple-950 text-purple-300 border border-purple-700'
                        : 'bg-blue-950 text-amber-300 border border-blue-700'
                    }`}>
                      {(userRole === 'admin' || staff) ? 'Administrator' : (userRole === 'provider' || organizer) ? 'Scholarship Provider / Verifier' : 'Student Applicant'}
                    </span>
                  </div>
                  <p className="font-extrabold text-sm truncate text-white">
                    {currentUser?.fullName || staff?.fullName || organizer?.fullName || profile?.fullName || account?.fullName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {currentUser?.email || staff?.email || organizer?.email || account?.email || 'user@nsp.gov.in'}
                  </p>
                  <p className="text-[11px] text-amber-400 font-mono font-bold">
                    User ID: {currentUser?.userIdentifier || (userRole === 'admin' ? 'OFF-BLR-09' : userRole === 'provider' ? 'ORG-TR-01' : profile?.registrationNumber || 'AU2022CS084')}
                  </p>
                </div>

                <div className="p-2 space-y-1 text-xs">
                  {/* Student Links */}
                  {(userRole === 'student' || (!staff && !organizer && signedIn)) && (
                    <>
                      <Link
                        to="/student/dashboard"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                      >
                        <FileText className="size-4 text-emerald-600" />
                        <span>My Student Dashboard</span>
                      </Link>
                      <Link
                        to="/student/renewal"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                      >
                        <Sparkles className="size-4 text-amber-600" />
                        <span>Renewal Re-Verification Desk</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                      >
                        <Heart className="size-4 text-rose-500" />
                        <span>Saved Wishlist ({wishlist.length})</span>
                      </Link>
                      <Link
                        to="/compare"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                      >
                        <Scale className="size-4 text-blue-600" />
                        <span>Compare Matrix ({compareList.length})</span>
                      </Link>
                    </>
                  )}

                  {/* Provider Links */}
                  {(userRole === 'provider' || userRole === 'organizer' || userRole === 'verifier' || organizer) && (
                    <Link
                      to="/provider/dashboard"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 text-purple-900 font-bold"
                    >
                      <Building2 className="size-4 text-purple-600" />
                      <span>Provider &amp; Disbursal Desk</span>
                    </Link>
                  )}

                  {/* Admin Links */}
                  {(userRole === 'admin' || staff) && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-900 font-bold"
                    >
                      <ShieldCheck className="size-4 text-emerald-600" />
                      <span>Officer Scrutiny &amp; Users Console</span>
                    </Link>
                  )}

                  <div className="border-t border-slate-100 my-1 pt-1">
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-bold cursor-pointer"
                    >
                      <LogOut className="size-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search & Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-4 animate-in slide-in-from-top-2 duration-150 shadow-xl">
          {/* Mobile Search Input */}
          <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className="relative">
            <input
              type="text"
              placeholder="Search 82 schemes, states, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-900 pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-hidden"
            />
            <Search className="size-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Mobile Role Switcher */}
          <div className="p-3 bg-slate-900 rounded-xl text-white space-y-2">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block font-mono">
              Demo Role Perspective Switcher:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
              <button
                onClick={() => { quickDemoLogin('student'); navigate('/student/dashboard'); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2 rounded-lg text-center transition-colors ${
                  signedIn && !staff && !organizer ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                }`}
              >
                🎓 Student
              </button>
              <button
                onClick={() => { quickDemoLogin('admin'); navigate('/admin/dashboard'); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2 rounded-lg text-center transition-colors ${
                  staff ? 'bg-blue-600 text-white font-black' : 'bg-slate-800 text-slate-300'
                }`}
              >
                🛡️ Officer
              </button>
              <button
                onClick={() => { quickDemoLogin('organizer'); navigate('/organizer/dashboard'); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2 rounded-lg text-center transition-colors ${
                  organizer ? 'bg-purple-600 text-white font-black' : 'bg-slate-800 text-slate-300'
                }`}
              >
                🏛️ Provider
              </button>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              to="/scholarships"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 font-semibold text-slate-800 flex items-center gap-2"
            >
              <GraduationCap className="size-4 text-blue-900" />
              <span>All 82 Schemes</span>
            </Link>
            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 font-semibold text-slate-800 flex items-center gap-2"
            >
              <Scale className="size-4 text-amber-600" />
              <span>Compare ({compareList.length})</span>
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 font-semibold text-slate-800 flex items-center gap-2"
            >
              <Heart className="size-4 text-rose-500 fill-rose-500" />
              <span>Wishlist ({wishlist.length})</span>
            </Link>
            <Link
              to="/eligibility"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 font-semibold text-slate-800 flex items-center gap-2"
            >
              <Sparkles className="size-4 text-emerald-600" />
              <span>Rule Engine</span>
            </Link>
            <Link
              to="/student/renewal"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 font-semibold text-slate-800 flex items-center gap-2"
            >
              <Sparkles className="size-4 text-purple-600" />
              <span>Renewal Desk</span>
            </Link>
            <Link
              to="/student/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 font-semibold text-slate-800 flex items-center gap-2"
            >
              <FileText className="size-4 text-indigo-600" />
              <span>My Applications</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
