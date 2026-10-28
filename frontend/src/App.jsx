import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { usePortal } from './context/PortalContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TomAIAssistant from './components/TomAIAssistant';
import OfflineBanner from './components/OfflineBanner';
import PWAInstallBanner from './components/PWAInstallBanner';
import FlipkartCategoryBar from './components/FlipkartCategoryBar';
import CompareFloatingDock from './components/CompareFloatingDock';
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
  const { signedIn } = usePortal();
  if (!signedIn) {
    return <Navigate to="/login?tab=student" replace />;
  }
  return children;
}

// Route guard for officer-only pages
function OfficerProtectedRoute({ children }) {
  const { staff } = usePortal();
  if (!staff) {
    return <Navigate to="/login?tab=admin" replace />;
  }
  return children;
}

// Route guard for organizer-only pages
function OrganizerProtectedRoute({ children }) {
  const { organizer } = usePortal();
  if (!organizer) {
    return <Navigate to="/login?tab=organizer" replace />;
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
      <FlipkartCategoryBar />
      <main className="flex-1">
        <Routes>
          {/* Welcome / Landing Page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Public Discovery Pages */}
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/scholarships/:id" element={<ScholarshipDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/eligibility" element={<EligibilityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/future-scope" element={<FutureScopePage />} />
          
          {/* Authentication Gateway */}
          <Route path="/login" element={<StudentLoginPage />} />
          <Route path="/register" element={<StudentRegisterPage />} />
          <Route path="/admin/login" element={<StudentLoginPage />} />
          
          {/* User-Based Dashboards & Workflows (Protected) */}
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
          
          {/* Officer Verification Desk (Protected) */}
          <Route
            path="/admin/dashboard"
            element={
              <OfficerProtectedRoute>
                <AdminDashboardPage />
              </OfficerProtectedRoute>
            }
          />

          {/* Scheme Organizer & Provider Desk (Protected) */}
          <Route
            path="/organizer/dashboard"
            element={
              <OrganizerProtectedRoute>
                <OrganizerDashboardPage />
              </OrganizerProtectedRoute>
            }
          />
          <Route path="/organizer/login" element={<Navigate to="/login?tab=organizer" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <CompareFloatingDock />
      <Footer />
      <TomAIAssistant />
    </div>
  );
}
