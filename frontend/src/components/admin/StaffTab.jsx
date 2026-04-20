import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Eye,
  EyeOff, 
  UserCheck, 
  UserX, 
  Shield, 
  MapPin, 
  BarChart3, 
  Settings,
  Mail,
  Key,
  ArrowRight,
  ClipboardList,
  Target,
  X,
  Plus,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const StaffTab = ({ staff = [], refreshData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff', phone: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:5002/api/admin/staff', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddForm(false);
      setFormData({ name: '', email: '', password: '', role: 'staff', phone: '' });
      if (refreshData) refreshData();
      alert('Staff created successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create staff');
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(s => 
    (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (selectedStaff) {
    return <StaffDetail staff={selectedStaff} onBack={() => setSelectedStaff(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Operational Team</h2>
          <p className="text-xs text-slate-500">Manage staff roles, performance, and assignments.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-64 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
          >
            <UserPlus size={18} /> Add Staff
          </button>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-8 animate-slide-up bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Add New Staff Member</h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field mt-1" placeholder="Enter name" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-field mt-1" placeholder="email@example.com" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Password</label>
                   <div className="relative mt-1">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        required 
                        type={showPassword ? 'text' : 'password'} 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        className="pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-primary-500" 
                        placeholder="••••••••" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                   </div>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                  <input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input-field mt-1" placeholder="10-digit mobile" />
               </div>
               <button type="submit" disabled={loading} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                 {loading ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Create Staff Account</>}
               </button>
            </form>
          </div>
        </div>
      )}

      {/* Staff Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4 text-center">Assigned / Follow-up</th>
                <th className="px-6 py-4 text-center">Conversions</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{s.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{s.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-xs font-bold text-slate-700">0 / 0</div>
                    <div className="text-[10px] text-slate-400">Assigned / Calls</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-xs font-bold text-green-600">0%</div>
                    <div className="text-[10px] text-slate-400">Approval Rate</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="w-[0%] h-full bg-primary-500" />
                       </div>
                       <span className="text-[10px] font-bold text-slate-600">0.0</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">Active</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => setSelectedStaff(s)} className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-primary-600 rounded-lg"><Eye size={16} /></button>
                       <button className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-lg"><Settings size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStaff.length === 0 && (
            <div className="p-20 text-center text-slate-300">
               <UserCheck size={64} className="mx-auto mb-4 opacity-10" />
               <p>No staff members found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StaffDetail = ({ staff, onBack }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Assigned Candidates', 'Work Report', 'Performance', 'Settings & Perms'];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold text-sm transition-colors">
          <ArrowRight className="rotate-180" size={18} /> Back to Team
        </button>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 flex items-center gap-2">
             <Key size={14} /> Reset Password
          </button>
          <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white flex items-center gap-2 transition-all">
             <UserX size={14} /> Deactivate Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Profile Card */}
        <div className="glass-card p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-3xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-3xl mb-4 border-4 border-white shadow-xl">
              {staff.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{staff.name}</h3>
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-6">{staff.role}</p>
            
            <div className="w-full space-y-4 pt-6 border-t border-slate-50">
               <ProfileItem icon={<Mail size={14} />} label="Email" value={staff.email} />
               <ProfileItem icon={<MapPin size={14} />} label="Region" value="North / Delhi" />
               <ProfileItem icon={<Shield size={14} />} label="Access" value="Level 2 Admin" />
            </div>

            <div className="mt-8 p-4 bg-primary-50 rounded-2xl w-full">
               <div className="text-center">
                 <p className="text-[10px] font-bold text-primary-600 uppercase mb-1">Score</p>
                 <p className="text-3xl font-bold text-primary-700">8.8<span className="text-sm">/10</span></p>
               </div>
            </div>
        </div>

        {/* Right Detail Tabs */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
            {tabs.map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 px-4 py-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === t ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="glass-card p-8 min-h-[450px]">
            {activeTab === 'Overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <MiniStat label="Applied Conversions" value="0" trend="0" color="green" />
                   <MiniStat label="Follow-ups Today" value="0" trend="Target: 0" color="blue" />
                   <MiniStat label="Overdue Resolved" value="₹0" trend="0%" color="purple" />
                </div>
                
                <div className="p-6 bg-slate-50 rounded-2xl">
                   <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Target size={18} className="text-primary-600" /> Key Performance Metrics</h4>
                   <div className="space-y-6">
                      <MetricBar label="Verification Cleanliness" value="0%" />
                      <MetricBar label="Collection Efficiency" value="0%" />
                      <MetricBar label="Customer Rating" value="0.0/5" />
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'Assigned Candidates' && (
              <div className="space-y-4">
                 <h4 className="font-bold text-slate-700 mb-4">Currently Managing (0)</h4>
                 <div className="p-12 text-center text-slate-300">
                    <UserIcon size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="text-sm">No candidates currently assigned.</p>
                 </div>
              </div>
            )}

            {activeTab === 'Work Report' && (
               <div className="space-y-6">
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                     <p className="text-xs font-bold text-slate-500 uppercase">Today's Summary - Apr 19, 2026</p>
                     <span className="p-1 px-3 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Submitted</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <SummaryReportItem label="Calls Logged" value="42" />
                     <SummaryReportItem label="KYC Handled" value="8" />
                     <SummaryReportItem label="Escalations" value="2" />
                     <SummaryReportItem label="Remarks Added" value="15" />
                  </div>
                  <div className="mt-4">
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Today's Reflection</p>
                     <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 italic">"Focused on high-priority overdue recoveries today. Successfully cleared 3 records from Delhi cluster. Verification queue is current."</div>
                  </div>
               </div>
            )}

            {activeTab === 'Settings & Perms' && (
               <div className="space-y-8">
                  <Section title="Branch Assignment" desc="Assign staff to specific regions or branches.">
                     <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <MapPin size={20} className="text-slate-400" />
                        <div>
                           <p className="text-xs font-bold text-slate-700 underline">Northern Region (Delhi-NCR)</p>
                           <p className="text-[10px] text-slate-500">Includes Okhla, Noida, and Gurgaon clusters.</p>
                        </div>
                        <button className="ml-auto text-xs font-bold text-primary-600">Change</button>
                     </div>
                  </Section>
                  
                  <Section title="Access Permissions" desc="Control what modules this staff member can interact with.">
                     <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                        <TogglePermission label="Can Verify Documents" active={true} />
                        <TogglePermission label="Can Suggest Approval" active={true} />
                        <TogglePermission label="Can Waive Penalties" active={false} />
                        <TogglePermission label="Can Cancel Subscription" active={false} />
                        <TogglePermission label="Can Modify Interest" active={false} />
                        <TogglePermission label="Can Export Financial Data" active={true} />
                     </div>
                  </Section>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
      {icon} {label}
    </div>
    <div className="text-sm font-bold text-slate-700 truncate">{value}</div>
  </div>
);

const MiniStat = ({ label, value, trend, color }) => {
  const colors = {
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700'
  };
  return (
    <div className={`p-4 rounded-2xl border border-slate-50 ${colors[color]}`}>
      <p className="text-[10px] font-bold uppercase opacity-70 mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[10px] font-bold mt-1 opacity-80">{trend}</p>
    </div>
  );
};

const MetricBar = ({ label, value }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs font-bold">
      <span className="text-slate-500">{label}</span>
      <span className="text-primary-600">{value}</span>
    </div>
    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
      <div className="h-full bg-primary-600" style={{ width: value.includes('/') ? '90%' : value }} />
    </div>
  </div>
);

const AssignCard = ({ name, plan, status }) => (
  <div className="p-4 rounded-xl border border-slate-100 hover:border-primary-100 bg-white transition-all">
    <div className="flex justify-between items-center">
       <span className="text-sm font-bold text-slate-800">{name}</span>
       <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${status === 'Overdue' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{status}</span>
    </div>
    <p className="text-[10px] text-slate-400 mt-1">{plan}</p>
  </div>
);

const SummaryReportItem = ({ label, value }) => (
  <div className="p-3 bg-white border border-slate-100 rounded-xl text-center">
    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
    <p className="text-lg font-bold text-slate-800">{value}</p>
  </div>
);

const Section = ({ title, desc, children }) => (
  <div className="space-y-3">
    <div>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
    {children}
  </div>
);

const TogglePermission = ({ label, active }) => (
  <div className="flex items-center justify-between group">
     <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800 transition-colors">{label}</span>
     <div className={`w-10 h-5 rounded-full relative transition-all ${active ? 'bg-primary-600' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'left-6' : 'left-1'}`} />
     </div>
  </div>
);

export default StaffTab;
