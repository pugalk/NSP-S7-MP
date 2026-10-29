import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import StatusBadge from '../components/StatusBadge';
import DocumentUploader from '../components/DocumentUploader';
import EligibilityRuleModal from '../components/EligibilityRuleModal';
import { 
  User, 
  FileText, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Check,
  Sparkles,
  TrendingUp,
  Percent,
  IndianRupee,
  BookOpen,
  HelpCircle,
  Eye,
  RefreshCw,
  Landmark,
  FileCheck2,
  Heart,
  Scale,
  QrCode,
  Printer,
  Download,
  X
} from 'lucide-react';

const STAGES = ['Submitted', 'Document Verification', 'Under Verification', 'Provider Review', 'Approved'];

export default function StudentDashboardPage() {
  const { 
    account, 
    profile, 
    updateProfile, 
    applications, 
    documents, 
    addDocument, 
    removeDocument,
    advanceApplication,
    unreadCount,
    scholarships,
    wishlist = [],
    compareList = []
  } = usePortal();

  // Tabs: 'recommendations' (default), 'applications', 'documents', 'profile'
  const [activeTab, setActiveTab] = useState('recommendations');
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState(profile);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [selectedSanctionApp, setSelectedSanctionApp] = useState(null);
  const [showScholarPass, setShowScholarPass] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    setEditProfileOpen(false);
  };

  // Evaluate all 82 schemes against student profile requirements to generate smart recommendations
  const evaluatedSchemes = useMemo(() => {
    return scholarships.map(scheme => {
      const criteria = [];
      let applicable = 0;
      let passed = 0;
      let hasFailed = false;

      // 1. Percentage
      if (scheme.minPercentage !== undefined && scheme.minPercentage !== null) {
        applicable++;
        const val = parseFloat(profile.previousPercentage || '0');
        if (val >= scheme.minPercentage) {
          passed++;
          criteria.push({
            title: 'Minimum percentage',
            status: 'passed',
            message: `Requires ${scheme.minPercentage}% (Your value: ${val}%)`,
            required: `${scheme.minPercentage}%`,
            actual: `${val}%`
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Minimum percentage',
            status: 'failed',
            message: `Requires ${scheme.minPercentage}% (Your value: ${val}%)`,
            required: `${scheme.minPercentage}%`,
            actual: `${val}%`
          });
        }
      }

      // 2. CGPA
      if (scheme.minCgpa !== undefined && scheme.minCgpa !== null) {
        applicable++;
        const val = parseFloat(profile.cgpa || '0');
        if (val >= scheme.minCgpa) {
          passed++;
          criteria.push({
            title: 'Minimum CGPA',
            status: 'passed',
            message: `Requires CGPA ${scheme.minCgpa} (Your value: ${val})`,
            required: `${scheme.minCgpa}`,
            actual: `${val}`
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Minimum CGPA',
            status: 'failed',
            message: `Requires CGPA ${scheme.minCgpa} (Your value: ${val})`,
            required: `${scheme.minCgpa}`,
            actual: `${val}`
          });
        }
      }

      // 3. Attendance
      if (scheme.minAttendance !== undefined && scheme.minAttendance !== null) {
        applicable++;
        const val = parseFloat(profile.attendance || '0');
        if (val >= scheme.minAttendance) {
          passed++;
          criteria.push({
            title: 'Minimum attendance',
            status: 'passed',
            message: `Requires ${scheme.minAttendance}% attendance (Your value: ${val}%)`,
            required: `${scheme.minAttendance}%`,
            actual: `${val}%`
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Minimum attendance',
            status: 'failed',
            message: `Requires ${scheme.minAttendance}% attendance (Your value: ${val}%)`,
            required: `${scheme.minAttendance}%`,
            actual: `${val}%`
          });
        }
      }

      // 4. Family Income
      if (scheme.maxFamilyIncome !== undefined && scheme.maxFamilyIncome !== null) {
        applicable++;
        const val = parseFloat(profile.familyIncome || '0');
        if (val <= scheme.maxFamilyIncome) {
          passed++;
          criteria.push({
            title: 'Annual family income',
            status: 'passed',
            message: `Income ceiling ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')} (Your income: ₹${val.toLocaleString('en-IN')})`,
            required: `≤ ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')}`,
            actual: `₹${val.toLocaleString('en-IN')}`
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Annual family income',
            status: 'failed',
            message: `Exceeds ceiling ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')} (Your income: ₹${val.toLocaleString('en-IN')})`,
            required: `≤ ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')}`,
            actual: `₹${val.toLocaleString('en-IN')}`
          });
        }
      }

      // 5. Eligible States Domicile
      if (scheme.eligibleStates && scheme.eligibleStates.length > 0) {
        applicable++;
        if (scheme.eligibleStates.includes(profile.state)) {
          passed++;
          criteria.push({
            title: 'Domicile state',
            status: 'passed',
            message: `Eligible for domicile: ${profile.state}`,
            required: scheme.eligibleStates.join(', '),
            actual: profile.state
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Domicile state',
            status: 'failed',
            message: `Not open to domicile: ${profile.state}`,
            required: scheme.eligibleStates.join(', '),
            actual: profile.state
          });
        }
      }

      // 6. Eligible Courses
      if (scheme.eligibleCourses && scheme.eligibleCourses.length > 0) {
        applicable++;
        if (scheme.eligibleCourses.includes(profile.course)) {
          passed++;
          criteria.push({
            title: 'Degree course',
            status: 'passed',
            message: `Eligible for degree course: ${profile.course}`,
            required: scheme.eligibleCourses.join(', '),
            actual: profile.course
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Degree course',
            status: 'failed',
            message: `Not applicable for course: ${profile.course}`,
            required: scheme.eligibleCourses.join(', '),
            actual: profile.course
          });
        }
      }

      // 7. Community
      if (scheme.eligibleCommunities && scheme.eligibleCommunities.length > 0) {
        applicable++;
        if (scheme.eligibleCommunities.includes(profile.community)) {
          passed++;
          criteria.push({
            title: 'Category / Community',
            status: 'passed',
            message: `Eligible for community: ${profile.community}`,
            required: scheme.eligibleCommunities.join(', '),
            actual: profile.community
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Category / Community',
            status: 'failed',
            message: `Specific to: ${scheme.eligibleCommunities.join(', ')}`,
            required: scheme.eligibleCommunities.join(', '),
            actual: profile.community
          });
        }
      }

      const matchPercentage = applicable > 0 ? Math.round((passed / applicable) * 100) : 100;
      const isEligible = matchPercentage === 100 && !hasFailed;

      return {
        scheme,
        result: {
          matchPercentage,
          passedCount: passed,
          applicableCount: applicable,
          overallStatus: isEligible ? 'eligible' : (passed > 0 ? 'partially_matching' : 'ineligible'),
          criteria
        }
      };
    });
  }, [scholarships, profile]);

  // Filter recommendations: Top matches (100% eligible or >70% match), sorted by match % and amount
  const recommendedSchemes = useMemo(() => {
    return evaluatedSchemes
      .filter(item => item.result.matchPercentage >= 70 && item.scheme.active)
      .sort((a, b) => {
        if (b.result.matchPercentage !== a.result.matchPercentage) {
          return b.result.matchPercentage - a.result.matchPercentage;
        }
        return b.scheme.amount - a.scheme.amount;
      });
  }, [evaluatedSchemes]);

  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const pendingCount = applications.filter(a => a.status !== 'Approved' && a.status !== 'Rejected').length;
  const verifiedDocsCount = documents.filter(d => d.status === 'Verified').length;

  return (
    <div className="portal-container py-10 space-y-8">
      {/* Student Welcome Header matching Image 4 */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0 border-2 border-amber-300">
            {profile.fullName ? profile.fullName.charAt(0) : 'A'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {profile.fullName || 'Aravind Swaminathan'}
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold py-0.5 px-2.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-400" />
                Verified Scholar
              </span>
            </div>
            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2 font-medium">
              <span>Student ID: <strong className="text-white font-mono">{profile.registrationNumber || 'AU2022CS084'}</strong></span>
              <span>•</span>
              <span>Institution: {profile.institution || 'Anna University, Chennai'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowScholarPass(true)}
            className="bg-indigo-950 hover:bg-indigo-900 text-amber-300 border border-indigo-700/80 text-xs py-2.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs font-bold"
            title="View DigiLocker APAAR Digital Scholar Identity Pass"
          >
            <ShieldCheck className="size-3.5 text-amber-400" />
            <span>APAAR Scholar ID</span>
          </button>
          <Link
            to="/student/renewal"
            className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-md transition-all hover:scale-[1.02] cursor-pointer"
          >
            <RefreshCw className="size-4" />
            <span>Renew Previous Award</span>
          </Link>
          <button
            onClick={() => { setProfileForm(profile); setEditProfileOpen(true); }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs py-2.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="size-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Cards matching Image 4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Applications */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Active Applications</span>
            <div className="flex -space-x-1">
              <span className="size-4 rounded-full bg-blue-500"></span>
              <span className="size-4 rounded-full bg-amber-500"></span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {applications.length || 2}
            </span>
          </div>
          <span className="text-[11px] text-blue-400 font-medium block">
            {pendingCount} in verification pipeline
          </span>
        </div>

        {/* Card 2: Sanctioned Grants */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Sanctioned Grants</span>
            <IndianRupee className="size-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">
              ₹86,000
            </span>
          </div>
          <span className="text-[11px] text-emerald-300 font-medium block">
            + ₹14k recent PFMS credit
          </span>
        </div>

        {/* Card 3: Renewal Deadline */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Renewal Deadline</span>
            <Calendar className="size-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-400">
              15 Nov 2026
            </span>
          </div>
          <span className="text-[11px] text-amber-300 font-medium block">
            Window closing soon
          </span>
        </div>

        {/* Card 4: Profile Health */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Profile Health</span>
            <ShieldCheck className="size-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">
              100%
            </span>
          </div>
          <span className="text-[11px] text-slate-300 font-medium block">
            All 4 certificates verified
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`pb-3 transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'recommendations'
              ? 'text-amber-700 border-b-2 border-amber-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="size-4 text-amber-500" />
          <span>Smart Recommendations &amp; Requirements ({recommendedSchemes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'applications'
              ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="size-4 text-blue-700" />
          <span>My Applications &amp; Live Tracker ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'documents'
              ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="size-4" />
          <span>Uploaded Certificates ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="size-4" />
          <span>Academic Profile &amp; Criteria</span>
        </button>

        <Link
          to="/wishlist"
          className="pb-3 transition-colors flex items-center gap-1.5 text-slate-500 hover:text-rose-600 whitespace-nowrap ml-auto"
        >
          <Heart className="size-4 text-rose-500 fill-rose-500" />
          <span>Saved Wishlist ({wishlist.length})</span>
        </Link>

        <Link
          to="/compare"
          className="pb-3 transition-colors flex items-center gap-1.5 text-slate-500 hover:text-blue-900 whitespace-nowrap"
        >
          <Scale className="size-4 text-blue-600" />
          <span>Compare Matrix ({compareList.length})</span>
        </Link>
      </div>

      {/* TAB 1: SMART RECOMMENDATIONS & REQUIREMENTS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Requirements Compliance Summary Card */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  <Sparkles className="size-3.5" />
                  <span>Rule Engine Diagnostics</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Your Eligibility Requirements Profile
                </h2>
                <p className="text-xs text-slate-300 max-w-xl">
                  Evaluated across 82 schemes in real time based on your latest semester scores, attendance, domicile, and family income ceiling.
                </p>
              </div>

              <div className="text-right">
                <span className="text-3xl font-extrabold text-amber-400 block">
                  {recommendedSchemes.length}
                </span>
                <span className="text-xs text-slate-300">
                  Matching Schemes Available
                </span>
              </div>
            </div>

            {/* 4 Pillars of Requirements */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1.5">
                <span className="text-slate-400 text-[11px] block">Academic Standing</span>
                <div className="text-base font-extrabold text-white flex items-center gap-1">
                  <span>{profile.cgpa || '8.4'} CGPA</span>
                  <span className="text-[11px] font-normal text-emerald-400">({profile.previousPercentage || '82'}%)</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <Check className="size-3" /> Exceeds 8.0 requirement
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1.5">
                <span className="text-slate-400 text-[11px] block">Attendance Verified</span>
                <div className="text-base font-extrabold text-white">
                  {profile.attendance || '88'}%
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <Check className="size-3" /> Exceeds 75% requirement
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1.5">
                <span className="text-slate-400 text-[11px] block">Annual Family Income</span>
                <div className="text-base font-extrabold text-white">
                  ₹{parseFloat(profile.familyIncome || '220000').toLocaleString('en-IN')}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <Check className="size-3" /> Within ₹2.5L / ₹4.5L ceiling
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1.5">
                <span className="text-slate-400 text-[11px] block">Domicile &amp; Category</span>
                <div className="text-base font-extrabold text-white">
                  {profile.state || 'Tamil Nadu'} • {profile.community || 'BC'}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <Check className="size-3" /> Domicile verified
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Scholarships Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="size-5 text-amber-600" />
                  <span>Top Recommended Scholarships for You</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Ranked by exact match percentage against your requirements and grant sanction amount.
                </p>
              </div>

              <Link
                to="/scholarships"
                className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Browse All 82 Schemes</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedSchemes.slice(0, 9).map(({ scheme, result }) => {
                const isFullyEligible = result.overallStatus === 'eligible';

                return (
                  <div 
                    key={scheme.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Top Category & Match Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="badge-category text-[11px] py-0.5 px-2">
                          {scheme.category}
                        </span>
                        <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isFullyEligible
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <Sparkles className="size-3" />
                          <span>{result.matchPercentage}% Match</span>
                        </span>
                      </div>

                      {/* Scheme Title & Provider */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
                          {scheme.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          {scheme.provider}
                        </p>
                      </div>

                      {/* Scholarship Amount */}
                      <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-medium">Grant Amount:</span>
                        <span className="text-sm font-extrabold text-emerald-700">
                          ₹{scheme.amount.toLocaleString('en-IN')} / year
                        </span>
                      </div>

                      {/* Satisfied Requirements Badges */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Met Requirements:
                        </span>
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          {scheme.minCgpa && (
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                              <Check className="size-2.5" /> CGPA ≥ {scheme.minCgpa}
                            </span>
                          )}
                          {scheme.maxFamilyIncome && (
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                              <Check className="size-2.5" /> Income ≤ ₹{(scheme.maxFamilyIncome / 100000).toFixed(1)}L
                            </span>
                          )}
                          {scheme.eligibleCourses?.length > 0 && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                              <Check className="size-2.5" /> Course: {profile.course}
                            </span>
                          )}
                          {scheme.eligibleStates?.length > 0 && (
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                              <Check className="size-2.5" /> State: {profile.state}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        to={`/student/apply/${scheme.id}`}
                        className="btn-accent flex-1 text-center py-2 text-xs font-bold shadow-2xs"
                      >
                        Apply Now
                      </Link>
                      <button
                        onClick={() => setSelectedEvaluation({ scheme, result })}
                        className="btn-secondary py-2 px-3 text-xs"
                        title="Inspect detailed criteria breakdown"
                      >
                        <Eye className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY APPLICATIONS & LIVE TRACKER (Matching Image 6) */}
      {activeTab === 'applications' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                National Verification Pipeline &amp; Disbursal Tracker
              </h3>
              <p className="text-xs text-slate-500">
                End-to-end transparent verification trail with automated timestamps and Nodal Officer logs.
              </p>
            </div>
            <Link to="/scholarships" className="btn-primary text-xs py-2 px-3.5 shadow-xs flex items-center gap-1.5 self-start sm:self-auto">
              <Plus className="size-3.5" /> Apply for Another Scheme
            </Link>
          </div>

          <div className="space-y-6">
            {applications.map((app) => {
              const currentStageIdx = STAGES.indexOf(app.status);
              const isApproved = app.status === 'Approved';

              return (
                <div key={app.id} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-0.5 rounded-md">
                          {app.applicationId}
                        </span>
                        <span className="badge-category text-[11px] py-0.5 px-2.5 rounded-full">
                          {app.type || 'Fresh'} Application
                        </span>
                        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          Sanction: ₹{app.amount ? app.amount.toLocaleString('en-IN') : '50,000'}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900">
                        {app.scholarshipName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Category: <strong className="text-slate-700">{app.category}</strong> • Academic Year: 2026-27 • Submitted: {app.appliedAt || '12 Oct 2026'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={app.status} />
                      <button
                        onClick={() => setSelectedSanctionApp(app)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                          app.status === 'Approved'
                            ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-amber-300/50'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                        title="View official Government Sanction Order & Award Letter"
                      >
                        <Award className="size-3.5" />
                        <span>{app.status === 'Approved' ? 'Award Sanction Letter' : 'Preview Sanction'}</span>
                      </button>
                      <button
                        onClick={() => advanceApplication(app.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs"
                        title="Simulate advancing to next verification milestone"
                      >
                        Advance Stage →
                      </button>
                    </div>
                  </div>

                  {/* 5-Stage Live Graphical Stepper (Image 6 Style) */}
                  <div className="py-2">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                        5-Stage National Verification Stepper
                      </span>
                      <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full">
                        Current: Stage {currentStageIdx + 1} of 5
                      </span>
                    </div>

                    <div className="relative">
                      {/* Connecting Line */}
                      <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 transition-all duration-500"
                          style={{ width: `${Math.min(100, (currentStageIdx / (STAGES.length - 1)) * 100)}%` }}
                        ></div>
                      </div>

                      {/* Stepper Nodes */}
                      <div className="grid grid-cols-5 gap-2 relative z-10 text-center">
                        {STAGES.map((stageName, idx) => {
                          const isDone = idx < currentStageIdx;
                          const isCurrent = idx === currentStageIdx;

                          return (
                            <div key={idx} className="flex flex-col items-center group">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                                isDone ? 'bg-emerald-600 text-white shadow-emerald-200' :
                                isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110 shadow-blue-300' :
                                'bg-white border-2 border-slate-300 text-slate-400'
                              }`}>
                                {isDone ? (
                                  <Check className="size-5 stroke-[2.5]" />
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                              </div>
                              <span className={`text-[11px] font-bold mt-2.5 line-clamp-2 max-w-[90px] leading-tight ${
                                isCurrent ? 'text-blue-950 font-extrabold' :
                                isDone ? 'text-emerald-700' :
                                'text-slate-400'
                              }`}>
                                {stageName}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-0.5">
                                {isDone ? 'Completed' : isCurrent ? 'Active Scrutiny' : 'Pending'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Stage Callout & Timeline Audit Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <ShieldCheck className="size-4 text-blue-700" />
                          Nodal Officer Remarks
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">ID: OFF-BLR-09</span>
                      </div>
                      <p className="text-slate-700 italic bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                        "{app.remarks || 'Application under institutional and district verification scrutiny.'}"
                      </p>
                      {app.nextAction && (
                        <p className="text-[11px] text-blue-800 font-bold flex items-center gap-1">
                          <ArrowRight className="size-3 text-blue-600" /> Next Milestone: {app.nextAction}
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Landmark className="size-4 text-emerald-700" />
                          Direct Benefit Transfer (DBT) Gate
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          NPCI Seeded
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1 shadow-2xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Disbursal Bank:</span>
                          <strong className="text-slate-900">{app.bankDetails?.bankName || 'State Bank of India'}</strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Account Number:</span>
                          <span className="font-mono font-bold text-slate-900">{app.bankDetails?.accountNumber || '••••••••4892'}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Disbursal Channel:</span>
                          <span className="text-emerald-700 font-bold">PFMS APBS Direct</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CERTIFICATES & UPLOADED DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <DocumentUploader
            documents={documents}
            onUpload={addDocument}
            onRemove={removeDocument}
            requiredDocs={[
              'Aadhaar / Identity Document',
              'Income Certificate',
              'Marksheet',
              'Bonafide Certificate',
              'Community / Category Certificate'
            ]}
          />
        </div>
      )}

      {/* TAB 4: MASTER PROFILE (Matching Image 5 Style: 3 Structured Cards) */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Verified Master Scholar Profile
              </h3>
              <p className="text-xs text-slate-500">
                Centralized academic &amp; socio-economic identity feeding the deterministic rule evaluation engine.
              </p>
            </div>
            <button
              onClick={() => { setProfileForm(profile); setEditProfileOpen(true); }}
              className="btn-primary text-xs py-2 px-4 shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Edit3 className="size-3.5" /> Edit Profile Records
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Personal & Domicile Record */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-sm border border-blue-200">
                  <User className="size-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Personal &amp; Domicile</h4>
                  <span className="text-[11px] text-slate-400">Identity &amp; Community</span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Full Legal Name</span>
                  <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{profile.fullName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 font-medium block">Gender</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{profile.gender || 'Male'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Community / Category</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{profile.community}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">State of Domicile</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{profile.state}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Annual Family Income</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-extrabold text-slate-900 text-sm">
                      ₹{parseFloat(profile.familyIncome || '0').toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Revenue Verified
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Aadhaar Linked Status:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Linked &amp; Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Academic Enrollment Record */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-sm border border-amber-200">
                  <BookOpen className="size-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Academic Progression</h4>
                  <span className="text-[11px] text-slate-400">Institutional records</span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Enrolled Institution</span>
                  <span className="font-extrabold text-slate-900 text-sm mt-0.5 block leading-tight">{profile.institution}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 font-medium block">Degree Course</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{profile.course}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Current Year</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">Year {profile.currentYear}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 font-medium block">CGPA Score</span>
                    <span className="font-extrabold text-emerald-700 text-sm mt-0.5 block">{profile.cgpa} / 10.0</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">✓ Cutoff met</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Attendance</span>
                    <span className="font-extrabold text-emerald-700 text-sm mt-0.5 block">{profile.attendance}%</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">✓ Above 75% rule</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Bonafide Status:</span>
                  <span className="text-blue-900 font-bold">Active Scholar 2026-27</span>
                </div>
              </div>
            </div>

            {/* Card 3: DBT Bank Details Record */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm border border-emerald-200">
                  <Landmark className="size-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">DBT Bank Account</h4>
                  <span className="text-[11px] text-slate-400">Direct Benefit Transfer</span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Bank Name</span>
                  <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">State Bank of India</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Account Number (Seeded)</span>
                  <span className="font-mono font-bold text-slate-900 mt-0.5 block text-sm">•••• •••• •••• 4892</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 font-medium block">IFSC Code</span>
                    <span className="font-mono font-bold text-slate-900 mt-0.5 block">SBIN0001234</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">NPCI Seeding</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      ✓ Active
                    </span>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                  Direct transfer protocol through <strong>Public Financial Management System (PFMS)</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Update Student Profile Requirements
            </h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="form-input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Current CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={profileForm.cgpa || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, cgpa: e.target.value })}
                    className="form-input text-xs font-bold text-emerald-700"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={profileForm.previousPercentage || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, previousPercentage: e.target.value })}
                    className="form-input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Attendance (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={profileForm.attendance || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, attendance: e.target.value })}
                    className="form-input text-xs font-bold text-emerald-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Annual Family Income (₹)</label>
                <input
                  type="number"
                  value={profileForm.familyIncome || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, familyIncome: e.target.value })}
                  className="form-input text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="btn-secondary text-xs py-2 px-3.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4 shadow-sm"
                >
                  Save Profile Requirements
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Criteria Breakdown Modal */}
      {selectedEvaluation && (
        <EligibilityRuleModal
          evaluation={selectedEvaluation}
          onClose={() => setSelectedEvaluation(null)}
        />
      )}

      {/* MODAL 1: Official Government Sanction Award Order (Printable / PDF) */}
      {selectedSanctionApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-500/30 space-y-6 text-slate-900 animate-in zoom-in-95 duration-150 my-6 max-h-[92vh] overflow-y-auto">
            {/* Action Bar (Not printed) */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Award className="size-3.5 text-amber-600" />
                Government of India Sanction Order
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setSelectedSanctionApp(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Certificate Body */}
            <div className="border-2 border-slate-300 p-6 sm:p-8 rounded-2xl bg-amber-50/20 space-y-6 relative overflow-hidden text-center">
              {/* Subtle background seal */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <ShieldCheck className="size-96 text-slate-900" />
              </div>

              {/* Header */}
              <div className="space-y-1 relative z-10">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-black shadow-sm mb-2">
                  <Landmark className="size-6 text-amber-400" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600">
                  Government of India • Ministry of Education
                </h2>
                <h3 className="text-xs font-semibold text-slate-500">
                  Department of Higher Education &amp; National Scholarship Portal
                </h3>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight pt-2 uppercase">
                  Scholarship Grant Sanction Order &amp; Award Letter
                </h1>
                <p className="text-[11px] font-mono text-slate-500 pt-1">
                  Sanction No: <strong>NSP/EDU/2026-27/DBT-{(selectedSanctionApp.applicationId || '849201').replace(/\D/g, '').slice(-6) || '849201'}</strong> • Date: 28 Oct 2026
                </p>
              </div>

              {/* Sanction Declaration */}
              <div className="text-left text-xs leading-relaxed space-y-3 pt-2 text-slate-700 relative z-10 border-t border-slate-200">
                <p>
                  Sanction of the Competent Authority under the Central Direct Benefit Transfer (DBT) Framework is hereby conveyed for the grant of scholarship under the <strong>"{selectedSanctionApp.scholarshipName}"</strong> to the scholar whose particulars are specified below:
                </p>

                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Scholar Name</span>
                      <strong className="text-slate-900 font-bold">{selectedSanctionApp.applicantName || profile.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Application ID</span>
                      <strong className="text-blue-900 font-mono font-bold">{selectedSanctionApp.applicationId}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Enrolled Institution</span>
                      <span className="text-slate-800 font-medium">{profile.institution || 'Anna University, Chennai'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Course / Year</span>
                      <span className="text-slate-800 font-medium">{profile.course || 'B.Tech'} (Year {profile.currentYear || '3'})</span>
                    </div>
                  </div>
                </div>

                {/* Amount Sanction Highlight */}
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 p-4 rounded-xl text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Sanctioned Scholarship Grant (AY 2026-27)
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-800 block font-mono">
                    ₹{(selectedSanctionApp.amount || 50000).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-emerald-700 italic block font-serif">
                    Fifty Thousand Indian Rupees Only (100% Direct Non-Refundable Grant)
                  </span>
                </div>

                {/* PFMS & Bank Details */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Direct Benefit Transfer (DBT) Credit Details
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Bank Name</span>
                      <strong className="text-slate-800">{selectedSanctionApp.bankDetails?.bankName || 'State Bank of India'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Aadhaar-Seeded A/C</span>
                      <strong className="text-slate-800 font-mono">{selectedSanctionApp.bankDetails?.accountNumber || '••••••••4892'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Disbursal Protocol</span>
                      <strong className="text-emerald-700">PFMS APBS Direct</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR and Signatures */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-left text-[11px] text-slate-500 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white border border-slate-300 rounded-lg p-1 flex items-center justify-center shadow-2xs">
                    <QrCode className="size-10 text-slate-900" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-[10px]">DigiLocker QR Hash</span>
                    <span className="text-[9px] font-mono text-slate-400 block">SHA256: 8f9a2e...c419</span>
                    <span className="text-[9px] text-emerald-700 font-bold">● Cryptographically Signed</span>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="inline-block border-b border-slate-800 pb-1 text-slate-900 font-serif italic text-xs font-bold">
                    Dr. Ramesh Kumar
                  </div>
                  <span className="block text-[10px] font-bold text-slate-700">State Nodal Officer</span>
                  <span className="block text-[9px] text-slate-400">Directorate of Higher Education</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: APAAR Digital Scholar Identity Pass */}
      {showScholarPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-700 space-y-5 animate-in zoom-in-95 duration-150 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">APAAR Digital Scholar Pass</h3>
                  <p className="text-[10px] text-slate-400">One Nation • One Student ID</p>
                </div>
              </div>
              <button
                onClick={() => setShowScholarPass(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Smart ID Card layout */}
            <div className="bg-gradient-to-br from-[#0c1f38] via-[#122e54] to-[#0a182d] rounded-2xl p-5 border border-blue-500/30 shadow-xl space-y-4 relative overflow-hidden text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black uppercase">
                    GOI APAAR
                  </span>
                  <span className="text-[10px] text-slate-300 font-semibold">DigiLocker Verified</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> ACTIVE SCHOLAR
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md shrink-0 border-2 border-white/20">
                  {profile.fullName ? profile.fullName.charAt(0) : 'A'}
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base text-white">{profile.fullName || 'Aravind Swaminathan'}</h4>
                  <p className="text-slate-300 text-[11px]">{profile.course || 'B.Tech'} • Year {profile.currentYear || '3'}</p>
                  <p className="text-slate-400 text-[10px]">{profile.institution || 'Anna University, Chennai'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10 text-[11px]">
                <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">12-Digit APAAR ID</span>
                  <strong className="text-amber-400 font-mono font-bold">2026-8819-4021</strong>
                </div>
                <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Academic Bank (ABC)</span>
                  <strong className="text-white font-mono font-bold">ABC-TN-904288</strong>
                </div>
                <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">CGPA / Attendance</span>
                  <strong className="text-emerald-400 font-bold">{profile.cgpa || '8.4'} CGPA • {profile.attendance || '88'}% Attn</strong>
                </div>
                <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Aadhaar Seeding</span>
                  <strong className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="size-3" /> NPCI Active
                  </strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>Direct Benefit Transfer Active</span>
                <span className="font-mono">Valid AY 2026-27</span>
              </div>
            </div>

            <button
              onClick={() => setShowScholarPass(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Done / Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
