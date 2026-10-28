import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { 
  Heart, 
  Trash2, 
  ArrowRight, 
  IndianRupee, 
  Clock, 
  Building2, 
  Sparkles, 
  Scale, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, scholarships, findScholarship, addToCompare, isInCompare } = usePortal();
  const navigate = useNavigate();

  const savedSchemes = (wishlist || []).map(id => findScholarship(id)).filter(Boolean);

  const totalFunding = savedSchemes.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const handleSeedWishlist = () => {
    ['1', '2', '3', '7'].forEach(id => {
      if (!wishlist.includes(id)) toggleWishlist(id);
    });
  };

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
              <span className="text-slate-800 font-semibold">My Saved Scholarships</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
                <Heart className="size-5 fill-current" />
              </div>
              <span>My Saved Wishlist ({savedSchemes.length})</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Shortlisted scholarships bookmarked for timely application submission and renewal tracking.
            </p>
          </div>

          {/* Cumulative Funding Banner (Flipkart Style Total Value) */}
          {savedSchemes.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <IndianRupee className="size-5" />
              </div>
              <div>
                <span className="text-xs text-emerald-800 font-medium block">Total Funding Potential</span>
                <span className="text-lg font-extrabold text-emerald-900 font-mono">
                  {formatCurrency(totalFunding)} / year
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {savedSchemes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm space-y-5 my-12">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mx-auto">
              <Heart className="size-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Your Wishlist is Empty</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Explore the catalog of 82 scholarships and click the heart icon on any scheme card to save it for quick access.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSeedWishlist}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-105 cursor-pointer"
              >
                <Sparkles className="size-4" />
                <span>Save 4 Popular Recommended Schemes</span>
              </button>
              <Link
                to="/scholarships"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Browse All Schemes</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Items List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSchemes.map((scheme) => {
              const now = new Date();
              const closing = new Date(scheme.closingDate);
              const diffDays = Math.ceil((closing - now) / (1000 * 60 * 60 * 24));
              const isClosed = !scheme.active || diffDays < 0;
              const inCompare = isInCompare(scheme.id);

              return (
                <div
                  key={scheme.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Top Bar with Code & Remove */}
                  <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded font-mono">
                        {scheme.code}
                      </span>
                      <span className="text-xs text-slate-300 truncate max-w-[150px]">
                        {scheme.category}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleWishlist(scheme.id)}
                      className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      title="Remove from saved wishlist"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <Link
                        to={`/scholarships/${scheme.id}`}
                        className="font-bold text-base text-slate-900 hover:text-blue-900 transition-colors line-clamp-2"
                      >
                        {scheme.name}
                      </Link>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                        <Building2 className="size-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{scheme.provider}</span>
                      </p>
                    </div>

                    {/* Price / Grant Pill */}
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                      <div>
                        <span className="text-[10px] text-emerald-800 font-semibold block uppercase tracking-wider">
                          Annual Financial Grant
                        </span>
                        <span className="text-base font-extrabold text-emerald-900 font-mono">
                          {formatCurrency(scheme.amount)}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-1 rounded-md">
                        100% DBT
                      </span>
                    </div>

                    {/* Criteria Quick Row */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                      {scheme.minPercentage && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Min {scheme.minPercentage}% Marks
                        </span>
                      )}
                      {scheme.maxFamilyIncome && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Income ≤ {formatCurrency(scheme.maxFamilyIncome)}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded border font-semibold ${
                        diffDays <= 15 ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {diffDays > 0 ? `Ends in ${diffDays} days` : 'Closed'}
                      </span>
                    </div>

                    {/* Action Buttons (Flipkart Yellow Apply Now) */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to={`/student/apply/${scheme.id}`}
                          className="w-full bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-extrabold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition-all text-center"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                        <button
                          onClick={() => addToCompare(scheme.id)}
                          className={`w-full font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                            inCompare 
                              ? 'bg-blue-50 text-blue-900 border-blue-300 font-bold' 
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                          }`}
                        >
                          <Scale className="size-3.5" />
                          <span>{inCompare ? 'In Compare' : 'Compare'}</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                        <Link to={`/scholarships/${scheme.id}`} className="hover:text-blue-900 hover:underline">
                          View details
                        </Link>
                        <Link to={`/eligibility?scheme=${scheme.id}`} className="hover:text-amber-700 hover:underline font-medium">
                          Check eligibility →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
