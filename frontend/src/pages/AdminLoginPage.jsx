import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { ShieldCheck, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const { staffLogin } = usePortal();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@nsp.gov.in');
  const [password, setPassword] = useState('admin');

  const handleSubmit = (e) => {
    e.preventDefault();
    staffLogin({ email, password });
    navigate('/admin/dashboard');
  };

  const handleDemoFill = () => {
    setEmail('admin@nsp.gov.in');
    setPassword('admin');
  };

  return (
    <div className="portal-container py-16 flex items-center justify-center min-h-[75vh]">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-md max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 mx-auto flex items-center justify-center shadow-sm">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Officer Verification Desk
          </h1>
          <p className="text-xs text-slate-500">
            Nodal Welfare Officer &amp; Institutional Reviewer Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Official Email ID</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@nsp.gov.in"
                className="form-input pl-9 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Access PIN / Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input pl-9 text-xs"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-2.5 text-xs font-bold shadow-sm bg-slate-900 hover:bg-slate-800"
          >
            Sign In to Verification Desk <ArrowRight className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="size-3.5" /> Auto-fill Demo Officer Credentials
          </button>
        </form>
      </div>
    </div>
  );
}
