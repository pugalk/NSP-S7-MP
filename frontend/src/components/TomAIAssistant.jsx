import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { api } from '../services/api';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  FileText, 
  RefreshCw, 
  Clock, 
  User, 
  Building2,
  HelpCircle,
  MessageSquare,
  Scale,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function TomAIAssistant() {
  const { profile, scholarships, signedIn, addToCompare, isInCompare } = usePortal();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'tom',
      text: `Hello! I'm **TOM** — your personal AI Scholarship & Eligibility Advisor. 🎓\n\nAsk me anything! Type your **marks/percentage**, **CGPA**, **course**, **state**, or ask about **specific schemes** (e.g. Pragati, KVPY, Central Sector, Renewal).`,
      schemes: [],
      suggestedActions: [
        { label: '🌟 Recommend for my profile', query: 'Recommend scholarships for my profile' },
        { label: '🎯 "I scored 78% in 12th"', query: 'Which scholarships can I get with 78% marks?' },
        { label: '🔄 How does renewal work?', query: 'How does scholarship renewal re-verification work?' },
        { label: '🏆 Highest grant schemes', query: 'What are the highest scholarship amounts available?' }
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Comprehensive Client-side Fallback & Offline NLP Engine
  const generateOfflineTomReply = (userQuery) => {
    const originalQ = (userQuery || '').trim();
    const q = originalQ.toLowerCase();
    const matchedSchemes = [];
    let suggestedActions = [];
    let reply = '';

    const userCourse = (profile.course || 'B.Tech').toLowerCase();
    const userState = profile.state || 'Tamil Nadu';
    const userCgpa = parseFloat(profile.cgpa || '8.4');
    const userIncome = parseFloat(profile.familyIncome || '220000');
    const userName = profile.fullName ? profile.fullName.split(' ')[0] : 'Student';

    // 1. Greetings
    if (/^(hi|hello|hey|namaste|hola|good morning|good evening)\b/i.test(q)) {
      reply = `Hello **${userName}**! 🎓 How can I help you today?\n\nYou can ask me:\n• *"Which scholarships can I get with 75% marks?"*\n• *"Show me engineering scholarships in ${userState}"*\n• *"How do I renew my scholarship?"*\n• *"Are there any schemes for female students?"*`;
      suggestedActions = [
        { label: 'Recommend for my profile', query: 'Recommend scholarships for my profile' },
        { label: 'Highest grant schemes', query: 'What are the highest scholarship amounts?' },
        { label: 'Renewal desk guide', query: 'How does scholarship renewal work?' }
      ];
      return { reply, schemes: [], suggestedActions };
    }

    // 2. Specific Scheme Lookup
    const schemeByName = scholarships.find(s => {
      const sName = s.name.toLowerCase();
      const sCode = s.code.toLowerCase();
      if (q.includes('pragati') && sName.includes('pragati')) return true;
      if (q.includes('saksham') && sName.includes('saksham')) return true;
      if (q.includes('kvpy') && (sName.includes('kvpy') || sName.includes('kishore'))) return true;
      if (q.includes('inspire') && sName.includes('inspire')) return true;
      if (q.includes('swarnajayanti') && sName.includes('swarnajayanti')) return true;
      if (q.includes('begum hazrat') && sName.includes('begum hazrat')) return true;
      if (q.includes('central sector') && sName.includes('central sector')) return true;
      if (q.includes('post matric') && (sName.includes('post matric') || sName.includes('post-matric'))) return true;
      if (q.includes('tata') && sName.includes('tata')) return true;
      if (q.includes('hdfc') && sName.includes('hdfc')) return true;
      if (q.includes('national merit') && sName.includes('national merit')) return true;
      if (sCode === q || q.includes(sCode)) return true;
      return false;
    });

    if (schemeByName) {
      const s = schemeByName;
      reply = `### 🏛️ Scheme Overview: **${s.name}**\n\n` +
        `• **Code:** \`${s.code}\`\n` +
        `• **Agency:** ${s.provider}\n` +
        `• **Annual Grant:** **${formatCurrency(s.amount)} / year** (100% PFMS DBT)\n` +
        `• **Category:** ${s.category}\n` +
        `• **Cut-off:** ${s.minPercentage ? `≥ ${s.minPercentage}% marks` : 'Pass marks'} ${s.minCgpa ? `(≥ ${s.minCgpa} CGPA)` : ''}\n` +
        `• **Income Limit:** ${s.maxFamilyIncome ? `≤ ${formatCurrency(s.maxFamilyIncome)}/yr` : 'No income ceiling'}\n` +
        `• **Deadline:** ${formatDate(s.closingDate)}\n\n` +
        `**Description:** ${s.description}`;

      matchedSchemes.push(s);
      suggestedActions = [
        { label: 'Apply Now', path: `/student/apply/${s.id}` },
        { label: 'Check Match Score', path: `/eligibility?scheme=${s.id}` },
        { label: 'Compare Scheme', path: '/compare' }
      ];
      return { reply, schemes: matchedSchemes, suggestedActions };
    }

    // 3. Highest / Top Schemes
    if (q.includes('highest') || q.includes('max amount') || q.includes('most money') || q.includes('top grant') || q.includes('best scholarship')) {
      const top = [...scholarships].sort((a, b) => b.amount - a.amount).slice(0, 3);
      reply = `### 💰 Highest-Grant Scholarships\n\nHere are top funding opportunities for AY 2026-27:\n\n` +
        top.map((s, idx) => `**${idx + 1}. [${s.code}] ${s.name}**\n• Grant: **${formatCurrency(s.amount)} / year**\n• Agency: ${s.provider}\n• Cut-off: Min ${s.minPercentage || 70}% marks`).join('\n\n');
      matchedSchemes.push(...top);
      suggestedActions = [
        { label: 'Compare Top Schemes', path: '/compare' },
        { label: 'View All Schemes', path: '/scholarships' }
      ];
      return { reply, schemes: matchedSchemes, suggestedActions };
    }

    // 4. Numerical Marks Extraction
    const pctMatch = q.match(/(\d{1,2}(?:\.\d{1,2})?)\s*(?:%|percent|percentage|marks)/i);
    if (pctMatch) {
      const score = parseFloat(pctMatch[1]);
      const qual = scholarships.filter(s => s.active && (!s.minPercentage || score >= s.minPercentage)).slice(0, 3);
      reply = `### 🎯 Scholarships Matching: **${score}% Marks**\n\nWith **${score}%**, you meet cut-off criteria for **${scholarships.filter(s => !s.minPercentage || s.minPercentage <= score).length} schemes**!\n\n` +
        qual.map((s, idx) => `**${idx + 1}. ${s.name}** (\`${s.code}\`)\n• Grant: **${formatCurrency(s.amount)}/yr**\n• Required: ${s.minPercentage ? `≥ ${s.minPercentage}% (Qualifies! ✅)` : 'Open'}`).join('\n\n');
      matchedSchemes.push(...qual);
      suggestedActions = [
        { label: 'Run Full Eligibility Check', path: '/eligibility' },
        { label: 'Explore Catalog', path: '/scholarships' }
      ];
      return { reply, schemes: matchedSchemes, suggestedActions };
    }

    // 5. Numerical CGPA Extraction
    const cgMatch = q.match(/(\d(?:\.\d{1,2})?)\s*(?:cgpa|gpa|pointer)/i);
    if (cgMatch) {
      const cg = parseFloat(cgMatch[1]);
      const qualCg = scholarships.filter(s => s.active && (!s.minCgpa || cg >= s.minCgpa)).slice(0, 3);
      reply = `### 🎓 Scholarships for **${cg} CGPA**\n\nWith a **${cg} CGPA**, you satisfy requirements across **${scholarships.filter(s => !s.minCgpa || s.minCgpa <= cg).length} schemes**!\n\n` +
        qualCg.map((s, idx) => `**${idx + 1}. ${s.name}**\n• Grant: **${formatCurrency(s.amount)}/year**\n• Min CGPA: ${s.minCgpa || 'None'}`).join('\n\n');
      matchedSchemes.push(...qualCg);
      suggestedActions = [
        { label: 'Check Eligibility', path: '/eligibility' },
        { label: 'Open Student Dashboard', path: '/student/dashboard' }
      ];
      return { reply, schemes: matchedSchemes, suggestedActions };
    }

    // 6. Renewal Re-verification
    if (q.includes('renew') || q.includes('promotion') || q.includes('previous scholarship')) {
      reply = `### 🔄 Scholarship Renewal Re-Verification Guide\n\n` +
        `Existing beneficiaries do **NOT** fill a fresh application!\n\n` +
        `1. **Enter Previous ID**: Reference your prior award number (e.g. \`NSP-2025-419201\`).\n` +
        `2. **Upload 2 Documents**: Current year grade sheet & college attendance bonafide (≥ 75%).\n` +
        `3. **Fast-Track Approval**: The rule engine verifies promotion criteria and sends to finance for continuing DBT!`;
      suggestedActions = [
        { label: 'Go to Renewal Desk', path: '/student/renewal' },
        { label: 'View Dashboard', path: '/student/dashboard' }
      ];
      return { reply, schemes: [], suggestedActions };
    }

    // 7. Documents Checklist
    if (q.includes('document') || q.includes('certificate') || q.includes('upload') || q.includes('proof')) {
      reply = `### 📄 Mandatory Documents Checklist\n\n` +
        `• **Aadhaar Card** (UIDAI verified for DBT)\n` +
        `• **Qualifying Marksheet** (Marks / CGPA proof)\n` +
        `• **Revenue Income Certificate** (Tehsildar issued)\n` +
        `• **College Bonafide Certificate** (Enrollment & attendance)\n` +
        `• **Aadhaar-Seeded Bank Passbook** (PFMS direct credit)\n` +
        `• **Caste / Community Certificate** (For SC/ST/OBC/Minority schemes)\n\n` +
        `*Accepted formats: PDF, JPG, PNG up to 10MB each.*`;
      suggestedActions = [
        { label: 'Open Document Vault', path: '/student/dashboard' },
        { label: 'Check Eligibility Rules', path: '/eligibility' }
      ];
      return { reply, schemes: [], suggestedActions };
    }

    // 8. Tracking, DBT & PFMS
    if (q.includes('track') || q.includes('status') || q.includes('pfms') || q.includes('dbt') || q.includes('disburs')) {
      reply = `### 🏛️ 5-Stage Verification Pipeline\n\n` +
        `1. **Submitted** ➔ Registered successfully.\n` +
        `2. **Document Verification** ➔ Nodal Officer screens marksheets & attendance.\n` +
        `3. **Under Verification** ➔ District & State clearance.\n` +
        `4. **Provider Review** ➔ Trust/Ministry sanction clearance.\n` +
        `5. **Approved & Disbursed** ➔ Credited straight to bank account via **PFMS DBT**!`;
      suggestedActions = [
        { label: 'Open Live Tracker', path: '/student/dashboard' }
      ];
      return { reply, schemes: [], suggestedActions };
    }

    // 9. Female / Girls
    if (q.includes('girl') || q.includes('women') || q.includes('female') || q.includes('daughter')) {
      const girls = scholarships.filter(s => s.active && (s.gender === 'Female' || s.category.toLowerCase().includes('women') || s.name.toLowerCase().includes('pragati'))).slice(0, 3);
      reply = `### 👩 Girls & Women Scholarship Opportunities\n\n` +
        girls.map((s, idx) => `**${idx + 1}. [${s.code}] ${s.name}**\n• Grant: **${formatCurrency(s.amount)}/year**\n• Agency: ${s.provider}`).join('\n\n');
      matchedSchemes.push(...girls);
      suggestedActions = [
        { label: 'View All Girls Schemes', path: '/scholarships?category=Women%20%2F%20Girls' }
      ];
      return { reply, schemes: matchedSchemes, suggestedActions };
    }

    // 10. Keyword Matcher Fallback
    const words = q.replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length >= 3);
    const scored = scholarships.map(scheme => {
      let score = 0;
      const text = `${scheme.name} ${scheme.code} ${scheme.provider} ${scheme.category} ${scheme.description}`.toLowerCase();
      words.forEach(w => { if (text.includes(w)) score++; });
      return { scheme, score };
    }).filter(i => i.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);

    if (scored.length > 0) {
      reply = `### 🔍 Schemes Matching Your Query: *"${originalQ}"*\n\n` +
        scored.map(({ scheme: s }, idx) => `**${idx + 1}. [${s.code}] ${s.name}**\n• Grant: **${formatCurrency(s.amount)} / year**\n• Category: ${s.category} | ${s.provider}`).join('\n\n');
      matchedSchemes.push(...scored.map(i => i.scheme));
      suggestedActions = [
        { label: 'View All Schemes', path: '/scholarships' },
        { label: 'Compare Schemes', path: '/compare' }
      ];
      return { reply, schemes: matchedSchemes, suggestedActions };
    }

    // Default Fallback
    reply = `I have searched the **82 active scholarship schemes** for: *"${originalQ}"*.\n\n` +
      `Tell me your **12th %**, **degree course**, **state**, or **annual family income** to calculate your exact eligible scholarships!`;
    suggestedActions = [
      { label: '🌟 Recommend for my profile', query: 'Recommend scholarships for my profile' },
      { label: 'Check 82 Schemes Catalog', path: '/scholarships' },
      { label: 'Open Compare Matrix', path: '/compare' }
    ];
    return { reply, schemes: [], suggestedActions };
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Call backend API for TOM AI
      const res = await api.chatWithTom(text, profile, messages.slice(-4));
      if (res && res.reply) {
        setMessages(prev => [
          ...prev,
          {
            id: `tom_${Date.now()}`,
            sender: 'tom',
            text: res.reply,
            schemes: res.schemes || [],
            suggestedActions: res.suggestedActions || [],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('No reply from server');
      }
    } catch {
      // Graceful local NLP fallback
      const fallback = generateOfflineTomReply(text);
      setMessages(prev => [
        ...prev,
        {
          id: `tom_${Date.now()}`,
          sender: 'tom',
          text: fallback.reply,
          schemes: fallback.schemes || [],
          suggestedActions: fallback.suggestedActions || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'tom',
        text: `Conversation cleared! 🎓 What would you like to know about scholarship schemes or renewals?`,
        schemes: [],
        suggestedActions: [
          { label: '🌟 Recommend for my profile', query: 'Recommend scholarships for my profile' },
          { label: '🎯 "I scored 78% in 12th"', query: 'Which scholarships can I get with 78% marks?' },
          { label: '🔄 How does renewal work?', query: 'How does scholarship renewal re-verification work?' }
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const renderFormattedText = (text) => {
    return text.split('\n').map((line, idx) => {
      // Markdown header 3 (###)
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-extrabold text-sm text-slate-900 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }

      // Markdown bullet point
      let content = line;
      let isBullet = false;
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        isBullet = true;
        content = line.trim().substring(2);
      }

      // Format bold, code, inline tags
      let formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<span class="font-mono bg-slate-100 text-slate-900 px-1 py-0.2 rounded border border-slate-200 text-[10px] font-bold">$1</span>');

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5">
            <span className="text-amber-500 font-bold shrink-0">•</span>
            <span 
              className="flex-1" 
              dangerouslySetInnerHTML={{ __html: formatted }} 
            />
          </div>
        );
      }

      return (
        <span 
          key={idx} 
          className="block min-h-[1.2em] my-0.5" 
          dangerouslySetInnerHTML={{ __html: formatted }} 
        />
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          {/* Subtle invitation chip */}
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-1.5 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-full shadow-lg border border-slate-700 cursor-pointer hover:bg-slate-800 transition-all group"
          >
            <Sparkles className="size-3.5 text-amber-400 animate-pulse" />
            <span className="font-semibold">Ask <strong className="text-amber-400">TOM AI</strong> (Ask Any Question)</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="relative size-14 rounded-2xl bg-gradient-to-tr from-blue-900 via-indigo-900 to-amber-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-white/20 group cursor-pointer"
            title="Chat with TOM AI Advisor"
          >
            <Bot className="size-7 text-amber-300 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 size-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
          </button>
        </div>
      )}

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[430px] h-[600px] max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md border border-amber-300/40">
                  <Bot className="size-6 text-slate-950" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-white tracking-tight">TOM AI Advisor</h3>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-400/30">
                    Live Engine
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  82 Schemes • Rules • Renewal • DBT
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleReset}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Restart Chat"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Minimize TOM"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Subheader: Active Schemes & Profile Notice */}
          <div className="px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-900 flex items-center justify-between font-medium shrink-0">
            <span className="flex items-center gap-1">
              <Sparkles className="size-3 text-amber-600" />
              <span>Trained on all 82 Central &amp; State Schemes</span>
            </span>
            {signedIn && (
              <span className="text-slate-600 font-bold truncate max-w-[150px]">
                {profile.course || 'B.Tech'} ({profile.cgpa || '8.4'} CGPA)
              </span>
            )}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/50">
            {messages.map((msg) => {
              const isTom = msg.sender === 'tom';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isTom ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-start gap-2 max-w-[90%]">
                    {isTom && (
                      <div className="size-7 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs font-bold text-[10px] mt-0.5">
                        <Bot className="size-4" />
                      </div>
                    )}

                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed shadow-2xs ${
                        isTom
                          ? 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                          : 'bg-blue-900 text-white rounded-tr-xs'
                      }`}
                    >
                      {renderFormattedText(msg.text)}

                      {/* Matching Schemes Cards with View & Apply buttons */}
                      {msg.schemes && msg.schemes.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Direct Matched Schemes ({msg.schemes.length}):
                          </span>
                          {msg.schemes.map((s) => {
                            const inComp = isInCompare(s.id);
                            return (
                              <div 
                                key={s.id} 
                                className="p-2.5 bg-slate-50 hover:bg-amber-50/50 rounded-xl border border-slate-200/80 transition-colors flex items-center justify-between gap-2"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-900 truncate block text-[11px]">
                                      {s.name}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-emerald-700 font-extrabold font-mono block">
                                    {formatCurrency(s.amount)} / year • {s.category}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => {
                                      setIsOpen(false);
                                      navigate(`/scholarships/${s.id}`);
                                    }}
                                    className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-700 cursor-pointer"
                                  >
                                    Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      setIsOpen(false);
                                      navigate(`/student/apply/${s.id}`);
                                    }}
                                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 py-1 px-2.5 rounded-lg text-[10px] font-extrabold cursor-pointer shadow-xs"
                                  >
                                    Apply
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Suggested Action Buttons */}
                      {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="mt-3 pt-2 flex flex-wrap gap-1.5">
                          {msg.suggestedActions.map((action, actIdx) => (
                            <button
                              key={actIdx}
                              onClick={() => {
                                if (action.query) {
                                  handleSendMessage(action.query);
                                } else if (action.path) {
                                  setIsOpen(false);
                                  navigate(action.path);
                                }
                              }}
                              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-900 border border-slate-200 text-slate-700 font-semibold text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>{action.label}</span>
                              <ChevronRight className="size-2.5" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <div className="size-7 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center shrink-0">
                  <Bot className="size-4 animate-spin" />
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 text-slate-500 flex items-center gap-1.5 shadow-2xs">
                  <span className="size-1.5 bg-blue-900 rounded-full animate-bounce" />
                  <span className="size-1.5 bg-blue-900 rounded-full animate-bounce delay-100" />
                  <span className="size-1.5 bg-blue-900 rounded-full animate-bounce delay-200" />
                  <span className="text-[11px] ml-1">TOM is querying 82 schemes for you...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips Bar */}
          <div className="px-3 py-1.5 bg-slate-100/80 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[10px]">
            <span className="text-slate-400 shrink-0 font-medium">Try asking:</span>
            <button
              type="button"
              onClick={() => handleSendMessage('Which scholarships can I get with 75% marks?')}
              className="bg-white hover:bg-slate-200 border border-slate-200 rounded-full px-2 py-0.5 whitespace-nowrap text-slate-700 cursor-pointer"
            >
              "75% marks"
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Show me top engineering scholarships')}
              className="bg-white hover:bg-slate-200 border border-slate-200 rounded-full px-2 py-0.5 whitespace-nowrap text-slate-700 cursor-pointer"
            >
              "Engineering schemes"
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Tell me about AICTE Pragati scholarship')}
              className="bg-white hover:bg-slate-200 border border-slate-200 rounded-full px-2 py-0.5 whitespace-nowrap text-slate-700 cursor-pointer"
            >
              "Pragati scheme"
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('What is the deadline for scholarship renewal?')}
              className="bg-white hover:bg-slate-200 border border-slate-200 rounded-full px-2 py-0.5 whitespace-nowrap text-slate-700 cursor-pointer"
            >
              "Renewal deadline"
            </button>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask TOM: marks, CGPA, state, income, scheme names..."
              className="bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 text-xs flex-1 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 transition-all placeholder:text-slate-400"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="p-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-amber-300 font-bold transition-all shadow-xs cursor-pointer"
              title="Send to TOM"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
