import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_PRIMARY_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nsp_portal';
const MONGODB_FALLBACK_URI = 'mongodb://127.0.0.1:27017/nsp_portal';

let isConnected = false;
let activeUri = MONGODB_PRIMARY_URI;

// Auto-seed MongoDB with initial datasets on connection
const seedDatabase = async () => {
  try {
    const { default: User } = await import('../models/User.js');
    const { default: Scholarship } = await import('../models/Scholarship.js');
    const { default: Application } = await import('../models/Application.js');

    // Seed Users if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const usersPath = path.join(__dirname, '../data/users.json');
      if (fs.existsSync(usersPath)) {
        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        const userDocs = usersData.map(u => ({
          fullName: u.fullName,
          email: u.email.toLowerCase(),
          password: u.passwordHash || u.password,
          role: u.role,
          userIdentifier: u.userIdentifier || '',
          phone: u.phone || '',
          organization: u.organization || '',
          department: u.department || '',
          profile: u.profile || {}
        }));
        await User.insertMany(userDocs, { ordered: false });
        console.log(`\x1b[32m[DATABASE SEED]\x1b[0m Populated ${userDocs.length} users into MongoDB 'users' collection.`);
      }
    }

    // Seed Scholarships if empty
    const schemeCount = await Scholarship.countDocuments();
    if (schemeCount === 0) {
      const schemesPath = path.join(__dirname, '../data/scholarships.json');
      if (fs.existsSync(schemesPath)) {
        const schemesData = JSON.parse(fs.readFileSync(schemesPath, 'utf8'));
        await Scholarship.insertMany(schemesData, { ordered: false });
        console.log(`\x1b[32m[DATABASE SEED]\x1b[0m Populated ${schemesData.length} schemes into MongoDB 'scholarships' collection.`);
      }
    }

    // Seed Applications if empty
    const appCount = await Application.countDocuments();
    if (appCount === 0) {
      const appsPath = path.join(__dirname, '../data/applications.json');
      if (fs.existsSync(appsPath)) {
        const appsData = JSON.parse(fs.readFileSync(appsPath, 'utf8'));
        await Application.insertMany(appsData, { ordered: false });
        console.log(`\x1b[32m[DATABASE SEED]\x1b[0m Populated ${appsData.length} applications into MongoDB 'applications' collection.`);
      }
    }
  } catch (err) {
    console.warn('[DATABASE SEED NOTE]', err.message);
  }
};

export const connectDB = async () => {
  if (isConnected) return true;

  // Try localhost:27017 first
  try {
    await mongoose.connect(MONGODB_PRIMARY_URI, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500
    });
    isConnected = true;
    activeUri = MONGODB_PRIMARY_URI;
    console.log(`\x1b[32m[DATABASE]\x1b[0m MongoDB connected successfully to ${MONGODB_PRIMARY_URI}`);
    await seedDatabase();
    return true;
  } catch (err1) {
    // Try 127.0.0.1:27017 as fallback
    try {
      await mongoose.connect(MONGODB_FALLBACK_URI, {
        serverSelectionTimeoutMS: 2500,
        connectTimeoutMS: 2500
      });
      isConnected = true;
      activeUri = MONGODB_FALLBACK_URI;
      console.log(`\x1b[32m[DATABASE]\x1b[0m MongoDB connected successfully to ${MONGODB_FALLBACK_URI}`);
      await seedDatabase();
      return true;
    } catch (err2) {
      console.log(`\x1b[33m[DATABASE]\x1b[0m MongoDB local service not running. Using Persistent File/JSON Store (Zero-crash guarantee).`);
      return false;
    }
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  type: isConnected ? 'MongoDB (Mongoose)' : 'Persistent JSON Store (Auto-Fallback)',
  uri: isConnected ? activeUri : 'Local data/ store'
});
