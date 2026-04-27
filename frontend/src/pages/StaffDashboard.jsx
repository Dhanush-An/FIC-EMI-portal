import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  LayoutDashboard,
  LogOut,
  Bell,
  UserPlus,
  FileUp,
  PhoneCall,
  MessageSquare,
  ShieldAlert,
  ScrollText,
  Download,
  Banknote,
  User as UserIcon,
  ChevronUp
} from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { useNavigate, Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import logo from '../assets/logo.webp';

// New Operational Modules
import StaffOverview from '../components/staff/StaffOverview';
import AddCandidate from '../components/staff/AddCandidate';
import KYCQueue from '../components/staff/KYCQueue';
import ApplyLoan from '../components/staff/ApplyLoan';
import FollowUpManager from '../components/staff/FollowUpManager';
import DueReminders from '../components/staff/DueReminders';
import EscalateFailures from '../components/staff/EscalateFailures';
import DailyReportForm from '../components/staff/DailyReportForm';
import DownloadLedgers from '../components/staff/DownloadLedgers';

import SupportSystem from '../components/SupportSystem';

const StaffDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:5002/api/staff/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    if (!window.confirm('Confirm that you have verified all documents for this candidate?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:5002/api/staff/verify/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        {/* Fixed Header */}
        <div className="p-6 pb-2">
          <div className="flex flex-col items-center mb-6 px-2 mt-2">
            <img src={logo} alt="Forge India" className="h-16 w-auto mb-2 drop-shadow-sm" />
            <div className="h-1 w-12 bg-accent-500 rounded-full opacity-80" />
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <nav className="space-y-4">
            <div>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-sans">Onboarding</p>
              <div className="space-y-1 font-sans">
                <Link to="/staff/add-candidate" className={`nav-link rounded-xl mx-2 ${location.pathname === '/staff/add-candidate' ? 'active shadow-sm' : ''}`}>
                  <UserPlus size={18} />
                  <span className="font-medium">New Candidate</span>
                </Link>
                <Link to="/staff/apply-loan" className={`nav-link rounded-xl mx-2 ${location.pathname === '/staff/apply-loan' ? 'active shadow-sm' : ''}`}>
                  <Banknote size={18} />
                  <span className="font-medium">Apply Loan</span>
                </Link>
                <Link to="/staff/kyc-verify" className={`nav-link rounded-xl mx-2 ${location.pathname === '/staff/kyc-verify' ? 'active shadow-sm' : ''}`}>
                  <FileUp size={18} />
                  <span className="font-medium">KYC Verification</span>
                </Link>
              </div>
            </div>

            <div>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-sans">My Operations</p>
              <div className="space-y-1 font-sans">
                <Link to="/staff/reminders" className={`nav-link rounded-xl mx-2 ${location.pathname === '/staff/reminders' ? 'active shadow-sm' : ''}`}>
                   <Bell size={18} />
                  <span className="font-medium">Due Reminders</span>
                </Link>
                <Link to="/staff/escalate" className={`nav-link rounded-xl mx-2 ${location.pathname === '/staff/escalate' ? 'active shadow-sm' : ''}`}>
                  <ShieldAlert size={18} />
                  <span className="font-medium">Escalate Failures</span>
                </Link>
                <Link to="/staff/support" className={`nav-link rounded-xl mx-2 ${location.pathname === '/staff/support' ? 'active shadow-sm' : ''}`}>
                  <MessageSquare size={18} />
                  <span className="font-medium">Support Hub</span>
                </Link>
              </div>
            </div>

            <div>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-sans">Productivity</p>
              <div className="space-y-1 font-sans">
                <Link to="/staff/ledgers" className={`nav-link rounded-xl mx-2 ${location.pathname === '/staff/ledgers' ? 'active shadow-sm' : ''}`}>
                  <Download size={18} />
                  <span className="font-medium">Download Ledgers</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="relative">
            {showProfileMenu && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-slide-up">
                <button 
                  onClick={() => { logout(); navigate('/login'); }} 
                  className="flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 w-full transition-all font-sans text-sm font-bold"
                >
                  <LogOut size={18} /> Logout Session
                </button>
              </div>
            )}
            
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center gap-3 p-3 w-full rounded-2xl transition-all font-sans ${showProfileMenu ? 'bg-slate-100 shadow-inner' : 'hover:bg-slate-50'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-200 text-sm">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Staff Member'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role || 'Operations'}</p>
              </div>
              <ChevronUp size={16} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 ml-64 p-10 font-sans">
        <div className="pt-2">

        <Routes>
          <Route path="/" element={<Navigate to="/staff/add-candidate" />} />
          <Route path="/add-candidate" element={<AddCandidate />} />
          <Route path="/apply-loan" element={<ApplyLoan />} />
          <Route path="/kyc-verify" element={<KYCQueue applications={applications} onVerify={handleVerify} />} />
          <Route path="/reminders" element={<DueReminders applications={applications} />} />
          <Route path="/escalate" element={<EscalateFailures applications={applications} />} />
          <Route path="/support" element={<SupportSystem isAdmin={true} />} />
          <Route path="/ledgers" element={<DownloadLedgers applications={applications} />} />
        </Routes>
      </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
