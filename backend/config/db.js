const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  console.log('Env MONGODB_PERSISTENT:', process.env.MONGODB_PERSISTENT);
  try {
    let uri = process.env.MONGO_URI;

    // Try primary connection
    if (uri && !uri.includes('127.0.0.1') && !uri.includes('localhost')) {
      try {
        const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
        console.log(`✅ MongoDB Connected (Persistent Cloud): ${conn.connection.host}`);
        return;
      } catch (err) {
        if (process.env.MONGODB_PERSISTENT === 'true') {
           console.error(`❌ PERSISTENCE FAILURE: Could not connect to Cloud MongoDB. Since MONGODB_PERSISTENT=true, the server will not start to avoid data loss.`);
           console.error(`Error: ${err.message}`);
           process.exit(1);
        }
        console.error(`⚠️ Cloud MongoDB connection failed: ${err.message}. Falling back to memory...`);
      }
    }

    // Fallback to memory server removed (Force Persistent DB)
    console.error('--- Critical: Cloud MongoDB connection failed and no fallback allowed ---');
    if (!uri) console.error('Error: MONGO_URI is missing in environment variables.');
    process.exit(1);
  } catch (error) {
    console.error(`❌ Critical DB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
