import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  User,
  Bell,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  ChevronUp
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';
import EMIApplicationForm from '../components/EMIApplicationForm';
import ApplicationList from '../components/ApplicationList';
import SupportSystem from '../components/SupportSystem';
import { processDownPayment } from '../services/PaymentService';
import axios from 'axios';

const PaymentHistory = () => {
  const mockPayments = [];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Transaction History</h3>
        <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
           <Download size={16} /> Export Statement
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockPayments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${p.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-500 font-mono">{p.id}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{p.date}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">{p.amount}</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{p.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sub-components
const DashboardHome = () => {
  const [apps, setApps] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:5002/api/candidate/applications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApps(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchApps();
  }, []);

  const activeApp = apps.find(a => ['Approved', 'Submitted', 'Under Review', 'Verified'].includes(a.status));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 bg-gradient-to-br from-primary-600 to-blue-700 text-white">
          <h3 className="text-lg font-semibold opacity-90">Total active balance</h3>
          <p className="text-3xl font-bold mt-2">₹ 0</p>
          <div className="mt-4 flex items-center text-sm opacity-80">
            <Clock size={16} className="mr-1" /> All clear
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-700">Next Due</h3>
          <p className="text-3xl font-bold mt-2 text-slate-900">₹ 0</p>
          <div className="mt-4 flex items-center text-sm text-slate-500">
            <CheckCircle2 size={16} className="mr-1 text-green-500" /> Fully paid
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-700">Application Status</h3>
          <p className={`text-3xl font-bold mt-2 ${activeApp ? 'text-primary-600' : 'text-slate-400'}`}>
            {activeApp ? activeApp.status : 'No Active App'}
          </p>
          <div className="mt-4 flex items-center text-sm text-slate-500">
            {activeApp?.status === 'Approved' ? (
              <button 
                onClick={() => processDownPayment(activeApp.amountRequested * 0.1, activeApp._id, user.name, user.email)}
                className="btn-primary py-1.5 px-3 text-xs"
              >
                Pay Down Payment (₹{(activeApp.amountRequested * 0.1).toLocaleString()})
              </button>
            ) : (
              <Link to="apply" className="flex items-center text-primary-600 font-medium hover:underline">
                {activeApp ? 'View Details' : 'Apply Now'} <ChevronRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>

  </div>
  );
};

const CandidateDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { title: 'EMI Option', icon: <FileText size={20} />, path: '/candidate/applications' },
    { title: 'Payment Auto Debit', icon: <CreditCard size={20} />, path: '/candidate/payments' },
    { title: 'Overdue Payments', icon: <AlertCircle size={20} className="text-red-500" />, path: '/candidate/overdue' },
    { title: 'Support Options', icon: <HelpCircle size={20} />, path: '/candidate/support' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        {/* Fixed Header */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-xl">F</div>
            <span className="text-xl font-bold tracking-tight text-slate-800">FORGE INDIA</span>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link rounded-xl mx-2 ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="relative">
            {showProfileMenu && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-slide-up z-50">
                <Link 
                  to="/candidate/profile"
                  className="flex items-center gap-3 px-6 py-4 text-slate-600 hover:bg-slate-50 w-full transition-all font-sans text-sm font-bold border-b border-slate-50"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User size={18} /> My Profile
                </Link>
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
                {user?.name?.charAt(0) || 'C'}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Candidate'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role || 'Candidate'}</p>
              </div>
              <ChevronUp size={16} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome, {user?.name}</h2>
            <p className="text-slate-500">Here's what's happening with your account.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-100 flex items-center gap-1">
              <CheckCircle2 size={12} /> Secure Connection
            </span>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/apply" element={<EMIApplicationForm />} />
          <Route path="/applications" element={<ApplicationList />} />
          <Route path="/payments" element={<PaymentHistory />} />
          <Route path="/overdue" element={
            <div className="glass-card p-12 text-center animate-fade-in flex flex-col items-center border-l-4 border-red-500">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Payment Overdue</h3>
              <p className="text-slate-500 mb-8 max-w-md">Your recent EMI payment is past due. Please clear your outstanding balance immediately to avoid late fees and impact on your credit score.</p>
              <button className="btn-primary bg-red-600 hover:bg-red-700 shadow-red-200">Clear Outstanding Now</button>
            </div>
          } />
          <Route path="/support" element={<SupportSystem />} />
        </Routes>
      </main>
    </div>
  );
};

export default CandidateDashboard;
