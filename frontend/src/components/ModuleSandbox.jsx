import React, { useState } from 'react';
import { usePWA } from '../context/PWAContext';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  Download, 
  ScanFace, 
  ShieldCheck, 
  Camera, 
  FileCheck2, 
  Sparkles, 
  Database, 
  Landmark, 
  Blocks, 
  Languages, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  Fingerprint,
  Eye
} from 'lucide-react';

export default function ModuleSandbox({ moduleId }) {
  const { 
    effectiveOnline, 
    isSimulatedOffline, 
    toggleSimulateOffline, 
    canInstall, 
    installApp, 
    isInstalled 
  } = usePWA();

  // Face-RD Biometric state
  const [faceRdStage, setFaceRdStage] = useState('idle'); // 'idle', 'scanning', 'blink', 'matching', 'verified'
  const [faceProgress, setFaceProgress] = useState(0);

  // DigiLocker state
  const [digiStage, setDigiStage] = useState('idle'); // 'idle', 'connecting', 'fetched'

  // AI OCR state
  const [ocrStage, setOcrStage] = useState('idle'); // 'idle', 'scanning', 'verified'

  // PFMS DBT state
  const [dbtStage, setDbtStage] = useState('idle'); // 'idle', 'submitting', 'disbursed'

  // Blockchain state
  const [bcStage, setBcStage] = useState('idle'); // 'idle', 'verifying', 'confirmed'

  // Predictive ML state
  const [mlAttendance, setMlAttendance] = useState(88);
  const [mlCgpa, setMlCgpa] = useState(8.4);

  // Bhashini state
  const [bhashiniLang, setBhashiniLang] = useState('Tamil');
  const [voicePlaying, setVoicePlaying] = useState(false);

  // Trigger Face-RD Biometric Animation
  const startFaceRdScan = () => {
    setFaceRdStage('scanning');
    setFaceProgress(20);
    setTimeout(() => {
      setFaceRdStage('blink');
      setFaceProgress(55);
    }, 1200);
    setTimeout(() => {
      setFaceRdStage('matching');
      setFaceProgress(85);
    }, 2400);
    setTimeout(() => {
      setFaceRdStage('verified');
      setFaceProgress(100);
    }, 3600);
  };

  // Reset Face-RD
  const resetFaceRd = () => {
    setFaceRdStage('idle');
    setFaceProgress(0);
  };

  // Trigger DigiLocker pull
  const handleDigiPull = () => {
    setDigiStage('connecting');
    setTimeout(() => setDigiStage('fetched'), 1500);
  };

  // Trigger AI OCR Scan
  const handleOcrScan = () => {
    setOcrStage('scanning');
    setTimeout(() => setOcrStage('verified'), 1600);
  };

  // Trigger PFMS DBT Transfer
  const handleDbtTransfer = () => {
    setDbtStage('submitting');
    setTimeout(() => setDbtStage('disbursed'), 1800);
  };

  // Trigger Blockchain Query
  const handleBlockchainCheck = () => {
    setBcStage('verifying');
    setTimeout(() => setBcStage('confirmed'), 1500);
  };

  // Calculate ML renewal risk
  const calculateRenewalRisk = () => {
    let score = 100;
    if (mlAttendance < 75) score -= 40;
    else if (mlAttendance < 80) score -= 15;

    if (mlCgpa < 7.0) score -= 45;
    else if (mlCgpa < 7.5) score -= 20;

    const probability = Math.max(10, Math.min(99, score));
    return {
      probability,
      status: probability >= 80 ? 'Safe Scholar' : probability >= 60 ? 'Moderate Risk' : 'High Dropout Risk',
      color: probability >= 80 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : probability >= 60 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-rose-600 bg-rose-50 border-rose-200'
    };
  };

  const mlResult = calculateRenewalRisk();

  const bhashiniPhrases = {
    Tamil: {
      studentQuery: 'பிரகதி உதவித்தொகைக்கு எவ்வளவு வருகை சதவீதம் தேவை?',
      translation: '"How much attendance is required for Pragati Scholarship?"',
      tomAnswer: 'பிரகதி திட்டத்திற்கு குறைந்தபட்சம் 75% கல்லூரி வருகை மற்றும் 8.0 CGPA அவசியம்.'
    },
    Hindi: {
      studentQuery: 'प्रगति छात्रवृत्ति के लिए न्यूनतम उपस्थिति कितनी चाहिए?',
      translation: '"What is the minimum attendance for Pragati Scholarship?"',
      tomAnswer: 'प्रगति छात्रवृत्ति के लिए न्यूनतम 75% उपस्थिति और 8.0 CGPA आवश्यक है।'
    },
    Telugu: {
      studentQuery: 'ప్రగతి స్కాలర్‌షిప్ కోసం ఎంత హాజరు శాతం అవసరం?',
      translation: '"How much attendance is needed for Pragati Scholarship?"',
      tomAnswer: 'ప్రగతి పథకానికి కనీసం 75% కళాశాల హాజరు మరియు 8.0 CGPA అవసరం.'
    },
    Bengali: {
      studentQuery: 'প্রগতি স্কলারশিপের জন্য কত শতাংশ উপস্থিতি প্রয়োজন?',
      translation: '"How much attendance percentage is required for Pragati Scholarship?"',
      tomAnswer: 'প্রগতি স্কলারশিপের জন্য ন্যূনতম ৭৫% উপস্থিতি এবং ৮.০ সিজিপিএ প্রয়োজন।'
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-amber-500 animate-pulse" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Live Viva &amp; Sandbox Simulator
          </h4>
        </div>
        <span className="text-[10px] font-mono bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded border border-blue-200">
          Interactive Architecture Demo
        </span>
      </div>

      {/* MODULE 7: PWA with Face-RD Biometrics */}
      {moduleId === 'pwa-biometrics' && (
        <div className="space-y-4 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 text-xs">
          {/* Top PWA Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Service Worker</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active (Scope: /)</span>
              </div>
              <span className="text-[10px] text-slate-400 block">sw.js v1.0 controlling clients</span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Offline Rule Engine</span>
              <div className="text-amber-400 font-bold flex items-center gap-1">
                <Database className="size-3.5" />
                <span>82 Schemes Cached</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Stale-While-Revalidate Cache</span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Network Mode</span>
              <div className={`font-bold flex items-center gap-1.5 ${effectiveOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                {effectiveOnline ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5 animate-pulse" />}
                <span>{effectiveOnline ? 'Online (Connected)' : 'Offline Simulation Active'}</span>
              </div>
              <button
                onClick={toggleSimulateOffline}
                className="mt-1 text-[10px] text-amber-300 hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                {isSimulatedOffline ? '➜ Reconnect Online' : '➜ Simulate Rural Low-Bandwidth'}
              </button>
            </div>
          </div>

          {/* UIDAI Face-RD Biometric Scanner Section */}
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScanFace className="size-4 text-indigo-400" />
                <span className="font-bold text-slate-200">UIDAI Face-RD Biometric Liveness Verification</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Standard Camera • Zero Hardware Needed</span>
            </div>

            {/* Camera Viewport Simulation */}
            <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[170px] overflow-hidden">
              {faceRdStage === 'idle' && (
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                    <Camera className="size-7" />
                  </div>
                  <p className="text-slate-400 text-xs">
                    Position your face within the optical oval frame for anti-spoofing liveness verification.
                  </p>
                  <button
                    onClick={startFaceRdScan}
                    className="btn-primary text-xs py-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer"
                  >
                    Start Face-RD Scan
                  </button>
                </div>
              )}

              {faceRdStage === 'scanning' && (
                <div className="text-center space-y-3 animate-pulse">
                  <div className="relative w-24 h-28 rounded-full border-2 border-indigo-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                    <ScanFace className="size-12 text-indigo-400" />
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-300 animate-bounce"></div>
                  </div>
                  <p className="text-indigo-300 font-semibold text-xs">
                    Initializing IR liveness detector &amp; computing 128 facial landmarks...
                  </p>
                </div>
              )}

              {faceRdStage === 'blink' && (
                <div className="text-center space-y-3">
                  <div className="w-24 h-28 rounded-full border-2 border-amber-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                    <Eye className="size-12 text-amber-400 animate-ping" />
                  </div>
                  <p className="text-amber-300 font-semibold text-xs">
                    Liveness Challenge: Natural eye blink and head motion verified!
                  </p>
                </div>
              )}

              {faceRdStage === 'matching' && (
                <div className="text-center space-y-3">
                  <div className="w-24 h-28 rounded-full border-2 border-blue-400 flex items-center justify-center mx-auto">
                    <Fingerprint className="size-12 text-blue-400 animate-spin" />
                  </div>
                  <p className="text-blue-300 font-semibold text-xs">
                    Querying UIDAI Central Aadhaar Biometric Vault (1:1 Matching)...
                  </p>
                </div>
              )}

              {faceRdStage === 'verified' && (
                <div className="text-center space-y-3 animate-fadeIn">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                    <CheckCircle2 className="size-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-emerald-300 font-bold text-sm">
                      UIDAI Liveness Verified: 99.4% Biometric Confidence Match
                    </p>
                    <p className="text-[11px] text-slate-300 font-mono">
                      Applicant: Aravind Swaminathan | Token: #RD-2026-X849102-UIDAI
                    </p>
                  </div>
                  <button
                    onClick={resetFaceRd}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer mt-1"
                  >
                    Run Test Again
                  </button>
                </div>
              )}
            </div>

            {/* Installation Button */}
            {canInstall && (
              <div className="flex items-center justify-between bg-indigo-950/60 p-3 rounded-lg border border-indigo-800">
                <span className="text-indigo-200">Progressive Web App installation available on this device:</span>
                <button
                  onClick={installApp}
                  className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-1 rounded text-xs font-bold cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Install App</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 1: DigiLocker & APAAR */}
      {moduleId === 'digilocker' && (
        <div className="space-y-4 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200">DigiLocker &amp; APAAR Single-Click Pull Simulator</span>
            {digiStage === 'fetched' && (
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">
                Cryptographically Signed X.509
              </span>
            )}
          </div>

          {digiStage === 'idle' && (
            <div className="text-center py-6 space-y-3">
              <p className="text-slate-400 max-w-md mx-auto">
                Authenticate with DigiLocker to pull verified marksheets, income certificate, and Academic Bank of Credits (ABC) data directly.
              </p>
              <button
                onClick={handleDigiPull}
                className="btn-primary text-xs py-2 px-5 bg-blue-600 hover:bg-blue-500 shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <FileCheck2 className="size-4" />
                <span>Simulate DigiLocker OAuth Pull</span>
              </button>
            </div>
          )}

          {digiStage === 'connecting' && (
            <div className="text-center py-8 space-y-2">
              <div className="animate-spin size-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-blue-300 font-semibold">Authorizing OAuth 2.0 PKCE Handshake with National Gateway...</p>
            </div>
          )}

          {digiStage === 'fetched' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">State Revenue Dept</span>
                  <div className="font-bold text-white">Income Certificate #TN-2026-40291</div>
                  <div className="text-emerald-400 text-[11px]">₹2,20,000/year (Signed by Tehsildar)</div>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Academic Bank of Credits</span>
                  <div className="font-bold text-white">Anna University Transcript</div>
                  <div className="text-emerald-400 text-[11px]">8.4 CGPA • 124 Credits • 0 Backlogs</div>
                </div>
              </div>
              <div className="p-3 bg-emerald-950/60 rounded-lg border border-emerald-800 flex items-center justify-between">
                <span className="text-emerald-300 font-medium">Verification Velocity: Sub-second (0.42s turnaround vs 5 days manual)</span>
                <button onClick={() => setDigiStage('idle')} className="text-slate-400 hover:text-white underline text-[11px] cursor-pointer">
                  Reset Demo
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODULE 2: AI OCR & Tamper Detection */}
      {moduleId === 'ai-ocr' && (
        <div className="space-y-4 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200">Computer Vision Error Level Analysis (ELA) &amp; OCR Engine</span>
            {ocrStage === 'verified' && (
              <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[10px] font-mono">
                Audit Status: 100% Authentic
              </span>
            )}
          </div>

          {ocrStage === 'idle' && (
            <div className="text-center py-6 space-y-3">
              <p className="text-slate-400 max-w-md mx-auto">
                Scan legacy scanned certificates for clone-stamp tampering, font interpolation, and optical stamp forging.
              </p>
              <button
                onClick={handleOcrScan}
                className="btn-primary text-xs py-2 px-5 bg-purple-600 hover:bg-purple-500 shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <ShieldCheck className="size-4" />
                <span>Simulate AI Document Authenticity Scan</span>
              </button>
            </div>
          )}

          {ocrStage === 'scanning' && (
            <div className="text-center py-8 space-y-2">
              <div className="animate-spin size-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-purple-300 font-semibold">Performing Convolutional Neural Network (CNN) Artifact Inspection...</p>
            </div>
          )}

          {ocrStage === 'verified' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-bold">Tamper Score</span>
                  <span className="text-emerald-400 font-bold text-sm">0.0% Clean</span>
                </div>
                <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-bold">Seal Authenticity</span>
                  <span className="text-emerald-400 font-bold text-sm">99.2% Genuine</span>
                </div>
                <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-bold">OCR Match</span>
                  <span className="text-emerald-400 font-bold text-sm">100% String Match</span>
                </div>
              </div>
              <p className="text-slate-300 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 text-[11px]">
                Name ("Aravind Swaminathan"), CGPA (8.4), and College Stamp verified with zero disparity flags against government templates.
              </p>
              <button onClick={() => setOcrStage('idle')} className="text-slate-400 hover:text-white underline text-[11px] cursor-pointer">
                Reset Demo
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODULE 3: PFMS DBT Disbursal */}
      {moduleId === 'pfms-dbt' && (
        <div className="space-y-4 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200">Public Financial Management System (PFMS) Direct Benefit Pipeline</span>
            {dbtStage === 'disbursed' && (
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">
                UTR Confirmed
              </span>
            )}
          </div>

          {dbtStage === 'idle' && (
            <div className="text-center py-6 space-y-3">
              <p className="text-slate-400 max-w-md mx-auto">
                Transmit approved scholarship sanction scroll via mutual TLS directly to PFMS and NPCI Aadhaar Payment Bridge.
              </p>
              <button
                onClick={handleDbtTransfer}
                className="btn-primary text-xs py-2 px-5 bg-emerald-600 hover:bg-emerald-500 shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <Landmark className="size-4" />
                <span>Simulate PFMS Direct Benefit Transfer</span>
              </button>
            </div>
          )}

          {dbtStage === 'submitting' && (
            <div className="text-center py-8 space-y-2">
              <div className="animate-spin size-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-emerald-300 font-semibold">Validating NPCI Aadhaar Mapping &amp; Scheduling Treasury Disbursal...</p>
            </div>
          )}

          {dbtStage === 'disbursed' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">Direct Benefit Transfer Credited: ₹50,000</span>
                  <span className="font-mono text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                    Stage: Disbursed
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                  <div>• Bank: State Bank of India (Aadhaar Seeded Active)</div>
                  <div>• PFMS Scroll ID: SCROLL-2026-NSP-849201</div>
                  <div>• Bank UTR Number: <strong className="text-amber-300">SBI94829104829</strong></div>
                </div>
              </div>
              <button onClick={() => setDbtStage('idle')} className="text-slate-400 hover:text-white underline text-[11px] cursor-pointer">
                Reset Demo
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODULE 4: Blockchain Dual-Disbursement Prevention */}
      {moduleId === 'blockchain' && (
        <div className="space-y-4 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200">Hyperledger Consortium Smart Contract Dual-Claim Prevention</span>
            {bcStage === 'confirmed' && (
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono">
                Zero Double-Dip Conflict
              </span>
            )}
          </div>

          {bcStage === 'idle' && (
            <div className="text-center py-6 space-y-3">
              <p className="text-slate-400 max-w-md mx-auto">
                Execute cross-registry smart contract to verify student has not claimed concurrent full scholarships across state and central bodies.
              </p>
              <button
                onClick={handleBlockchainCheck}
                className="btn-primary text-xs py-2 px-5 bg-amber-600 hover:bg-amber-500 shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <Blocks className="size-4" />
                <span>Simulate Smart Contract Query</span>
              </button>
            </div>
          )}

          {bcStage === 'verifying' && (
            <div className="text-center py-8 space-y-2">
              <div className="animate-spin size-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-amber-300 font-semibold">Executing Chaincode hasActiveFullAward[studentHash][2026]...</p>
            </div>
          )}

          {bcStage === 'confirmed' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 font-mono text-[11px] space-y-1.5">
                <div className="text-emerald-400 font-bold">✔ Contract Execution: SUCCESS</div>
                <div>Hash: 0x8f4d92a104cb88921e42a94019bfac09</div>
                <div>Active State Awards: 0 (No concurrent claims found)</div>
                <div>Block Height: #1,849,204 | Timestamp: Just now</div>
              </div>
              <button onClick={() => setBcStage('idle')} className="text-slate-400 hover:text-white underline text-[11px] cursor-pointer">
                Reset Demo
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODULE 5: Predictive ML Dropout Warning */}
      {moduleId === 'predictive-ml' && (
        <div className="space-y-4 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200">ML Gradient Boosted Tree Early Warning Model</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${mlResult.color}`}>
              {mlResult.status} ({mlResult.probability}%)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">College Attendance:</span>
                <span className="font-bold text-amber-400">{mlAttendance}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={mlAttendance}
                onChange={(e) => setMlAttendance(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Threshold: ≥ 75% required</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Semester CGPA:</span>
                <span className="font-bold text-amber-400">{mlCgpa}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="10.0"
                step="0.1"
                value={mlCgpa}
                onChange={(e) => setMlCgpa(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Threshold: ≥ 7.5 CGPA required</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border text-xs ${mlResult.color}`}>
            {mlResult.probability >= 80 ? (
              <p className="font-medium">
                Scholar is progressing on track. High probability of seamless annual renewal without intervention.
              </p>
            ) : mlResult.probability >= 60 ? (
              <p className="font-medium">
                ⚠️ Marginal risk warning: Automated SMS sent to student advising remedial tutoring to safeguard scholarship renewal.
              </p>
            ) : (
              <p className="font-medium">
                🚨 Critical Dropout Risk: Proactive nodal officer intervention triggered; bridge emergency aid recommended.
              </p>
            )}
          </div>
        </div>
      )}

      {/* MODULE 6: Bhashini Multilingual AI */}
      {moduleId === 'bhashini' && (
        <div className="space-y-4 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200">Bhashini Multilingual Conversational AI Simulator</span>
            <div className="flex items-center gap-1">
              {['Tamil', 'Hindi', 'Telugu', 'Bengali'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setBhashiniLang(lang)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    bhashiniLang === lang ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
            <div className="space-y-1">
              <span className="text-[10px] text-cyan-400 uppercase font-bold">Student Spoken Voice Prompt ({bhashiniLang})</span>
              <p className="text-sm font-semibold text-white">
                "{bhashiniPhrases[bhashiniLang].studentQuery}"
              </p>
              <p className="text-[11px] text-slate-400 italic">
                NLU Translation: {bhashiniPhrases[bhashiniLang].translation}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-700/80 space-y-1">
              <span className="text-[10px] text-emerald-400 uppercase font-bold">Synthesized Voice Response</span>
              <p className="text-xs text-slate-200 leading-relaxed">
                "{bhashiniPhrases[bhashiniLang].tomAnswer}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
