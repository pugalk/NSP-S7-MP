import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { 
  Scale, 
  IndianRupee, 
  Trash2, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Building2, 
  Clock, 
  GraduationCap, 
  ChevronRight,
  Sparkles,
  FileText
} from 'lucide-react';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, addToCompare, scholarships, findScholarship } = usePortal();
  const [selectedSchemeToAdd, setSelectedSchemeToAdd] = useState('');
  const navigate = useNavigate();

  const comparedSchemes = compareList.map(id => findScholarship(id)).filter(Boolean);

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const handleAddScheme = (e) => {
    e.preventDefault();
    if (selectedSchemeToAdd) {
      addToCompare(selectedSchemeToAdd);
      setSelectedSchemeToAdd('');
    }
  };

  const loadPopularComparison = () => {
    // Load top 3 popular schemes for instant Flipkart-style comparison
    ['1', '2', '3'].forEach(id => addToCompare(id));
  };

  // List of remaining schemes that can be added
  const availableSchemes = scholarships.filter(s => !compareList.includes(s.id));

  return (
    <div className="py-8 bg-slate-50 min-h-[85vh]">
      <div className="portal-container space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link to="/" className="hover:text-blue-900">Home</Link>
              <ChevronRight className="size-3" />
              <Link to="/scholarships" className="hover:text-blue-900">Scholarships</Link>
              <ChevronRight className="size-3" />
              <span className="text-slate-800 font-semibold">Scheme Comparison</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                <Scale className="size-5" />
              </div>
              <span>Scholarship Comparison Matrix</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Side-by-side specification comparison across eligibility rules, grant amounts, income caps, and DBT criteria.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {comparedSchemes.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <Link
              to="/scholarships"
              className="px-4 py-2 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>+ Add More Schemes</span>
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {comparedSchemes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm space-y-5 my-12">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
              <Scale className="size-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">No Scholarships in Comparison Matrix</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Select up to 4 schemes from the scholarship catalog to evaluate their marks, income limits, and benefits side-by-side.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={loadPopularComparison}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-105 cursor-pointer"
              >
                <Sparkles className="size-4" />
                <span>Load Top 3 Schemes to Compare</span>
              </button>
              <Link
                to="/scholarships"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Browse All 82 Schemes</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Comparison Matrix Table */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            {/* Quick Add Bar */}
            {comparedSchemes.length < 4 && (
              <div className="bg-slate-50/80 p-3.5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 font-medium">
                  Comparing <strong className="text-slate-900">{comparedSchemes.length} of 4</strong> schemes. You can add {4 - comparedSchemes.length} more.
                </span>
                <form onSubmit={handleAddScheme} className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedSchemeToAdd}
                    onChange={(e) => setSelectedSchemeToAdd(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden max-w-xs truncate"
                  >
                    <option value="">-- Choose a scheme to compare --</option>
                    {availableSchemes.slice(0, 25).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({formatCurrency(s.amount)})
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={!selectedSchemeToAdd}
                    className="bg-blue-900 disabled:opacity-50 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Plus className="size-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>
            )}

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                {/* Header Row: Scheme Card Previews & Actions */}
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-900 text-white">
                    <th className="p-4 w-48 font-bold text-xs uppercase tracking-wider text-slate-400 bg-slate-950/40">
                      Specification
                    </th>
                    {comparedSchemes.map((scheme) => (
                      <th key={scheme.id} className="p-4 align-top w-72 min-w-[240px]">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-400 text-slate-950">
                              {scheme.code}
                            </span>
                            <button
                              onClick={() => removeFromCompare(scheme.id)}
                              className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer p-1 rounded hover:bg-white/10"
                              title="Remove from comparison"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>

                          <Link
                            to={`/scholarships/${scheme.id}`}
                            className="block font-bold text-sm text-white hover:text-amber-300 transition-colors line-clamp-2"
                          >
                            {scheme.name}
                          </Link>

                          <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                            <Building2 className="size-3 shrink-0" />
                            <span>{scheme.provider}</span>
                          </p>

                          <div className="pt-2">
                            <Link
                              to={`/student/apply/${scheme.id}`}
                              className="w-full bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-extrabold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-102 cursor-pointer"
                            >
                              <span>Apply Now</span>
                              <ArrowRight className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      </th>
                    ))}
                    {/* Placeholder columns if less than 4 */}
                    {Array.from({ length: 4 - comparedSchemes.length }).map((_, idx) => (
                      <th key={idx} className="p-4 align-middle text-center w-72 min-w-[240px] bg-slate-800/40 border-l border-slate-800">
                        <Link
                          to="/scholarships"
                          className="border-2 border-dashed border-slate-700 hover:border-amber-400 text-slate-400 hover:text-amber-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all block group"
                        >
                          <Plus className="size-6 text-slate-500 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-semibold">Add Scheme</span>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body Rows */}
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {/* Row: Annual Grant Amount */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/80">
                      Annual Grant Amount
                    </td>
                    {comparedSchemes.map((scheme) => (
                      <td key={scheme.id} className="p-4">
                        <span className="text-base font-extrabold text-emerald-700 font-mono block">
                          {formatCurrency(scheme.amount)}
                        </span>
                        <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                          100% PFMS DBT Transfer
                        </span>
                      </td>
                    ))}
                    {Array.from({ length: 4 - comparedSchemes.length }).map((_, idx) => (
                      <td key={idx} className="p-4 bg-slate-50/20" />
                    ))}
                  </tr>

                  {/* Row: Category */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/80">
                      Category
                    </td>
                    {comparedSchemes.map((scheme) => (
                      <td key={scheme.id} className="p-4">
                        <span className="font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          {scheme.category}
                        </span>
                      </td>
                    ))}
                    {Array.from({ length: 4 - comparedSchemes.length }).map((_, idx) => (
                      <td key={idx} className="p-4 bg-slate-50/20" />
                    ))}
                  </tr>

                  {/* Row: Min Percentage Required */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/80">
                      Min Marks / % Required
                    </td>
                    {comparedSchemes.map((scheme) => (
                      <td key={scheme.id} className="p-4">
                        {scheme.minPercentage ? (
                          <span className="font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                            ≥ {scheme.minPercentage}% marks
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">No minimum cut-off</span>
                        )}
                      </td>
                    ))}
                    {Array.from({ length: 4 - comparedSchemes.length }).map((_, idx) => (
                      <td key={idx} className="p-4 bg-slate-50/20" />
                    ))}
                  </tr>

                  {/* Row: Min CGPA */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/80">
                      Min College CGPA
                    </td>
                    {comparedSchemes.map((scheme) => (
                      <td key={scheme.id} className="p-4">
                        {scheme.minCgpa ? (
                          <span className="font-bold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                            ≥ {scheme.minCgpa} CGPA
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">Not mandated</span>
                        )}
                      </td>
                    ))}
                    {Array.from({ length: 4 - comparedSchemes.length }).map((_, idx) => (
                      <td key={idx} className="p-4 bg-slate-50/20" />
                    ))}
                  </tr>

                  {/* Row: Attendance */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/80">
                      Min Attendance
                    </td>
                    {comparedSchemes.map((scheme) => (
                      <td key={scheme.id} className="p-4 font-medium">
                        {scheme.minAttendance ? `≥ ${scheme.minAttendance}%` : 'Standard 75%'}
                      </td>
                    ))}
                    {Array.from({ length: 4 - comparedSchemes.length }).map((_, idx) => (
                      <td key={idx} className="p-4 bg-slate-50/20" />
                    ))}
                  </tr>

                  {/* Row: Income Ceiling */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/80">
                      Family Income Ceiling
                    </td>
                    {comparedSchemes.map((scheme) => (
                      <td key={scheme.id} className="p-4">
                        {scheme.maxFamilyIncome ? (
                          <span className="font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                            ≤ {formatCurrency(scheme.maxFamilyIncome)} / year
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">No income ceiling (Open Merit)</span>
                        )}
                      </td>
                    ))}
                    {Array.from({ length: 4 - comparedSchemes.length }).map((_, idx) => (
                      <td key={idx} className="p-4 bg-slate-50/20" />
                    ))}
                  </tr>

                  {/* Row: State Domicile */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/80">
                      Domicile State
                    </td>
                    {comparedSchemes.map((scheme) => (
                      <td key={scheme.id} className="p-4">
                        {scheme.eligibleStates && scheme.eligibleStates.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {scheme.eligibleStates.slice(0, 3).map((st, i) => (
                              <span key={i} className="bg-slate-100 text-slate-800 text-[10px] px-1.5 py-0.5 rounded">
                                {st}
                              </span>
                            ))}
                            {scheme.eligibleStates.length > 3 && (
                              <span className="text-[10px] text-slate-500">+{scheme.eligibleStates.length - 3} more</span>
                            )}
                          </div>
                        ) : (
                          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                            All Indian States &amp; UTs
                          </span>
                        )}
                      </td>
                    ))}
                    {Array.from({ length: 4 - comparedSchemes.length }).map((_, idx) => (
                      <td key={idx} className="p-4 bg-slate-50/20" />
                    ))}
                  </tr>

                  {/* Row: Eligible Courses */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/80">
                      Eligible Courses
                    </td>
                    {comparedSchemes.map((scheme) => (
                      <td key={scheme.id} className="p-4">
                        {scheme.eligibleCourses && scheme.eligibleCourses.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {scheme.eligibleCourses.map((c, i) => (
                              <span key={i} className="bg-slate-100 text-slate-800 text-[10px] px-2 py-0.5 rounded">
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-600">All Higher Education Courses</span>
                        )}
                      </td>
                    ))}
                    {Array.from({ length: 4 - comparedSchemes.length }).map((_, idx) => (
                      <td key={idx} className="p-4 bg-slate-50/20" />
                    ))}
                  </tr>

                  {/* Row: Required Documents */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/80">
                      Mandatory Documents
                    </td>
                    {comparedSchemes.map((scheme) => (
                      <td key={scheme.id} className="p-4">
                        <ul className="space-y-1 text-[11px] text-slate-600">
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                            <span>Aadhaar ID Card</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                            <span>Academic Marksheet</span>
                          </li>
                          {scheme.maxFamilyIncome && (
                            <li className="flex items-center gap-1.5">
                              <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                              <span>Income Certificate</span>
                            </li>
                          )}
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                            <span>Institution Bonafide</span>
                          </li>
                        </ul>
                      </td>
                    ))}
                    {Array.from({ length: 4 - comparedSchemes.length }).map((_, idx) => (
                      <td key={idx} className="p-4 bg-slate-50/20" />
                    ))}
                  </tr>

                  {/* Row: Closing Date */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/80">
                      Application Deadline
                    </td>
                    {comparedSchemes.map((scheme) => {
                      const now = new Date();
                      const closing = new Date(scheme.closingDate);
                      const diffDays = Math.ceil((closing - now) / (1000 * 60 * 60 * 24));
                      return (
                        <td key={scheme.id} className="p-4">
                          <span className="font-semibold text-slate-900 block">
                            {closing.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block mt-1 ${
                            diffDays <= 15 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {diffDays > 0 ? `${diffDays} days remaining` : 'Closed'}
                          </span>
                        </td>
                      );
                    })}
                    {Array.from({ length: 4 - comparedSchemes.length }).map((_, idx) => (
                      <td key={idx} className="p-4 bg-slate-50/20" />
                    ))}
                  </tr>

                  {/* Row: Quick Apply CTA */}
                  <tr className="bg-slate-50/90 font-bold">
                    <td className="p-4 text-slate-900">Action</td>
                    {comparedSchemes.map((scheme) => (
                      <td key={scheme.id} className="p-4">
                        <div className="flex flex-col gap-2">
                          <Link
                            to={`/student/apply/${scheme.id}`}
                            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all text-center"
                          >
                            <span>Apply Scheme</span>
                            <ArrowRight className="size-3.5" />
                          </Link>
                          <Link
                            to={`/eligibility?scheme=${scheme.id}`}
                            className="text-center text-[11px] text-blue-900 hover:underline"
                          >
                            Check My Match Score →
                          </Link>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 4 - comparedSchemes.length }).map((_, idx) => (
                      <td key={idx} className="p-4 bg-slate-50/20" />
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
