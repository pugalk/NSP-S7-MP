import React from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Sparkles,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

export default function EligibilityRuleModal({ evaluation, onClose }) {
  if (!evaluation) return null;

  const { scheme, result } = evaluation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono bg-blue-950 text-blue-200 px-2 py-0.5 rounded border border-blue-800">
                {scheme.code}
              </span>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                {scheme.category}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold leading-tight">{scheme.name}</h2>
            <p className="text-xs text-slate-300 mt-1">{scheme.provider}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Match Percentage Banner */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Rule Engine Verdict
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xl font-extrabold ${
                result.overallStatus === 'eligible' ? 'text-emerald-600' :
                result.overallStatus === 'partially_matching' ? 'text-amber-600' : 'text-rose-600'
              }`}>
                {result.matchPercentage}% criteria matched
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                result.overallStatus === 'eligible' ? 'bg-emerald-100 text-emerald-800' :
                result.overallStatus === 'partially_matching' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {result.overallStatus === 'eligible' ? 'Eligible' :
                 result.overallStatus === 'partially_matching' ? 'Partially Matching' : 'Ineligible'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Passed Criteria</span>
            <span className="text-sm font-bold text-slate-700">
              {result.passedCount} of {result.applicableCount} rules
            </span>
          </div>
        </div>

        {/* Detailed Reasons List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Transparent Criteria Breakdown
          </h4>

          {result.criteria.map((crit, idx) => (
            <div key={idx} className="pt-3 first:pt-0 flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {crit.status === 'passed' ? (
                  <CheckCircle2 className="size-5 text-emerald-600" />
                ) : crit.status === 'failed' ? (
                  <XCircle className="size-5 text-rose-600" />
                ) : (
                  <HelpCircle className="size-5 text-amber-500" />
                )}
              </div>

              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">{crit.title}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    crit.status === 'passed' ? 'bg-emerald-50 text-emerald-700' :
                    crit.status === 'failed' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {crit.status === 'passed' ? 'Satisfied' : crit.status === 'failed' ? 'Unmet' : 'Profile Missing'}
                  </span>
                </div>
                
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {crit.message}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-2 bg-slate-50 p-2 rounded-md text-[11px]">
                  <div>
                    <span className="text-slate-400 font-medium">Required by Scheme: </span>
                    <span className="font-semibold text-slate-700">{crit.required}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Your Profile Value: </span>
                    <span className="font-semibold text-slate-700">{crit.actual}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <Link
            to="/student/dashboard"
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
          >
            Update Profile Information
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Close
            </button>
            <Link
              to={`/student/apply/${scheme.id}`}
              onClick={onClose}
              className="btn-primary text-xs py-2 px-4 shadow-xs"
            >
              Proceed to Apply
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
