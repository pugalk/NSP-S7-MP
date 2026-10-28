import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const usersFilePath = path.join(__dirname, '../data/users.json');

// Ensure users file exists with a default demo account
if (!fs.existsSync(usersFilePath)) {
  const initialUsers = [
    {
      id: 'usr_demo_01',
      fullName: 'Aravind Swaminathan',
      email: 'student@nsp.gov.in',
      password: 'student123',
      role: 'student',
      profile: {
        fullName: 'Aravind Swaminathan',
        email: 'student@nsp.gov.in',
        phone: '+91 98765 43210',
        dob: '2004-05-15',
        gender: 'Male',
        state: 'Tamil Nadu',
        district: 'Chennai',
        address: '12, Anna Salai, Guindy, Chennai - 600025',
        community: 'BC',
        institution: 'Anna University, Chennai',
        course: 'B.Tech',
        department: 'Computer Science and Engineering',
        currentYear: '3',
        registrationNumber: 'AU2022CS084',
        previousPercentage: '82',
        cgpa: '8.4',
        attendance: '88',
        familyIncome: '220000',
        disability: false,
        disabilityPercentage: '',
        residence: 'Day Scholar',
        sportsAchievement: 'None',
        previousScholarship: 'Central Sector Post-Matric Scholarship',
        previousScholarshipId: 'NSP-2025-419201'
      }
    }
  ];
  fs.writeFileSync(usersFilePath, JSON.stringify(initialUsers, null, 2));
}

const getUsers = () => JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
const saveUsers = (users) => fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { fullName, email, password, phone, state, course, community, ...rest } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Full name, email and password are required' });
  }

  const users = getUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    fullName,
    email,
    password,
    role: 'student',
    profile: {
      fullName,
      email,
      phone: phone || '',
      state: state || '',
      course: course || '',
      community: community || '',
      dob: '',
      gender: '',
      district: '',
      address: '',
      institution: '',
      department: '',
      currentYear: '1',
      registrationNumber: '',
      previousPercentage: '',
      cgpa: '',
      attendance: '',
      familyIncome: '',
      disability: false,
      disabilityPercentage: '',
      residence: 'Day Scholar',
      sportsAchievement: 'None',
      previousScholarship: '',
      previousScholarshipId: '',
      ...rest
    }
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role
    },
    profile: newUser.profile
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email. Please register first.' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: 'Incorrect password. Please try again.' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    },
    profile: user.profile
  });
});

// GET /api/auth/profile
router.get('/profile', (req, res) => {
  const email = req.headers['x-user-email'];
  if (!email) {
    return res.status(401).json({ error: 'Missing user identification' });
  }

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user.profile);
});

// PUT /api/auth/profile
router.put('/profile', (req, res) => {
  const email = req.headers['x-user-email'] || req.body.email;
  if (!email) {
    return res.status(401).json({ error: 'Missing user identification' });
  }

  const users = getUsers();
  const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[index].profile = { ...users[index].profile, ...req.body };
  if (req.body.fullName) users[index].fullName = req.body.fullName;

  saveUsers(users);

  res.json({
    success: true,
    profile: users[index].profile
  });
});

export default router;
