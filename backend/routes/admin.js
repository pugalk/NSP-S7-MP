import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getScholarships } from './scholarships.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const applicationsFilePath = path.join(__dirname, '../data/applications.json');
const docsFilePath = path.join(__dirname, '../data/documents.json');

// Staff accounts
const STAFF_ACCOUNTS = [
  {
    id: 'staff_01',
    fullName: 'Dr. Ramesh Kumar',
    email: 'admin@nsp.gov.in',
    password: 'admin',
    role: 'State Nodal Officer',
    department: 'Directorate of Higher Education'
  },
  {
    id: 'staff_02',
    fullName: 'Priya Sundaram',
    email: 'reviewer@nsp.gov.in',
    password: 'admin',
    role: 'Verification Desk Officer',
    department: 'Scholarship Disbursal Cell'
  }
];

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const staff = STAFF_ACCOUNTS.find(
    s => s.email.toLowerCase() === (email || '').toLowerCase() && s.password === password
  );

  if (!staff) {
    return res.status(401).json({ error: 'Invalid staff credentials' });
  }

  res.json({
    success: true,
    staff: {
      id: staff.id,
      fullName: staff.fullName,
      email: staff.email,
      role: staff.role,
      department: staff.department
    }
  });
});

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  const scholarships = getScholarships();
  const applications = fs.existsSync(applicationsFilePath)
    ? JSON.parse(fs.readFileSync(applicationsFilePath, 'utf8'))
    : [];
  const documents = fs.existsSync(docsFilePath)
    ? JSON.parse(fs.readFileSync(docsFilePath, 'utf8'))
    : [];

  const totalSchemes = scholarships.length;
  const activeSchemes = scholarships.filter(s => s.active && new Date(s.closingDate) >= new Date()).length;
  const totalApplications = applications.length;
  const approvedApplications = applications.filter(a => a.status === 'Approved').length;
  const pendingApplications = applications.filter(a => a.status !== 'Approved' && a.status !== 'Rejected').length;
  const rejectedApplications = applications.filter(a => a.status === 'Rejected').length;

  const totalDisbursedAmount = applications
    .filter(a => a.status === 'Approved')
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  // Category breakdown
  const categoryCounts = {};
  scholarships.forEach(s => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  });

  res.json({
    totalSchemes,
    activeSchemes,
    totalApplications,
    approvedApplications,
    pendingApplications,
    rejectedApplications,
    totalDisbursedAmount,
    totalDocuments: documents.length,
    pendingDocuments: documents.filter(d => d.status === 'Pending Verification').length,
    categoryCounts
  });
});

export default router;
