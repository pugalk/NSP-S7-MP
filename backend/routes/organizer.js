import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getScholarships, updateScholarships } from './scholarships.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const applicationsFilePath = path.join(__dirname, '../data/applications.json');

// Organizer / Scheme Provider Accounts
const ORGANIZER_ACCOUNTS = [
  {
    id: 'org_01',
    fullName: 'Vikram Singhania',
    organization: 'National Higher Education Foundation & CSR Trust',
    email: 'organizer@nsp.gov.in',
    password: 'organizer123',
    role: 'organizer',
    designation: 'Scholarship Program Director',
    allocatedBudget: 25000000, // 2.5 Crore
    managedSchemeIds: ['1', '2', '3', '4']
  },
  {
    id: 'org_02',
    fullName: 'Dr. Ananya Roy',
    organization: 'Tata & Global Educational CSR Consortium',
    email: 'trust@nsp.gov.in',
    password: 'trust123',
    role: 'organizer',
    designation: 'CSR Grants Head',
    allocatedBudget: 15000000,
    managedSchemeIds: ['10', '11']
  }
];

const getApplications = () => {
  if (fs.existsSync(applicationsFilePath)) {
    return JSON.parse(fs.readFileSync(applicationsFilePath, 'utf8'));
  }
  return [];
};

const saveApplications = (apps) => {
  fs.writeFileSync(applicationsFilePath, JSON.stringify(apps, null, 2));
};

// POST /api/organizer/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const organizer = ORGANIZER_ACCOUNTS.find(
    o => o.email.toLowerCase() === (email || '').toLowerCase() && o.password === password
  );

  if (!organizer) {
    return res.status(401).json({ error: 'Invalid scholarship organizer / provider credentials' });
  }

  res.json({
    success: true,
    organizer: {
      id: organizer.id,
      fullName: organizer.fullName,
      organization: organizer.organization,
      email: organizer.email,
      role: organizer.role,
      designation: organizer.designation,
      allocatedBudget: organizer.allocatedBudget,
      managedSchemeIds: organizer.managedSchemeIds
    }
  });
});

// GET /api/organizer/dashboard
router.get('/dashboard', (req, res) => {
  const email = req.headers['x-user-email'] || 'organizer@nsp.gov.in';
  const organizer = ORGANIZER_ACCOUNTS.find(o => o.email.toLowerCase() === email.toLowerCase()) || ORGANIZER_ACCOUNTS[0];

  const allScholarships = getScholarships();
  const allApplications = getApplications();

  // Find schemes managed by this organizer or with matching provider name
  const managedSchemes = allScholarships.filter(s => 
    organizer.managedSchemeIds.includes(s.id) ||
    s.provider.toLowerCase().includes('foundation') ||
    s.provider.toLowerCase().includes('ministry') ||
    s.provider.toLowerCase().includes('council')
  );

  const managedSchemeIds = new Set(managedSchemes.map(s => s.id));

  // Find applications for these schemes
  const schemeApplications = allApplications.filter(a => managedSchemeIds.has(a.scholarshipId));

  const totalSanctionedBudget = organizer.allocatedBudget;
  const disbursedAmount = schemeApplications
    .filter(a => a.status === 'Approved')
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  const pendingReviewCount = schemeApplications.filter(
    a => a.status === 'Provider Review' || a.status === 'Under Verification'
  ).length;

  res.json({
    organizer,
    stats: {
      totalSchemes: managedSchemes.length,
      activeSchemes: managedSchemes.filter(s => s.active).length,
      totalApplicants: schemeApplications.length,
      approvedGrants: schemeApplications.filter(a => a.status === 'Approved').length,
      pendingProviderReview: pendingReviewCount,
      totalBudget: totalSanctionedBudget,
      disbursedAmount,
      remainingBudget: totalSanctionedBudget - disbursedAmount
    },
    schemes: managedSchemes,
    applications: schemeApplications
  });
});

// POST /api/organizer/schemes (Create new scholarship scheme)
router.post('/schemes', (req, res) => {
  const {
    name,
    category = 'Merit-Based',
    amount = 50000,
    provider,
    description,
    closingDate,
    minCgpa = 7.5,
    minPercentage = 75,
    minAttendance = 75,
    maxFamilyIncome = 450000,
    eligibleCourses = ['B.Tech', 'B.Sc'],
    eligibleStates = ['Tamil Nadu', 'Karnataka']
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Scheme name is required' });
  }

  const scholarships = getScholarships();
  const newId = String(scholarships.length + 1);
  const code = `SCH-ORG-${Date.now().toString().slice(-4)}`;

  const newScheme = {
    id: newId,
    code,
    name,
    provider: provider || 'National Higher Education Foundation',
    category,
    amount: parseFloat(amount),
    description: description || `Scholarship grant for eligible students enrolled in higher education programs.`,
    closingDate: closingDate || '2026-11-30',
    minCgpa: parseFloat(minCgpa),
    minPercentage: parseFloat(minPercentage),
    minAttendance: parseFloat(minAttendance),
    maxFamilyIncome: parseFloat(maxFamilyIncome),
    gender: 'Any',
    eligibleCourses: Array.isArray(eligibleCourses) ? eligibleCourses : [eligibleCourses],
    eligibleStates: Array.isArray(eligibleStates) ? eligibleStates : [eligibleStates],
    eligibleCommunities: ['OC', 'BC', 'MBC', 'SC', 'ST', 'Minority', 'EWS'],
    active: true,
    renewable: true,
    createdAt: new Date().toISOString()
  };

  scholarships.unshift(newScheme);
  updateScholarships(scholarships);

  res.status(201).json({
    success: true,
    scheme: newScheme
  });
});

// PATCH /api/organizer/applications/:id/sanction (Provider quick sanction)
router.patch('/applications/:id/sanction', (req, res) => {
  const { decision = 'Approved', remark } = req.body;
  const applications = getApplications();
  const index = applications.findIndex(a => a.id === req.params.id || a.applicationId === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const app = applications[index];
  const now = new Date().toISOString();

  app.status = decision;
  app.remarks = remark || `Fund sanction granted by Scheme Organizer / Provider. Disbursal scheduled via PFMS DBT.`;
  app.updatedAt = now;
  app.nextAction = decision === 'Approved' ? 'Disbursal in progress through PFMS bank credit.' : 'Application closed by provider.';

  if (!app.history) app.history = [];
  app.history.push({
    status: decision,
    at: now,
    by: 'Scheme Provider / Organizer Desk',
    remark: app.remarks
  });

  saveApplications(applications);

  res.json({
    success: true,
    application: app
  });
});

export default router;
