import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  HelpCircle,
  ShieldCheck 
} from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    applicationId: '',
    subject: 'Application Verification Query',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="portal-container py-12 max-w-4xl space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact &amp; Helpdesk
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Need assistance with eligibility rules, application status, or certificate verification? Our grievance desk is available.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info (5 Cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              National Helpdesk Details
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Phone className="size-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Toll-Free Helpline</span>
                  <span className="text-slate-600">1800-11-2001 / 011-24308000</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Mon to Fri, 9:30 AM to 5:30 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="size-4 text-blue-900 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Email Support</span>
                  <span className="text-slate-600">helpdesk-nsp@gov.in</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Typical response within 24 hours</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Central Welfare Directorate</span>
                  <span className="text-slate-600">
                    Department of Higher Education, Ministry of Education, Shastri Bhawan, New Delhi - 110001
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Query Form (7 Cols) */}
        <div className="md:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Submit Grievance / Inquire
          </h3>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
              <CheckCircle2 className="size-10 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-950">Grievance Ticket Submitted</h4>
              <p className="text-xs text-emerald-800">
                Ticket reference #GRV-2026-98421 has been registered. Our nodal support officer will contact you within 1 business day.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-secondary text-xs py-1.5 px-4 mt-2"
              >
                Submit another query
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Aravind"
                    className="form-input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                    className="form-input text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Application ID (Optional if existing applicant)
                </label>
                <input
                  type="text"
                  value={form.applicationId}
                  onChange={(e) => setForm({ ...form, applicationId: e.target.value })}
                  placeholder="e.g. NSRP-2026-849201"
                  className="form-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Query Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="form-select text-xs font-medium"
                >
                  <option value="Application Verification Query">Application Verification Query</option>
                  <option value="Document Re-upload Issue">Document Re-upload Issue</option>
                  <option value="Eligibility Rule Clarification">Eligibility Rule Clarification</option>
                  <option value="Renewal Re-Verification Assistance">Renewal Re-Verification Assistance</option>
                  <option value="DBT PFMS Disbursal Delay">DBT PFMS Disbursal Delay</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Detailed Message</label>
                <textarea
                  rows="4"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Provide complete details including scheme name, semester marks, or certificate issue..."
                  className="form-textarea text-xs"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-2.5 text-xs font-bold shadow-sm"
              >
                <Send className="size-3.5" /> Submit Support Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
