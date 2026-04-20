import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import useAuthStore from './store/authStore';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuthStore();
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Placeholder Mock Pages - No longer needed as they are imported above
const LandingPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-600 to-blue-800 text-white p-4">
    <h1 className="text-5xl font-extrabold mb-6 animate-slide-up">EMI Management Platform</h1>
    <p className="text-xl mb-10 opacity-90 max-w-2xl text-center">
      Empowering candidates with flexible financial plans. Seamlessly manage your EMIs, documents, and payments in one place.
    </p>
    <div className="flex gap-4">
      <a href="/login" className="px-8 py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-slate-100 transition-all">Get Started</a>
      <a href="#features" className="px-8 py-3 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all">Learn More</a>
    </div>
  </div>
);

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Staff Routes */}
        <Route 
          path="/staff/*" 
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Candidate Routes */}
        <Route 
          path="/candidate/*" 
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <CandidateDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
