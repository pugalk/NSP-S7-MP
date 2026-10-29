import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import {
  GraduationCap,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Layers,
  IndianRupee,
  Cpu,
  RefreshCw,
  Search,
  Scale,
  Award,
  ChevronRight,
  Database,
  Lock,
  Zap,
  Landmark,
  UserCheck,
  KeyRound,
  FileText,
  User,
  Shield,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user, userRole, signedIn, quickDemoLogin, scholarships } = usePortal();

  const handleRoleQuickEntry = (role) => {
    quickDemoLogin(role);
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'provider' || role === 'organizer') navigate('/provider/dashboard');
    else navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-900 selection:text-white">
      {/* Official Government Tricolor Top Accent */}
      <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 shadow-xs"></div>

      {/* Official Institutional Authority Banner */}
      <div className="bg-slate-900 text-slate-300 border-b border-slate-800 text-xs py-2 px-4 sm:px-6">
        <div className="portal-container flex flex-wrap items-center justify-between gap-3 font-medium">
          <div className="flex items-center gap-2">
            <Landmark className="size-3.5 text-amber-400" />
            <span className="font-semibold text-white">Government of India &bull; Ministry of Education &amp; Social Justice</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">National Direct Benefit Transfer (DBT) Mission</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
              AY 2026-27 Disbursals Active
            </span>
            <span className="text-slate-400 font-mono">100% PFMS Validated</span>
          </div>
        </div>
      </div>

      {/* Grand Hero & Portal Entrance Header */}
      <section className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white relative overflow-hidden pt-12 pb-24 border-b border-slate-800">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="portal-container relative z-10 space-y-8">
          {/* Emblem & Portal Tag */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/70 border border-blue-700/70 text-xs font-bold text-amber-300">
              <Shield className="size-3.5 text-amber-400" />
              <span>Official Common Entrance Gateway</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-700/70 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>Role-Based Access Control (RBAC) Verified</span>
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="max-w-4xl space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              National Scholarship Renewal &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-400">
                Eligibility Re-Verification
              </span>{' '}
              Portal
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl font-normal">
              A unified central digital platform for academic scheme discovery, multi-tier eligibility evaluation, fraud-proof certificate verification, seamless year-on-year renewals, and Direct Benefit Transfer (DBT) financial disbursals.
            </p>
          </div>

          {/* Primary Action Button Cluster */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {(signedIn || user) && (
              <button
                onClick={() => {
                  if (userRole === 'admin') navigate('/admin/dashboard');
                  else if (userRole === 'provider' || userRole === 'organizer') navigate('/provider/dashboard');
                  else navigate('/student/dashboard');
                }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <UserCheck className="size-5 text-slate-950" />
                <span>Go to My Dashboard ({user?.fullName ? user.fullName.split(' ')[0] : 'User'})</span>
                <ArrowRight className="size-5" />
              </button>
            )}

            <Link
              to="/login"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <KeyRound className="size-5 text-slate-950" />
              <span>Enter Common Login Portal</span>
              <ArrowRight className="size-5" />
            </Link>

            <Link
              to="/scholarships"
              className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base border border-white/20 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <Search className="size-4.5 text-blue-300" />
              <span>Explore 82 Schemes Catalog</span>
            </Link>

            <Link
              to="/eligibility"
              className="px-6 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-sm sm:text-base border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="size-4.5 text-amber-400" />
              <span>Check Eligibility Rule Engine</span>
            </Link>
          </div>

          {/* Key Metrics Ticker */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">82+</p>
              <p className="text-xs text-slate-400 font-medium">Active Schemes Loaded</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">₹142.5 Cr</p>
              <p className="text-xs text-slate-400 font-medium">Total Sanctioned Grants</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">99.4%</p>
              <p className="text-xs text-slate-400 font-medium">Scrutiny Accuracy Rate</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-blue-400">5-Stage</p>
              <p className="text-xs text-slate-400 font-medium">Transparent Stepper</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMON ENTRANCE DOORS: The 3 Role Gateway Hubs */}
      <section className="portal-container -mt-12 relative z-20 space-y-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-black tracking-wider uppercase text-blue-900 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
                Single Entrance Hub &bull; 3 Secure Workspaces
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Select Your Portal Entrance Gate
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Each user enters through verified credentials. Backend JWT role authorization routes you to your specific dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* GATEWAY 1: STUDENT ENTRANCE */}
            <div className="bg-gradient-to-b from-slate-50 to-amber-50/20 rounded-2xl p-6 border-2 border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center font-bold shadow-md shadow-blue-950/20 group-hover:scale-110 transition-transform">
                    <GraduationCap className="size-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full uppercase">
                    Entrance Gate 1
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">Student Portal Entrance</h3>
                  <p className="text-xs text-slate-500 font-semibold">Scholar Applicant &amp; Beneficiary Workspace</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Apply for 82 central, state and CSR schemes, evaluate eligibility with automated rule criteria, submit academic renewal transcripts, view APAAR digital scholar ID pass, and track 5-stage DBT disbursal status.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span>82 Schemes Catalog &amp; Compare Matrix</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span>1-Click Renewal Re-Verification Desk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span>Official Sanction Award Order with QR Code</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2.5">
                <Link
                  to="/login?role=student"
                  className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
                >
                  <span>Enter Student Portal</span>
                  <ChevronRight className="size-4" />
                </Link>

                <button
                  onClick={() => handleRoleQuickEntry('student')}
                  className="w-full py-2 rounded-lg bg-amber-100 hover:bg-amber-200/80 text-amber-900 border border-amber-300 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="1-Click Instant Demo Login for Viva Evaluators"
                >
                  <Sparkles className="size-3 text-amber-700" />
                  <span>1-Click Demo Pass: Aravind (AU2022CS084)</span>
                </button>
              </div>
            </div>

            {/* GATEWAY 2: SCHOLARSHIP PROVIDER / VERIFIER ENTRANCE */}
            <div className="bg-gradient-to-b from-slate-50 to-purple-50/20 rounded-2xl p-6 border-2 border-slate-200 hover:border-purple-400 hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-900 text-purple-300 flex items-center justify-center font-bold shadow-md shadow-purple-950/20 group-hover:scale-110 transition-transform">
                    <Building2 className="size-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-full uppercase">
                    Entrance Gate 2
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">Scholarship Provider / Verifier</h3>
                  <p className="text-xs text-slate-500 font-semibold">Scheme Sponsor &amp; Trust Disbursal Desk</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Design and launch custom scholarship schemes, set minimum marks and income ceilings, screen applicant dossiers, sanction grant disbursements, monitor fund utilization, and export printable Statutory CSR-1 certificates.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-purple-600 shrink-0" />
                    <span>Create &amp; Manage Custom Scholarship Schemes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-purple-600 shrink-0" />
                    <span>Grant Sanction &amp; Renewal Authorization Desk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-purple-600 shrink-0" />
                    <span>CSR Disbursal Analytics &amp; Statutory Form CSR-1</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2.5">
                <Link
                  to="/login?role=provider"
                  className="w-full py-3 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
                >
                  <span>Enter Provider / Verifier Portal</span>
                  <ChevronRight className="size-4" />
                </Link>

                <button
                  onClick={() => handleRoleQuickEntry('provider')}
                  className="w-full py-2 rounded-lg bg-purple-100 hover:bg-purple-200/80 text-purple-900 border border-purple-300 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="1-Click Instant Demo Login for Viva Evaluators"
                >
                  <Sparkles className="size-3 text-purple-700" />
                  <span>1-Click Demo Pass: Vikram (ORG-TR-01)</span>
                </button>
              </div>
            </div>

            {/* GATEWAY 3: ADMINISTRATOR ENTRANCE */}
            <div className="bg-gradient-to-b from-slate-50 to-emerald-50/20 rounded-2xl p-6 border-2 border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-900 text-emerald-300 flex items-center justify-center font-bold shadow-md shadow-emerald-950/20 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="size-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full uppercase">
                    Entrance Gate 3
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">Administrator Scrutiny Desk</h3>
                  <p className="text-xs text-slate-500 font-semibold">State Nodal Officer &amp; Audit Console</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Manage registered users and role permissions stored in database, inspect multi-stage scrutiny queues, execute batch application approvals, run AI OCR certificate tamper checks, and export live PFMS CSV bank transfer batches.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span>Database Users &amp; Role Management Console</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span>AI OCR Document Tamper &amp; Authenticity Inspector</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span>1-Click Central PFMS CSV DBT Disbursal Export</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2.5">
                <Link
                  to="/login?role=admin"
                  className="w-full py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
                >
                  <span>Enter Administrator Console</span>
                  <ChevronRight className="size-4" />
                </Link>

                <button
                  onClick={() => handleRoleQuickEntry('admin')}
                  className="w-full py-2 rounded-lg bg-emerald-100 hover:bg-emerald-200/80 text-emerald-900 border border-emerald-300 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="1-Click Instant Demo Login for Viva Evaluators"
                >
                  <Sparkles className="size-3 text-emerald-700" />
                  <span>1-Click Demo Pass: Dr. Ramesh (OFF-BLR-09)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMON LOGIN INVITATION & WORKFLOW SUMMARY */}
      <section className="portal-container py-12">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-blue-800/60 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
              One Single Entrance Door
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Sign In with Your Assigned User ID or Email
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              No manual workspace routing required. Our backend authentication engine identifies your user ID, checks your cryptographic password hash, verifies your role in MongoDB, and redirects you directly to your assigned dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              to="/login"
              className="px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <span>Go to Common Sign In Page</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <User className="size-4 text-amber-400" />
              <span>New Student Registration</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CORE ARCHITECTURAL CAPABILITIES */}
      <section className="portal-container pb-16 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
            System Features &amp; Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Engineered for Integrity, Transparency &amp; Scale
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Compliant with Government of India PFMS Direct Benefit Transfer protocols and high-throughput collegiate verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <Cpu className="size-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Multi-Tier Eligibility Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dynamically evaluates student marks, CGPA, annual family income ceilings, community categories, and domicile against 82 schemes in real time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <RefreshCw className="size-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Academic Renewal Continuity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Allows previous beneficiaries to re-verify progression by uploading semester marksheets and attendance certificates without filling fresh profiles.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <FileCheck2 className="size-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">AI OCR Tamper Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cryptographically scores Aadhaar seeding, Tehsildar income barcodes, and university marksheet seals with automated anomaly detection.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold">
              <IndianRupee className="size-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">PFMS Direct Benefit Transfer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              1-click batch export of sanctioned awards in Central PFMS APBS format mapped directly to Aadhaar-linked bank accounts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
              <UserCheck className="size-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Database Role Access Control</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Roles are stored in the database and protected by Bearer JWT authorization middleware. Administrators can reassign roles with live persistence.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold">
              <Lock className="size-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Zero-Trust Protected Routes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students cannot access provider or administrator consoles. Providers cannot alter admin configurations. Enforced on both frontend and backend.
            </p>
          </div>
        </div>
      </section>

      {/* VIVA & EXAMINER DEMO TEST CREDENTIALS */}
      <section className="portal-container pb-16">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
                Viva &amp; Evaluation Reference Desk
              </span>
              <h3 className="text-lg font-black mt-1">Pre-Seeded Accounts in Database</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Database className="size-4 text-emerald-400" />
              <span>Bcrypt Passwords &bull; MongoDB / JSON Store</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Student */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">1. Student Applicant</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-900 text-blue-200 font-mono font-bold">role: student</span>
              </div>
              <p className="text-slate-300"><strong className="text-white">Email / User ID:</strong> student@nsp.gov.in</p>
              <p className="text-slate-300"><strong className="text-white">Password:</strong> student123</p>
              <p className="text-slate-400 text-[11px] font-mono">User ID: AU2022CS084 &bull; Aravind S.</p>
              <button
                onClick={() => handleRoleQuickEntry('student')}
                className="w-full mt-2 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-amber-300 font-bold text-[11px] border border-blue-700 transition-colors cursor-pointer"
              >
                Launch Student Dashboard &rarr;
              </button>
            </div>

            {/* Provider */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-400">2. Provider / Verifier</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-900 text-purple-200 font-mono font-bold">role: provider</span>
              </div>
              <p className="text-slate-300"><strong className="text-white">Email / User ID:</strong> provider@nsp.gov.in</p>
              <p className="text-slate-300"><strong className="text-white">Password:</strong> provider123</p>
              <p className="text-slate-400 text-[11px] font-mono">User ID: ORG-TR-01 &bull; Vikram S.</p>
              <button
                onClick={() => handleRoleQuickEntry('provider')}
                className="w-full mt-2 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-300 font-bold text-[11px] border border-purple-700 transition-colors cursor-pointer"
              >
                Launch Provider Dashboard &rarr;
              </button>
            </div>

            {/* Admin */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400">3. Administrator</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-900 text-emerald-200 font-mono font-bold">role: admin</span>
              </div>
              <p className="text-slate-300"><strong className="text-white">Email / User ID:</strong> admin@nsp.gov.in</p>
              <p className="text-slate-300"><strong className="text-white">Password:</strong> admin123</p>
              <p className="text-slate-400 text-[11px] font-mono">User ID: OFF-BLR-09 &bull; Dr. Ramesh K.</p>
              <button
                onClick={() => handleRoleQuickEntry('admin')}
                className="w-full mt-2 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 font-bold text-[11px] border border-emerald-700 transition-colors cursor-pointer"
              >
                Launch Admin Console &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
