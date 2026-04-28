import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Send, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Smartphone
} from 'lucide-react';

const DueReminders = ({ applications = [] }) => {
  const [filter, setFilter] = useState('Today');
  
  // Filter for approved or verified applications to show in reminder hub
  const activeApplications = applications.filter(app => 
    ['Approved', 'Verified', 'Active'].includes(app.status)
  ).map(app => ({
    id: app._id,
    name: app.candidateId?.name || 'Unknown',
    phone: app.candidateId?.phone || 'No Phone',
    amount: `₹${(app.amountRequested / app.tenure).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, // Approximate EMI
    date: new Date(new Date().setMonth(new Date().getMonth() + 1, 5)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), // Mock: 5th of next month
    status: 'Due Today', // For demo
    reminderSent: 'None'
  }));

  const displayData = activeApplications.length > 0 ? activeApplications : [
    { id: '1', name: 'Rahul Sharma', phone: '9876543210', amount: '₹4,200', date: 'Apr 19, 2026', status: 'Due Today', reminderSent: 'Yesterday' },
    { id: '4', name: 'Manish Malhotra', phone: '8123456789', amount: '₹8,400', date: 'Apr 19, 2026', status: 'Due Today', reminderSent: 'None' },
  ];

  const filteredPayees = displayData.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Today') return p.status === 'Due Today';
    if (filter === 'Tomorrow') return p.status === 'Due Tomorrow';
    if (filter === 'Upcoming') return p.status === 'Upcoming';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="text-amber-500" size={24} /> Payment Reminder Hub
          </h2>
          <p className="text-xs text-slate-500 italic mt-1 font-medium">Ensure on-time collection by triggering reminders before due dates.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
           {['All', 'Today', 'Tomorrow', 'Upcoming'].map(t => (
             <button 
              key={t} 
              onClick={() => setFilter(t)}
              className={`px-4 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${filter === t ? 'bg-amber-100 text-amber-700 shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
             >
                {t}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">
         {filteredPayees.map((p) => (
           <div key={p.id} className="glass-card p-6 hover:border-amber-200 transition-all group border-l-4 border-amber-400 bg-white shadow-lg animate-slide-up">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-soft">
                       {p.name.charAt(0)}
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-800">{p.name}</h4>
                       <div className="flex flex-col gap-0.5">
                          <p className="text-[10px] font-bold text-primary-600 flex items-center gap-1">
                             <Phone size={10} /> {p.phone}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                             <Smartphone size={10} /> WhatsApp Enabled
                          </p>
                       </div>
                    </div>
                 </div>
                 <div className={`px-2 py-1 rounded text-[8px] font-bold uppercase ${p.status === 'Due Today' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-500'}`}>
                    {p.status}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Amount Due</p>
                    <p className="text-lg font-bold text-slate-800">{p.amount}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">EMI Date</p>
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-600">
                       <Calendar size={12} className="text-primary-600" /> {p.date}
                    </div>
                 </div>
              </div>

              <div className="flex border-t border-slate-50 pt-4 gap-2">
                 <button className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-primary-600 transition-all active:scale-95">
                    <Send size={12} /> SMS / Email
                 </button>
                 <button 
                  onClick={() => window.open(`https://wa.me/${p.phone}?text=Greetings%20from%20Forge%20India.%20Your%20EMI%20of%20${p.amount}%20is%20due%20on%20${p.date}.`, '_blank')}
                  className="flex-1 py-2 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white transition-all border border-green-100 active:scale-95"
                 >
                    <MessageSquare size={12} /> WhatsApp
                 </button>
              </div>
              
              <div className="mt-3 flex items-center justify-center gap-2 text-[9px] font-bold text-slate-400 opacity-60">
                 <Clock size={10} /> Last reminder: {p.reminderSent}
              </div>
           </div>
         ))}
         {filteredPayees.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-slate-300 opacity-50 py-20">
               <Calendar size={64} className="mb-4" />
               <p className="font-bold uppercase tracking-widest text-xs">No records found for this filter</p>
            </div>
         )}
      </div>

      <div className="p-4 bg-primary-900 text-white rounded-2xl flex items-center justify-between shadow-xl shadow-primary-200">
         <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-green-400" />
            <div>
               <p className="font-bold text-sm">Bulk Reminders</p>
               <p className="text-[10px] opacity-70">Trigger reminders for all {filteredPayees.length} pending candidates in this view.</p>
            </div>
         </div>
         <button className="px-6 py-2 bg-white text-primary-900 rounded-xl text-xs font-bold hover:bg-primary-50 transition-all shadow-lg active:scale-95">Send Bulk ({filteredPayees.length})</button>
      </div>
    </div>
  );
};

export default DueReminders;
