import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileSearch, 
  CheckCheck, 
  XCircle, 
  RotateCcw 
} from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Approved':
      case 'Verified':
        return {
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold',
          icon: <CheckCheck className="size-3.5 text-emerald-700" />,
          label: status
        };
      case 'Under Verification':
        return {
          bg: 'bg-blue-100 text-blue-950 border-blue-300 font-extrabold',
          icon: <FileSearch className="size-3.5 text-blue-700" />,
          label: 'Under Verification'
        };
      case 'Document Verification':
        return {
          bg: 'bg-indigo-100 text-indigo-950 border-indigo-300 font-extrabold',
          icon: <Clock className="size-3.5 text-indigo-700" />,
          label: 'Doc Verification'
        };
      case 'Provider Review':
        return {
          bg: 'bg-purple-100 text-purple-950 border-purple-300 font-extrabold',
          icon: <AlertCircle className="size-3.5 text-purple-700" />,
          label: 'Provider Review'
        };
      case 'Submitted':
      case 'Pending Verification':
        return {
          bg: 'bg-amber-100 text-amber-950 border-amber-300 font-extrabold',
          icon: <Clock className="size-3.5 text-amber-700" />,
          label: status
        };
      case 'Resubmission Required':
        return {
          bg: 'bg-orange-100 text-orange-950 border-orange-300 font-extrabold',
          icon: <RotateCcw className="size-3.5 text-orange-700" />,
          label: 'Resubmit Required'
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-100 text-rose-950 border-rose-300 font-extrabold',
          icon: <XCircle className="size-3.5 text-rose-700" />,
          label: 'Rejected'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <CheckCircle2 className="size-3.5 text-slate-500" />,
          label: status || 'Pending'
        };
    }
  };

  const config = getBadgeConfig();
  const paddingClass = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-2xs ${config.bg} ${paddingClass}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
