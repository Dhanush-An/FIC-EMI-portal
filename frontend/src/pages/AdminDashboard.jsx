import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileCheck, 
  UserCheck, 
  TrendingUp, 
  Search, 
  Filter, 
  MoreVertical,
  Check,
  X,
  UserPlus,
  CheckCircle,
  Clock,
  LayoutDashboard,
  LogOut,
  Bell,
  CreditCard,
  Settings,
  ShieldCheck,
  FileBarChart,
  RefreshCcw,
  AlertOctagon,
  ArrowRight,
  PlusCircle,
  Download,
  History,
  AlertCircle,
  FileText,
  PieChart,
  BarChart,
  Target,
  MessageSquare,
  HelpCircle,
  ChevronUp
} from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';
import logo from '../assets/logo.webp';
import useAuthStore from '../store/authStore';
import { useNavigate, Link, Routes, Route, useLocation } from 'react-router-dom';
import CandidatesTab from '../components/admin/CandidatesTab';
import StaffTab from '../components/admin/StaffTab';
import ActivePlansTab from '../components/admin/ActivePlansTab';
import OverdueTab from '../components/admin/OverdueTab';
import PaymentsTab from '../components/admin/PaymentsTab';
import FailuresTab from '../components/admin/FailuresTab';
import RefundsTab from '../components/admin/RefundsTab';
import AuditTab from '../components/admin/AuditTab';
import NotificationsTab from '../components/admin/NotificationsTab';
import ApplicationCenter from '../components/admin/ApplicationCenter';
import SettingsTab from '../components/admin/SettingsTab';
import SupportSystem from '../components/SupportSystem';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
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
      const [appRes, staffRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/applications`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/admin/staff`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setApplications(appRes.data.data);
      setStaff(staffRes.data.data);
      
      const apps = appRes.data.data;
      setStats({
        total: apps.length,
        pending: apps.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length,
        approved: apps.filter(a => a.status === 'Approved' || a.status === 'Active').length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this application?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Approval failed');
    }
  };

  const handleAssign = async (staffId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/admin/assign/${selectedApp}`, { staffId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAssignModal(false);
      fetchData();
    } catch (err) {
      alert('Assignment failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Similar to Candidate for consistency */}
      <aside className="dashboard-sidebar">
        <div className="p-6">
          <div className="flex flex-col items-center mb-10 px-2 mt-4">
            <img src={logo} alt="Forge India" className="h-16 w-auto mb-2 drop-shadow-sm" />
            <div className="h-1 w-12 bg-accent-500 rounded-full opacity-80" />
          </div>
          <nav className="space-y-4">
            <div>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Core Dashboard</p>
              <div className="space-y-1">
                <Link to="/admin" className={`nav-link rounded-xl mx-2 ${location.pathname === '/admin' ? 'active shadow-sm' : ''}`}>
                  <LayoutDashboard size={18} />
                  <span className="font-medium">Overview</span>
                </Link>
                <Link to="/admin/candidates" className={`nav-link rounded-xl mx-2 ${location.pathname === '/admin/candidates' ? 'active shadow-sm' : ''}`}>
                  <Users size={18} />
                  <span className="font-medium">Candidates</span>
                </Link>
                <Link to="/admin/staff" className={`nav-link rounded-xl mx-2 ${location.pathname === '/admin/staff' ? 'active shadow-sm' : ''}`}>
                  <UserPlus size={18} />
                  <span className="font-medium">Staff Management</span>
                </Link>
              </div>
            </div>

            <div>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">EMI Operations</p>
              <div className="space-y-1">
                <Link to="/admin/applications" className={`nav-link rounded-xl mx-2 ${location.pathname === '/admin/applications' ? 'active shadow-sm' : ''}`}>
                  <FileText size={18} />
                  <span className="font-medium">Decisions/Approve</span>
                </Link>
                <Link to="/admin/active-plans" className={`nav-link rounded-xl mx-2 ${location.pathname === '/admin/active-plans' ? 'active shadow-sm' : ''}`}>
                  <CheckCircle size={18} />
                  <span className="font-medium">Active EMI Plans</span>
                </Link>
                <Link to="/admin/overdue" className={`nav-link rounded-xl mx-2 ${location.pathname === '/admin/overdue' ? 'active shadow-sm' : ''}`}>
                  <AlertCircle size={18} />
                  <span className="font-medium text-red-600">Overdue EMIs</span>
                </Link>
              </div>
            </div>

            <div>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Financials</p>
              <div className="space-y-1">
                <Link to="/admin/payments" className={`nav-link rounded-xl mx-2 ${location.pathname === '/admin/payments' ? 'active shadow-sm' : ''}`}>
                  <CreditCard size={18} />
                  <span className="font-medium">All Payments</span>
                </Link>
                <Link to="/admin/failures" className={`nav-link rounded-xl mx-2 ${location.pathname === '/admin/failures' ? 'active shadow-sm' : ''}`}>
                  <AlertOctagon size={18} />
                  <span className="font-medium">Failed Auto-Debits</span>
                </Link>
                <Link to="/admin/refunds" className={`nav-link rounded-xl mx-2 ${location.pathname === '/admin/refunds' ? 'active shadow-sm' : ''}`}>
                  <RefreshCcw size={18} />
                  <span className="font-medium">Refund Mgmt</span>
                </Link>
              </div>
            </div>

            <div>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System</p>
              <div className="space-y-1">
                <Link to="/admin/support" className={`nav-link rounded-xl mx-2 ${location.pathname === '/admin/support' ? 'active shadow-sm' : ''}`}>
                   <HelpCircle size={18} />
                   <span className="font-medium">Support Hub</span>
                </Link>
                <Link to="/admin/settings" className={`nav-link rounded-xl mx-2 ${location.pathname === '/admin/settings' ? 'active shadow-sm' : ''}`}>
                  <Settings size={18} />
                  <span className="font-medium">Finance Rules</span>
                </Link>
                <Link to="/admin/audit" className={`nav-link rounded-xl mx-2 ${location.pathname === '/admin/audit' ? 'active shadow-sm' : ''}`}>
                  <History size={18} />
                  <span className="font-medium">Audit Logs</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-slate-100">
          <div className="relative">
            {showProfileMenu && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-slide-up z-50">
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
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role || 'Admin'}</p>
              </div>
              <ChevronUp size={16} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        <div className="pt-2">

        {/* Table */}
        <Routes>
          <Route path="/" element={
            <div className="space-y-8 animate-fade-in">
              {/* TOP SUMMARY CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Candidates" value={applications.length.toString()} icon={<Users size={20} />} trend="Real-time" color="blue" />
                <StatCard title="Total Staff" value={staff.length.toString()} icon={<UserCheck size={20} />} trend="Verified" color="indigo" />
                <StatCard title="Active EMI Plans" value={applications.filter(a => a.status === 'Active').length.toString()} icon={<Target size={20} />} trend="Active" color="green" />
                <StatCard title="Overdue EMIs" value="0" icon={<AlertCircle size={20} />} trend="Clean" color="red" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Paid Amount" value="₹0" icon={<TrendingUp size={20} />} trend="0%" color="green" />
                <StatCard title="Pending Amount" value="₹0" icon={<Clock size={20} />} trend="0%" color="orange" />
                <StatCard title="Today's Collection" value="₹0" icon={<CreditCard size={20} />} trend="No debits" color="purple" />
                <StatCard title="Failed Debits" value="0" icon={<AlertOctagon size={20} />} trend="Secure" color="red" />
              </div>

              {/* CHARTS ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">Monthly Revenue</h3>
                    <BarChart className="text-slate-400" size={20} />
                  </div>
                  <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-dashed border-slate-200">
                    [ Revenue Trend Chart Component ]
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">Paid vs Pending Collection</h3>
                    <PieChart className="text-slate-400" size={20} />
                  </div>
                  <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-dashed border-slate-200">
                    [ Collection Distribution Chart ]
                  </div>
                </div>
              </div>

              {/* QUICK TABLES */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                 <div className="col-span-2 glass-card">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">Recent EMI Requests</h3>
                      <Link to="/admin/applications" className="text-xs font-bold text-primary-600 hover:underline">View All</Link>
                    </div>
                    <div className="p-0">
                      {/* Simple Table Head for Quick View */}
                      <table className="w-full text-left text-sm">
                        <tbody className="divide-y divide-slate-100">
                           {applications.slice(0, 5).map(app => (
                             <tr key={app._id} className="hover:bg-slate-50">
                               <td className="px-6 py-4">
                                 <div className="font-semibold text-slate-800">{app.candidateId?.name}</div>
                                 <div className="text-[10px] text-slate-400 uppercase font-bold">{app.service}</div>
                               </td>
                               <td className="px-6 py-4 text-slate-500 font-bold">₹{app.amountRequested?.toLocaleString()}</td>
                               <td className="px-6 py-4">
                                 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 uppercase">{app.status}</span>
                               </td>
                               <td className="px-6 py-4 text-right">
                                 <button className="text-primary-600"><ArrowRight size={16} /></button>
                               </td>
                             </tr>
                           ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
                 <div className="glass-card">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">Failed Auto-Debits</h3>
                      <AlertOctagon className="text-red-500" size={18} />
                    </div>
                     <div className="p-6 space-y-4">
                        <div className="flex flex-col items-center justify-center py-4 text-slate-400">
                          <CheckCircle className="mb-2 text-green-500" size={24} />
                          <p className="text-[10px] font-bold uppercase">All collections healthy</p>
                        </div>
                     </div>
                 </div>
              </div>
            </div>
          } />
          
          <Route path="/candidates" element={<CandidatesTab applications={applications} />} />
          <Route path="/staff" element={<StaffTab staff={staff} refreshData={fetchData} />} />
          <Route path="/applications" element={<ApplicationCenter applications={applications} onApprove={handleApprove} />} />
          <Route path="/active-plans" element={<ActivePlansTab applications={applications} />} />
          <Route path="/overdue" element={<OverdueTab applications={applications} />} />
          <Route path="/payments" element={<PaymentsTab />} />
          <Route path="/failures" element={<FailuresTab applications={applications} />} />
          <Route path="/refunds" element={<RefundsTab />} />
          <Route path="/support" element={<SupportSystem isAdmin={true} />} />
          <Route path="/settings" element={<SettingsTab />} />
          <Route path="/audit" element={<AuditTab />} />
          <Route path="/notifications" element={<NotificationsTab />} />
          <Route path="/reports" element={<PlaceholderModule title="Reporting Center" icon={<Download size={44} />} desc="Export all business data to Finance-optimized Excel or PDF Management summaries." />} />
        </Routes>

        {/* Assignment Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="glass-card w-full max-w-md p-6 bg-white shadow-2xl animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Assign Staff</h3>
                <button onClick={() => setShowAssignModal(false)}><X size={20} /></button>
              </div>
              <div className="space-y-3">
                {staff.map(s => (
                  <button 
                    key={s._id}
                    onClick={() => handleAssign(s._id)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-red-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-red-100 group-hover:text-red-600">{s.name.charAt(0)}</div>
                      <div className="text-left font-semibold text-slate-700">{s.name}</div>
                    </div>
                    <ArrowRight size={18} className="text-slate-300 group-hover:text-red-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, color }) => {
  const colors = {
    blue: 'bg-primary-50 text-primary-600 border-primary-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    orange: 'bg-accent-50 text-accent-600 border-accent-100',
    indigo: 'bg-slate-50 text-slate-600 border-slate-100',
    purple: 'bg-primary-50 text-primary-900 border-primary-200',
  };
  
  return (
    <div className={`glass-card p-5 border-l-4 ${colors[color] || colors.blue}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</h3>
        <div className="p-2 rounded-lg bg-white/50 backdrop-blur-sm">{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <span className={`text-[10px] font-bold ${trend?.startsWith('+') ? 'text-green-600' : trend?.startsWith('-') ? 'text-red-600' : 'text-slate-400'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
};

const PlaceholderModule = ({ title, icon, desc }) => (
  <div className="glass-card p-12 text-center animate-fade-in bg-white shadow-xl border border-slate-100">
    <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 mb-8 max-w-md mx-auto">{desc}</p>
    <div className="flex justify-center gap-4">
      <button className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center gap-2">
        <PlusCircle size={20} /> Open Module
      </button>
      <button className="px-8 py-3 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-100 transition-all">
        Download Template
      </button>
    </div>
  </div>
);

export default AdminDashboard;
