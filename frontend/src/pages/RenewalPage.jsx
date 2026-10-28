import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  FileCheck, 
  BookOpen, 
  Calendar 
} from 'lucide-react';

export default function RenewalPage() {
  const { profile, scholarships, addApplication } = usePortal();
  const navigate = useNavigate();

  // Find renewable schemes
  const renewableSchemes = scholarships.filter(s => s.renewable);

  const [selectedSchemeId, setSelectedSchemeId] = useState(
    renewableSchemes[0]?.id || '1'
  );
  const [previousAppId, setPreviousAppId] = useState('NSRP-2025-419201');
  const [currentYearMarks, setCurrentYearMarks] = useState(profile.previousPercentage || '82');
  const [currentCgpa, setCurrentCgpa] = useState(profile.cgpa || '8.4');
  const [attendance, setAttendance] = useState(profile.attendance || '88');
  const [hasBacklogs, setHasBacklogs] = useState(false);
  const [incomeDeclaration, setIncomeDeclaration] = useState(profile.familyIncome || '220000');
  const [submitting, setSubmitting] = useState(false);

  const selectedScheme = scholarships.find(s => s.id === selectedSchemeId);

  // Check renewal eligibility
  const meetsPercentage = selectedScheme?.minPercentage ? parseFloat(currentYearMarks) >= selectedScheme.minPercentage : true;
  const meetsCgpa = selectedScheme?.minCgpa ? parseFloat(currentCgpa) >= selectedScheme.minCgpa : true;
  const meetsAttendance = selectedScheme?.minAttendance ? parseFloat(attendance) >= selectedScheme.minAttendance : true;
  const meetsNoBacklogs = !hasBacklogs;
  const meetsIncome = selectedScheme?.maxFamilyIncome ? parseFloat(incomeDeclaration) <= selectedScheme.maxFamilyIncome : true;

  const isRenewalEligible = meetsPercentage && meetsCgpa && meetsAttendance && meetsNoBacklogs && meetsIncome;

  const handleRenewalSubmit = (e) => {
    e.preventDefault();
    if (!isRenewalEligible) {
      alert('Cannot submit renewal. One or more renewal criteria are not satisfied.');
      return;
    }
    setSubmitting(true);

    addApplication({
      scholarshipId: selectedScheme.id,
      type: 'Renewal',
      remarks: `Previous App ID: ${previousAppId}. Annual renewal verified with ${currentCgpa} CGPA and ${attendance}% attendance.`,
      academicDetails: {
        percentage: currentYearMarks,
        cgpa: currentCgpa,
        attendance: attendance
      }
    });

    setTimeout(() => {
      setSubmitting(false);
      navigate('/student/dashboard');
    }, 600);
  };

  return (
    <div className="portal-container py-8 max-w-5xl space-y-8">
      {/* High-Fidelity Renewal Banner (Image 7 Style) */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-amber-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-amber-100 border border-white/20 shadow-xs">
            <RefreshCw className="size-3.5" />
            <span>Academic Year 2026-27 Renewal Window</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Scholarship Renewal &amp; Re-Verification Desk
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-normal">
            Fast-track your renewal for existing awards. Re-verify your academic progression, 
            attendance, and updated income ceiling to receive continuous DBT financial assistance.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-amber-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-300" /> Auto-seeded with Previous Year ID
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-300" /> Direct College Nodal Pipeline
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Renewal Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">Renewal Declaration Form</h2>
              <span className="text-xs text-slate-400">Progression details for continuous sanction</span>
            </div>
            <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
              Annual Cycle
            </span>
          </div>

          <form onSubmit={handleRenewalSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Select Award Scheme to Renew
              </label>
              <select
                value={selectedSchemeId}
                onChange={(e) => setSelectedSchemeId(e.target.value)}
                className="form-select text-xs font-bold text-slate-900 rounded-xl"
              >
                {renewableSchemes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code}) - ₹{s.amount.toLocaleString('en-IN')}/yr
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Previous Academic Year Application ID
              </label>
              <input
                type="text"
                value={previousAppId}
                onChange={(e) => setPreviousAppId(e.target.value)}
                placeholder="e.g. NSRP-2025-419201"
                className="form-input text-xs font-mono font-bold rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Latest Semester Marks (%)
                </label>
                <input
                  type="number"
                  value={currentYearMarks}
                  onChange={(e) => setCurrentYearMarks(e.target.value)}
                  className="form-input text-xs font-bold rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Cumulative CGPA (out of 10)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={currentCgpa}
                  onChange={(e) => setCurrentCgpa(e.target.value)}
                  className="form-input text-xs font-bold rounded-xl text-emerald-700"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Certified Attendance Rate (%)
                </label>
                <input
                  type="number"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  className="form-input text-xs font-bold rounded-xl text-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Updated Annual Family Income (₹)
                </label>
                <input
                  type="number"
                  value={incomeDeclaration}
                  onChange={(e) => setIncomeDeclaration(e.target.value)}
                  className="form-input text-xs font-bold rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-1">
              <label className="flex items-center gap-2.5 cursor-pointer font-bold text-rose-900">
                <input
                  type="checkbox"
                  checked={hasBacklogs}
                  onChange={(e) => setHasBacklogs(e.target.checked)}
                  className="rounded text-rose-600 size-4"
                />
                <span>I have active backlogs / arrear examinations</span>
              </label>
              <p className="text-[11px] text-rose-700/80 pl-6.5">
                Central rules mandate clear pass without standing arrear courses to qualify for renewal disbursement.
              </p>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={submitting || !isRenewalEligible}
                className="w-full py-3 rounded-2xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Transmitting Renewal Application...' : 'Submit Renewal Application →'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Automated Re-Verification Checklist (Image 7 Style) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <ShieldCheck className="size-5 text-blue-900" />
              <h3 className="text-base font-black text-slate-900">Live Rule Verification Matrix</h3>
            </div>

            <p className="text-xs text-slate-500">
              Deterministic evaluation against <strong className="text-slate-800">{selectedScheme?.name}</strong> renewal clauses:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3">
                {meetsPercentage ? (
                  <CheckCircle2 className="size-4.5 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="size-4.5 text-rose-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-800 block">Minimum Academic Marks</span>
                  <span className={meetsPercentage ? 'text-slate-600' : 'text-rose-700 font-bold'}>
                    Requires {selectedScheme?.minPercentage || 50}% (You have {currentYearMarks}%)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3">
                {meetsCgpa ? (
                  <CheckCircle2 className="size-4.5 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="size-4.5 text-rose-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-800 block">Cumulative CGPA</span>
                  <span className={meetsCgpa ? 'text-slate-600' : 'text-rose-700 font-bold'}>
                    Requires {selectedScheme?.minCgpa || 6.0} CGPA (You have {currentCgpa})
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3">
                {meetsAttendance ? (
                  <CheckCircle2 className="size-4.5 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="size-4.5 text-rose-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-800 block">Certified Attendance Rate</span>
                  <span className={meetsAttendance ? 'text-slate-600' : 'text-rose-700 font-bold'}>
                    Requires {selectedScheme?.minAttendance || 75}% attendance (You have {attendance}%)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3">
                {meetsNoBacklogs ? (
                  <CheckCircle2 className="size-4.5 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="size-4.5 text-rose-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-800 block">Clear Academic Promotion</span>
                  <span className={meetsNoBacklogs ? 'text-slate-600' : 'text-rose-700 font-bold'}>
                    {meetsNoBacklogs ? 'No active backlogs reported.' : 'Active backlogs violate renewal criteria.'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3">
                {meetsIncome ? (
                  <CheckCircle2 className="size-4.5 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="size-4.5 text-rose-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-800 block">Income Ceiling Rule</span>
                  <span className={meetsIncome ? 'text-slate-600' : 'text-rose-700 font-bold'}>
                    Ceiling ₹{selectedScheme?.maxFamilyIncome?.toLocaleString('en-IN') || 'None'} (Declared: ₹{Number(incomeDeclaration).toLocaleString('en-IN')})
                  </span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl text-xs font-bold ${
              isRenewalEligible ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              {isRenewalEligible 
                ? '✓ 5/5 Criteria Satisfied. Immediate auto-forwarding to Institutional Nodal Officer upon submission.'
                : '✗ One or more renewal criteria unmet. Rectify marked conditions before proceeding.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
