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

    // Fallback to memory server
    console.log('--- Starting MongoDB Memory Server (Local Fallback) ---');
    const mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected (Local): ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Critical DB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
