import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const scholarshipsDataPath = path.join(__dirname, '../data/scholarships.json');
let scholarships = JSON.parse(fs.readFileSync(scholarshipsDataPath, 'utf8'));

// Helper to get all scholarships
export const getScholarships = () => scholarships;
export const updateScholarships = (newScholarships) => {
  scholarships = newScholarships;
  fs.writeFileSync(scholarshipsDataPath, JSON.stringify(scholarships, null, 2));
};

// GET /api/scholarships
router.get('/', (req, res) => {
  const { category, state, search, status, gender, course } = req.query;
  const now = new Date();

  let results = [...scholarships];

  if (category && category !== 'All') {
    results = results.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }

  if (state && state !== 'All') {
    results = results.filter(s => 
      !s.eligibleStates || s.eligibleStates.length === 0 || s.eligibleStates.includes(state)
    );
  }

  if (gender && gender !== 'Any') {
    results = results.filter(s => s.gender === 'Any' || s.gender === gender);
  }

  if (course && course !== 'All') {
    results = results.filter(s => 
      !s.eligibleCourses || s.eligibleCourses.length === 0 || s.eligibleCourses.includes(course)
    );
  }

  if (status) {
    if (status === 'active') {
      results = results.filter(s => s.active && new Date(s.closingDate) >= now);
    } else if (status === 'closed') {
      results = results.filter(s => !s.active || new Date(s.closingDate) < now);
    } else if (status === 'closing_soon') {
      results = results.filter(s => {
        if (!s.active) return false;
        const diffDays = Math.ceil((new Date(s.closingDate) - now) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 15;
      });
    }
  }

  if (search) {
    const q = search.toLowerCase().trim();
    results = results.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.provider.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q))
    );
  }

  res.json({
    total: results.length,
    schemes: results
  });
});

// GET /api/scholarships/:id
router.get('/:id', (req, res) => {
  const scheme = scholarships.find(s => s.id === req.params.id || s.code === req.params.id);
  if (!scheme) {
    return res.status(404).json({ error: 'Scholarship scheme not found' });
  }
  res.json(scheme);
});

// POST /api/scholarships (Organizer create new scheme)
router.post('/', (req, res) => {
  const newId = String(Date.now());
  const newCode = req.body.code || `SCH-${Math.floor(1000 + Math.random() * 9000)}`;
  const newScheme = {
    id: newId,
    code: newCode,
    name: req.body.name || 'Untitled Scholarship Scheme',
    provider: req.body.provider || 'National Education Foundation',
    category: req.body.category || 'Merit-Based',
    description: req.body.description || 'Financial assistance program for eligible students.',
    benefits: req.body.benefits || ['Tuition Grant', 'Direct Bank Disbursal'],
    amount: Number(req.body.amount) || 50000,
    openingDate: req.body.openingDate || new Date().toISOString().split('T')[0],
    closingDate: req.body.closingDate || '2026-11-30',
    eligibleStates: req.body.eligibleStates || [],
    eligibleCommunities: req.body.eligibleCommunities || [],
    gender: req.body.gender || 'Any',
    minPercentage: req.body.minPercentage !== undefined ? Number(req.body.minPercentage) : 75,
    minCgpa: req.body.minCgpa !== undefined ? Number(req.body.minCgpa) : 7.5,
    minAttendance: req.body.minAttendance !== undefined ? Number(req.body.minAttendance) : 75,
    maxFamilyIncome: req.body.maxFamilyIncome !== undefined ? Number(req.body.maxFamilyIncome) : 500000,
    eligibleCourses: req.body.eligibleCourses || ['B.Tech', 'B.Sc', 'Degree'],
    eligibleYears: req.body.eligibleYears || [1, 2, 3, 4],
    requiredDocuments: req.body.requiredDocuments || ['Aadhaar Card', 'Marksheet', 'Income Certificate', 'Bonafide'],
    renewable: req.body.renewable !== undefined ? req.body.renewable : true,
    renewalCriteria: req.body.renewalCriteria || 'Maintain promotion CGPA and 75% attendance.',
    active: true
  };

  scholarships.unshift(newScheme);
  fs.writeFileSync(scholarshipsDataPath, JSON.stringify(scholarships, null, 2));
  res.status(201).json({ success: true, scheme: newScheme });
});

// DELETE /api/scholarships/:id (Organizer remove scheme)
router.delete('/:id', (req, res) => {
  const index = scholarships.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Scholarship scheme not found' });
  }
  const removed = scholarships.splice(index, 1)[0];
  fs.writeFileSync(scholarshipsDataPath, JSON.stringify(scholarships, null, 2));
  res.json({ success: true, message: 'Scholarship scheme deleted successfully', removedId: req.params.id });
});

export default router;
