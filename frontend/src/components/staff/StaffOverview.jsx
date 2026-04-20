import React from 'react';
import { 
  Users, 
  FileCheck, 
  Clock, 
  AlertCircle, 
  ShieldAlert, 
  PhoneCall,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertOctagon,
  Calendar,
  Eye,
  MessageCircle,
  Zap
} from 'lucide-react';

const StaffOverview = ({ applications = [] }) => {
  const stats = [
    { label: 'Assigned Candidates', value: applications.length, icon: <Users size={24} />, color: 'blue', trend: '+2 today' },
    { label: 'Pending KYC', value: applications.filter(a => a.status === 'Submitted').length, icon: <FileCheck size={24} />, color: 'orange', trend: '3 high priority' },
    { label: 'Due Today', value: 8, icon: <Calendar size={24} />, color: 'green', trend: '₹1.2L total' },
    { label: 'Overdue Cases', value: 3, icon: <AlertOctagon size={24} />, color: 'red', trend: 'Critical recovery' },
    { label: 'Failed Payments', value: 2, icon: <ShieldAlert size={24} />, color: 'purple', trend: 'Needs retry' },
    { label: 'Follow-ups', value: 12, icon: <PhoneCall size={24} />, color: 'indigo', trend: 'Pending calls' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className={`glass-card p-4 border-l-4 border-${s.color}-500 group hover:scale-[1.02] transition-transform cursor-pointer`}>
            <div className={`p-2 rounded-lg bg-${s.color}-50 text-${s.color}-600 inline-block mb-3`}>
              {s.icon}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className={`text-[9px] font-bold text-${s.color}-600 mt-1`}>{s.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Quick Sections & Focus */}
        <div className="lg:col-span-2 space-y-6">
           <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Zap size={20} className="text-primary-600" /> Staff Focus Queue
                 </h3>
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Prioritized by urgency</span>
              </div>
              <div className="space-y-4">
                 <FocusItem 
                  title="Overdue Recovery: Rahul Sharma" 
                  desc="Payment of ₹4,200 is overdue by 14 days. Immediate call required." 
                  tag="Overdue" 
                  tagColor="red" 
                  action="Call Now"
                 />
                 <FocusItem 
                  title="Verify Docs: Anita Verma" 
                  desc="New income proof uploaded. Move to approval after verification." 
                  tag="KYC" 
                  tagColor="blue" 
                  action="Review"
                 />
                 <FocusItem 
                  title="Payment Reminder: Suresh Gupta" 
                  desc="EMI of ₹12,000 due tomorrow. Register mandate status is active." 
                  tag="Reminder" 
                  tagColor="green" 
                  action="Send SMS"
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuickTable title="Today's Calls" count={12} icon={<PhoneCall size={18} />} items={[
                { name: 'Manoj Roy', status: 'Interested' },
                { name: 'Sita Rani', status: 'Promised' },
                { name: 'Kiran Deep', status: 'Needs Followup' }
              ]} />
              <QuickTable title="Pending Documents" count={5} icon={<FileCheck size={18} />} items={[
                { name: 'Amit Shah', status: 'PAN Missing' },
                { name: 'Pooja Jha', status: 'Aadhar Invalid' },
                { name: 'Ravi Teja', status: 'Pending Review' }
              ]} />
           </div>
        </div>

        {/* Right: Daily Progress & Alerts */}
        <div className="space-y-6">
           <div className="glass-card p-6 bg-slate-900 text-white border-none shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2" />
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Today's Performance</h4>
              <div className="space-y-6">
                 <ProgressCircle label="Calls Goal" current={32} target={50} color="primary" />
                 <ProgressCircle label="KYC Goal" current={8} target={10} color="green" />
                 <ProgressCircle label="Collection Goal" current="₹85K" target="₹1.2L" color="amber" percent={70} />
              </div>
           </div>

           <div className="glass-card p-6">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Bell className="text-red-500" size={18} /> Critical Failed Debits</h4>
              <div className="space-y-3">
                 <FailedDebitAlert name="Rajesh Kumar" amount="₹4,200" reason="Mandate Revoked" />
                 <FailedDebitAlert name="Sunita Devi" amount="₹2,500" reason="Insufficient Funds" />
              </div>
              <button className="w-full mt-4 py-2 text-xs font-bold text-primary-600 hover:bg-primary-50 rounded-xl transition-all">View All Failures</button>
           </div>
        </div>
      </div>
    </div>
  );
};

const FocusItem = ({ title, desc, tag, tagColor, action }) => (
  <div className="p-4 rounded-2xl border border-slate-100 hover:border-primary-100 transition-all group flex items-start gap-4">
     <div className={`w-10 h-10 rounded-xl bg-${tagColor === 'red' ? 'red' : tagColor === 'blue' ? 'blue' : 'green'}-50 flex items-center justify-center shrink-0`}>
        <TrendingUp size={20} className={`text-${tagColor === 'red' ? 'red' : tagColor === 'blue' ? 'blue' : 'green'}-600`} />
     </div>
     <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
           <h5 className="text-sm font-bold text-slate-800">{title}</h5>
           <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest bg-${tagColor === 'red' ? 'red' : tagColor === 'blue' ? 'blue' : 'green'}-100 text-${tagColor === 'red' ? 'red' : tagColor === 'blue' ? 'blue' : 'green'}-700`}>{tag}</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed truncate max-w-[300px]">{desc}</p>
     </div>
     <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold hover:bg-primary-600 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
        {action}
     </button>
  </div>
);

const QuickTable = ({ title, count, icon, items }) => (
  <div className="glass-card p-5">
     <div className="flex justify-between items-center mb-4">
        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
           {icon} {title}
        </h5>
        <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{count}</span>
     </div>
     <div className="space-y-3">
        {items.map((item, i) => (
           <div key={i} className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">{item.name}</span>
              <span className="text-slate-400 italic text-[10px]">{item.status}</span>
           </div>
        ))}
     </div>
     <button className="w-full mt-4 p-2 text-[10px] font-bold text-slate-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-1">
        View All <ArrowRight size={10} />
     </button>
  </div>
);

const ProgressCircle = ({ label, current, target, color, percent }) => {
  const p = percent || (typeof current === 'number' ? (current / target) * 100 : 70);
  const colors = {
    primary: 'bg-primary-600',
    green: 'bg-green-500',
    amber: 'bg-amber-500'
  };
  return (
    <div className="space-y-2">
       <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-400">{label}</span>
          <span>{current} / {target}</span>
       </div>
       <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full ${colors[color]} transition-all duration-1000`} style={{ width: `${p}%` }} />
       </div>
    </div>
  );
};

const FailedDebitAlert = ({ name, amount, reason }) => (
  <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-center gap-3">
     <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
        <AlertOctagon size={16} />
     </div>
     <div>
        <div className="text-[10px] font-bold text-slate-800">{name} - <span className="text-red-600">{amount}</span></div>
        <div className="text-[9px] text-slate-500 mt-0.5">{reason}</div>
     </div>
     <button className="ml-auto p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors">
        <ArrowRight size={14} />
     </button>
  </div>
);

export default StaffOverview;
