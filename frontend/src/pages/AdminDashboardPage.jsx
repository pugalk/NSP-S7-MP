import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import StatusBadge from '../components/StatusBadge';
import { 
  ShieldCheck, 
  Users, 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Search, 
  Clock, 
  Building2, 
  LogOut,
  IndianRupee,
  Eye,
  Check
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    staff, 
    staffLogout, 
    applications, 
    reviewApplication, 
    advanceApplication,
    documents, 
    setDocumentStatus, 
    scholarships 
  } = usePortal();

  const [activeTab, setActiveTab] = useState('applications'); // 'applications', 'documents', 'schemes'
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [reviewingApp, setReviewingApp] = useState(null);
  const [reviewRemark, setReviewRemark] = useState('');

  const filteredApps = applications.filter(app => {
    if (filterStatus !== 'All' && app.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        app.applicationId.toLowerCase().includes(q) ||
        app.applicantName.toLowerCase().includes(q) ||
        app.scholarshipName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleReviewAction = (newStatus) => {
    if (!reviewingApp) return;
    reviewApplication(
      reviewingApp.id,
      newStatus,
      reviewRemark || `Action taken by ${staff?.fullName || 'Welfare Officer'}`,
      staff?.fullName || 'Nodal Officer'
    );
    setReviewingApp(null);
    setReviewRemark('');
  };

  const handleQuickApprove = (app) => {
    reviewApplication(
      app.id,
      'Approved',
      `Application verified and awarded by ${staff?.fullName || 'Nodal Verification Officer'}. DBT Disbursal cleared.`,
      staff?.fullName || 'Nodal Officer'
    );
  };

  const totalDisbursed = applications
    .filter(a => a.status === 'Approved')
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  return (
    <div className="portal-container py-8 space-y-8">
      {/* Officer Header (Image 8 Style) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-xs">
            <ShieldCheck className="size-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white">{staff?.fullName || 'State Nodal Officer'}</h1>
              <span className="text-[10px] font-mono bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                Verification Desk
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                Online &amp; Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {staff?.department || 'Directorate of Collegiate & Higher Education'} • Central Redressal &amp; Audit Portal
            </p>
          </div>
        </div>

        <button
          onClick={staffLogout}
          className="relative z-10 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-2 self-start md:self-auto shadow-xs"
        >
          <LogOut className="size-3.5 text-rose-400" /> Sign Out Desk
        </button>
      </div>

      {/* Metrics Row (Image 8 Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Pipeline</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">
            {applications.length}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <Clock className="size-3 text-blue-600" /> Active verification trail
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Sanctioned Disbursals</span>
          <span className="text-3xl font-black text-emerald-700 mt-1 block">
            ₹{totalDisbursed.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
            <CheckCircle2 className="size-3 text-emerald-600" /> {applications.filter(a => a.status === 'Approved').length} awards finalized
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Pending Review</span>
          <span className="text-3xl font-black text-amber-600 mt-1 block">
            {applications.filter(a => a.status !== 'Approved' && a.status !== 'Rejected').length}
          </span>
          <span className="text-[11px] text-amber-700 font-bold mt-1 flex items-center gap-1">
            <Eye className="size-3 text-amber-600" /> Requires officer action
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Managed Schemes</span>
          <span className="text-3xl font-black text-blue-900 mt-1 block">
            {scholarships.length}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <Building2 className="size-3 text-slate-400" /> 13 Central/State domains
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 transition-colors ${
            activeTab === 'applications'
              ? 'text-blue-900 border-b-2 border-blue-900 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Scrutiny Queue ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 transition-colors ${
            activeTab === 'documents'
              ? 'text-blue-900 border-b-2 border-blue-900 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Document Vault ({documents.length})
        </button>
        <button
          onClick={() => setActiveTab('schemes')}
          className={`pb-3 transition-colors ${
            activeTab === 'schemes'
              ? 'text-blue-900 border-b-2 border-blue-900 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Schemes Catalog ({scholarships.length})
        </button>
      </div>

      {/* Tab 1: Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search applicant, App ID, or Scheme..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-10 text-xs rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="font-bold text-slate-600">Filter Stage:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select text-xs font-bold rounded-xl"
              >
                <option value="All">All Pipeline Stages</option>
                <option value="Submitted">1. Submitted</option>
                <option value="Document Verification">2. Document Verification</option>
                <option value="Under Verification">3. Under Verification</option>
                <option value="Provider Review">4. Provider Review</option>
                <option value="Approved">5. Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-extrabold">
                  <tr>
                    <th className="p-4 pl-6">App ID</th>
                    <th className="p-4">Applicant Scholar</th>
                    <th className="p-4">Scholarship Scheme</th>
                    <th className="p-4">Grant Amount</th>
                    <th className="p-4">Pipeline Status</th>
                    <th className="p-4 pr-6 text-right">Officer Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">
                        No applications found in scrutiny queue.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 pl-6 font-mono font-bold text-blue-900">{app.applicationId}</td>
                        <td className="p-4">
                          <span className="font-extrabold text-slate-900 block">{app.applicantName}</span>
                          <span className="text-[11px] text-slate-400">{app.userEmail}</span>
                        </td>
                        <td className="p-4 font-semibold text-slate-800">{app.scholarshipName}</td>
                        <td className="p-4 font-black text-emerald-700">₹{app.amount?.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {app.status !== 'Approved' && (
                              <button
                                onClick={() => handleQuickApprove(app)}
                                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                                title="1-Click Approve and sanction award"
                              >
                                <Check className="size-3" />
                                <span>Approve</span>
                              </button>
                            )}
                            <button
                              onClick={() => { setReviewingApp(app); setReviewRemark(app.remarks || ''); }}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white transition-all shadow-xs cursor-pointer"
                            >
                              Review &amp; Decide →
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden divide-y divide-slate-100">
          {documents.map((doc) => (
            <div key={doc.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-slate-50/50 transition-colors">
              <div className="min-w-0">
                <span className="font-extrabold text-slate-900 text-sm block">{doc.name}</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  File: <code className="font-mono text-slate-700">{doc.fileName}</code> • Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                {doc.remark && (
                  <p className="text-[11px] text-slate-600 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">Remarks: {doc.remark}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={doc.status} />
                <button
                  onClick={() => setDocumentStatus(doc.id, 'Verified', 'Verified by Nodal Officer.')}
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl hover:bg-emerald-100 transition-colors shadow-2xs"
                >
                  Verify Document
                </button>
                <button
                  onClick={() => setDocumentStatus(doc.id, 'Rejected', 'Certificate rejected: Unclear copy or invalid issuing authority.')}
                  className="px-3 py-1.5 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 rounded-xl hover:bg-rose-100 transition-colors shadow-2xs"
                >
                  Flag Discrepancy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Schemes Manager */}
      {activeTab === 'schemes' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">82 National Schemes Active in Rule Engine</h2>
              <p className="text-xs text-slate-500">Live deterministic rules enforced at frontend evaluation and server validation layers.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {scholarships.slice(0, 18).map((s) => (
              <div key={s.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <span className="font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">{s.code}</span>
                  <span className="badge-category text-[10px] py-0.5 px-2">{s.category}</span>
                </div>
                <span className="font-extrabold text-slate-800 line-clamp-1 block text-sm">{s.name}</span>
                <span className="text-emerald-700 font-extrabold block mt-2 text-xs">₹{s.amount.toLocaleString('en-IN')} / year</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Modal (Image 8 Style Decision Drawer) */}
      {reviewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 text-xs animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Application Review: {reviewingApp.applicationId}
                </h3>
                <span className="text-slate-400 text-[11px]">Nodal Officer Scrutiny &amp; Disbursal Order</span>
              </div>
              <button
                onClick={() => setReviewingApp(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Applicant Name:</span>
                <strong className="text-slate-900">{reviewingApp.applicantName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Scheme Applied:</span>
                <strong className="text-slate-900 text-right max-w-[300px] truncate">{reviewingApp.scholarshipName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Sanction Amount:</span>
                <strong className="text-emerald-700 font-extrabold">₹{reviewingApp.amount?.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Current Status:</span>
                <StatusBadge status={reviewingApp.status} />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Official Reviewer Remarks / Audit Justification
              </label>
              <textarea
                rows="3"
                value={reviewRemark}
                onChange={(e) => setReviewRemark(e.target.value)}
                placeholder="Enter justification or instructions for scholar..."
                className="form-textarea text-xs rounded-xl"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <button
                onClick={() => handleReviewAction('Approved')}
                className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="size-3.5" /> Approve Award
              </button>
              <button
                onClick={() => {
                  advanceApplication(reviewingApp.id);
                  setReviewingApp(null);
                  setReviewRemark('');
                }}
                className="py-2.5 px-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Clock className="size-3.5" /> Advance Stage
              </button>
              <button
                onClick={() => handleReviewAction('Resubmission Required')}
                className="py-2.5 px-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <RotateCcw className="size-3.5" /> Correction
              </button>
              <button
                onClick={() => handleReviewAction('Rejected')}
                className="py-2.5 px-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <XCircle className="size-3.5" /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
