import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Award,
  Users,
  Target
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="portal-container py-12 max-w-4xl space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-900">
          <ShieldCheck className="size-4" />
          <span>About the National Scholarship Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Transparency in Every Scholarship Evaluation
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The National Scholarship Renewal &amp; Eligibility Re-Verification Portal is built to eliminate 
          opaque rejections and fragmented application systems across central and state welfare ministries.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <CheckCircle2 className="size-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Zero Opaque Rejections</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every candidate receives a point-by-point explanation showing required values against their actual profile data.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <Target className="size-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Multi-Tier Rule Engine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Checks percentage, CGPA, attendance, domicile, community, and income against 82 schemes in real time.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Users className="size-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Seamless Annual Renewal</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Beneficiaries don't start from scratch. Promotion marks and attendance certificates are re-verified with one click.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-4 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold">Try the Interactive Eligibility Matcher</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Fill your student profile once and instantly see all matched schemes.
        </p>
        <Link to="/eligibility" className="btn-accent inline-flex text-xs py-2.5 px-6 mt-2">
          Check Eligibility Now <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
