import React from 'react';
import { 
  ShieldAlert, 
  Search, 
  RefreshCcw, 
  ExternalLink, 
  Bell, 
  UserPlus, 
  MoreVertical,
  AlertOctagon,
  ArrowUpRight,
  TrendingDown,
  Clock,
  Zap,
  ArrowRight,
  PhoneCall,
  Calendar
} from 'lucide-react';

const EscalateFailures = ({ applications = [] }) => {
  // Filter for applications that have passed their due date without payment
  // For this demo, we simulate "Overdue" for Active loans with specific names 
  // or logic related to the current date.
  const overdueRecords = applications
    .filter(app => ['Active', 'Approved'].includes(app.status))
    .map(app => ({
      name: app.candidateId?.name || 'Unknown',
      phone: app.candidateId?.phone || 'No Phone',
      amount: `₹${(app.amountRequested / app.tenure).toLocaleString()}`,
      reason: 'Payment Overdue',
      attempts: Math.floor(Math.random() * 3) + 1,
      lastAttempt: '1 day ago',
      dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: 'Overdue'
    }));

  const displayFailures = overdueRecords.length > 0 ? overdueRecords : [
    { name: 'Rajesh Kumar', phone: '9876543210', amount: '₹4,200', reason: 'Payment Overdue', attempts: 3, lastAttempt: '2 hrs ago', status: 'Critical', dueDate: 'Apr 18' },
    { name: 'Sunita Devi', phone: '8123456789', amount: '₹2,500', reason: 'Insufficient Funds', attempts: 1, lastAttempt: 'Yesterday', status: 'Pending Retry', dueDate: 'Apr 19' },
  ];

  const totalOutstanding = displayFailures.reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[₹,]/g, '')), 0);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex justify-between items-center bg-red-900 p-6 rounded-3xl text-white shadow-xl shadow-red-200">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md border border-white/20">
               <ShieldAlert size={32} />
            </div>
            <div>
               <h2 className="text-xl font-bold">Overdue Recovery Center</h2>
               <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Manage critical missed payments and recovery actions</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-3xl font-bold">₹{totalOutstanding.toLocaleString()}</p>
            <p className="text-[10px] font-bold uppercase opacity-60 italic">Critical Recovery Portfolio</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatItem label="Payments Overdue" value={displayFailures.length} color="red" icon={<AlertOctagon size={18} />} />
         <StatItem label="Recovery Rate" value="15%" color="blue" icon={<RefreshCcw size={18} />} />
         <StatItem label="Resolved (24h)" value="4" color="green" icon={<Zap size={18} />} trend="+₹12K" />
      </div>

      <div className="glass-card overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                     <th className="px-6 py-4 text-center">Risk Level</th>
                     <th className="px-6 py-4">Candidate & Mobile</th>
                     <th className="px-6 py-4">Reason / Due Date</th>
                     <th className="px-6 py-4">Attempts</th>
                     <th className="px-6 py-4 text-right">Recovery Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 italic">
                  {displayFailures.map((f, i) => (
                    <tr key={i} className="hover:bg-red-50/20 transition-colors">
                       <td className="px-6 py-4 text-center">
                          <div className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center ${f.attempts >= 3 || f.status === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                             {f.attempts >= 3 ? <AlertOctagon size={20} /> : <TrendingDown size={20} />}
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 text-sm whitespace-nowrap">{f.name}</div>
                          <div className="text-[10px] font-bold text-primary-600 flex items-center gap-1">
                             <PhoneCall size={10} /> {f.phone}
                          </div>
                          <div className="text-[10px] font-bold text-red-600 uppercase mt-0.5">{f.amount} Overdue</div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="text-xs font-bold text-slate-700">"{f.reason}"</div>
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium italic"><Calendar size={10} /> Due Date: {f.dueDate}</div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${f.attempts >= 3 ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{f.attempts} Attempts</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <ActionButton 
                               icon={<ExternalLink size={14} />} 
                               title="Send Recovery Link" 
                               color="blue" 
                               onClick={() => alert(`Recovery link generated for ${f.name}. Notification sent.`)}
                             />
                             <ActionButton 
                               icon={<PhoneCall size={14} />} 
                               title="Call Candidate" 
                               color="primary" 
                               onClick={() => window.open(`tel:${f.phone}`, '_self')}
                             />
                             <ActionButton 
                               icon={<ArrowUpRight size={14} />} 
                               title="Final Notice" 
                               color="red" 
                               onClick={() => window.confirm(`WARNING: Are you sure you want to escalate ${f.name} for Legal Action? This will send a final recovery notice.`)}
                             />
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, color, icon, trend }) => (
  <div className={`glass-card p-5 border-l-4 ${color === 'red' ? 'border-red-500' : color === 'blue' ? 'border-blue-500' : 'border-green-500'}`}>
     <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        {icon}
     </div>
     <div className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        {value} {trend && <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">{trend}</span>}
     </div>
  </div>
);

const ActionButton = ({ icon, title, color, onClick }) => {
   const colors = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white',
      primary: 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white',
      red: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
   };
   return (
      <button 
        onClick={onClick}
        title={title} 
        className={`p-2 rounded-xl transition-all shadow-sm border border-slate-50 ${colors[color]}`}
      >
         {icon}
      </button>
   );
};

export default EscalateFailures;
