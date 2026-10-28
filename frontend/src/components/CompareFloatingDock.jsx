import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { Scale, X, ArrowRight, IndianRupee, Trash2 } from 'lucide-react';

export default function CompareFloatingDock() {
  const { compareList, removeFromCompare, clearCompare, findScholarship } = usePortal();
  const location = useLocation();

  // Don't show dock if no schemes selected or if already on compare page
  if (!compareList || compareList.length === 0 || location.pathname === '/compare') {
    return null;
  }

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 p-3 sm:p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left Indicator & Scheme Chips */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Scale className="size-5" />
            </div>
            <div>
              <span className="text-xs font-bold block text-slate-100">
                Compare Dock ({compareList.length}/4)
              </span>
              <span className="text-[10px] text-slate-400">
                Side-by-side specification matrix
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-700 hidden sm:block shrink-0" />

          {/* Scheme Badges */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {compareList.map((id) => {
              const scheme = findScholarship(id);
              if (!scheme) return null;
              return (
                <div
                  key={id}
                  className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-2 shrink-0 max-w-[200px]"
                >
                  <div className="truncate text-left">
                    <p className="text-[11px] font-semibold text-white truncate">{scheme.name}</p>
                    <p className="text-[10px] text-emerald-400 font-mono font-bold flex items-center">
                      <IndianRupee className="size-2.5 inline" />
                      {scheme.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCompare(id)}
                    className="text-slate-400 hover:text-rose-400 p-0.5 rounded cursor-pointer transition-colors"
                    title="Remove from comparison"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              );
            })}

            {/* Empty Slots */}
            {Array.from({ length: 4 - compareList.length }).map((_, idx) => (
              <Link
                key={idx}
                to="/scholarships"
                className="border border-dashed border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500 rounded-lg px-3 py-1.5 text-[11px] font-medium shrink-0 flex items-center gap-1 transition-colors"
              >
                <span>+ Add Slot</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
            title="Clear all selected schemes"
          >
            <Trash2 className="size-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <Link
            to="/compare"
            className="bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer shrink-0"
          >
            <span>Compare Now ({compareList.length})</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
