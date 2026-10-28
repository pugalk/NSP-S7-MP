import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { STATES, COURSES, COMMUNITIES } from '../data/scholarships';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  SlidersHorizontal, 
  UserCheck, 
  BookOpen, 
  Building2, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export default function EligibilityPage() {
  const { profile, updateProfile, scholarships } = usePortal();
  const [searchParams] = useSearchParams();
  const targetSchemeId = searchParams.get('scheme');

  // Local draft state initialized with student profile
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    gender: profile?.gender || 'Male',
    state: profile?.state || 'Tamil Nadu',
    community: profile?.community || 'BC',
    course: profile?.course || 'B.Tech',
    currentYear: profile?.currentYear || '3',
    previousPercentage: profile?.previousPercentage || '82',
    cgpa: profile?.cgpa || '8.4',
    attendance: profile?.attendance || '88',
    familyIncome: profile?.familyIncome || '220000',
    disability: profile?.disability || false,
    disabilityPercentage: profile?.disabilityPercentage || '',
    residence: profile?.residence || 'Day Scholar',
    sportsAchievement: profile?.sportsAchievement || 'None'
  });

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'eligible', 'partial', 'ineligible'
  const [activeSection, setActiveSection] = useState('personal'); // 'personal', 'academic', 'financial', 'other'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveToProfile = () => {
    updateProfile(formData);
  };

  // Calculate profile completeness
  const completeness = useMemo(() => {
    const requiredFields = [
      'fullName', 'gender', 'state', 'community', 
      'course', 'currentYear', 'previousPercentage', 
      'cgpa', 'attendance', 'familyIncome', 'residence'
    ];
    const filledCount = requiredFields.filter(f => formData[f] !== '' && formData[f] !== null && formData[f] !== undefined).length;
    return Math.round((filledCount / requiredFields.length) * 100);
  }, [formData]);

  // Live rule engine evaluation across all 82 schemes
  const evaluatedSchemes = useMemo(() => {
    return scholarships.map(scheme => {
      const criteria = [];
      let applicable = 0;
      let passed = 0;
      let hasMissing = false;
      let hasFailed = false;

      // 1. Min Percentage
      if (scheme.minPercentage !== undefined && scheme.minPercentage !== null) {
        applicable++;
        const val = formData.previousPercentage;
        if (!val) {
          hasMissing = true;
          criteria.push({
            title: 'Minimum percentage',
            status: 'missing',
            message: 'Minimum percentage is not filled in your profile. Add it to complete this check.',
            required: `${scheme.minPercentage}%`,
            actual: 'Missing'
          });
        } else {
          const num = parseFloat(val);
          if (num >= scheme.minPercentage) {
            passed++;
            criteria.push({
              title: 'Minimum percentage',
              status: 'passed',
              message: `Requires min ${scheme.minPercentage}% (Your value: ${num}%)`,
              required: `${scheme.minPercentage}%`,
              actual: `${num}%`
            });
          } else {
            hasFailed = true;
            criteria.push({
              title: 'Minimum percentage',
              status: 'failed',
              message: `Requires min ${scheme.minPercentage}% (Your value: ${num}%)`,
              required: `${scheme.minPercentage}%`,
              actual: `${num}%`
            });
          }
        }
      }

      // 2. Min CGPA
      if (scheme.minCgpa !== undefined && scheme.minCgpa !== null) {
        applicable++;
        const val = formData.cgpa;
        if (!val) {
          hasMissing = true;
          criteria.push({
            title: 'Minimum CGPA',
            status: 'missing',
            message: 'Minimum CGPA is not filled in your profile. Add it to complete this check.',
            required: `${scheme.minCgpa}`,
            actual: 'Missing'
          });
        } else {
          const num = parseFloat(val);
          if (num >= scheme.minCgpa) {
            passed++;
            criteria.push({
              title: 'Minimum CGPA',
              status: 'passed',
              message: `Requires min CGPA ${scheme.minCgpa} (Your value: ${num})`,
              required: `${scheme.minCgpa}`,
              actual: `${num}`
            });
          } else {
            hasFailed = true;
            criteria.push({
              title: 'Minimum CGPA',
              status: 'failed',
              message: `Requires min CGPA ${scheme.minCgpa} (Your value: ${num})`,
              required: `${scheme.minCgpa}`,
              actual: `${num}`
            });
          }
        }
      }

      // 3. Attendance
      if (scheme.minAttendance !== undefined && scheme.minAttendance !== null) {
        applicable++;
        const val = formData.attendance;
        if (!val) {
          hasMissing = true;
          criteria.push({
            title: 'Minimum attendance',
            status: 'missing',
            message: 'Minimum attendance is not filled in your profile. Add it to complete this check.',
            required: `${scheme.minAttendance}%`,
            actual: 'Missing'
          });
        } else {
          const num = parseFloat(val);
          if (num >= scheme.minAttendance) {
            passed++;
            criteria.push({
              title: 'Minimum attendance',
              status: 'passed',
              message: `Requires min ${scheme.minAttendance}% attendance (Your value: ${num}%)`,
              required: `${scheme.minAttendance}%`,
              actual: `${num}%`
            });
          } else {
            hasFailed = true;
            criteria.push({
              title: 'Minimum attendance',
              status: 'failed',
              message: `Requires min ${scheme.minAttendance}% attendance (Your value: ${num}%)`,
              required: `${scheme.minAttendance}%`,
              actual: `${num}%`
            });
          }
        }
      }

      // 4. Family Income
      if (scheme.maxFamilyIncome !== undefined && scheme.maxFamilyIncome !== null) {
        applicable++;
        const val = formData.familyIncome;
        if (!val) {
          hasMissing = true;
          criteria.push({
            title: 'Family income',
            status: 'missing',
            message: 'Family income is not filled in your profile. Add it to complete this check.',
            required: `Max ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')}`,
            actual: 'Missing'
          });
        } else {
          const num = parseFloat(val);
          if (num <= scheme.maxFamilyIncome) {
            passed++;
            criteria.push({
              title: 'Family income',
              status: 'passed',
              message: `Income ceiling ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')} (Your value: ₹${num.toLocaleString('en-IN')})`,
              required: `Max ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')}`,
              actual: `₹${num.toLocaleString('en-IN')}`
            });
          } else {
            hasFailed = true;
            criteria.push({
              title: 'Family income',
              status: 'failed',
              message: `Exceeds ceiling ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')} (Your value: ₹${num.toLocaleString('en-IN')})`,
              required: `Max ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')}`,
              actual: `₹${num.toLocaleString('en-IN')}`
            });
          }
        }
      }

      // 5. State
      if (scheme.eligibleStates && scheme.eligibleStates.length > 0) {
        applicable++;
        const val = formData.state;
        if (!val) {
          hasMissing = true;
          criteria.push({
            title: 'Eligible state',
            status: 'missing',
            message: 'State is not filled in your profile.',
            required: scheme.eligibleStates.join(', '),
            actual: 'Missing'
          });
        } else if (scheme.eligibleStates.includes(val)) {
          passed++;
          criteria.push({
            title: 'Eligible state',
            status: 'passed',
            message: `Must be domicile of ${scheme.eligibleStates.join(', ')} (Your state: ${val})`,
            required: scheme.eligibleStates.join(', '),
            actual: val
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Eligible state',
            status: 'failed',
            message: `Restricted to ${scheme.eligibleStates.join(', ')} (Your state: ${val})`,
            required: scheme.eligibleStates.join(', '),
            actual: val
          });
        }
      }

      // 6. Community
      if (scheme.eligibleCommunities && scheme.eligibleCommunities.length > 0) {
        applicable++;
        const val = formData.community;
        if (!val) {
          hasMissing = true;
          criteria.push({
            title: 'Eligible community',
            status: 'missing',
            message: 'Category / community is not filled in your profile.',
            required: scheme.eligibleCommunities.join(', '),
            actual: 'Missing'
          });
        } else if (scheme.eligibleCommunities.includes(val)) {
          passed++;
          criteria.push({
            title: 'Eligible community',
            status: 'passed',
            message: `Eligible: ${scheme.eligibleCommunities.join(', ')} (Your category: ${val})`,
            required: scheme.eligibleCommunities.join(', '),
            actual: val
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Eligible community',
            status: 'failed',
            message: `Restricted to ${scheme.eligibleCommunities.join(', ')} (Your category: ${val})`,
            required: scheme.eligibleCommunities.join(', '),
            actual: val
          });
        }
      }

      // 7. Gender
      if (scheme.gender && scheme.gender !== 'Any') {
        applicable++;
        const val = formData.gender;
        if (!val) {
          hasMissing = true;
          criteria.push({
            title: 'Gender requirement',
            status: 'missing',
            message: 'Gender is not filled in your profile.',
            required: scheme.gender,
            actual: 'Missing'
          });
        } else if (val.toLowerCase() === scheme.gender.toLowerCase()) {
          passed++;
          criteria.push({
            title: 'Gender requirement',
            status: 'passed',
            message: `Scheme restricted to ${scheme.gender} applicants.`,
            required: scheme.gender,
            actual: val
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Gender requirement',
            status: 'failed',
            message: `Scheme is exclusively for ${scheme.gender} candidates (Your value: ${val})`,
            required: scheme.gender,
            actual: val
          });
        }
      }

      // 8. Course
      if (scheme.eligibleCourses && scheme.eligibleCourses.length > 0) {
        applicable++;
        const val = formData.course;
        if (!val) {
          hasMissing = true;
          criteria.push({
            title: 'Eligible course',
            status: 'missing',
            message: 'Course is not filled in your profile.',
            required: scheme.eligibleCourses.join(', '),
            actual: 'Missing'
          });
        } else if (scheme.eligibleCourses.includes(val)) {
          passed++;
          criteria.push({
            title: 'Eligible course',
            status: 'passed',
            message: `Supported courses: ${scheme.eligibleCourses.join(', ')} (Enrolled: ${val})`,
            required: scheme.eligibleCourses.join(', '),
            actual: val
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Eligible course',
            status: 'failed',
            message: `Supported courses: ${scheme.eligibleCourses.join(', ')} (Your course: ${val})`,
            required: scheme.eligibleCourses.join(', '),
            actual: val
          });
        }
      }

      // 9. Academic Year
      if (scheme.eligibleYears && scheme.eligibleYears.length > 0) {
        applicable++;
        const val = formData.currentYear;
        if (!val) {
          hasMissing = true;
          criteria.push({
            title: 'Academic year',
            status: 'missing',
            message: 'Current academic year is not filled in your profile.',
            required: scheme.eligibleYears.map(y => `Year ${y}`).join(', '),
            actual: 'Missing'
          });
        } else {
          const yr = parseInt(val, 10);
          if (scheme.eligibleYears.includes(yr)) {
            passed++;
            criteria.push({
              title: 'Academic year',
              status: 'passed',
              message: `Eligible for Year ${scheme.eligibleYears.join(', ')} (Your year: ${yr})`,
              required: scheme.eligibleYears.map(y => `Year ${y}`).join(', '),
              actual: `Year ${yr}`
            });
          } else {
            hasFailed = true;
            criteria.push({
              title: 'Academic year',
              status: 'failed',
              message: `Restricted to Year ${scheme.eligibleYears.join(', ')} (Your year: ${yr})`,
              required: scheme.eligibleYears.map(y => `Year ${y}`).join(', '),
              actual: `Year ${yr}`
            });
          }
        }
      }

      // 10. Disability
      if (scheme.requiresDisability) {
        applicable++;
        if (formData.disability) {
          passed++;
          criteria.push({
            title: 'Certified disability',
            status: 'passed',
            message: 'Certified disability condition verified.',
            required: 'Disability Certificate',
            actual: 'Certified'
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Certified disability',
            status: 'failed',
            message: 'Requires certified disability certificate.',
            required: 'Disability Certificate',
            actual: 'None'
          });
        }
      }

      // 11. Sports
      if (scheme.requiresSports) {
        applicable++;
        if (formData.sportsAchievement && formData.sportsAchievement !== 'None') {
          passed++;
          criteria.push({
            title: 'Sports achievement',
            status: 'passed',
            message: `Sports achievement verified: ${formData.sportsAchievement}`,
            required: 'State/National Sports Certificate',
            actual: formData.sportsAchievement
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Sports achievement',
            status: 'failed',
            message: 'Requires state or national level sports achievement.',
            required: 'State/National Sports Certificate',
            actual: formData.sportsAchievement || 'None'
          });
        }
      }

      // 12. Hosteller
      if (scheme.requiresHosteller) {
        applicable++;
        if (formData.residence?.toLowerCase() === 'hosteller') {
          passed++;
          criteria.push({
            title: 'Residence type',
            status: 'passed',
            message: 'Hosteller residence condition verified.',
            required: 'Hosteller',
            actual: 'Hosteller'
          });
        } else {
          hasFailed = true;
          criteria.push({
            title: 'Residence type',
            status: 'failed',
            message: 'Exclusively for hosteller students residing on campus.',
            required: 'Hosteller',
            actual: formData.residence
          });
        }
      }

      const matchPercentage = applicable > 0 ? Math.round((passed / applicable) * 100) : 100;
      let status = 'ineligible';
      if (matchPercentage === 100 && !hasMissing && !hasFailed) {
        status = 'eligible';
      } else if (passed > 0 && !hasFailed) {
        status = 'partially_matching';
      } else if (passed > 0 && hasFailed) {
        status = 'partially_matching';
      } else {
        status = 'ineligible';
      }

      return {
        scheme,
        matchPercentage,
        passed,
        applicable,
        status,
        hasMissing,
        hasFailed,
        criteria
      };
    });
  }, [scholarships, formData]);

  const eligibleCount = evaluatedSchemes.filter(s => s.status === 'eligible').length;
  const partialCount = evaluatedSchemes.filter(s => s.status === 'partially_matching').length;
  const ineligibleCount = evaluatedSchemes.filter(s => s.status === 'ineligible').length;

  const displayList = useMemo(() => {
    let list = evaluatedSchemes;
    if (targetSchemeId) {
      list = list.filter(e => e.scheme.id === targetSchemeId);
    }
    if (activeTab === 'eligible') {
      return list.filter(s => s.status === 'eligible');
    }
    if (activeTab === 'partial') {
      return list.filter(s => s.status === 'partially_matching');
    }
    if (activeTab === 'ineligible') {
      return list.filter(s => s.status === 'ineligible');
    }
    return list;
  }, [evaluatedSchemes, activeTab, targetSchemeId]);

  return (
    <div className="portal-container py-8 space-y-8">
      {/* High-Fidelity Match Analytics Hero Banner (Image 3 Style) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              <Sparkles className="size-3.5 text-amber-400" />
              <span>Deterministic Multi-Tier Rule Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Live Scheme Eligibility Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your academic, domicile, and financial criteria are continuously tested against <strong>82 Central &amp; State Schemes</strong>. See exact qualification scores and instant direct-entry routes.
            </p>

            {/* Profile Completeness Bar */}
            <div className="pt-2 max-w-md">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Student Profile Completeness</span>
                <span className="text-amber-400 font-bold">{completeness}% Complete</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* KPI Analytics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Fully Eligible</span>
              <span className="text-3xl font-black text-emerald-400 mt-1 block">{eligibleCount}</span>
              <span className="text-[10px] text-emerald-300/80 font-medium mt-0.5 block">Direct routes</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Partial Match</span>
              <span className="text-3xl font-black text-amber-400 mt-1 block">{partialCount}</span>
              <span className="text-[10px] text-amber-300/80 font-medium mt-0.5 block">Minor gaps</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Max Grants</span>
              <span className="text-2xl font-black text-white mt-1 block">₹2.8L</span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Potential aid</span>
            </div>
          </div>
        </div>

        {/* Quick action strip */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>Rule Engine version 2.4 active • Rules evaluated synchronously</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToProfile}
              className="px-3.5 py-1.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-sm flex items-center gap-1.5"
            >
              <UserCheck className="size-3.5" />
              Sync to Master Profile
            </button>
            <Link
              to="/student/dashboard"
              className="px-3.5 py-1.5 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
            >
              Student Portal →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Profile Details Tabs (4 Columns on Desktop) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Your Eligibility Profile</h2>
              <span className="text-[11px] text-slate-400 font-medium">Auto-evaluating live</span>
            </div>

            {/* Section Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold text-center">
              <button
                onClick={() => setActiveSection('personal')}
                className={`py-1.5 rounded-md transition-colors ${
                  activeSection === 'personal' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => setActiveSection('academic')}
                className={`py-1.5 rounded-md transition-colors ${
                  activeSection === 'academic' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Academic
              </button>
              <button
                onClick={() => setActiveSection('financial')}
                className={`py-1.5 rounded-md transition-colors ${
                  activeSection === 'financial' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Financial
              </button>
              <button
                onClick={() => setActiveSection('other')}
                className={`py-1.5 rounded-md transition-colors ${
                  activeSection === 'other' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Other
              </button>
            </div>

            {/* Form Fields by Active Section */}
            <div className="space-y-4 text-xs">
              {activeSection === 'personal' && (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Aravind Swaminathan"
                      className="form-input text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="form-select text-xs font-medium"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Community</label>
                      <select
                        name="community"
                        value={formData.community}
                        onChange={handleChange}
                        className="form-select text-xs font-medium"
                      >
                        {COMMUNITIES.map((c, i) => (
                          <option key={i} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">State of Domicile</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="form-select text-xs font-medium"
                    >
                      {STATES.map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {activeSection === 'academic' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Degree Course</label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="form-select text-xs font-medium"
                      >
                        {COURSES.map((c, i) => (
                          <option key={i} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Academic Year</label>
                      <select
                        name="currentYear"
                        value={formData.currentYear}
                        onChange={handleChange}
                        className="form-select text-xs font-medium"
                      >
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Percentage (%)</label>
                      <input
                        type="number"
                        name="previousPercentage"
                        value={formData.previousPercentage}
                        onChange={handleChange}
                        placeholder="82"
                        className="form-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">CGPA (out of 10)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="cgpa"
                        value={formData.cgpa}
                        onChange={handleChange}
                        placeholder="8.4"
                        className="form-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Attendance (%)</label>
                      <input
                        type="number"
                        name="attendance"
                        value={formData.attendance}
                        onChange={handleChange}
                        placeholder="88"
                        className="form-input text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'financial' && (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Annual Family Income (₹ INR)
                    </label>
                    <input
                      type="number"
                      name="familyIncome"
                      value={formData.familyIncome}
                      onChange={handleChange}
                      placeholder="e.g. 220000"
                      className="form-input text-xs font-semibold"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Must match latest revenue certificate or ITR copy.
                    </p>
                  </div>
                </>
              )}

              {activeSection === 'other' && (
                <>
                  <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        name="disability"
                        checked={formData.disability}
                        onChange={handleChange}
                        className="rounded text-blue-900 size-4"
                      />
                      <span>Certified Disability (Divyangjan)</span>
                    </label>
                    {formData.disability && (
                      <div>
                        <input
                          type="number"
                          name="disabilityPercentage"
                          value={formData.disabilityPercentage}
                          onChange={handleChange}
                          placeholder="Disability Percentage (e.g. 40)"
                          className="form-input text-xs mt-1"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Residence Type</label>
                    <select
                      name="residence"
                      value={formData.residence}
                      onChange={handleChange}
                      className="form-select text-xs font-medium"
                    >
                      <option value="Day Scholar">Day Scholar</option>
                      <option value="Hosteller">Hosteller (Living on-campus)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Sports Representation</label>
                    <select
                      name="sportsAchievement"
                      value={formData.sportsAchievement}
                      onChange={handleChange}
                      className="form-select text-xs font-medium"
                    >
                      <option value="None">None</option>
                      <option value="District">District Level</option>
                      <option value="State">State Level</option>
                      <option value="National">National Level</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Updates apply immediately</span>
              <button
                onClick={() => {
                  setFormData({
                    fullName: '',
                    gender: 'Male',
                    state: 'Tamil Nadu',
                    community: 'BC',
                    course: 'B.Tech',
                    currentYear: '1',
                    previousPercentage: '',
                    cgpa: '',
                    attendance: '',
                    familyIncome: '',
                    disability: false,
                    disabilityPercentage: '',
                    residence: 'Day Scholar',
                    sportsAchievement: 'None'
                  });
                }}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="size-3" /> Reset inputs
              </button>
            </div>
          </div>
        </div>

        {/* Right Area: Evaluated Results List (7 Columns on Desktop) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Status Breakdown Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs flex items-center justify-between gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'all' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Schemes ({evaluatedSchemes.length})
            </button>
            <button
              onClick={() => setActiveTab('eligible')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'eligible' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="size-3.5" />
              Eligible ({eligibleCount})
            </button>
            <button
              onClick={() => setActiveTab('partial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'partial' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <AlertCircle className="size-3.5" />
              Partially Matching ({partialCount})
            </button>
            <button
              onClick={() => setActiveTab('ineligible')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'ineligible' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <XCircle className="size-3.5" />
              Ineligible ({ineligibleCount})
            </button>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {displayList.slice(0, 20).map(({ scheme, matchPercentage, passed, applicable, status, criteria }) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Card Top */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                        {scheme.code}
                      </span>
                      <span className="badge-category text-[11px] py-0.5 px-2.5 rounded-full">
                        {scheme.category}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                        ₹{scheme.amount.toLocaleString('en-IN')} / year
                      </span>
                    </div>
                    <Link
                      to={`/scholarships/${scheme.id}`}
                      className="text-base font-extrabold text-slate-900 hover:text-blue-900 transition-colors block"
                    >
                      {scheme.name}
                    </Link>
                    <span className="text-xs text-slate-500 block">
                      Administered by: <strong>{scheme.provider}</strong>
                    </span>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0">
                    <div className={`px-3 py-1 rounded-xl font-black text-sm flex items-center gap-1.5 ${
                      status === 'eligible' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      status === 'partially_matching' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      <Sparkles className="size-3.5" />
                      <span>{matchPercentage}% Match</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      status === 'eligible' ? 'text-emerald-700' :
                      status === 'partially_matching' ? 'text-amber-700' : 'text-rose-700'
                    }`}>
                      {status === 'eligible' ? '✓ Fully Qualified' :
                       status === 'partially_matching' ? '• Partial Criteria' : '✗ Ineligible'}
                    </span>
                  </div>
                </div>

                {/* Why This Result Transparent Breakdown */}
                <div className="bg-slate-50/90 rounded-xl p-3.5 text-xs space-y-2 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-700 block uppercase tracking-wider text-[10px]">
                      Deterministic Evaluation Checklist ({passed}/{applicable} passed)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Rule ID: {scheme.id}-REV
                    </span>
                  </div>
                  <ul className="space-y-2 divide-y divide-slate-100">
                    {criteria.map((c, i) => (
                      <li key={i} className="pt-2 first:pt-0 flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0">
                          {c.status === 'passed' ? (
                            <CheckCircle2 className="size-4 text-emerald-600" />
                          ) : c.status === 'failed' ? (
                            <XCircle className="size-4 text-rose-600" />
                          ) : (
                            <HelpCircle className="size-4 text-amber-500" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1 leading-snug">
                          <span className="font-bold text-slate-800">{c.title}: </span>
                          <span className={c.status === 'failed' ? 'text-rose-700 font-medium' : c.status === 'missing' ? 'text-amber-700 font-medium' : 'text-slate-600'}>
                            {c.message}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Row */}
                <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                  <Link
                    to={`/scholarships/${scheme.id}`}
                    className="text-slate-600 hover:text-blue-900 font-bold transition-colors"
                  >
                    View Guidelines &amp; Cutoffs →
                  </Link>

                  <div className="flex items-center gap-2">
                    {status === 'eligible' ? (
                      <Link
                        to={`/student/apply/${scheme.id}`}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                      >
                        Apply Now (Direct Entry) →
                      </Link>
                    ) : (
                      <Link
                        to={`/scholarships/${scheme.id}`}
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        Review Criteria
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
