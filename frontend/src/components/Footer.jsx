import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="portal-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: About & Portal info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-amber-400">
                <GraduationCap className="size-6" />
              </div>
              <div>
                <h3 className="text-white text-base font-bold">National Scholarship Renewal &amp; Re-Verification Portal</h3>
                <p className="text-xs text-amber-400 font-medium">AY 2026-2027 Centralized Redressal Platform</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              A centralized platform to discover scholarships, verify eligibility against every active scheme, 
              apply online, upload documents and manage renewals with 100% transparent rule explanations.
            </p>
            <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 text-xs text-slate-400">
              <span className="font-semibold text-amber-300">Important Note:</span> Demonstration project. 
              All scholarship listings are sample demonstration data and not official live scheme information.
            </div>
          </div>

          {/* Col 2: Explore */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/scholarships" className="hover:text-amber-400 transition-colors">
                  All Scholarships (82)
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="hover:text-amber-400 transition-colors">
                  Eligibility Checker
                </Link>
              </li>
              <li>
                <Link to="/future-scope" className="text-amber-400 hover:underline flex items-center gap-1 font-semibold">
                  <Sparkles className="size-3.5" /> Future Scope (v2.0)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  About the Portal
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Contact &amp; Helpdesk
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-amber-400" />
                  Staff / Officer Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Student Portal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/register" className="hover:text-amber-400 transition-colors">
                  New Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-amber-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/student/renewal" className="hover:text-amber-400 transition-colors">
                  Scholarship Renewal Desk
                </Link>
              </li>
              <li>
                <Link to="/scholarships?status=closing_soon" className="hover:text-amber-400 transition-colors text-amber-300 font-medium">
                  Deadlines Approaching
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 National Scholarship Renewal &amp; Eligibility Re-Verification Portal. Open Source Re-creation.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-400">Privacy Policy</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-400">Terms of Use</Link>
            <span>•</span>
            <Link to="/future-scope" className="hover:text-amber-400 text-amber-300">Future Scope (v2.0)</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
