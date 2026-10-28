import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  FileCheck2, 
  BrainCircuit, 
  Landmark, 
  Blocks, 
  TrendingUp, 
  Languages, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle,
  Zap,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';
import ModuleSandbox from '../components/ModuleSandbox';

export default function FutureScopePage() {
  const [activeTab, setActiveTab] = useState(0);

  const enhancements = [
    {
      id: 'digilocker',
      icon: <FileCheck2 className="size-6 text-blue-400" />,
      title: '1. DigiLocker & APAAR / ABC Integration',
      badge: 'Digital Public Infrastructure (DPI)',
      color: 'blue',
      whatItDoes: 'Replaces manual document uploads (PDF/JPEG) with one-click cryptographic verification using government APIs (DigiLocker, UIDAI Aadhaar, and Ministry of Education’s APAAR ID / Academic Bank of Credits).',
      mechanism: [
        'OAuth 2.0 PKCE handshake with National DigiLocker API gateways.',
        'Pulls digitally signed XML/JSON credentials directly from State Revenue Boards (Income/Caste) and Universities (Marksheets/CGPA).',
        'Direct linkage to Academic Bank of Credits (ABC) for live credit score and attendance verification.'
      ],
      impact: 'Eliminates counterfeit certificates, drops verification time from days to seconds, and reduces student upload friction to near zero.'
    },
    {
      id: 'ai-ocr',
      icon: <BrainCircuit className="size-6 text-purple-400" />,
      title: '2. AI Document Authenticity & OCR Verification',
      badge: 'Computer Vision & Deep Learning',
      color: 'purple',
      whatItDoes: 'Employs Computer Vision and Optical Character Recognition (OCR) to inspect any manually uploaded legacy certificate or offline institution document.',
      mechanism: [
        'Convolutional Neural Networks (CNNs) & Error Level Analysis (ELA) to detect digital tampering, font inconsistencies, and altered seals/stamps.',
        'High-speed OCR extraction (Tesseract / Vision AI) to match student-typed names, CGPAs, and family income against the text detected on the certificate.',
        'Automated fuzzy string distance matching (Levenshtein & Jaro-Winkler) with instant disparity flags.'
      ],
      impact: 'Flags forged applications before administrative scrutiny, drastically reducing caseworker workloads and preventing inadvertent student typos from causing rejections.'
    },
    {
      id: 'pfms-dbt',
      icon: <Landmark className="size-6 text-emerald-400" />,
      title: '3. Aadhaar Payment Bridge & PFMS Integration (DBT)',
      badge: 'FinTech & Treasury Integration',
      color: 'emerald',
      whatItDoes: 'Links the scholarship sanction desk directly to the Public Financial Management System (PFMS) and NPCI Aadhaar Payment Bridge System (APBS) for frictionless Direct Benefit Transfer.',
      mechanism: [
        'Secure mTLS webhook triggers send approved disbursement batches directly to national treasury gateways.',
        'Real-time NPCI Mapper API calls to confirm active Aadhaar-bank account seeding prior to transmission.',
        'Live student tracking timeline from Sanction Order Issued ➔ PFMS Scheduled ➔ Bank Credit Confirmed with UTR numbers.'
      ],
      impact: 'Eliminates administrative middlemen, prevents banking routing failures (IFSC changes / inactive accounts), and ensures transparent instant student disbursals.'
    },
    {
      id: 'blockchain',
      icon: <Blocks className="size-6 text-amber-400" />,
      title: '4. Blockchain Dual-Disbursement Prevention & Audit Trail',
      badge: 'Distributed Ledger Technology (DLT)',
      color: 'amber',
      whatItDoes: 'Prevents students from fraudulently claiming multiple full-tuition scholarships simultaneously from independent state and central bodies.',
      mechanism: [
        'Permissioned distributed ledger (Hyperledger Fabric) shared between state welfare boards and central ministries.',
        'Deterministic smart contracts (Chaincode) lock concurrent active full awards using unique cryptographic student identity hashes.',
        'Zero-Knowledge Proofs (ZKP) enable inter-state claim uniqueness checks without exposing student PII.'
      ],
      impact: 'Complete financial transparency, tamper-proof audit trails for government comptrollers, and fair, equitable distribution of limited public funds.'
    },
    {
      id: 'predictive-ml',
      icon: <TrendingUp className="size-6 text-rose-400" />,
      title: '5. Predictive Dropout & Renewal-Risk Early Warning System',
      badge: 'Predictive Analytics & Retention AI',
      color: 'rose',
      whatItDoes: 'Uses machine learning models to identify students who are statistically at risk of failing renewal criteria (e.g., borderline attendance, trailing backlogs, or impending income cap breaches).',
      mechanism: [
        'Supervised classification algorithms (Gradient Boosted Trees) analyzing historical progression and engagement trends.',
        'Calculates mid-term retention risk indices and forecasts year-end GPA outcomes.',
        'Proactively triggers automated SMS/WhatsApp alerts, mentorship nudges, and recommends emergency bridge assistance before final exams.'
      ],
      impact: 'Prevents at-risk, first-generation scholars from losing financial support and dropping out due to marginal GPA deficits.'
    },
    {
      id: 'bhashini',
      icon: <Languages className="size-6 text-cyan-400" />,
      title: '6. Multilingual Conversational AI & Voice Assistant (Bhashini)',
      badge: 'Natural Language AI (22 Indian Languages)',
      color: 'cyan',
      whatItDoes: 'Enables rural, tribal, and first-generation college students to navigate the portal, verify eligibility, and file renewals using voice commands in regional languages.',
      mechanism: [
        'Direct integration with Project Bhashini (National Language Translation Mission) speech-to-text and text-to-speech APIs.',
        'Domain-specific Conversational LLM fine-tuned on scholarship guidelines and welfare eligibility rules.',
        'Native voice interaction in Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati, and other regional tongues.'
      ],
      impact: 'Bridges digital divide and accessibility barriers, allowing students to apply independently without reliance on internet café middlemen.'
    },
    {
      id: 'pwa-biometrics',
      icon: <Smartphone className="size-6 text-indigo-400" />,
      title: '7. Offline-First PWA with UIDAI Face-RD Biometrics',
      badge: 'Edge Computing & Biometric Security',
      color: 'indigo',
      whatItDoes: 'Allows students in low-connectivity remote regions to draft profiles and renewal forms offline, syncing automatically when connectivity resumes.',
      mechanism: [
        'Service Workers and IndexedDB local caching for 100% offline rule matching and application drafting.',
        'Background Sync API for guaranteed payload transmission on reconnection.',
        'UIDAI Face-RD SDK integration on standard smartphone cameras for biometric liveness verification without specialized hardware.'
      ],
      impact: 'Ensures zero dropped applications due to poor rural network conditions and guarantees verified applicant liveness.'
    }
  ];

  const comparison = [
    {
      dimension: 'Eligibility Verification',
      mvp: 'Deterministic rule engine against student profile input',
      futuristic: 'Automated live verification against university, tax & ABC databases'
    },
    {
      dimension: 'Document Processing',
      mvp: 'Manual student upload + admin visual screening',
      futuristic: 'DigiLocker API integration + AI OCR tamper & forgery detection'
    },
    {
      dimension: 'Renewal Workflow',
      mvp: 'Automatic comparison against promotion rules on renewal desk',
      futuristic: 'Predictive early-warning alerts + proactive remedial mentorship'
    },
    {
      dimension: 'Disbursement Pipeline',
      mvp: 'Application status tracking to "Disbursed" stage',
      futuristic: 'Real-time PFMS / NPCI bank transfer gateway with live UTR timeline'
    },
    {
      dimension: 'Fraud Prevention',
      mvp: 'Role-based nodal scrutiny & strict schema validation',
      futuristic: 'Blockchain cross-registry smart contracts against dual-scheme claims'
    },
    {
      dimension: 'Accessibility & Reach',
      mvp: 'Modern responsive web interface (English)',
      futuristic: 'Multilingual voice assistant (Bhashini) & offline PWA with Face-RD'
    }
  ];

  return (
    <div className="portal-container py-12 max-w-5xl space-y-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-semibold text-amber-300">
          <Sparkles className="size-3.5" />
          <span>Project Report &amp; Viva Defense Chapter</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Futuristic Updates &amp; Future Scope
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Comprehensive blueprint for scaling the National Scholarship Renewal &amp; Eligibility Re-Verification Portal (Eligifind) 
          into an enterprise-grade, fraud-resilient, and universally accessible Digital Public Good.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <span className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80 text-slate-300">
            🏛️ Digital Public Infrastructure (DPI)
          </span>
          <span className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80 text-slate-300">
            🤖 AI &amp; Computer Vision
          </span>
          <span className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80 text-slate-300">
            ⛓️ Hyperledger Blockchain
          </span>
          <span className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80 text-slate-300">
            🗣️ Bhashini Voice AI
          </span>
        </div>
      </div>

      {/* Interactive 7 Modules Navigator */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            7 Next-Generation Architecture Modules
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Click on any module below to inspect the functional objective, technical mechanism, and measurable impact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Module Selector (5 Cols) */}
          <div className="lg:col-span-5 space-y-2">
            {enhancements.map((enh, idx) => (
              <button
                key={enh.id}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between gap-3 ${
                  activeTab === idx
                    ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="shrink-0">{enh.icon}</span>
                  <span className="truncate">{enh.title}</span>
                </div>
                <ChevronRight className={`size-4 shrink-0 transition-transform ${activeTab === idx ? 'translate-x-1' : 'opacity-40'}`} />
              </button>
            ))}
          </div>

          {/* Module Detail Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="badge-category text-xs py-0.5 px-2.5">
                {enhancements[activeTab].badge}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                {enhancements[activeTab].title}
              </h3>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                What it does
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {enhancements[activeTab].whatItDoes}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Technical Mechanism &amp; Architecture
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {enhancements[activeTab].mechanism.map((m, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 text-blue-900 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
              <span className="font-bold text-emerald-950 block">Measurable Impact &amp; ROI</span>
              <p className="text-emerald-800 leading-relaxed">
                {enhancements[activeTab].impact}
              </p>
            </div>

            {/* Interactive Module Sandbox / Viva Simulator */}
            <ModuleSandbox moduleId={enhancements[activeTab].id} />
          </div>
        </div>
      </div>

      {/* Comparison Table for Project Defense */}
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="size-4" />
            <span>Viva Presentation Slide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Summary Comparison for Project Defense
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Comparative analysis between the current operational MVP and the futuristic v2.0 production roadmap.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="p-4 sm:w-1/4">Dimension</th>
                <th className="p-4 sm:w-3/8 text-blue-200">Current System (Eligifind MVP)</th>
                <th className="p-4 sm:w-3/8 text-amber-300">Futuristic Production System (v2.0)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparison.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{c.dimension}</td>
                  <td className="p-4 text-slate-600 leading-relaxed">{c.mvp}</td>
                  <td className="p-4 font-semibold text-blue-950 leading-relaxed bg-blue-50/30">
                    {c.futuristic}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Viva Talking Points Quick Callout */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-amber-400">
          💡 Examiner &amp; Viva Defense Talking Points
        </h3>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">•</span>
            <span>
              <strong>Full DPI Alignment:</strong> The future scope is architecturally designed around India's Digital Public Infrastructure (DigiLocker, APAAR, Bhashini, and PFMS).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">•</span>
            <span>
              <strong>Dual-Disbursement Solution:</strong> Introduces permissioned blockchain smart contracts (Hyperledger Fabric) to solve the chronic national issue of students claiming multiple concurrent full scholarships across disconnected portals.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">•</span>
            <span>
              <strong>Proactive Student Retention:</strong> Replaces reactive rejection with ML-driven early warning risk scores to intervene before students lose their scholarship due to marginal attendance/GPA deficits.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
