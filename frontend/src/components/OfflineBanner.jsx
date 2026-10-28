import React from 'react';
import { usePWA } from '../context/PWAContext';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, Zap } from 'lucide-react';

export default function OfflineBanner() {
  const { 
    effectiveOnline, 
    isSimulatedOffline, 
    toggleSimulateOffline, 
    offlineSyncMessage,
    updateAvailable,
    updateApp
  } = usePWA();

  // If there's an SW update available, show update toast
  if (updateAvailable) {
    return (
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-2.5 text-xs font-semibold shadow-md border-b border-blue-700 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <RefreshCw className="size-4 animate-spin text-amber-400" />
          <span>A new version of the National Scholarship Portal is available!</span>
        </div>
        <button
          onClick={updateApp}
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer"
        >
          Update Now
        </button>
      </div>
    );
  }

  // If offline (either real or simulated)
  if (!effectiveOnline) {
    return (
      <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-medium shadow-md border-b border-amber-600 flex flex-wrap items-center justify-between gap-3 z-50 transition-all">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-full bg-slate-950/10">
            <WifiOff className="size-3.5 text-slate-950 animate-pulse" />
          </span>
          <div>
            <span className="font-bold">Offline-First Mode Active</span>
            <span className="hidden sm:inline text-slate-900">
              {' '}— All 82 scholarship schemes, eligibility checks, and renewal drafting are running from local Service Worker cache.
            </span>
          </div>
          {isSimulatedOffline && (
            <span className="bg-slate-900 text-amber-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
              Simulated
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isSimulatedOffline ? (
            <button
              onClick={toggleSimulateOffline}
              className="bg-slate-900 text-white hover:bg-slate-800 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer"
            >
              Resume Online
            </button>
          ) : (
            <span className="text-[11px] bg-amber-600/20 px-2 py-0.5 rounded font-semibold text-slate-950">
              Auto-Sync Ready
            </span>
          )}
        </div>
      </div>
    );
  }

  // Show temporary sync / recovery message if present
  if (offlineSyncMessage) {
    return (
      <div className="bg-emerald-600 text-white px-4 py-1.5 text-xs font-semibold shadow-xs flex items-center justify-center gap-2 z-50 transition-all">
        <CheckCircle2 className="size-3.5" />
        <span>{offlineSyncMessage}</span>
      </div>
    );
  }

  return null;
}
