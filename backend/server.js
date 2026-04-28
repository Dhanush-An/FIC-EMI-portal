const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route files
const auth = require('./routes/authRoutes');
const candidate = require('./routes/candidateRoutes');
const admin = require('./routes/adminRoutes');
const staff = require('./routes/staffRoutes');
const payments = require('./routes/paymentRoutes');
const support = require('./routes/supportRoutes');

// Home route
app.get("/", (req, res) => {
  res.send("FIC EMI Portal Backend API is running ✅");
});

// Mount routers
app.use('/api/auth', auth);
app.use('/api/candidate', candidate);
app.use('/api/admin', admin);
app.use('/api/staff', staff);
app.use('/api/payments', payments);
app.use('/api/support', support);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // 404 Handler for development (not found in API)
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found"
    });
  });
}

// Connect to database and start server
connectDB().then(async () => {
  // Ensure the master admin account always exists
  const adminExists = await User.findOne({ email: 'admin@fic.com' });
  if (!adminExists) {
    await User.create({
      name: 'System Admin',
      email: 'admin@fic.com',
      password: 'Password123',
      role: 'admin',
      phone: '0000000000',
      isVerified: true
    });
    console.log('✅ Master Admin account verified: admin@fic.com / Password123');
  } else {
    // Optionally reset password if it was somehow corrupted
    adminExists.password = 'Password123';
    await adminExists.save();
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
