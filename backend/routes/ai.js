import express from 'express';
import { getScholarships } from './scholarships.js';

const router = express.Router();

/**
 * AI Assistant "TOM" - Advanced Conversational Scholarship & Eligibility Engine
 * Parses user input to extract criteria (marks, CGPA, income, state, course, community, gender, scheme names),
 * queries the active 82 scholarships database dynamically, and generates tailored, accurate answers.
 */

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function generateTomResponse(query, profile = {}) {
  const originalQ = (query || '').trim();
  const q = originalQ.toLowerCase();
  const scholarships = getScholarships();
  const matchedSchemes = [];
  let suggestedActions = [];
  let reply = '';

  // Extract user parameters if available from profile or text
  const userCourse = (profile.course || 'B.Tech').toLowerCase();
  const userState = profile.state || 'Tamil Nadu';
  const userCgpa = parseFloat(profile.cgpa || '8.4');
  const userIncome = parseFloat(profile.familyIncome || '220000');
  const userName = profile.fullName ? profile.fullName.split(' ')[0] : 'Student';

  // 1. GREETINGS & SMALL TALK
  if (/^(hi|hello|hey|hola|namaste|vanakkam|good morning|good afternoon|good evening)\b/i.test(q)) {
    reply = `Hello **${userName}**! I'm **TOM**, your personal AI Scholarship & Eligibility Advisor. 🎓\n\n` +
      `I can help you find financial assistance across **82 verified Central, State, and Corporate schemes**.\n\n` +
      `Here is what you can ask me:\n` +
      `• *"Which scholarships can I get with 75% marks in 12th?"*\n` +
      `• *"Show me engineering scholarships in ${userState}"*\n` +
      `• *"Are there any schemes for female / girl students?"*\n` +
      `• *"What is the deadline and process for scholarship renewal?"*\n` +
      `• *"How does Direct Benefit Transfer (DBT) and PFMS work?"*`;

    suggestedActions = [
      { label: '🌟 Recommend for my profile', query: 'Recommend scholarships for my profile' },
      { label: '🔄 How does renewal work?', query: 'How does scholarship renewal work?' },
      { label: '🏆 Highest grant schemes', query: 'What are the highest scholarship amounts?' },
      { label: '📄 Documents checklist', query: 'What documents are required to apply?' }
    ];
    return { reply, schemes: [], suggestedActions };
  }

  // 2. GRATITUDE & CLOSING
  if (/^(thank|thanks|thank you|ok thanks|great|awesome|helpful|bye|goodbye)\b/i.test(q)) {
    reply = `You're very welcome, **${userName}**! 😊\n\nRemember, scholarships have strict application windows. Make sure to save your preferred schemes to your **Saved Wishlist** or add them to the **Compare Matrix** to track deadlines. Feel free to ask anytime if you need more guidance!`;
    suggestedActions = [
      { label: 'Check Saved Wishlist', path: '/wishlist' },
      { label: 'Open Compare Matrix', path: '/compare' },
      { label: 'Go to Student Dashboard', path: '/student/dashboard' }
    ];
    return { reply, schemes: [], suggestedActions };
  }

  // 3. SPECIFIC SCHEME NAME SEARCH
  // Check if query matches any known scholarship by name, code, or provider keyword
  const schemeByName = scholarships.find(s => {
    const sName = s.name.toLowerCase();
    const sCode = s.code.toLowerCase();
    const sProv = s.provider.toLowerCase();
    
    // Check specific popular scheme names
    if (q.includes('pragati') && (sName.includes('pragati') || sCode.includes('pragati'))) return true;
    if (q.includes('saksham') && (sName.includes('saksham') || sCode.includes('saksham'))) return true;
    if (q.includes('kvpy') && (sName.includes('kvpy') || sCode.includes('kvpy') || sName.includes('kishore'))) return true;
    if (q.includes('inspire') && (sName.includes('inspire') || sCode.includes('inspire'))) return true;
    if (q.includes('swarnajayanti') && sName.includes('swarnajayanti')) return true;
    if (q.includes('begum hazrat') && sName.includes('begum hazrat')) return true;
    if (q.includes('central sector') && sName.includes('central sector')) return true;
    if (q.includes('post matric') && (sName.includes('post matric') || sName.includes('post-matric'))) return true;
    if (q.includes('tata') && (sName.includes('tata') || sProv.includes('tata'))) return true;
    if (q.includes('reliance') && (sName.includes('reliance') || sProv.includes('reliance'))) return true;
    if (q.includes('hdfc') && (sName.includes('hdfc') || sProv.includes('hdfc'))) return true;
    if (q.includes('aditya birla') && (sName.includes('aditya birla') || sProv.includes('aditya birla'))) return true;
    if (q.includes('national merit') && sName.includes('national merit')) return true;
    
    // Direct code search (e.g. NSP-MERIT-001)
    if (sCode === q || q.includes(sCode)) return true;

    return false;
  });

  if (schemeByName) {
    const s = schemeByName;
    const now = new Date();
    const closing = new Date(s.closingDate);
    const diffDays = Math.ceil((closing - now) / (1000 * 60 * 60 * 24));
    const isClosed = !s.active || diffDays < 0;

    reply = `### 🏛️ Scheme Details: **${s.name}**\n\n` +
      `• **Official Code:** \`${s.code}\`\n` +
      `• **Sanctioning Authority:** ${s.provider}\n` +
      `• **Annual Financial Grant:** **${formatCurrency(s.amount)} / year** (100% PFMS DBT Disbursal)\n` +
      `• **Category:** ${s.category}\n` +
      `• **Application Window:** Closes on **${formatDate(s.closingDate)}** (${isClosed ? 'Closed' : `${diffDays} days left`})\n\n` +
      `**Key Eligibility Rules:**\n` +
      `• Academic Cut-off: ${s.minPercentage ? `≥ ${s.minPercentage}% marks` : 'Pass percentage'} ${s.minCgpa ? `(≥ ${s.minCgpa} CGPA)` : ''}\n` +
      `• Minimum Attendance: ${s.minAttendance ? `≥ ${s.minAttendance}% verified attendance` : 'Standard 75%'}\n` +
      `• Income Ceiling: ${s.maxFamilyIncome ? `Gross family income ≤ ${formatCurrency(s.maxFamilyIncome)}/year` : 'No income cap (Merit-based)'}\n` +
      `• Eligible Domicile: ${s.eligibleStates && s.eligibleStates.length > 0 ? s.eligibleStates.join(', ') : 'All Indian States & UTs'}\n` +
      `• Eligible Courses: ${s.eligibleCourses && s.eligibleCourses.length > 0 ? s.eligibleCourses.join(', ') : 'All Higher Education Courses'}\n\n` +
      `**Description:** ${s.description}\n\n` +
      `Would you like to apply now or check your exact match score against this scheme?`;

    matchedSchemes.push(s);
    suggestedActions = [
      { label: 'Apply for this Scheme', path: `/student/apply/${s.id}` },
      { label: 'Check My Match Score', path: `/eligibility?scheme=${s.id}` },
      { label: 'Add to Compare Matrix', path: `/compare` }
    ];
    return { reply, schemes: matchedSchemes, suggestedActions };
  }

  // 4. HIGHEST / MAXIMUM GRANT INQUIRIES
  if (
    q.includes('highest') ||
    q.includes('maximum amount') ||
    q.includes('max amount') ||
    q.includes('most money') ||
    q.includes('top grant') ||
    q.includes('best scholarship') ||
    q.includes('biggest scholarship')
  ) {
    const topSchemes = [...scholarships]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);

    reply = `### 💰 Top Highest-Funding Scholarships on the Portal\n\n` +
      `Here are the highest financial grants available for academic year 2026-27:\n\n` +
      topSchemes.map((s, idx) => 
        `**${idx + 1}. [${s.code}] ${s.name}**\n` +
        `   • Annual Grant: **${formatCurrency(s.amount)} / year**\n` +
        `   • Category: ${s.category} (${s.provider})\n` +
        `   • Cut-off: Min ${s.minPercentage || 70}% marks ${s.minCgpa ? `| ≥ ${s.minCgpa} CGPA` : ''}\n` +
        `   • Deadline: ${formatDate(s.closingDate)}`
      ).join('\n\n') +
      `\n\nAll grants are credited directly to the student's Aadhaar-seeded bank account through **PFMS Direct Benefit Transfer (DBT)**.`;

    matchedSchemes.push(...topSchemes);
    suggestedActions = [
      topSchemes[0] ? { label: `Apply: ${topSchemes[0].name.slice(0, 20)}...`, path: `/student/apply/${topSchemes[0].id}` } : null,
      { label: 'Compare Top 4 Schemes', path: '/compare' },
      { label: 'View All 82 Schemes', path: '/scholarships' }
    ].filter(Boolean);
    return { reply, schemes: matchedSchemes, suggestedActions };
  }

  // 5. EXTRACT NUMERICAL MARKS OR PERCENTAGE (e.g. "I scored 78%", "65 marks", "70 percent")
  const percentageMatch = q.match(/(\d{1,2}(?:\.\d{1,2})?)\s*(?:%|percent|percentage|marks|pcm|aggregate)/i);
  if (percentageMatch) {
    const userScore = parseFloat(percentageMatch[1]);
    if (userScore >= 35 && userScore <= 100) {
      const qualifying = scholarships.filter(s => {
        if (!s.active) return false;
        if (s.minPercentage && userScore < s.minPercentage) return false;
        return true;
      }).sort((a, b) => b.amount - a.amount).slice(0, 4);

      reply = `### 🎯 Scholarships Matching Your Academic Score: **${userScore}%**\n\n` +
        `Great job! With an academic score of **${userScore}%**, you meet the cut-off criteria for **${scholarships.filter(s => !s.minPercentage || s.minPercentage <= userScore).length} out of 82 scholarships** on this portal!\n\n` +
        `Here are the top-recommended grants you qualify for:\n\n` +
        qualifying.map((s, idx) => 
          `**${idx + 1}. ${s.name}** (\`${s.code}\`)\n` +
          `   • Grant: **${formatCurrency(s.amount)} / year**\n` +
          `   • Required Cut-off: ${s.minPercentage ? `≥ ${s.minPercentage}% (Your ${userScore}% qualifies! ✅)` : 'Open eligibility'}\n` +
          `   • Provider: ${s.provider}`
        ).join('\n\n') +
        `\n\nWould you like me to evaluate these against your family income ceiling as well?`;

      matchedSchemes.push(...qualifying);
      suggestedActions = [
        { label: 'Run Full Rule Engine', path: '/eligibility' },
        { label: 'Check Saved Wishlist', path: '/wishlist' },
        { label: 'Explore All Schemes', path: '/scholarships' }
      ];
      return { reply, schemes: matchedSchemes, suggestedActions };
    }
  }

  // 6. EXTRACT CGPA (e.g. "8.2 cgpa", "cgpa 7.5", "8 pointer")
  const cgpaMatch = q.match(/(\d(?:\.\d{1,2})?)\s*(?:cgpa|gpa|pointer)/i) || q.match(/(?:cgpa|gpa)\s*(?:of|is|:)?\s*(\d(?:\.\d{1,2})?)/i);
  if (cgpaMatch) {
    const enteredCgpa = parseFloat(cgpaMatch[1]);
    if (enteredCgpa >= 4.0 && enteredCgpa <= 10.0) {
      const qualifyingCgpa = scholarships.filter(s => {
        if (!s.active) return false;
        if (s.minCgpa && enteredCgpa < s.minCgpa) return false;
        return true;
      }).sort((a, b) => b.amount - a.amount).slice(0, 4);

      reply = `### 🎓 Higher Education Scholarships for **${enteredCgpa} CGPA**\n\n` +
        `With a **${enteredCgpa} CGPA**, you satisfy the university merit threshold across **${scholarships.filter(s => !s.minCgpa || s.minCgpa <= enteredCgpa).length} schemes**!\n\n` +
        qualifyingCgpa.map((s, idx) => 
          `**${idx + 1}. ${s.name}**\n` +
          `   • Grant: **${formatCurrency(s.amount)} / year**\n` +
          `   • Required CGPA: ${s.minCgpa ? `≥ ${s.minCgpa} CGPA (You have ${enteredCgpa} ✅)` : 'No CGPA minimum'}\n` +
          `   • Eligible Courses: ${s.eligibleCourses ? s.eligibleCourses.slice(0, 3).join(', ') : 'All degrees'}`
        ).join('\n\n') +
        `\n\nKeep your latest semester grade sheet ready for fast-track document verification.`;

      matchedSchemes.push(...qualifyingCgpa);
      suggestedActions = [
        { label: 'Check All Matched Schemes', path: '/eligibility' },
        { label: 'Go to Student Dashboard', path: '/student/dashboard' }
      ];
      return { reply, schemes: matchedSchemes, suggestedActions };
    }
  }

  // 7. EXTRACT INCOME NUMBERS (e.g. "income 2.5 lakhs", "family income 300000", "5 lakh income")
  const incomeMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|l)/i) || q.match(/(?:income|salary|earns?)\s*(?:is|of|:)?\s*₹?\s*(\d{5,7})/i);
  if (incomeMatch && (q.includes('income') || q.includes('salary') || q.includes('earn') || q.includes('ceiling') || q.includes('lakh'))) {
    let incomeVal = parseFloat(incomeMatch[1]);
    if (incomeVal < 100) incomeVal = incomeVal * 100000; // convert lakhs to INR

    const validForIncome = scholarships.filter(s => {
      if (!s.active) return false;
      if (s.maxFamilyIncome && incomeVal > s.maxFamilyIncome) return false;
      return true;
    }).sort((a, b) => b.amount - a.amount).slice(0, 4);

    reply = `### 💵 Income Eligibility Breakdown for **${formatCurrency(incomeVal)} / year**\n\n` +
      `With an annual family income of **${formatCurrency(incomeVal)}**, you are eligible for **${scholarships.filter(s => !s.maxFamilyIncome || s.maxFamilyIncome >= incomeVal).length} scholarship schemes**!\n\n` +
      `• **Low-Income / Need-Based Grants**: Schemes with ₹2.5L ceiling qualify if your income is below it.\n` +
      `• **Central Sector Schemes**: Central Government ceiling is typically ₹4,50,000.\n` +
      `• **Merit-Based Schemes**: Open merit schemes have ceilings up to ₹8,00,000 or no income cap at all.\n\n` +
      `**Top Schemes You Can Apply For Right Now:**\n\n` +
      validForIncome.map((s, idx) => 
        `**${idx + 1}. ${s.name}**\n` +
        `   • Annual Grant: **${formatCurrency(s.amount)}**\n` +
        `   • Scheme Income Cap: ${s.maxFamilyIncome ? `≤ ${formatCurrency(s.maxFamilyIncome)}/yr (Within Limit ✅)` : 'Open Merit (No Cap ✅)'}`
      ).join('\n\n');

    matchedSchemes.push(...validForIncome);
    suggestedActions = [
      { label: 'Filter Catalog by Income', path: `/scholarships` },
      { label: 'Check Document Checklist', query: 'What documents are required to apply?' }
    ];
    return { reply, schemes: matchedSchemes, suggestedActions };
  }

  // 8. GIRLS / WOMEN / FEMALE SCHOLARSHIPS
  if (q.includes('girl') || q.includes('women') || q.includes('female') || q.includes('daughter') || q.includes('beti')) {
    const womenSchemes = scholarships.filter(s => 
      s.active && 
      (s.gender === 'Female' || s.category.toLowerCase().includes('women') || s.name.toLowerCase().includes('pragati') || s.name.toLowerCase().includes('girl') || s.name.toLowerCase().includes('begum hazrat'))
    ).slice(0, 4);

    reply = `### 👩 Dedicated Scholarship Schemes for Girls & Women\n\n` +
      `The portal hosts several prestigious Central and Corporate schemes specifically dedicated to empowering female education:\n\n` +
      womenSchemes.map((s, idx) => 
        `**${idx + 1}. [${s.code}] ${s.name}**\n` +
        `   • Grant Amount: **${formatCurrency(s.amount)} / year**\n` +
        `   • Agency: ${s.provider}\n` +
        `   • Eligibility: ${s.minPercentage ? `Min ${s.minPercentage}% marks` : 'Regular Enrollment'} | Income ≤ ${formatCurrency(s.maxFamilyIncome || 800000)}\n` +
        `   • Disbursal: Direct PFMS Bank Transfer`
      ).join('\n\n') +
      `\n\nFemale candidates can also apply for all general Central and State schemes alongside these dedicated quotas!`;

    matchedSchemes.push(...womenSchemes);
    suggestedActions = [
      { label: 'View All Girls Schemes', path: '/scholarships?category=Women%20%2F%20Girls' },
      { label: 'Apply for Pragati Scheme', path: `/student/apply/${womenSchemes[0]?.id || 3}` }
    ];
    return { reply, schemes: matchedSchemes, suggestedActions };
  }

  // 9. STATE-SPECIFIC SCHOLARSHIP INQUIRIES
  const stateList = [
    'Tamil Nadu', 'Maharashtra', 'Karnataka', 'Uttar Pradesh', 'Kerala',
    'Andhra Pradesh', 'Telangana', 'West Bengal', 'Gujarat', 'Delhi', 'Rajasthan', 'Bihar', 'Punjab'
  ];
  const matchedState = stateList.find(st => q.includes(st.toLowerCase()));
  if (matchedState) {
    const stateSchemes = scholarships.filter(s => 
      s.active && (
        (s.eligibleStates && s.eligibleStates.includes(matchedState)) ||
        s.name.toLowerCase().includes(matchedState.toLowerCase())
      )
    ).slice(0, 4);

    reply = `### 🗺️ Scholarships for Students Domiciled in **${matchedState}**\n\n` +
      `Students with domicile in **${matchedState}** are eligible for both state-specific welfare initiatives AND all national central schemes:\n\n` +
      (stateSchemes.length > 0 ? 
        stateSchemes.map((s, idx) => 
          `**${idx + 1}. ${s.name}** (\`${s.code}\`)\n` +
          `   • Grant: **${formatCurrency(s.amount)} / year**\n` +
          `   • Department: ${s.provider}\n` +
          `   • Criteria: Min ${s.minPercentage || 60}% marks | Income: ≤ ${formatCurrency(s.maxFamilyIncome || 250000)}`
        ).join('\n\n')
        : `All 18 Central Sector Schemes and Corporate CSR grants accept students from **${matchedState}**!`) +
      `\n\n*Note: Domicile certificate or Nativity certificate issued by the Tehsildar is required as proof.*`;

    matchedSchemes.push(...stateSchemes);
    suggestedActions = [
      { label: `Browse ${matchedState} Schemes`, path: `/scholarships?state=${encodeURIComponent(matchedState)}` },
      { label: 'Check All Matched', path: '/eligibility' }
    ];
    return { reply, schemes: matchedSchemes, suggestedActions };
  }

  // 10. COURSE SPECIFIC: ENGINEERING, MEDICAL, SCIENCE, COMMERCE, DIPLOMA, SCHOOL
  if (q.includes('engineering') || q.includes('b.tech') || q.includes('b.e') || q.includes('polytechnic') || q.includes('diploma') || q.includes('computer')) {
    const engSchemes = scholarships.filter(s => 
      s.active && (s.eligibleCourses?.includes('B.Tech') || s.eligibleCourses?.includes('B.E') || s.name.toLowerCase().includes('technical'))
    ).slice(0, 4);

    reply = `### ⚙️ Technical & Engineering Scholarships (B.Tech / B.E)\n\n` +
      `Engineering degree students have access to high-value grants up to **₹1,00,000 / year**:\n\n` +
      engSchemes.map((s, idx) => 
        `**${idx + 1}. ${s.name}** (\`${s.code}\`)\n` +
        `   • Grant: **${formatCurrency(s.amount)} / year**\n` +
        `   • Provider: ${s.provider}\n` +
        `   • Academic Cut-off: Min ${s.minPercentage || 70}% marks ${s.minCgpa ? `| ≥ ${s.minCgpa} CGPA` : ''}`
      ).join('\n\n');

    matchedSchemes.push(...engSchemes);
    suggestedActions = [
      { label: 'Filter Engineering Schemes', path: '/scholarships?course=B.Tech' },
      { label: 'Compare Engineering Schemes', path: '/compare' }
    ];
    return { reply, schemes: matchedSchemes, suggestedActions };
  }

  if (q.includes('medical') || q.includes('mbbs') || q.includes('bds') || q.includes('nursing') || q.includes('pharmacy')) {
    const medSchemes = scholarships.filter(s => 
      s.active && (s.eligibleCourses?.includes('MBBS') || s.name.toLowerCase().includes('health') || s.name.toLowerCase().includes('medical') || s.category.toLowerCase().includes('merit'))
    ).slice(0, 3);

    reply = `### 🩺 Healthcare & Medical Scholarships (MBBS / BDS / Nursing)\n\n` +
      `Medical and professional healthcare students can access full tuition grants and stipends:\n\n` +
      medSchemes.map((s, idx) => 
        `**${idx + 1}. ${s.name}**\n` +
        `   • Grant: **${formatCurrency(s.amount)} / year**\n` +
        `   • Criteria: NEET / Qualifying Exam merit + College Bonafide\n` +
        `   • Disbursal: PFMS Direct Benefit Transfer`
      ).join('\n\n');

    matchedSchemes.push(...medSchemes);
    suggestedActions = [
      { label: 'Browse Medical Schemes', path: '/scholarships?course=MBBS' },
      { label: 'Check Eligibility', path: '/eligibility' }
    ];
    return { reply, schemes: matchedSchemes, suggestedActions };
  }

  // 11. COMMUNITY QUOTAS: SC / ST / OBC / MINORITY / DISABILITY / SPORTS
  if (q.includes('minority') || q.includes('muslim') || q.includes('christian') || q.includes('sikh') || q.includes('jain') || q.includes('buddhist')) {
    const minoritySchemes = scholarships.filter(s => 
      s.active && (s.category.toLowerCase().includes('minority') || s.name.toLowerCase().includes('minority') || s.name.toLowerCase().includes('hazrat'))
    ).slice(0, 3);

    reply = `### 🕊️ Minority Welfare Scholarship Programs\n\n` +
      `Administered by the Ministry of Minority Affairs and State Waqf/Minority Welfare boards:\n\n` +
      minoritySchemes.map((s, idx) => 
        `**${idx + 1}. ${s.name}**\n` +
        `   • Grant: **${formatCurrency(s.amount)} / year**\n` +
        `   • Communities: Muslim, Christian, Sikh, Buddhist, Jain, Parsi\n` +
        `   • Income Ceiling: Typically ≤ ₹2,50,000 / year`
      ).join('\n\n');

    matchedSchemes.push(...minoritySchemes);
    suggestedActions = [
      { label: 'Browse Minority Schemes', path: '/scholarships?category=Minority' },
      { label: 'View Document Requirements', query: 'What documents are required to apply?' }
    ];
    return { reply, schemes: matchedSchemes, suggestedActions };
  }

  if (q.includes('disab') || q.includes('handicap') || q.includes('pwd') || q.includes('specially abled') || q.includes('saksham')) {
    const disSchemes = scholarships.filter(s => 
      s.active && (s.category.toLowerCase().includes('disability') || s.name.toLowerCase().includes('saksham') || s.name.toLowerCase().includes('divyang'))
    ).slice(0, 3);

    reply = `### ♿ Scholarships for Specially Abled Students (Divyangjan / PwD)\n\n` +
      `• **AICTE Saksham Scholarship**: ₹50,000/year for technical education.\n` +
      `• **Central Post-Matric Disability Grant**: Full fee reimbursement + maintenance allowance.\n` +
      `• **Requirement**: Minimum 40% disability certificate issued by a recognized Chief Medical Officer (CMO) or UDID card.\n` +
      `• **Disbursal**: Direct DBT transfer without any deductions.`;

    matchedSchemes.push(...disSchemes);
    suggestedActions = [
      { label: 'View Disability Schemes', path: '/scholarships?category=Disability' },
      { label: 'Apply for Saksham', path: `/student/apply/${disSchemes[0]?.id || 5}` }
    ];
    return { reply, schemes: matchedSchemes, suggestedActions };
  }

  if (q.includes('sport') || q.includes('athlete') || q.includes('player') || q.includes('game')) {
    const sportsSchemes = scholarships.filter(s => 
      s.active && (s.category.toLowerCase().includes('sports') || s.name.toLowerCase().includes('sport'))
    ).slice(0, 3);

    reply = `### 🏅 Sports Excellence Scholarships\n\n` +
      `• Awarded to students who have represented their State, District, or University at National/All-India Inter-University tournaments.\n` +
      `• Grant Amount: Up to **₹60,000 / year** + training allowance.\n` +
      `• Certificate: Federation / University sports certificate authenticated by Sports Authority of India (SAI).`;

    matchedSchemes.push(...sportsSchemes);
    suggestedActions = [
      { label: 'Browse Sports Quota Schemes', path: '/scholarships?category=Sports' }
    ];
    return { reply, schemes: matchedSchemes, suggestedActions };
  }

  // 12. RENEWAL QUESTIONS & HOW IT WORKS
  if (q.includes('renew') || q.includes('promotion') || q.includes('next year') || q.includes('continuation') || q.includes('previous scholarship')) {
    reply = `### 🔄 How Scholarship Renewal Re-Verification Works\n\n` +
      `If you received a scholarship last academic year, you do **NOT** need to create a fresh account or re-enter your demographic profile!\n\n` +
      `**3-Step Renewal Procedure:**\n` +
      `1. **Enter Previous Award ID**: Provide your existing scholarship reference ID (e.g. \`NSP-2025-419201\`).\n` +
      `2. **Re-Verify 2 Documents**:\n` +
      `   • Current Semester Grade Sheet (confirming promotion & required CGPA/marks)\n` +
      `   • College Attendance Bonafide (minimum 75% attendance)\n` +
      `3. **Instant Automated Re-Evaluation**: Our transparent rule engine re-evaluates promotion marks and dispatches your renewal file to the Disbursal Unit for continuing DBT!\n\n` +
      `*Renewal window is currently active for AY 2026-27.*`;

    suggestedActions = [
      { label: 'Go to Renewal Desk', path: '/student/renewal' },
      { label: 'View My Existing Applications', path: '/student/dashboard' }
    ];
    return { reply, schemes: [], suggestedActions };
  }

  // 13. DOCUMENTS & CERTIFICATES CHECKLIST
  if (q.includes('document') || q.includes('certificate') || q.includes('upload') || q.includes('format') || q.includes('size') || q.includes('proof')) {
    reply = `### 📄 Mandatory Documents Checklist for Verification\n\n` +
      `Please ensure clear, legible scans before uploading to the document desk:\n\n` +
      `1. **Aadhaar Card / UIDAI Identity Proof**: Mandatory for Aadhaar-based DBT payment authentication.\n` +
      `2. **Previous Qualifying Marksheet**: Grade sheet / semester transcript confirming required percentage or CGPA.\n` +
      `3. **Current Year Income Certificate**: Issued by the competent Revenue Tehsildar / Sub-Divisional Magistrate (SDM).\n` +
      `4. **Institution Bonafide Certificate**: Stamped bonafide from your college registrar confirming course, current year, and attendance.\n` +
      `5. **Aadhaar-Seeded Bank Passbook / Cancelled Cheque**: Bank account must be seeded with Aadhaar in NPCI mapper.\n` +
      `6. **Caste / Community Certificate**: (Only required if applying under SC, ST, OBC, or Minority quota).\n\n` +
      `• **Accepted Formats:** PDF, JPG, JPEG, PNG\n` +
      `• **Max File Size:** Up to 10MB per certificate`;

    suggestedActions = [
      { label: 'Upload Documents in Vault', path: '/student/dashboard' },
      { label: 'Check Eligibility Rules', path: '/eligibility' }
    ];
    return { reply, schemes: [], suggestedActions };
  }

  // 14. TRACKING, STATUS, PFMS & DIRECT BENEFIT TRANSFER (DBT)
  if (q.includes('status') || q.includes('track') || q.includes('stage') || q.includes('pfms') || q.includes('dbt') || q.includes('when will money') || q.includes('credit')) {
    reply = `### 🏛️ 5-Stage Verification Pipeline & PFMS DBT Tracking\n\n` +
      `Every application moves through an audited 5-stage national workflow:\n\n` +
      `1. **Stage 1: Submitted** ➔ Student profile, bank details, and documents registered.\n` +
      `2. **Stage 2: Document Verification** ➔ College / Institute Nodal Officer validates marks and attendance.\n` +
      `3. **Stage 3: Under Verification** ➔ District & State Welfare Officer approves quota clearance.\n` +
      `4. **Stage 4: Provider Review** ➔ Ministry or Foundation Trust sanctions the disbursal budget.\n` +
      `5. **Stage 5: Approved & Disbursed** ➔ Funds credited directly to your bank account via **PFMS / Aadhaar Payment Bridge (APB)**.\n\n` +
      `You can view live stage milestones, reviewer remarks, and download acknowledgment slips directly on your dashboard.`;

    suggestedActions = [
      { label: 'Open Live Application Tracker', path: '/student/dashboard' },
      { label: 'Officer Desk Login', path: '/login?tab=admin' }
    ];
    return { reply, schemes: [], suggestedActions };
  }

  // 15. COMPARE & WISHLIST FEATURE INQUIRIES
  if (q.includes('compare') || q.includes('wishlist') || q.includes('save') || q.includes('flipkart') || q.includes('shortlist')) {
    reply = `### ⚖️ Flipkart-Style Compare Matrix & Saved Wishlist\n\n` +
      `We built this portal to make scholarship discovery as smooth as an e-commerce platform:\n\n` +
      `• **Compare Matrix (` + `/compare` + `)**: Check the "Compare" box on any 2 to 4 scholarships. A floating dock appears at the bottom. Click "Compare Now" to view grant amounts, minimum marks, attendance requirements, and income caps side-by-side!\n` +
      `• **Saved Wishlist (` + `/wishlist` + `)**: Click the Heart icon on any card to bookmark schemes you want to apply for later. The wishlist calculates your **Total Funding Potential** in real time!`;

    suggestedActions = [
      { label: 'Open Compare Matrix', path: '/compare' },
      { label: 'View Saved Wishlist', path: '/wishlist' },
      { label: 'Explore Scholarships', path: '/scholarships' }
    ];
    return { reply, schemes: [], suggestedActions };
  }

  // 16. DYNAMIC KEYWORD SEARCH ACROSS 82 SCHOLARSHIPS (Intelligent Matcher)
  // Tokenize user words and find the best matching scholarships
  const userWords = q.replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length >= 3 && !['what', 'which', 'where', 'when', 'how', 'can', 'the', 'for', 'are', 'there', 'any', 'tell', 'show', 'give'].includes(w));
  
  if (userWords.length > 0) {
    const scoredSchemes = scholarships.map(scheme => {
      let score = 0;
      const text = `${scheme.name} ${scheme.code} ${scheme.provider} ${scheme.category} ${scheme.description} ${scheme.eligibleCourses?.join(' ')} ${scheme.eligibleStates?.join(' ')}`.toLowerCase();
      userWords.forEach(word => {
        if (text.includes(word)) score += 1;
      });
      return { scheme, score };
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);

    if (scoredSchemes.length > 0) {
      reply = `### 🔍 Schemes Found for: *"${originalQ}"*\n\n` +
        `Based on your input, here are the closest matching scholarships from the 82 active database schemes:\n\n` +
        scoredSchemes.map(({ scheme: s }, idx) => 
          `**${idx + 1}. [${s.code}] ${s.name}**\n` +
          `   • Annual Grant: **${formatCurrency(s.amount)}** (PFMS DBT)\n` +
          `   • Category: ${s.category} | ${s.provider}\n` +
          `   • Minimum Requirements: ${s.minPercentage ? `≥ ${s.minPercentage}% marks` : 'Pass'} ${s.minCgpa ? `| ≥ ${s.minCgpa} CGPA` : ''} | Income ≤ ${formatCurrency(s.maxFamilyIncome || 800000)}`
        ).join('\n\n') +
        `\n\nWould you like more details on any of these schemes?`;

      matchedSchemes.push(...scoredSchemes.map(item => item.scheme));
      suggestedActions = [
        { label: `View: ${scoredSchemes[0].scheme.name.slice(0, 20)}...`, path: `/scholarships/${scoredSchemes[0].scheme.id}` },
        { label: 'Check Eligibility', path: '/eligibility' },
        { label: 'View All 82 Schemes', path: '/scholarships' }
      ];
      return { reply, schemes: matchedSchemes, suggestedActions };
    }
  }

  // 17. FINAL SMART GENERAL FALLBACK
  reply = `I understand you're asking about: *"${originalQ}"*.\n\n` +
    `As your AI Scholarship Advisor, I have live access to all **82 Central, State, and Corporate scholarship schemes**.\n\n` +
    `To give you the most accurate answer, you can tell me:\n` +
    `• Your **12th percentage** or current **CGPA** (e.g. *"I scored 82%"*)\n` +
    `• Your **degree course** (e.g. *"B.Tech"*, *"MBBS"*, *"B.Sc"*, *"Polytechnic"*)\n` +
    `• Your **domicile state** (e.g. *"Tamil Nadu"*, *"Maharashtra"*, *"Karnataka"*)\n` +
    `• Your **annual family income** (e.g. *"Income 2.5 lakhs"*)\n\n` +
    `Or choose one of the quick actions below:`;

  suggestedActions = [
    { label: 'Recommend for my profile', query: 'Recommend scholarships for my profile' },
    { label: 'Check 82 Schemes Catalog', path: '/scholarships' },
    { label: 'Open Compare Matrix', path: '/compare' },
    { label: 'How does renewal work?', query: 'How does scholarship renewal work?' }
  ];

  return { reply, schemes: [], suggestedActions };
}

// POST /api/ai/chat
router.post('/chat', (req, res) => {
  const { message, profile = {}, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const response = generateTomResponse(message, profile);

  res.json({
    success: true,
    sender: 'TOM AI',
    timestamp: new Date().toISOString(),
    ...response
  });
});

export default router;
