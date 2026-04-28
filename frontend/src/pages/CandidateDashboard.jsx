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
import logo from '../assets/logo.webp';
import ProfileForm from '../components/ProfileForm';
import EMIApplicationForm from '../components/EMIApplicationForm';
import ApplicationList from '../components/ApplicationList';
import SupportSystem from '../components/SupportSystem';
import { processDownPayment } from '../services/PaymentService';
import axios from 'axios';
import API_BASE_URL from '../config';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/candidate/payments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

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
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-slate-500">Loading payments...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-slate-500">No payment history found.</td></tr>
            ) : payments.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${p.status === 'Success' ? 'bg-green-100 text-green-600' : p.status === 'Failed' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-500 font-mono">{p.razorpayPaymentId || p._id}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{p.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{p.method || 'Razorpay'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OverduePayments = () => {
  const [overdueInstalls, setOverdueInstalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOverdue = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/candidate/applications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const apps = res.data.data || [];
        const overdue = [];
        
        apps.forEach(app => {
          if (app.emiPlanId && app.emiPlanId.schedule) {
            app.emiPlanId.schedule.forEach(inst => {
              const isOverdue = inst.status === 'Overdue' || (inst.status === 'Pending' && new Date(inst.dueDate) < new Date());
              if (isOverdue) {
                overdue.push({ ...inst, appId: app._id, service: app.service });
              }
            });
          }
        });
        setOverdueInstalls(overdue);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverdue();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-medium animate-pulse">Loading overdue payments...</div>;
  }

  if (overdueInstalls.length === 0) {
    return (
      <div className="glass-card p-12 text-center animate-fade-in flex flex-col items-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Account Healthy</h3>
        <p className="text-slate-500 mb-8 max-w-md">You have no overdue payments. All your EMI obligations are currently up to date.</p>
        <button className="btn-primary" onClick={() => navigate('/candidate/payments')}>View Payment History</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Overdue Payments</h3>
      </div>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
              <th className="px-6 py-4">Installment No</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {overdueInstalls.map((inst, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{inst.installmentNo}</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-500">{inst.service}</td>
                <td className="px-6 py-4 text-sm font-bold text-red-600">{new Date(inst.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{inst.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => navigate('/candidate/applications')} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition-all">
                    Pay Now
                  </button>
                </td>
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
        const res = await axios.get(`${API_BASE_URL}/api/candidate/applications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApps(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchApps();
  }, []);

  const activeApp = apps.find(a => ['Approved', 'Submitted', 'Under Review', 'Verified', 'Active'].includes(a.status));
  const activePlan = apps.find(a => a.status === 'Active')?.emiPlanId;

  const totalActiveBalance = activePlan?.remainingBalance || 0;
  const nextInstallment = activePlan?.schedule?.find(s => s.status === 'Pending');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 bg-gradient-to-br from-primary-600 to-blue-700 text-white">
          <h3 className="text-lg font-semibold opacity-90">Total active balance</h3>
          <p className="text-3xl font-bold mt-2">₹ {totalActiveBalance.toLocaleString()}</p>
          <div className="mt-4 flex items-center text-sm opacity-80">
            {totalActiveBalance > 0 ? (
              <><Clock size={16} className="mr-1" /> Payment in progress</>
            ) : (
              <><CheckCircle2 size={16} className="mr-1" /> All clear</>
            )}
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-700">Next Due</h3>
          <p className="text-3xl font-bold mt-2 text-slate-900">₹ {(nextInstallment?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <div className="mt-4 flex items-center text-sm text-slate-500">
            {nextInstallment ? (
              <><Clock size={16} className="mr-1 text-orange-500" /> Due on {new Date(nextInstallment.dueDate).toLocaleDateString()}</>
            ) : (
              <><CheckCircle2 size={16} className="mr-1 text-green-500" /> Fully paid</>
            )}
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
                onClick={() => processDownPayment(Math.round(activeApp.amountRequested * 0.1 * 100) / 100, activeApp._id, user.name, user.email)}
                className="btn-primary py-1.5 px-3 text-xs"
              >
                Pay Down Payment (₹{(Math.round(activeApp.amountRequested * 0.1 * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
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
    { title: 'Payment History', icon: <CreditCard size={20} />, path: '/candidate/payments' },
    { title: 'Overdue Payments', icon: <AlertCircle size={20} className="text-red-500" />, path: '/candidate/overdue' },
    { title: 'Support Options', icon: <HelpCircle size={20} />, path: '/candidate/support' },
  ];

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
          <Route path="/overdue" element={<OverduePayments />} />
          <Route path="/support" element={<SupportSystem />} />
        </Routes>
      </main>
    </div>
  );
};

export default CandidateDashboard;
