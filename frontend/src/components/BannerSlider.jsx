import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  IndianRupee, 
  Clock, 
  ArrowRight, 
  GraduationCap,
  Scale,
  Zap,
  CheckCircle2
} from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: 'AY 2026-2027 NATIONWIDE ADMISSION & SCHOLARSHIP WINDOW',
    tagColor: 'bg-amber-400 text-slate-950',
    title: 'India’s Unified Portal for 82 Active Scholarships',
    highlight: '₹500+ Cr Disbursal Pool',
    description: 'Direct access to Central, State, Merit, Need-Based, and Corporate CSR schemes. Zero application fee, transparent eligibility criteria.',
    ctaPrimary: { label: 'Explore 82 Schemes', link: '/scholarships' },
    ctaSecondary: { label: 'Check Eligibility', link: '/eligibility' },
    gradient: 'from-[#0a1931] via-[#152e59] to-[#1e3c72]',
    accentColor: '#38bdf8',
    badge: '100% Verified Schemes',
    stats: [
      { label: 'Active Schemes', value: '82' },
      { label: 'Max Annual Grant', value: '₹2,50,000' },
      { label: 'Disbursal Pipeline', value: 'PFMS DBT' }
    ]
  },
  {
    id: 2,
    tag: 'DIGITAL PUBLIC INFRASTRUCTURE (DPI) ENABLED',
    tagColor: 'bg-emerald-400 text-slate-950',
    title: '100% Aadhaar-Seeded Direct Benefit Transfer (DBT)',
    highlight: 'Zero Leakage Guarantee',
    description: 'Sanctioned funds are credited straight into your bank account through the Public Financial Management System (PFMS). No intermediaries.',
    ctaPrimary: { label: 'Track Application Status', link: '/student/dashboard' },
    ctaSecondary: { label: 'Officer Desk Login', link: '/login?tab=admin' },
    gradient: 'from-[#06241b] via-[#0d3f32] to-[#14532d]',
    accentColor: '#34d399',
    badge: 'PFMS Validated',
    stats: [
      { label: 'Avg Disbursal Time', value: '14 Days' },
      { label: 'Aadhaar Verification', value: 'Instant' },
      { label: 'Success Rate', value: '98.4%' }
    ]
  },
  {
    id: 3,
    tag: 'AI-POWERED SCHOLARSHIP MATCHING ENGINE',
    tagColor: 'bg-purple-400 text-slate-950',
    title: 'Meet "TOM" — Your 24/7 AI Scholarship Advisor',
    highlight: 'Instant Profile Evaluation',
    description: 'Input your 12th percentage, CGPA, attendance, and family income ceiling. Our multi-tier rule engine calculates your match percentage across all 82 schemes in 30 seconds.',
    ctaPrimary: { label: 'Run AI Eligibility Match', link: '/eligibility' },
    ctaSecondary: { label: 'Compare Schemes Matrix', link: '/compare' },
    gradient: 'from-[#1e1138] via-[#2d1b54] to-[#4c1d95]',
    accentColor: '#c084fc',
    badge: 'TOM AI Active',
    stats: [
      { label: 'Rule Verification', value: 'Multi-Tier' },
      { label: 'Match Accuracy', value: '100%' },
      { label: 'Instant Feedback', value: '< 1 sec' }
    ]
  },
  {
    id: 4,
    tag: 'URGENT: CLOSING WINDOW REMINDER',
    tagColor: 'bg-rose-500 text-white',
    title: 'Scholarship Renewal Re-Verification Desk Open',
    highlight: 'Re-Verify in 2 Minutes',
    description: 'Continuing students do not need to fill fresh applications. Just re-verify your current semester marks and attendance to secure continuing disbursal.',
    ctaPrimary: { label: 'Re-Verify for Renewal', link: '/student/renewal' },
    ctaSecondary: { label: 'View Expiring Schemes', link: '/scholarships?status=closing_soon' },
    gradient: 'from-[#2e0b12] via-[#4c121e] to-[#881337]',
    accentColor: '#fb7185',
    badge: 'Window Closing Soon',
    stats: [
      { label: 'Renewal Schemes', value: '38 Active' },
      { label: 'Required Uploads', value: '2 Docs Only' },
      { label: 'Expiring In', value: '5 Days' }
    ]
  }
];

export default function FlipkartBannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = SLIDES[currentSlide];

  return (
    <div 
      className="relative overflow-hidden shadow-xl rounded-2xl mx-4 sm:mx-6 lg:mx-auto max-w-7xl my-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Gradient & Animated Glow */}
      <div className={`bg-gradient-to-r ${slide.gradient} text-white p-6 sm:p-10 lg:p-12 transition-all duration-700 relative min-h-[360px] sm:min-h-[380px] flex flex-col justify-between`}>
        {/* Decorative Grid and Ambient Light */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(${slide.accentColor} 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Content Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs ${slide.tagColor}`}>
                {slide.tag}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-xs border border-white/10">
                <ShieldCheck className="size-3.5 text-amber-400" />
                {slide.badge}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {slide.title} <br className="hidden sm:inline" />
              <span className="text-amber-300 underline decoration-amber-400/50 decoration-wavy decoration-2">
                {slide.highlight}
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              {slide.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={slide.ctaPrimary.link}
                className="bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
              >
                <span>{slide.ctaPrimary.label}</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to={slide.ctaSecondary.link}
                className="bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-semibold px-5 py-3 rounded-xl text-sm border border-white/25 backdrop-blur-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{slide.ctaSecondary.label}</span>
              </Link>
            </div>
          </div>

          {/* Right Stats Card (Flipkart Trust Grid) */}
          <div className="lg:col-span-4 hidden lg:flex flex-col gap-3 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300">National Key Metrics</span>
              <Zap className="size-4 text-amber-400 animate-bounce" />
            </div>
            {slide.stats.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-xs text-slate-300">{s.label}</span>
                <span className="text-sm font-bold text-amber-300 font-mono">{s.value}</span>
              </div>
            ))}
            <div className="pt-2 text-[11px] text-slate-300/80 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>Audited under National Education Mission</span>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Bar (Flipkart Dots & Arrows) */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 mt-6">
          {/* Slide Dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentSlide === i 
                    ? 'w-8 h-2.5 bg-amber-400' 
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
                title={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
              className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all cursor-pointer backdrop-blur-xs border border-white/20"
              title="Previous banner"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
              className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all cursor-pointer backdrop-blur-xs border border-white/20"
              title="Next banner"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
