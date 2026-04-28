const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists and is not "null"/"undefined" string from frontend
  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ 
      success: false, 
      error: 'Session expired or not logged in. Please log in again.' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not found. Please log in again.' 
      });
    }

    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return res.status(401).json({ 
      success: false, 
      error: err.name === 'TokenExpiredError' ? 'Your session has expired. Please log in again.' : 'Not authorized to access this route. Invalid token.' 
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
