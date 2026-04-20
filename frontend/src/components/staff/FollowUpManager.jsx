import React, { useState } from 'react';
import { 
  Phone, 
  Search, 
  MoreVertical, 
  MessageCircle, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Plus, 
  History,
  TrendingUp,
  ShieldAlert,
  Save,
  Loader2,
  ArrowRight,
  PhoneCall,
  UserCheck
} from 'lucide-react';

const FollowUpManager = ({ applications = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const followUpQueue = applications.map(app => ({
    id: app._id,
    name: app.candidateId?.name,
    phone: app.candidateId?.phone,
    status: app.status,
    lastCall: '2 days ago',
    nextFollowUp: 'Today, 2:00 PM',
    priority: app.status === 'Overdue' ? 'High' : 'Medium'
  }));

  if (selectedLog) {
    return <CallLogger candidate={selectedLog} onBack={() => setSelectedLog(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <PhoneCall className="text-primary-600" size={24} /> Communication Center
          </h2>
          <p className="text-xs text-slate-500">Track candidate engagement, schedule reminders, and log call outcomes.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or status..." 
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-64 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <SummaryCard label="Calls Today" value="32" icon={<Phone size={18} />} color="blue" />
        <SummaryCard label="Promised Payments" value="12" icon={<TrendingUp size={18} />} color="green" />
        <SummaryCard label="High Priority" value="5" icon={<ShieldAlert size={18} />} color="red" />
        <SummaryCard label="Pending Verif." value="8" icon={<Clock size={18} />} color="indigo" />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Candidate & Engagement</th>
                <th className="px-6 py-4">Last Contact</th>
                <th className="px-6 py-4 text-center">Next Follow-up</th>
                <th className="px-6 py-4 text-center">Priority</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {followUpQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-bold group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                           <Phone size={20} />
                        </div>
                        <div>
                           <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                           <div className="text-[10px] text-slate-400 flex items-center gap-1"><UserCheck size={10} /> {item.phone}</div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-xs font-bold text-slate-600 italic">"{item.lastCall}"</div>
                     <div className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">Note: Promised tomorrow</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-bold border border-amber-100 inline-block">
                        {item.nextFollowUp}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${item.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{item.priority}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button onClick={() => setSelectedLog(item)} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2 ml-auto">
                        <MessageCircle size={14} /> Log Call
                     </button>
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

const CallLogger = ({ candidate, onBack }) => {
  const [loading, setLoading] = useState(false);
  const outcomes = ['Interested', 'Needs Callback', 'Not Responding', 'Promised Payment', 'Declined', 'Escalate to Admin'];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up pb-20">
       <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold text-sm transition-colors">
            <ArrowRight className="rotate-180" size={18} /> Back to Communications
          </button>
       </div>

       <div className="glass-card p-8 space-y-8">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
             <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xl">
               {candidate.name.charAt(0)}
             </div>
             <div>
                <h3 className="text-xl font-bold text-slate-800">{candidate.name}</h3>
                <p className="text-sm font-medium text-primary-600 cursor-pointer hover:underline flex items-center gap-1">
                   <Phone size={14} /> {candidate.phone}
                </p>
             </div>
             <button className="ml-auto p-4 bg-green-500 text-white rounded-full shadow-lg shadow-green-200 hover:scale-110 transition-transform">
                <PhoneCall size={24} />
             </button>
          </div>

          <div className="space-y-6">
             <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><CheckCircle size={14} /> Call Outcome</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                   {outcomes.map(o => (
                      <button key={o} className="p-3 border rounded-xl text-[10px] font-bold uppercase transition-all hover:border-primary-600 hover:text-primary-600 bg-white shadow-sm border-slate-100">
                         {o}
                      </button>
                   ))}
                </div>
             </div>

             <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={14} /> Schedule Next Follow-up</p>
                <div className="flex gap-4">
                   <input type="datetime-local" className="input-field flex-1" />
                   <button className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold border border-amber-100">Set Reminder</button>
                </div>
             </div>

             <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><History size={14} /> Call Notes (Mandatory for Reports)</p>
                <textarea className="input-field h-32 py-4" placeholder="Briefly describe the conversation including any objections or promises made..."></textarea>
             </div>

             <button 
              onClick={() => { setLoading(true); setTimeout(() => onBack(), 1000); }} 
              className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-all uppercase tracking-widest text-xs"
             >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Call Log & Activity</>}
             </button>
          </div>
       </div>
    </div>
  );
};

const SummaryCard = ({ label, value, icon, color }) => {
  const colors = {
    blue: 'border-blue-500 text-blue-600 bg-blue-50/50',
    green: 'border-green-500 text-green-600 bg-green-50/50',
    red: 'border-red-500 text-red-600 bg-red-50/50',
    indigo: 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
  };
  return (
    <div className={`glass-card p-4 border-l-4 ${colors[color]} flex items-center gap-3`}>
       <div className="p-2 rounded-lg bg-white shadow-sm opacity-60">{icon}</div>
       <div>
          <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">{label}</p>
          <p className="text-lg font-bold text-slate-800">{value}</p>
       </div>
    </div>
  );
};

export default FollowUpManager;
