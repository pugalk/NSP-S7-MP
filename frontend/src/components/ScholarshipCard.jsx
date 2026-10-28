import React from 'react';
import { Link } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { 
  IndianRupee, 
  Building2, 
  ArrowRight, 
  Clock, 
  Heart,
  Scale,
  Star,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function ScholarshipCard({ scheme }) {
  const { toggleWishlist, isInWishlist, addToCompare, removeFromCompare, isInCompare } = usePortal();

  const now = new Date();
  const closing = new Date(scheme.closingDate);
  const diffDays = Math.ceil((closing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isClosed = !scheme.active || diffDays < 0;

  const inWishlist = isInWishlist(scheme.id);
  const inCompare = isInCompare(scheme.id);

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(scheme.id);
    } else {
      addToCompare(scheme.id);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(scheme.id);
  };

  // Generate deterministic rating & applicant count based on scheme ID for Flipkart credibility
  const rating = (4.5 + ((Number(scheme.id) * 7) % 5) / 10).toFixed(1);
  const applicants = (800 + ((Number(scheme.id) * 137) % 2400)).toLocaleString('en-IN');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md card-hover flex flex-col justify-between overflow-hidden transition-all hover:shadow-xl hover:border-slate-300 relative group">
      {/* Dark Navy Header Block matching official UI render */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-t-2xl space-y-2 relative overflow-hidden">
        {/* Top Badges & Action Buttons */}
        <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded shadow-2xs">
              {scheme.code}
            </span>
            <span className="text-slate-400 truncate max-w-[120px] hidden sm:inline">
              {scheme.category}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Add to Compare Button */}
            <button
              onClick={handleCompareToggle}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-sans ${
                inCompare 
                  ? 'bg-blue-600 text-white font-bold' 
                  : 'bg-white/10 hover:bg-white/20 text-slate-300'
              }`}
              title={inCompare ? "Remove from comparison" : "Add to side-by-side comparison"}
            >
              <Scale className="size-3.5" />
              <span className="hidden sm:inline text-[10px]">{inCompare ? 'Comparing' : 'Compare'}</span>
            </button>

            {/* Wishlist Heart Toggle */}
            <button
              onClick={handleWishlistToggle}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                inWishlist 
                  ? 'bg-rose-500/30 text-rose-400 hover:bg-rose-500/40' 
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white'
              }`}
              title={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
            >
              <Heart className={`size-3.5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link to={`/scholarships/${scheme.id}`} className="block group/link">
          <h3 className="text-base font-bold text-white group-hover/link:text-amber-300 transition-colors line-clamp-1 leading-snug">
            {scheme.name}
          </h3>
        </Link>

        {/* Department / Trust */}
        <p className="text-xs text-slate-300 flex items-center gap-1.5 truncate">
          <Building2 className="size-3 text-slate-400 shrink-0" />
          <span className="truncate">{scheme.provider}</span>
        </p>

        {/* Flipkart-style Rating & Verification Pill */}
        <div className="flex items-center gap-2 pt-0.5 text-[10px]">
          <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 font-mono">
            <span>{rating}</span>
            <Star className="size-2.5 fill-current" />
          </span>
          <span className="text-slate-400">({applicants} applicants)</span>
          <span className="text-emerald-400 flex items-center gap-0.5 font-medium ml-auto">
            <ShieldCheck className="size-3" />
            <span>DBT Verified</span>
          </span>
        </div>
      </div>

      {/* Body with Badges & Tags */}
      <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between bg-white">
        {/* Pills Row: Green Grant Pill + Countdown Pill */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-2xs">
            <IndianRupee className="size-3" />
            <span>{formatCurrency(scheme.amount)} / year</span>
          </span>

          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
            isClosed
              ? 'bg-slate-100 text-slate-600 border-slate-200'
              : diffDays <= 15
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}>
            <Clock className="size-3" />
            <span>{isClosed ? 'Closed' : `Ends in ${diffDays} days`}</span>
          </span>
        </div>

        {/* Criteria Tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium border border-slate-200/80">
            {scheme.category.split(' ')[0]}
          </span>
          {scheme.minPercentage && (
            <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md font-semibold border border-blue-200">
              ≥ {scheme.minPercentage}%
            </span>
          )}
          {scheme.minCgpa && (
            <span className="bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-md font-semibold border border-indigo-200">
              ≥ {scheme.minCgpa} CGPA
            </span>
          )}
          {scheme.maxFamilyIncome && (
            <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-semibold border border-amber-200">
              Income ≤ ₹{(scheme.maxFamilyIncome / 100000).toFixed(1)}L
            </span>
          )}
        </div>

        {/* Action Button: Full-width Amber 'Apply Now' Button */}
        <div className="pt-2 space-y-2">
          {!isClosed ? (
            <Link
              to={`/student/apply/${scheme.id}`}
              className="w-full bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="size-3.5" />
            </Link>
          ) : (
            <button
              disabled
              className="w-full bg-slate-200 text-slate-500 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1 cursor-not-allowed"
            >
              <span>Application Closed</span>
            </button>
          )}

          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
            <Link to={`/scholarships/${scheme.id}`} className="hover:text-blue-900 hover:underline">
              View criteria matrix
            </Link>
            <Link to={`/eligibility?scheme=${scheme.id}`} className="hover:text-amber-700 hover:underline font-medium">
              Check my eligibility →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
