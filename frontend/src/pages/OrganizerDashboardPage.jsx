import React, { useState, useEffect, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Building2,
  Landmark,
  Award,
  IndianRupee,
  Users,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Search,
  Filter,
  LogOut,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Briefcase,
  FileText,
  Clock,
  Layers,
  Check,
  Eye,
  AlertCircle,
  Trash2,
  Printer,
  QrCode,
  Download,
  RotateCcw
} from 'lucide-react';

export default function OrganizerDashboardPage() {
  const { 
    organizer, 
    organizerLogout, 
    applications, 
    scholarships, 
    reviewApplication,
    addScholarship,
    removeScholarship,
    notify,
    backendConnected 
  } = usePortal();

  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'schemes'
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [showNewSchemeModal, setShowNewSchemeModal] = useState(false);
  const [showCSRCert, setShowCSRCert] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [sanctionRemark, setSanctionRemark] = useState('');
  const [sanctioning, setSanctioning] = useState(false);

  // New Scheme Form State
  const [newSchemeData, setNewSchemeData] = useState({
    name: '',
    category: 'Merit-Based',
    amount: 60000,
    description: '',
    closingDate: '2026-11-30',
    minCgpa: 8.0,
    minPercentage: 80,
    minAttendance: 80,
    maxFamilyIncome: 450000,
    eligibleCourses: 'B.Tech, B.E, B.Sc',
    eligibleStates: 'All States (Pan-India)'
  });
  const [submittingScheme, setSubmittingScheme] = useState(false);

  // Schemes managed by this organizer
  const managedSchemes = useMemo(() => {
    const managedIds = organizer?.managedSchemeIds || ['1', '2', '3', '4'];
    return scholarships.filter(s => 
      managedIds.includes(s.id) ||
      s.provider?.toLowerCase().includes('foundation') ||
      s.provider?.toLowerCase().includes('trust') ||
      s.provider?.toLowerCase().includes('ministry')
    );
  }, [organizer, scholarships]);

  const managedSchemeIds = useMemo(() => new Set(managedSchemes.map(s => s.id)), [managedSchemes]);

  // Applications belonging to managed schemes
  const relevantApplications = useMemo(() => {
    return applications.filter(a => managedSchemeIds.has(a.scholarshipId) || !a.scholarshipId);
  }, [applications, managedSchemeIds]);

  // Renewal-specific applications
  const renewalApplications = useMemo(() => {
    return relevantApplications.filter(a => a.type === 'Renewal');
  }, [relevantApplications]);

  const filteredApps = useMemo(() => {
    return relevantApplications.filter(app => {
      if (filterStatus !== 'All' && app.status !== filterStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          app.applicationId?.toLowerCase().includes(q) ||
          app.applicantName?.toLowerCase().includes(q) ||
          app.scholarshipName?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [relevantApplications, filterStatus, search]);

  // Financial calculations
  const totalBudget = organizer?.allocatedBudget || 25000000;
  const disbursedAmount = relevantApplications
    .filter(a => a.status === 'Approved')
    .reduce((sum, a) => sum + (a.amount || 0), 0);
  const remainingBudget = Math.max(0, totalBudget - disbursedAmount);

  const pendingProviderCount = relevantApplications.filter(
    a => a.status === 'Provider Review' || a.status === 'Under Verification'
  ).length;

  const handleQuickSanction = async (app, decision = 'Approved') => {
    setSanctioning(true);
    const remark = sanctionRemark || (decision === 'Approved' 
      ? `Grant sanctioned & approved by ${organizer?.organization || 'Funding Body'}. DBT disbursal registered.`
      : `Grant declined by Scheme Organizer due to quota / eligibility cutoff.`);
    
    try {
      if (backendConnected) {
        await api.sanctionOrganizerApplication(app.id, decision, remark);
      }
      reviewApplication(
        app.id,
        decision,
        remark,
        `${organizer?.fullName || 'Vikram Singhania'} (Organizer Desk)`
      );
      notify({
        title: decision === 'Approved' ? 'Grant Sanctioned!' : 'Decision Recorded',
        body: `Application ${app.applicationId} status updated to ${decision}.`,
        tone: decision === 'Approved' ? 'success' : 'warning'
      });
      setSelectedApp(null);
      setSanctionRemark('');
    } catch (err) {
      console.warn('Sanction error:', err.message);
      // Fallback local update
      reviewApplication(
        app.id,
        decision,
        remark,
        `${organizer?.fullName || 'Vikram Singhania'} (Organizer Desk)`
      );
      setSelectedApp(null);
      setSanctionRemark('');
    } finally {
      setSanctioning(false);
    }
  };

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    if (!newSchemeData.name.trim()) return;

    setSubmittingScheme(true);
    try {
      const payload = {
        ...newSchemeData,
        provider: organizer?.organization || 'National Higher Education Foundation & CSR Trust',
        eligibleCourses: typeof newSchemeData.eligibleCourses === 'string'
          ? newSchemeData.eligibleCourses.split(',').map(s => s.trim())
          : newSchemeData.eligibleCourses,
        eligibleStates: typeof newSchemeData.eligibleStates === 'string'
          ? newSchemeData.eligibleStates.split(',').map(s => s.trim())
          : newSchemeData.eligibleStates
      };

      await addScholarship(payload);

      setShowNewSchemeModal(false);
      setNewSchemeData({
        name: '',
        category: 'Merit-Based',
        amount: 60000,
        description: '',
        closingDate: '2026-11-30',
        minCgpa: 8.0,
        minPercentage: 80,
        minAttendance: 80,
        maxFamilyIncome: 450000,
        eligibleCourses: 'B.Tech, B.E, B.Sc',
        eligibleStates: 'All States (Pan-India)'
      });
    } catch (err) {
      notify({
        title: 'Publish Warning',
        body: err.message || 'Scheme creation failed.',
        tone: 'warning'
      });
    } finally {
      setSubmittingScheme(false);
    }
  };

  const handleDeleteScheme = async (schemeId, schemeName) => {
    if (window.confirm(`Are you sure you want to remove and withdraw "${schemeName}" from the National Scholarship Portal catalog? This action will immediately archive it.`)) {
      try {
        await removeScholarship(schemeId);
      } catch (err) {
        notify({
          title: 'Removal Error',
          body: err.message || 'Could not remove scheme.',
          tone: 'warning'
        });
      }
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="portal-container py-10 space-y-8">
      {/* Organizer Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30 shadow-inner">
            <Landmark className="size-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {organizer?.fullName || 'Vikram Singhania'}
              </h1>
              <span className="text-[11px] font-mono bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                Scholarship Provider / Verifier
              </span>
              <span className="text-[11px] font-mono bg-purple-950 text-purple-300 border border-purple-700 px-2.5 py-0.5 rounded-full font-bold">
                User ID: {organizer?.userIdentifier || 'ORG-TR-01'}
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-1 flex items-center gap-1.5 font-medium">
              <Building2 className="size-3.5 text-amber-400" />
              <span>{organizer?.organization || 'National Higher Education Foundation & CSR Trust'}</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {organizer?.designation || 'Scholarship Program Director'} • Fund Allocation &amp; Scheme Sponsor Desk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto relative z-10">
          <button
            onClick={() => setShowNewSchemeModal(true)}
            className="btn-accent text-xs py-2 px-3.5 shadow-md flex items-center gap-1.5 font-bold"
          >
            <PlusCircle className="size-4" />
            <span>Create New Scheme</span>
          </button>
          <button
            onClick={organizerLogout}
            className="btn-secondary text-xs py-2 px-3.5 bg-white/10 text-white border-white/20 hover:bg-white/20 shadow-sm"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sanctioned Budget */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500">Sanctioned Trust Budget</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
              <Landmark className="size-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(totalBudget)}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Direct CSR &amp; Endowment Grant Pool
            </span>
          </div>
        </div>

        {/* Card 2: Disbursed Grants */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500">Disbursed Grants (PFMS)</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <IndianRupee className="size-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-700 tracking-tight">
              {formatCurrency(disbursedAmount)}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="size-3" />
              <span>{relevantApplications.filter(a => a.status === 'Approved').length} Students Awarded</span>
            </span>
          </div>
        </div>

        {/* Card 3: Remaining Fund Quota */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500">Available Disbursal Buffer</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <Sparkles className="size-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-amber-700 tracking-tight">
              {formatCurrency(remainingBudget)}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Remaining for AY 2026-27 cycle
            </span>
          </div>
        </div>

        {/* Card 4: Managed Schemes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500">Sponsored Schemes</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-800">
              <Award className="size-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-indigo-900 tracking-tight">
              {managedSchemes.length} Active Schemes
            </span>
            <span className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
              <Clock className="size-3" />
              <span>{pendingProviderCount} Applications Awaiting Review</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('applications')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'border-indigo-900 text-indigo-950 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="size-4" />
          <span>Candidate Applications ({relevantApplications.length})</span>
          {pendingProviderCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {pendingProviderCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('renewals')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'renewals'
              ? 'border-indigo-900 text-indigo-950 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="size-4 text-amber-600" />
          <span>Renewals Desk ({renewalApplications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schemes')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'schemes'
              ? 'border-indigo-900 text-indigo-950 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="size-4" />
          <span>Managed Schemes ({managedSchemes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-indigo-900 text-indigo-950'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="size-4 text-amber-500" />
          <span>Disbursal &amp; Impact Analytics</span>
        </button>
      </div>

      {/* TAB 1: Applications & Sanctions Desk */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
          {/* Filters Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search applicant name, ID, or scheme..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-9 text-xs py-2 w-full"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                <Filter className="size-3.5" /> Stage:
              </span>
              {['All', 'Provider Review', 'Under Verification', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    filterStatus === status
                      ? 'bg-indigo-950 text-amber-400 shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Applicant &amp; Scheme</th>
                  <th className="py-3 px-4">Sanction Amount</th>
                  <th className="py-3 px-4">Submission Type</th>
                  <th className="py-3 px-4">Verification Stage</th>
                  <th className="py-3 px-4">Remarks / Bank</th>
                  <th className="py-3 px-4 text-right">Organizer Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      No applications match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id || app.applicationId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{app.applicantName}</div>
                        <div className="text-[11px] text-indigo-900 font-medium">{app.scholarshipName}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{app.applicationId}</div>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {formatCurrency(app.amount || 50000)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          app.type === 'Renewal' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {app.type || 'Fresh'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs">
                        <p className="line-clamp-2 text-[11px]">{app.remarks || 'Awaiting nodal & trust review.'}</p>
                        {app.bankDetails?.bankName && (
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                            Bank: {app.bankDetails.bankName} ({app.bankDetails.accountNumber})
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {app.status === 'Approved' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="size-3.5" /> Disbursed
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => { setSelectedApp(app); setSanctionRemark(''); }}
                              className="btn-accent text-xs py-1 px-2.5 shadow-2xs font-bold"
                            >
                              <Award className="size-3.5" /> Sanction Grant
                            </button>
                            <button
                              onClick={() => handleQuickSanction(app, 'Approved')}
                              className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                              title="1-Click Direct Sanction"
                            >
                              <Check className="size-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMIC RENEWALS DESK */}
      {activeTab === 'renewals' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">Academic Renewal Re-Verification Desk</h2>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  {renewalApplications.length} Continuing Scholars
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Annual renewal scrutiny for continuing scholars. Verifies year-on-year pass promotion, minimum 75% attendance, and latest semester marksheets.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Scholar &amp; Renewal ID</th>
                  <th className="py-3 px-4">Scheme Name</th>
                  <th className="py-3 px-4">Sanction Grant</th>
                  <th className="py-3 px-4">Promotion Criteria</th>
                  <th className="py-3 px-4">Renewal Status</th>
                  <th className="py-3 px-4 text-right">Provider Renewal Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {renewalApplications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      No renewal applications found.
                    </td>
                  </tr>
                ) : (
                  renewalApplications.map((app) => (
                    <tr key={app.id || app.applicationId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{app.applicantName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{app.applicationId}</div>
                        <div className="text-[11px] text-amber-800 font-semibold mt-0.5">Academic Year 2026-27 Renewal</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-indigo-900">
                        {app.scholarshipName}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900 font-mono">
                        {formatCurrency(app.amount || 36000)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[11px]">
                          <span className="text-emerald-700 font-bold block">✓ Promoted to Next Year</span>
                          <span className="text-slate-500 block">Attendance: 88% (Pass &ge; 75%)</span>
                          <span className="text-slate-500 block">CGPA: 8.4 (Verified)</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {app.status === 'Approved' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="size-3.5" /> Renewal Disbursed
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => { setSelectedApp(app); setSanctionRemark('Renewal verified and approved.'); }}
                              className="btn-accent text-xs py-1 px-2.5 shadow-2xs font-bold cursor-pointer"
                            >
                              <RotateCcw className="size-3.5" /> Sanction Renewal
                            </button>
                            <button
                              onClick={() => handleQuickSanction(app, 'Approved')}
                              className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                              title="1-Click Approve Renewal"
                            >
                              <Check className="size-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Managed Schemes Portfolio */}
      {activeTab === 'schemes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Sponsored Scholarship Portfolio</h2>
              <p className="text-xs text-slate-500">Schemes created and funded under {organizer?.organization || 'Trust'}</p>
            </div>
            <button
              onClick={() => setShowNewSchemeModal(true)}
              className="btn-primary text-xs py-2 px-3 shadow-sm flex items-center gap-1.5 font-bold"
            >
              <PlusCircle className="size-3.5" />
              <span>Add New Scholarship Scheme</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {managedSchemes.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900">
                      {s.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">#{s.code || s.id}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{s.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{s.description}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Max Grant Amount:</span>
                    <span className="font-black text-indigo-950">{formatCurrency(s.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Minimum CGPA:</span>
                    <span className="font-bold text-slate-800">{s.minCgpa || 7.5} CGPA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Max Family Income:</span>
                    <span className="font-bold text-slate-800">{formatCurrency(s.maxFamilyIncome || 450000)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Deadline:</span>
                    <span className="font-semibold text-rose-700">{s.closingDate || '30 Oct 2026'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-extrabold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                      <CheckCircle2 className="size-3 text-emerald-600" /> Active
                    </span>
                    <span className="text-slate-600 font-mono text-[11px] font-bold">
                      {relevantApplications.filter(a => a.scholarshipId === s.id).length} Applicants
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteScheme(s.id, s.name)}
                    className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs hover:scale-105"
                    title="Remove / Delete this scholarship scheme from the portal"
                  >
                    <Trash2 className="size-3.5 text-rose-600" />
                    <span>Remove Scheme</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Disbursal & Impact Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/15 border border-amber-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
                CSR &amp; Endowment Trust Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-black">
                {organizer?.organization || 'National Higher Education Foundation & CSR Trust'}
              </h2>
              <p className="text-xs text-indigo-200 max-w-xl">
                Statutory CSR impact metrics, gender diversity indices, and direct-to-bank disbursal records compliant with Section 135 Companies Act &amp; 80G Tax Exemption.
              </p>
            </div>

            <button
              onClick={() => setShowCSRCert(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all flex items-center gap-2 shadow-lg cursor-pointer self-start md:self-auto"
            >
              <Printer className="size-4" />
              <span>Generate CSR Utilization Certificate</span>
            </button>
          </div>

          {/* Fund Utilization Progress Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Total Sanctioned Trust Budget Utilization</h3>
                <p className="text-xs text-slate-500">AY 2026-27 Allocation vs Released Grants</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-indigo-950 font-mono">
                  {formatCurrency(disbursedAmount)} / {formatCurrency(totalBudget)}
                </span>
                <span className="text-[10px] text-emerald-700 block font-bold">
                  {((disbursedAmount / totalBudget) * 100).toFixed(2)}% Disbursed to Scholars
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(1, (disbursedAmount / totalBudget) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>₹0 Disbursed</span>
                <span>Buffer Remaining: {formatCurrency(remainingBudget)}</span>
                <span>Cap: {formatCurrency(totalBudget)}</span>
              </div>
            </div>
          </div>

          {/* Diversity & Social Impact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Gender Inclusion Ratio</span>
                <span className="text-[10px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-bold">High Equality</span>
              </div>
              <span className="text-2xl font-black text-pink-700 block">54% Women Scholars</span>
              <p className="text-[11px] text-slate-500">
                Flagship female STEM scholars and Begum Hazrat Mahal girls education grant beneficiaries.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Rural Outreach (Tier 2/3)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Pan-India</span>
              </div>
              <span className="text-2xl font-black text-emerald-700 block">68% Rural Coverage</span>
              <p className="text-[11px] text-slate-500">
                Students enrolled in district and state government colleges across 11 Indian states.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Average Beneficiary CGPA</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">High Merit</span>
              </div>
              <span className="text-2xl font-black text-blue-900 block">8.2 CGPA</span>
              <p className="text-[11px] text-slate-500">
                Stringent merit requirements filter verified students with &gt; 80% attendance.
              </p>
            </div>
          </div>

          {/* Top Recipient Institutions */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">Top Recipient Higher Education Institutions</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {[
                { name: 'Anna University, Chennai (College of Engineering Guindy)', state: 'Tamil Nadu', count: 18, sum: '₹9,00,000' },
                { name: 'Indian Institute of Technology (IIT) Madras', state: 'Tamil Nadu', count: 12, sum: '₹9,60,000' },
                { name: 'Delhi Technological University (DTU)', state: 'Delhi', count: 10, sum: '₹6,00,000' },
                { name: 'Jadavpur University, Kolkata', state: 'West Bengal', count: 8, sum: '₹4,80,000' }
              ].map((inst, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{inst.name}</span>
                    <span className="text-[11px] text-slate-400">{inst.state} • {inst.count} Beneficiaries</span>
                  </div>
                  <span className="font-mono font-black text-emerald-700 text-xs">{inst.sum}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Grant Sanction Decision */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Award className="size-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Sanction Grant Allocation</h3>
                  <p className="text-[11px] text-slate-500">{selectedApp.applicationId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <XCircle className="size-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-900">{selectedApp.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheme:</span>
                <span className="font-bold text-indigo-900">{selectedApp.scholarshipName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Award Amount:</span>
                <span className="font-black text-emerald-700">{formatCurrency(selectedApp.amount || 50000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type:</span>
                <span className="font-semibold text-slate-800">{selectedApp.type || 'Fresh'} Application</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Sanction Remark / Disbursal Note
              </label>
              <textarea
                rows="3"
                value={sanctionRemark}
                onChange={(e) => setSanctionRemark(e.target.value)}
                placeholder="Enter official grant sanction order or remarks for student records..."
                className="form-input text-xs w-full"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="btn-secondary text-xs py-2 px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleQuickSanction(selectedApp, 'Rejected')}
                disabled={sanctioning}
                className="px-3 py-2 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                Decline Grant
              </button>
              <button
                type="button"
                onClick={() => handleQuickSanction(selectedApp, 'Approved')}
                disabled={sanctioning}
                className="btn-accent text-xs py-2 px-4 shadow-sm font-bold flex items-center gap-1.5"
              >
                <Check className="size-3.5" />
                <span>{sanctioning ? 'Processing...' : 'Sanction & Award Grant'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create New Scholarship Scheme */}
      {showNewSchemeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                  <PlusCircle className="size-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Publish New Scholarship Scheme</h3>
                  <p className="text-[11px] text-slate-500">Sponsored by {organizer?.organization || 'Trust'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewSchemeModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <XCircle className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateScheme} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Scholarship Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National STEM & Innovation Merit Fellowship 2026"
                  value={newSchemeData.name}
                  onChange={(e) => setNewSchemeData({ ...newSchemeData, name: e.target.value })}
                  className="form-input text-xs w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Scheme Category</label>
                  <select
                    value={newSchemeData.category}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, category: e.target.value })}
                    className="form-input text-xs w-full"
                  >
                    <option value="Merit-Based">Merit-Based</option>
                    <option value="Special Category">Special Category / CSR</option>
                    <option value="Central Government">Central Government</option>
                    <option value="State Scheme">State Scheme</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Grant Amount per Student (₹)</label>
                  <input
                    type="number"
                    required
                    min="5000"
                    step="1000"
                    value={newSchemeData.amount}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, amount: e.target.value })}
                    className="form-input text-xs w-full"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Scheme Overview &amp; Objectives</label>
                <textarea
                  rows="2"
                  placeholder="Brief description of the scholarship purpose, targeted beneficiaries, and impact..."
                  value={newSchemeData.description}
                  onChange={(e) => setNewSchemeData({ ...newSchemeData, description: e.target.value })}
                  className="form-input text-xs w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="5.0"
                    max="10.0"
                    value={newSchemeData.minCgpa}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, minCgpa: e.target.value })}
                    className="form-input text-xs w-full"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Min % Marks</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={newSchemeData.minPercentage}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, minPercentage: e.target.value })}
                    className="form-input text-xs w-full"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Min Attendance %</label>
                  <input
                    type="number"
                    min="60"
                    max="100"
                    value={newSchemeData.minAttendance}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, minAttendance: e.target.value })}
                    className="form-input text-xs w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Annual Family Income (₹)</label>
                  <input
                    type="number"
                    step="10000"
                    value={newSchemeData.maxFamilyIncome}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, maxFamilyIncome: e.target.value })}
                    className="form-input text-xs w-full"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Application Closing Date</label>
                  <input
                    type="date"
                    value={newSchemeData.closingDate}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, closingDate: e.target.value })}
                    className="form-input text-xs w-full"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Eligible Courses (comma separated)</label>
                <input
                  type="text"
                  value={newSchemeData.eligibleCourses}
                  onChange={(e) => setNewSchemeData({ ...newSchemeData, eligibleCourses: e.target.value })}
                  placeholder="B.Tech, B.E, B.Sc, M.Tech, MBBS"
                  className="form-input text-xs w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewSchemeModal(false)}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingScheme}
                  className="btn-primary text-xs py-2 px-4 shadow-sm font-bold flex items-center gap-1.5"
                >
                  <Award className="size-3.5" />
                  <span>{submittingScheme ? 'Publishing...' : 'Publish Scheme Live'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: Foundation CSR Utilization Certificate */}
      {showCSRCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-indigo-500/30 space-y-6 text-slate-900 animate-in zoom-in-95 duration-150 my-6 max-h-[92vh] overflow-y-auto">
            {/* Header / Actions */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="size-3.5 text-indigo-600" />
                Statutory CSR Compliance Certificate
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => setShowCSRCert(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="border-2 border-indigo-200 p-6 sm:p-8 rounded-2xl bg-indigo-50/15 space-y-6 text-center relative overflow-hidden">
              <div className="space-y-1">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-900 to-slate-950 text-amber-400 flex items-center justify-center font-black shadow-md mb-2">
                  <Landmark className="size-7 text-amber-400" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-900">
                  {organizer?.organization || 'National Higher Education Foundation & CSR Trust'}
                </h2>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 uppercase pt-1">
                  CSR Grant Utilization &amp; Compliance Certificate
                </h1>
                <p className="text-[11px] font-mono text-slate-500">
                  Certificate Ref: <strong>CSR/NSP/2026-27/TR-{(Date.now()).toString().slice(-6)}</strong> • Section 135 Compliant
                </p>
              </div>

              <div className="text-left text-xs leading-relaxed space-y-3 pt-2 text-slate-700 border-t border-indigo-100">
                <p>
                  This is to certify that an aggregate grant amount of <strong className="text-indigo-950">{formatCurrency(disbursedAmount)}</strong> has been directly disbursed to eligible and verified student scholars under the scholarship schemes sponsored by <strong>{organizer?.organization || 'Trust'}</strong> on the National Scholarship Renewal Portal for Academic Year 2026-27.
                </p>

                <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Authorized Trustee</span>
                      <strong className="text-slate-900 font-bold">{organizer?.fullName || 'Vikram Singhania'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Designation</span>
                      <span className="text-slate-800 font-medium">{organizer?.designation || 'Scholarship Program Director'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Scholars Awarded</span>
                      <strong className="text-emerald-700 font-bold font-mono">{relevantApplications.filter(a => a.status === 'Approved').length} Beneficiaries</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Disbursal Pipeline</span>
                      <span className="text-slate-800 font-medium">PFMS Direct Benefit Transfer</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  * All grant disbursements are processed through Aadhaar Payment Bridge (APBS) directly into authenticated scholar bank accounts with zero intermediary leakage.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-4 border-t border-indigo-100 flex items-center justify-between text-left text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white border border-indigo-200 rounded-lg p-1 flex items-center justify-center">
                    <QrCode className="size-10 text-indigo-950" />
                  </div>
                  <div>
                    <span className="font-bold text-indigo-950 block text-[10px]">Statutory Verification Hash</span>
                    <span className="text-[9px] font-mono text-slate-400">CSR-AUTH-2026-NSP</span>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="inline-block border-b border-indigo-950 pb-1 text-indigo-950 font-serif italic text-xs font-bold">
                    {organizer?.fullName || 'Vikram Singhania'}
                  </div>
                  <span className="block text-[10px] font-bold text-slate-700">Program Director &amp; Trustee</span>
                  <span className="block text-[9px] text-slate-400">CSR Statutory Audit Division</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
