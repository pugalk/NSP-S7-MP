import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { CATEGORIES } from '../data/scholarships';
import ScholarshipCard from '../components/ScholarshipCard';
import FlipkartBannerSlider from '../components/FlipkartBannerSlider';
import { 
  GraduationCap, 
  Search, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Users, 
  Award, 
  FileCheck, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Landmark, 
  BookOpen, 
  Calendar, 
  Scale,
  Heart,
  IndianRupee,
  Zap,
  TrendingUp,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const { scholarships, profile, signedIn, quickDemoLogin, compareList, wishlist } = usePortal();
  const navigate = useNavigate();
  const [heroQuery, setHeroQuery] = useState('');
  const [faqOpen, setFaqOpen] = useState({ 0: true });

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Top High-Value Schemes (Flipkart "Top Deals" Format)
  const highValueSchemes = [...scholarships]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  // Expiring Soon (Flipkart "Flash Sale / Closing Soon" Format)
  const now = new Date();
  const expiringSchemes = [...scholarships]
    .filter(s => {
      const diff = Math.ceil((new Date(s.closingDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return s.active && diff > 0 && diff <= 45;
    })
    .sort((a, b) => new Date(a.closingDate) - new Date(b.closingDate))
    .slice(0, 4);

  // Featured 6 schemes for discovery
  const featuredSchemes = scholarships.slice(0, 6);

  const faqs = [
    {
      q: 'How does this Flipkart-style One Portal work for students?',
      a: 'Browse 82 active central and state scholarship schemes like products in an e-commerce catalog! You can search with instant auto-suggestions, add schemes to your Saved Wishlist, compare up to 4 schemes side-by-side on an interactive specification matrix, and apply with 1-click DBT bank verification.'
    },
    {
      q: 'How does the side-by-side Compare Matrix work?',
      a: 'Simply click "Compare" on any scheme card. A floating compare dock appears at the bottom of your screen. Click "Compare Now" to inspect annual grant amount, min 12th/degree marks, income ceilings, domicile requirements, and required documents in one clean table.'
    },
    {
      q: 'What is the scholarship renewal re-verification process?',
      a: 'Existing beneficiaries do not have to fill a fresh profile from scratch. Enter your previous scholarship award ID, upload your latest semester marksheets and attendance certificate, and the rule engine automatically re-evaluates promotion requirements.'
    },
    {
      q: 'How is Direct Benefit Transfer (DBT) handled?',
      a: 'All 82 schemes in this portal are 100% PFMS validated and Aadhaar-seeded. Once an application is approved by the verification officer and scheme provider, grants are disbursed directly to your bank account without any intermediaries.'
    }
  ];

  return (
    <div className="space-y-10 pb-20 bg-slate-50">
      {/* 1. Flipkart-Style Dynamic Hero Banner Carousel */}
      <FlipkartBannerSlider />

      {/* 2. Quick Search & One-Click Demo Bar */}
      <div className="portal-container">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center font-bold shrink-0">
              <Zap className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Instant Scholarship Engine</h2>
              <p className="text-xs text-slate-500">82 active central, state &amp; private schemes ready for application</p>
            </div>
          </div>

          {/* Quick Demo Login Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs w-full lg:w-auto justify-end">
            <span className="text-slate-400 font-semibold hidden sm:inline">1-Click Portal Entry:</span>
            <button
              onClick={() => {
                quickDemoLogin('student');
                navigate('/student/dashboard');
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <GraduationCap className="size-3.5 text-amber-600" />
              <span>Student Desk</span>
            </button>
            <button
              onClick={() => {
                quickDemoLogin('admin');
                navigate('/admin/dashboard');
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="size-3.5 text-blue-600" />
              <span>Officer Desk</span>
            </button>
            <button
              onClick={() => {
                quickDemoLogin('organizer');
                navigate('/organizer/dashboard');
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Landmark className="size-3.5 text-purple-600" />
              <span>Provider Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. FLIPKART CURATED DEALS ROW: TOP HIGH-VALUE SCHOLARSHIPS */}
      <section className="portal-container space-y-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Top High-Value Scholarships
                </h2>
                <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-300">
                  Up to ₹2,50,000 / yr
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Premier merit, research, and professional education financial grants with 100% direct bank transfer.
              </p>
            </div>
          </div>
          <Link
            to="/scholarships?category=Merit-Based"
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-stretch sm:self-auto justify-center"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highValueSchemes.map((scheme) => (
            <ScholarshipCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </section>

      {/* 4. FLIPKART LIMITED TIME ROW: EXPIRING SOON */}
      <section className="portal-container space-y-4">
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 p-4 sm:p-5 rounded-2xl border border-amber-300/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Flame className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Urgent: Closing This Month
                </h2>
                <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-2 py-0.5 rounded-full border border-rose-300 animate-pulse">
                  Deadlines Approaching
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Application windows concluding within 30 to 45 days. Complete document upload and submit now.
              </p>
            </div>
          </div>
          <Link
            to="/scholarships?status=closing_soon"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-stretch sm:self-auto justify-center shadow-xs"
          >
            <span>VIEW CLOSING SCHEMES</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {expiringSchemes.map((scheme) => (
            <ScholarshipCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </section>

      {/* 5. FLIPKART STYLE COMPARISON PROMO BANNER */}
      <section className="portal-container">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold font-mono">
              <Scale className="size-3.5" />
              <span>FLIPKART-STYLE COMPARISON ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Cannot Decide Which Scholarship Fits You Best?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Select up to 4 scholarships and compare their annual financial grants, academic percentages, attendance mandates, income ceilings, and required documents side-by-side.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/compare"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-105"
              >
                <Scale className="size-4" />
                <span>Open Comparison Matrix ({compareList.length})</span>
              </Link>
              <Link
                to="/wishlist"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs border border-white/20 flex items-center gap-1.5 transition-all"
              >
                <Heart className="size-4 text-rose-400 fill-rose-400" />
                <span>View Saved Wishlist ({wishlist.length})</span>
              </Link>
            </div>
          </div>

          {/* Quick Comparison Snapshot Card */}
          <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700/80 w-full lg:w-80 space-y-3 shrink-0 shadow-md">
            <div className="flex items-center justify-between text-xs border-b border-slate-700 pb-2">
              <span className="font-bold text-amber-400">Spec Comparison Highlights</span>
              <span className="text-slate-400 text-[10px]">Matrix v2</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Grant Comparison:</span>
                <span className="font-mono text-emerald-400 font-bold">Side-by-side</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Cut-off Marks %:</span>
                <span className="font-mono text-amber-300 font-bold">Exact vs Yours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Income Ceiling:</span>
                <span className="font-mono text-blue-300 font-bold">Cap Check</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">1-Click Apply:</span>
                <span className="font-mono text-purple-300 font-bold">Supported</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW THE PORTAL WORKS (3-STEP E-COMMERCE STYLE FLOW) */}
      <section className="portal-container space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Streamlined 3-Step Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How The Portal Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            From smart discovery to direct benefit disbursal in your bank account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative">
            <span className="text-3xl font-black text-slate-200 font-mono">01</span>
            <h3 className="text-base font-bold text-slate-900">Explore &amp; Shortlist</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Search 82 verified schemes. Save to Wishlist or select up to 4 schemes in the Compare Matrix to evaluate marks, CGPA, and income criteria.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative">
            <span className="text-3xl font-black text-slate-200 font-mono">02</span>
            <h3 className="text-base font-bold text-slate-900">AI Match &amp; Apply</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use the transparent rule engine or chat with TOM AI to verify your eligibility score. Complete the streamlined wizard with DBT bank details.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative">
            <span className="text-3xl font-black text-slate-200 font-mono">03</span>
            <h3 className="text-base font-bold text-slate-900">Track &amp; Receive DBT</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monitor your application across the 5 verification stages like an order tracking timeline. Sanctioned funds are disbursed directly via PFMS.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="portal-container space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Clear guidance on applications, criteria evaluation, and direct disbursal.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
              >
                <span>{faq.q}</span>
                {faqOpen[idx] ? <ChevronUp className="size-4 shrink-0 text-slate-400" /> : <ChevronDown className="size-4 shrink-0 text-slate-400" />}
              </button>
              {faqOpen[idx] && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
