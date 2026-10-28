import React, { useState } from 'react';
import { usePWA } from '../context/PWAContext';
import { Download, Smartphone, X, Check, ShieldCheck } from 'lucide-react';

export default function PWAInstallBanner() {
  const { canInstall, isInstalled, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed || !canInstall) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-y border-blue-800/50 py-3 px-4 shadow-lg transition-all animate-fadeIn">
      <div className="portal-container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
            <Smartphone className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">Install National Scholarship Portal (PWA)</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded text-[10px] font-mono">
                Offline-Ready
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Install as a native desktop or mobile app for instant launch, offline verification, and zero data latency in remote areas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={installApp}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>Install App</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss install banner"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
