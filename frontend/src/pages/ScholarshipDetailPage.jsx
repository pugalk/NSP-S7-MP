import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import EligibilityRuleModal from '../components/EligibilityRuleModal';
import { 
  Building2, 
  Calendar, 
  IndianRupee, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function ScholarshipDetailPage() {
  const { id } = useParams();
  const { findScholarship, profile } = usePortal();
  const navigate = useNavigate();
  const [evalModal, setEvalModal] = useState(null);

  const scheme = findScholarship(id);

  if (!scheme) {
    return (
      <div className="portal-container py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Scholarship Scheme Not Found</h2>
        <p className="text-sm text-slate-500">The requested scheme ID #{id} does not exist in our active database.</p>
        <Link to="/scholarships" className="btn-primary inline-flex text-xs py-2 px-4 mt-2">
          <ArrowLeft className="size-4" /> Back to Scholarships
        </Link>
      </div>
    );
  }

  const now = new Date();
  const closing = new Date(scheme.closingDate);
  const diffDays = Math.ceil((closing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isClosed = !scheme.active || diffDays < 0;

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const handleCheckEligibility = () => {
    // Quick evaluate against student's current profile
    navigate(`/eligibility?scheme=${scheme.id}`);
  };

  return (
    <div className="portal-container py-10 space-y-8 max-w-5xl">
      {/* Back button */}
      <Link
        to="/scholarships"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to all scholarships
      </Link>

      {/* Main Scheme Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="badge-category text-xs py-1 px-3">
              {scheme.category}
            </span>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
              Code: {scheme.code}
            </span>
          </div>

          <div>
            {isClosed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                <Clock className="size-3.5" /> Application window closed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Clock className="size-3.5 text-emerald-600" />
                {diffDays <= 7 ? `${diffDays} days left to apply` : `Open until ${new Date(scheme.closingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
              </span>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {scheme.name}
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mt-2">
            <Building2 className="size-4 text-slate-400 shrink-0" />
            <span>{scheme.provider}</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          {scheme.description}
        </p>

        {/* Highlight Key Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Grant Amount</span>
            <span className="text-lg font-extrabold text-emerald-700">
              {formatCurrency(scheme.amount)}
              <span className="text-xs text-slate-400 font-normal"> / year</span>
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Opening Date</span>
            <span className="text-sm font-bold text-slate-800">
              {new Date(scheme.openingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Closing Date</span>
            <span className="text-sm font-bold text-slate-800">
              {new Date(scheme.closingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Renewable</span>
            <span className="text-sm font-bold text-slate-800">
              {scheme.renewable ? 'Yes (Annual)' : 'No (One-time)'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {!isClosed ? (
            <Link
              to={`/student/apply/${scheme.id}`}
              className="btn-primary text-sm py-2.5 px-6 shadow-md"
            >
              Apply Online Now
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <button disabled className="btn-secondary text-sm py-2.5 px-6 opacity-60 cursor-not-allowed">
              Applications Closed
            </button>
          )}

          <button
            onClick={handleCheckEligibility}
            className="btn-accent text-sm py-2.5 px-5 shadow-sm"
          >
            Check My Eligibility Against This Scheme
          </button>
        </div>
      </div>

      {/* Grid: Eligibility Matrix & Benefits / Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Detailed Eligibility Criteria */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <ShieldCheck className="size-5 text-blue-900" />
              <h2 className="text-lg font-bold text-slate-900">Eligibility Criteria Matrix</h2>
            </div>

            <div className="space-y-3 text-xs">
              {/* Academic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-slate-400 font-medium block">Minimum Percentage</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {scheme.minPercentage ? `${scheme.minPercentage}% marks required` : 'No minimum percentage required'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Minimum CGPA</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {scheme.minCgpa ? `${scheme.minCgpa} CGPA on 10-point scale` : 'No minimum CGPA required'}
                  </span>
                </div>
              </div>

              {/* Attendance & Income */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-slate-400 font-medium block">Minimum Attendance</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {scheme.minAttendance ? `${scheme.minAttendance}% biometric / certified attendance` : 'Standard institution attendance'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Family Income Ceiling</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {scheme.maxFamilyIncome ? `Up to ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')} per annum` : 'No income ceiling specified'}
                  </span>
                </div>
              </div>

              {/* Domicile & Communities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-slate-400 font-medium block">Domicile States</span>
                  <span className="font-bold text-slate-800">
                    {scheme.eligibleStates && scheme.eligibleStates.length > 0 
                      ? scheme.eligibleStates.join(', ') 
                      : 'All States & Union Territories of India'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Eligible Categories</span>
                  <span className="font-bold text-slate-800">
                    {scheme.eligibleCommunities && scheme.eligibleCommunities.length > 0 
                      ? scheme.eligibleCommunities.join(', ') 
                      : 'Open to All Communities (OC, BC, MBC, SC, ST, EWS)'}
                  </span>
                </div>
              </div>

              {/* Courses & Years */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-slate-400 font-medium block">Eligible Degree Courses</span>
                  <span className="font-bold text-slate-800">
                    {scheme.eligibleCourses && scheme.eligibleCourses.length > 0 
                      ? scheme.eligibleCourses.join(', ') 
                      : 'All Recognised Courses (B.Tech, B.Sc, B.Com, MBA, etc.)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Eligible Academic Years</span>
                  <span className="font-bold text-slate-800">
                    {scheme.eligibleYears && scheme.eligibleYears.length > 0 
                      ? scheme.eligibleYears.map(y => `Year ${y}`).join(', ') 
                      : 'All Academic Years (1st to Final Year)'}
                  </span>
                </div>
              </div>

              {/* Gender & Special Requirements */}
              <div className="p-3 bg-slate-50 rounded-lg space-y-1.5">
                <div>
                  <span className="text-slate-400 font-medium">Gender Requirement: </span>
                  <span className="font-bold text-slate-800">
                    {scheme.gender === 'Female' ? 'Exclusively for Female Candidates' : 'Open to All Genders (Male / Female / Transgender)'}
                  </span>
                </div>
                {scheme.requiresDisability && (
                  <div className="text-amber-800 font-semibold">
                    • Certified 40%+ Disability (Divyangjan) certificate mandatory.
                  </div>
                )}
                {scheme.requiresSports && (
                  <div className="text-amber-800 font-semibold">
                    • State or National level sports representation certificate mandatory.
                  </div>
                )}
                {scheme.requiresHosteller && (
                  <div className="text-amber-800 font-semibold">
                    • Hosteller certificate / on-campus residence proof required.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Renewal Criteria */}
          {scheme.renewable && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Annual Renewal Re-Verification Terms</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {scheme.renewalCriteria || 'Must maintain passing marks, minimum required attendance, and promote to the next academic year without active backlogs.'}
              </p>
              <div className="pt-2">
                <Link
                  to="/student/renewal"
                  className="text-xs font-semibold text-blue-900 hover:underline inline-flex items-center gap-1"
                >
                  Go to Renewal Re-Verification Desk →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Benefits & Required Documents */}
        <div className="space-y-6">
          {/* Benefits Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Benefits &amp; Support
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {scheme.benefits && scheme.benefits.length > 0 ? (
                scheme.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Direct Benefit Transfer of financial grant into Aadhaar-seeded bank account.</span>
                </li>
              )}
            </ul>
          </div>

          {/* Required Documents Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Required Documents</span>
              <FileText className="size-4 text-slate-400" />
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 ? (
                scheme.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-900"></span>
                    <span className="font-medium">{doc}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500">Standard identity and academic documents.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
