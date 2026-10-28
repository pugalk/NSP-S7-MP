import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { STATES, COURSES, COMMUNITIES } from '../data/scholarships';
import { GraduationCap, ArrowRight, Lock, Mail, User, Phone } from 'lucide-react';

export default function StudentRegisterPage() {
  const { register } = usePortal();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    state: 'Tamil Nadu',
    course: 'B.Tech',
    community: 'BC'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form);
    navigate('/student/dashboard');
  };

  return (
    <div className="portal-container py-12 flex items-center justify-center min-h-[80vh]">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-md max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-400 mx-auto flex items-center justify-center shadow-sm">
            <GraduationCap className="size-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Registration</h1>
          <p className="text-xs text-slate-500">
            Create your account once to unlock multi-scheme eligibility matching and tracking
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Full Legal Name (as in Aadhaar)</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g. Aravind Swaminathan"
                className="form-input pl-9 text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="form-input pl-9 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="form-input pl-9 text-xs"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Create Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="form-input pl-9 text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Domicile State</label>
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="form-select text-xs font-medium"
              >
                {STATES.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Course</label>
              <select
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                className="form-select text-xs font-medium"
              >
                {COURSES.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Community</label>
              <select
                value={form.community}
                onChange={(e) => setForm({ ...form, community: e.target.value })}
                className="form-select text-xs font-medium"
              >
                {COMMUNITIES.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn-accent w-full py-2.5 text-xs font-bold shadow-sm"
          >
            Create Student Account <ArrowRight className="size-3.5" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-blue-900 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
