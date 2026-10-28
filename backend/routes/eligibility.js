import express from 'express';
import { getScholarships } from './scholarships.js';

const router = express.Router();

export function evaluateSchemeEligibility(scheme, profile = {}) {
  const criteria = [];
  let applicableCount = 0;
  let passedCount = 0;
  let hasMissingRequired = false;
  let hasFailedCondition = false;

  // 1. Minimum Percentage
  if (scheme.minPercentage !== undefined && scheme.minPercentage !== null) {
    applicableCount++;
    const userVal = profile.previousPercentage;
    if (userVal === undefined || userVal === null || userVal === '') {
      hasMissingRequired = true;
      criteria.push({
        id: 'minPercentage',
        title: 'Minimum percentage',
        status: 'missing',
        message: 'Minimum percentage is not filled in your profile. Add it to complete this check.',
        required: `${scheme.minPercentage}%`,
        actual: 'Not filled'
      });
    } else {
      const numVal = parseFloat(userVal);
      if (numVal >= scheme.minPercentage) {
        passedCount++;
        criteria.push({
          id: 'minPercentage',
          title: 'Minimum percentage',
          status: 'passed',
          message: `Requires minimum ${scheme.minPercentage}% (Your value: ${numVal}%)`,
          required: `${scheme.minPercentage}%`,
          actual: `${numVal}%`
        });
      } else {
        hasFailedCondition = true;
        criteria.push({
          id: 'minPercentage',
          title: 'Minimum percentage',
          status: 'failed',
          message: `Requires minimum ${scheme.minPercentage}% (Your value: ${numVal}%)`,
          required: `${scheme.minPercentage}%`,
          actual: `${numVal}%`
        });
      }
    }
  }

  // 2. Minimum CGPA
  if (scheme.minCgpa !== undefined && scheme.minCgpa !== null) {
    applicableCount++;
    const userVal = profile.cgpa;
    if (userVal === undefined || userVal === null || userVal === '') {
      hasMissingRequired = true;
      criteria.push({
        id: 'minCgpa',
        title: 'Minimum CGPA',
        status: 'missing',
        message: 'Minimum CGPA is not filled in your profile. Add it to complete this check.',
        required: `${scheme.minCgpa}`,
        actual: 'Not filled'
      });
    } else {
      const numVal = parseFloat(userVal);
      if (numVal >= scheme.minCgpa) {
        passedCount++;
        criteria.push({
          id: 'minCgpa',
          title: 'Minimum CGPA',
          status: 'passed',
          message: `Requires minimum CGPA of ${scheme.minCgpa} (Your value: ${numVal})`,
          required: `${scheme.minCgpa}`,
          actual: `${numVal}`
        });
      } else {
        hasFailedCondition = true;
        criteria.push({
          id: 'minCgpa',
          title: 'Minimum CGPA',
          status: 'failed',
          message: `Requires minimum CGPA of ${scheme.minCgpa} (Your value: ${numVal})`,
          required: `${scheme.minCgpa}`,
          actual: `${numVal}`
        });
      }
    }
  }

  // 3. Minimum Attendance
  if (scheme.minAttendance !== undefined && scheme.minAttendance !== null) {
    applicableCount++;
    const userVal = profile.attendance;
    if (userVal === undefined || userVal === null || userVal === '') {
      hasMissingRequired = true;
      criteria.push({
        id: 'minAttendance',
        title: 'Minimum attendance',
        status: 'missing',
        message: 'Minimum attendance is not filled in your profile. Add it to complete this check.',
        required: `${scheme.minAttendance}%`,
        actual: 'Not filled'
      });
    } else {
      const numVal = parseFloat(userVal);
      if (numVal >= scheme.minAttendance) {
        passedCount++;
        criteria.push({
          id: 'minAttendance',
          title: 'Minimum attendance',
          status: 'passed',
          message: `Requires minimum ${scheme.minAttendance}% attendance (Your value: ${numVal}%)`,
          required: `${scheme.minAttendance}%`,
          actual: `${numVal}%`
        });
      } else {
        hasFailedCondition = true;
        criteria.push({
          id: 'minAttendance',
          title: 'Minimum attendance',
          status: 'failed',
          message: `Requires minimum ${scheme.minAttendance}% attendance (Your value: ${numVal}%)`,
          required: `${scheme.minAttendance}%`,
          actual: `${numVal}%`
        });
      }
    }
  }

  // 4. Family Income
  if (scheme.maxFamilyIncome !== undefined && scheme.maxFamilyIncome !== null) {
    applicableCount++;
    const userVal = profile.familyIncome;
    if (userVal === undefined || userVal === null || userVal === '') {
      hasMissingRequired = true;
      criteria.push({
        id: 'familyIncome',
        title: 'Family income',
        status: 'missing',
        message: 'Family income is not filled in your profile. Add it to complete this check.',
        required: `Max ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')}`,
        actual: 'Not filled'
      });
    } else {
      const numVal = parseFloat(userVal);
      if (numVal <= scheme.maxFamilyIncome) {
        passedCount++;
        criteria.push({
          id: 'familyIncome',
          title: 'Family income',
          status: 'passed',
          message: `Max ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')} (Your value: ₹${numVal.toLocaleString('en-IN')})`,
          required: `Max ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')}`,
          actual: `₹${numVal.toLocaleString('en-IN')}`
        });
      } else {
        hasFailedCondition = true;
        criteria.push({
          id: 'familyIncome',
          title: 'Family income',
          status: 'failed',
          message: `Income exceeds limit of ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')} (Your value: ₹${numVal.toLocaleString('en-IN')})`,
          required: `Max ₹${scheme.maxFamilyIncome.toLocaleString('en-IN')}`,
          actual: `₹${numVal.toLocaleString('en-IN')}`
        });
      }
    }
  }

  // 5. Eligible State
  if (scheme.eligibleStates && scheme.eligibleStates.length > 0) {
    applicableCount++;
    const userVal = profile.state;
    if (!userVal) {
      hasMissingRequired = true;
      criteria.push({
        id: 'state',
        title: 'Eligible state',
        status: 'missing',
        message: 'State is not filled in your profile.',
        required: scheme.eligibleStates.join(', '),
        actual: 'Not filled'
      });
    } else if (scheme.eligibleStates.includes(userVal)) {
      passedCount++;
      criteria.push({
        id: 'state',
        title: 'Eligible state',
        status: 'passed',
        message: `Must be domicile of ${scheme.eligibleStates.join(', ')} (Your state: ${userVal})`,
        required: scheme.eligibleStates.join(', '),
        actual: userVal
      });
    } else {
      hasFailedCondition = true;
      criteria.push({
        id: 'state',
        title: 'Eligible state',
        status: 'failed',
        message: `Scheme restricted to ${scheme.eligibleStates.join(', ')} (Your state: ${userVal})`,
        required: scheme.eligibleStates.join(', '),
        actual: userVal
      });
    }
  }

  // 6. Community / Category
  if (scheme.eligibleCommunities && scheme.eligibleCommunities.length > 0) {
    applicableCount++;
    const userVal = profile.community;
    if (!userVal) {
      hasMissingRequired = true;
      criteria.push({
        id: 'community',
        title: 'Eligible community',
        status: 'missing',
        message: 'Category / community is not filled in your profile.',
        required: scheme.eligibleCommunities.join(', '),
        actual: 'Not filled'
      });
    } else if (scheme.eligibleCommunities.includes(userVal)) {
      passedCount++;
      criteria.push({
        id: 'community',
        title: 'Eligible community',
        status: 'passed',
        message: `Eligible communities: ${scheme.eligibleCommunities.join(', ')} (Your category: ${userVal})`,
        required: scheme.eligibleCommunities.join(', '),
        actual: userVal
      });
    } else {
      hasFailedCondition = true;
      criteria.push({
        id: 'community',
        title: 'Eligible community',
        status: 'failed',
        message: `Requires ${scheme.eligibleCommunities.join(', ')} (Your category: ${userVal})`,
        required: scheme.eligibleCommunities.join(', '),
        actual: userVal
      });
    }
  }

  // 7. Gender
  if (scheme.gender && scheme.gender !== 'Any') {
    applicableCount++;
    const userVal = profile.gender;
    if (!userVal) {
      hasMissingRequired = true;
      criteria.push({
        id: 'gender',
        title: 'Gender requirement',
        status: 'missing',
        message: 'Gender is not filled in your profile.',
        required: scheme.gender,
        actual: 'Not filled'
      });
    } else if (userVal.toLowerCase() === scheme.gender.toLowerCase()) {
      passedCount++;
      criteria.push({
        id: 'gender',
        title: 'Gender requirement',
        status: 'passed',
        message: `Scheme restricted to ${scheme.gender} applicants.`,
        required: scheme.gender,
        actual: userVal
      });
    } else {
      hasFailedCondition = true;
      criteria.push({
        id: 'gender',
        title: 'Gender requirement',
        status: 'failed',
        message: `Scheme is exclusively for ${scheme.gender} candidates (Your value: ${userVal})`,
        required: scheme.gender,
        actual: userVal
      });
    }
  }

  // 8. Eligible Course
  if (scheme.eligibleCourses && scheme.eligibleCourses.length > 0) {
    applicableCount++;
    const userVal = profile.course;
    if (!userVal) {
      hasMissingRequired = true;
      criteria.push({
        id: 'course',
        title: 'Eligible course',
        status: 'missing',
        message: 'Course is not filled in your profile.',
        required: scheme.eligibleCourses.join(', '),
        actual: 'Not filled'
      });
    } else if (scheme.eligibleCourses.includes(userVal)) {
      passedCount++;
      criteria.push({
        id: 'course',
        title: 'Eligible course',
        status: 'passed',
        message: `Eligible courses: ${scheme.eligibleCourses.join(', ')} (Enrolled: ${userVal})`,
        required: scheme.eligibleCourses.join(', '),
        actual: userVal
      });
    } else {
      hasFailedCondition = true;
      criteria.push({
        id: 'course',
        title: 'Eligible course',
        status: 'failed',
        message: `Course not eligible. Supported courses: ${scheme.eligibleCourses.join(', ')} (Your course: ${userVal})`,
        required: scheme.eligibleCourses.join(', '),
        actual: userVal
      });
    }
  }

  // 9. Academic Year
  if (scheme.eligibleYears && scheme.eligibleYears.length > 0) {
    applicableCount++;
    const userVal = profile.currentYear;
    if (!userVal) {
      hasMissingRequired = true;
      criteria.push({
        id: 'currentYear',
        title: 'Academic year',
        status: 'missing',
        message: 'Current academic year is not filled in your profile.',
        required: scheme.eligibleYears.map(y => `Year ${y}`).join(', '),
        actual: 'Not filled'
      });
    } else {
      const yearNum = parseInt(userVal, 10);
      if (scheme.eligibleYears.includes(yearNum)) {
        passedCount++;
        criteria.push({
          id: 'currentYear',
          title: 'Academic year',
          status: 'passed',
          message: `Eligible for year(s): ${scheme.eligibleYears.join(', ')} (Your year: ${yearNum})`,
          required: scheme.eligibleYears.map(y => `Year ${y}`).join(', '),
          actual: `Year ${yearNum}`
        });
      } else {
        hasFailedCondition = true;
        criteria.push({
          id: 'currentYear',
          title: 'Academic year',
          status: 'failed',
          message: `Scheme restricted to Year ${scheme.eligibleYears.join(', ')} (Your year: ${yearNum})`,
          required: scheme.eligibleYears.map(y => `Year ${y}`).join(', '),
          actual: `Year ${yearNum}`
        });
      }
    }
  }

  // 10. Certified Disability
  if (scheme.requiresDisability) {
    applicableCount++;
    if (!profile.disability) {
      hasFailedCondition = true;
      criteria.push({
        id: 'disability',
        title: 'Certified disability',
        status: 'failed',
        message: 'Requires certified disability (PwD certificate).',
        required: 'Disability Certificate Required',
        actual: 'No disability indicated'
      });
    } else {
      passedCount++;
      criteria.push({
        id: 'disability',
        title: 'Certified disability',
        status: 'passed',
        message: 'Disability criteria verified.',
        required: 'Disability Certificate',
        actual: `Certified (${profile.disabilityPercentage || '40'}%)`
      });
    }
  }

  // 11. Sports
  if (scheme.requiresSports) {
    applicableCount++;
    if (!profile.sportsAchievement || profile.sportsAchievement === 'None') {
      hasFailedCondition = true;
      criteria.push({
        id: 'sports',
        title: 'Sports achievement',
        status: 'failed',
        message: 'Requires state or national level sports participation certificate.',
        required: 'State/National Sports Certificate',
        actual: profile.sportsAchievement || 'None'
      });
    } else {
      passedCount++;
      criteria.push({
        id: 'sports',
        title: 'Sports achievement',
        status: 'passed',
        message: `Sports achievement verified: ${profile.sportsAchievement}`,
        required: 'Recognised sports participation',
        actual: profile.sportsAchievement
      });
    }
  }

  // 12. Hosteller
  if (scheme.requiresHosteller) {
    applicableCount++;
    if (!profile.residence) {
      hasMissingRequired = true;
      criteria.push({
        id: 'residence',
        title: 'Residence type',
        status: 'missing',
        message: 'Residence type is not filled in your profile.',
        required: 'Hosteller',
        actual: 'Not filled'
      });
    } else if (profile.residence.toLowerCase() === 'hosteller') {
      passedCount++;
      criteria.push({
        id: 'residence',
        title: 'Residence type',
        status: 'passed',
        message: 'Hosteller requirement verified.',
        required: 'Hosteller',
        actual: 'Hosteller'
      });
    } else {
      hasFailedCondition = true;
      criteria.push({
        id: 'residence',
        title: 'Residence type',
        status: 'failed',
        message: 'Scheme is exclusively for hosteller students residing on campus.',
        required: 'Hosteller',
        actual: profile.residence
      });
    }
  }

  const matchPercentage = applicableCount > 0 ? Math.round((passedCount / applicableCount) * 100) : 100;
  
  let overallStatus = 'ineligible';
  if (matchPercentage === 100 && !hasMissingRequired && !hasFailedCondition) {
    overallStatus = 'eligible';
  } else if (passedCount > 0 && !hasFailedCondition) {
    overallStatus = 'partially_matching';
  } else if (passedCount > 0 && hasFailedCondition) {
    overallStatus = 'partially_matching';
  } else {
    overallStatus = 'ineligible';
  }

  return {
    schemeId: scheme.id,
    schemeCode: scheme.code,
    schemeName: scheme.name,
    provider: scheme.provider,
    category: scheme.category,
    amount: scheme.amount,
    closingDate: scheme.closingDate,
    matchPercentage,
    passedCount,
    applicableCount,
    overallStatus,
    criteria
  };
}

// POST /api/eligibility/check
router.post('/check', (req, res) => {
  const profile = req.body || {};
  const scholarships = getScholarships();

  const results = scholarships.map(scheme => evaluateSchemeEligibility(scheme, profile));

  const eligible = results.filter(r => r.overallStatus === 'eligible');
  const partiallyMatching = results.filter(r => r.overallStatus === 'partially_matching');
  const ineligible = results.filter(r => r.overallStatus === 'ineligible');

  res.json({
    totalEvaluated: scholarships.length,
    summary: {
      eligibleCount: eligible.length,
      partiallyMatchingCount: partiallyMatching.length,
      ineligibleCount: ineligible.length
    },
    results: {
      eligible,
      partiallyMatching,
      ineligible,
      all: results
    }
  });
});

// POST /api/eligibility/check/:schemeId
router.post('/check/:schemeId', (req, res) => {
  const profile = req.body || {};
  const scholarships = getScholarships();
  const scheme = scholarships.find(s => s.id === req.params.schemeId);
  if (!scheme) {
    return res.status(404).json({ error: 'Scheme not found' });
  }

  const evaluation = evaluateSchemeEligibility(scheme, profile);
  res.json(evaluation);
});

export default router;
