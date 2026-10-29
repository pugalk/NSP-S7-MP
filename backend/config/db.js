import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nsp_portal';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return true;

  try {
    // Attempt Mongoose connection with short timeout so it doesn't hang if MongoDB is not running locally
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    isConnected = true;
    console.log(`\x1b[32m[DATABASE]\x1b[0m MongoDB connected successfully to ${MONGODB_URI}`);
    return true;
  } catch (err) {
    console.log(`\x1b[33m[DATABASE]\x1b[0m MongoDB local service not running. Using Persistent File/JSON Store (Zero-crash guarantee).`);
    return false;
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  type: isConnected ? 'MongoDB (Mongoose)' : 'Persistent JSON Store (Auto-Fallback)',
  uri: isConnected ? MONGODB_URI : 'Local data/ store'
});
