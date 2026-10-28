import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import DocumentUploader from '../components/DocumentUploader';
import { 
  Building2, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  IndianRupee, 
  FileText, 
  Landmark,
  AlertCircle 
} from 'lucide-react';

export default function ApplyScholarshipPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { findScholarship, profile, documents, addDocument, removeDocument, addApplication } = usePortal();

  const scheme = findScholarship(id);

  const [step, setStep] = useState(1);
  const [appType, setAppType] = useState('Fresh');
  const [bankDetails, setBankDetails] = useState({
    bankName: 'State Bank of India',
    accountNumber: '409182910492',
    ifscCode: 'SBIN0001234',
    accountHolderName: profile.fullName || 'Aravind Swaminathan'
  });
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!scheme) {
    return (
      <div className="portal-container py-20 text-center">
        <h2 className="text-xl font-bold">Scholarship scheme not found.</h2>
        <Link to="/scholarships" className="btn-primary mt-4 inline-flex text-xs py-2 px-4">
          Browse Scholarships
        </Link>
      </div>
    );
  }

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!declarationAccepted) {
      alert('Please accept the declaration to submit your application.');
      return;
    }
    setSubmitting(true);

    const newApp = addApplication({
      scholarshipId: scheme.id,
      type: appType,
      bankDetails,
      academicDetails: {
        course: profile.course,
        year: profile.currentYear,
        percentage: profile.previousPercentage,
        cgpa: profile.cgpa,
        attendance: profile.attendance
      }
    });

    setTimeout(() => {
      setSubmitting(false);
      navigate('/student/dashboard');
    }, 600);
  };

  return (
    <div className="portal-container py-10 max-w-3xl space-y-8">
      {/* Back button */}
      <Link
        to={`/scholarships/${scheme.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Back to scheme details
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="badge-category text-xs py-0.5 px-2.5">{scheme.category}</span>
          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            {scheme.code}
          </span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Apply: {scheme.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{scheme.provider}</p>
        </div>

        {/* Step Progress indicator */}
        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 text-center text-xs">
          <div className={`p-2 rounded-lg font-semibold ${step >= 1 ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
            1. Mode
          </div>
          <div className={`p-2 rounded-lg font-semibold ${step >= 2 ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
            2. Academic
          </div>
          <div className={`p-2 rounded-lg font-semibold ${step >= 3 ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
            3. Documents
          </div>
          <div className={`p-2 rounded-lg font-semibold ${step >= 4 ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
            4. DBT Bank
          </div>
        </div>
      </div>

      {/* Wizard Steps */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900">Select Application Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label 
                onClick={() => setAppType('Fresh')}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  appType === 'Fresh' ? 'border-blue-900 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">Fresh Application</span>
                  <input
                    type="radio"
                    checked={appType === 'Fresh'}
                    onChange={() => setAppType('Fresh')}
                    className="size-4 text-blue-900"
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  First-time application for this specific scholarship scheme in the current academic year.
                </p>
              </label>

              <label 
                onClick={() => setAppType('Renewal')}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  appType === 'Renewal' ? 'border-blue-900 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm">Renewal Application</span>
                  <input
                    type="radio"
                    checked={appType === 'Renewal'}
                    onChange={() => setAppType('Renewal')}
                    className="size-4 text-blue-900"
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Renewing an award from a previous year. Requires promotion proof and certified marks.
                </p>
              </label>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="btn-primary text-xs py-2 px-6"
              >
                Continue to Academic Review <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Confirm Academic &amp; Profile Details</h2>
              <span className="text-xs text-blue-900 font-semibold">Pre-filled from Profile</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-medium">Applicant Name:</span>
                <span className="font-bold text-slate-800 block">{profile.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Institution:</span>
                <span className="font-bold text-slate-800 block">{profile.institution}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Course &amp; Year:</span>
                <span className="font-bold text-slate-800 block">{profile.course} (Year {profile.currentYear})</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">State Domicile:</span>
                <span className="font-bold text-slate-800 block">{profile.state}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Percentage / CGPA:</span>
                <span className="font-bold text-emerald-700 block">{profile.previousPercentage}% ({profile.cgpa} CGPA)</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Certified Attendance:</span>
                <span className="font-bold text-blue-900 block">{profile.attendance}%</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-primary text-xs py-2 px-6"
              >
                Verify Documents <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900">Required Documents for {scheme.name}</h2>
            <p className="text-xs text-slate-600">
              Upload the certificates specified by the provider. You can also re-use previously uploaded certificates.
            </p>

            <DocumentUploader
              documents={documents}
              onUpload={addDocument}
              onRemove={removeDocument}
              requiredDocs={scheme.requiredDocuments || []}
            />

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="btn-primary text-xs py-2 px-6"
              >
                Continue to DBT Bank Details <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900">Direct Benefit Transfer (DBT) Bank Account</h2>
              <p className="text-xs text-slate-500">
                Grant amounts are disbursed directly to your Aadhaar-linked bank account through PFMS.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                  className="form-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  className="form-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Account Number</label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  className="form-input text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                  className="form-input text-xs font-mono"
                  required
                />
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-amber-950 font-medium">
                <input
                  type="checkbox"
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-blue-900 size-4"
                  required
                />
                <span className="leading-relaxed">
                  I solemnly declare that the information and certificates furnished by me are true and accurate. 
                  I understand that any false declaration will lead to immediate cancellation of scholarship and recovery of disbursed amounts.
                </span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting || !declarationAccepted}
                className="btn-primary text-xs py-2.5 px-6 shadow-md disabled:opacity-50"
              >
                {submitting ? 'Submitting Application...' : 'Submit Application Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
