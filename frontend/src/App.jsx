import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { usePortal } from './context/PortalContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TomAIAssistant from './components/TomAIAssistant';
import OfflineBanner from './components/OfflineBanner';
import PWAInstallBanner from './components/PWAInstallBanner';
import FlipkartCategoryBar from './components/CategoryBar';
import CompareFloatingDock from './components/CompareFloatingDock';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import ScholarshipDetailPage from './pages/ScholarshipDetailPage';
import ComparePage from './pages/ComparePage';
import WishlistPage from './pages/WishlistPage';
import EligibilityPage from './pages/EligibilityPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import ApplyScholarshipPage from './pages/ApplyScholarshipPage';
import RenewalPage from './pages/RenewalPage';
import StudentLoginPage from './pages/StudentLoginPage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FutureScopePage from './pages/FutureScopePage';

// Route guard for student-only pages
function StudentProtectedRoute({ children }) {
  const { signedIn, user, userRole } = usePortal();
  if (!signedIn && !user) {
    return <Navigate to="/login?role=student" replace />;
  }
  if (userRole === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (userRole === 'provider' || userRole === 'organizer' || userRole === 'verifier') {
    return <Navigate to="/provider/dashboard" replace />;
  }
  return children;
}

// Route guard for officer/admin-only pages
function AdminProtectedRoute({ children }) {
  const { staff, user, userRole } = usePortal();
  if (!staff && !user) {
    return <Navigate to="/login?role=admin" replace />;
  }
  if (userRole === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  }
  if (userRole === 'provider' || userRole === 'organizer' || userRole === 'verifier') {
    return <Navigate to="/provider/dashboard" replace />;
  }
  return children;
}

// Route guard for provider/verifier-only pages
function ProviderProtectedRoute({ children }) {
  const { organizer, user, userRole } = usePortal();
  if (!organizer && !user) {
    return <Navigate to="/login?role=provider" replace />;
  }
  if (userRole === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  }
  if (userRole === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

export default function App() {
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <OfflineBanner />
      <PWAInstallBanner />
      <Navbar />
      {/* Category Bar for browsing schemes catalog (hidden on Common Entrance and Auth pages) */}
      {!['/', '/welcome', '/login', '/register'].includes(location.pathname) && (
        <FlipkartCategoryBar />
      )}
      <main className="flex-1">
        <Routes>
          {/* 1. Master Welcome Page (Entry Point) */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
          
          {/* Public Discovery Pages */}
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/scholarships/:id" element={<ScholarshipDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/eligibility" element={<EligibilityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/future-scope" element={<FutureScopePage />} />
          
          {/* 2. Authentication Gateway */}
          <Route path="/login" element={<StudentLoginPage />} />
          <Route path="/register" element={<StudentRegisterPage />} />
          <Route path="/admin/login" element={<Navigate to="/login?role=admin" replace />} />
          <Route path="/provider/login" element={<Navigate to="/login?role=provider" replace />} />
          <Route path="/organizer/login" element={<Navigate to="/login?role=provider" replace />} />
          
          {/* 3. Role-Based Dashboards & Workflows (Protected) */}
          {/* Role 1: Student Dashboard */}
          <Route
            path="/student/dashboard"
            element={
              <StudentProtectedRoute>
                <StudentDashboardPage />
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/student/apply/:id"
            element={
              <StudentProtectedRoute>
                <ApplyScholarshipPage />
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/student/renewal"
            element={
              <StudentProtectedRoute>
                <RenewalPage />
              </StudentProtectedRoute>
            }
          />
          
          {/* Role 2: Scholarship Provider / Verifier Dashboard */}
          <Route
            path="/provider/dashboard"
            element={
              <ProviderProtectedRoute>
                <OrganizerDashboardPage />
              </ProviderProtectedRoute>
            }
          />
          <Route
            path="/organizer/dashboard"
            element={
              <ProviderProtectedRoute>
                <OrganizerDashboardPage />
              </ProviderProtectedRoute>
            }
          />

          {/* Role 3: Administrator Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <CompareFloatingDock />
      <Footer />
      <TomAIAssistant />
    </div>
  );
}
