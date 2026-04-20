import React, { useState } from 'react';
import { 
  Search, 
  MoreVertical, 
  Eye, 
  Clock, 
  FileText, 
  CreditCard, 
  Calendar,
  ArrowRight,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  PauseCircle,
  XCircle
} from 'lucide-react';

const ActivePlansTab = ({ applications = [] }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const plans = applications.filter(app => ['Active', 'Approved', 'Overdue', 'Paused', 'Closed'].includes(app.status));

  if (selectedPlan) {
    return <PlanDetail plan={selectedPlan} onBack={() => setSelectedPlan(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Live EMI Subscriptions</h2>
          <p className="text-xs text-slate-500">Manage ongoing repayment plans and subscription statuses.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Plan ID or name..." 
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-64 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Plan & Candidate</th>
                <th className="px-6 py-4">Financials</th>
                <th className="px-6 py-4">Tenure / EMI</th>
                <th className="px-6 py-4 text-center">Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plans.map((plan) => (
                <tr key={plan._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{plan.candidateId?.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase">ID: {plan._id?.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="font-bold text-slate-700 uppercase">₹{plan.amountRequested?.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">Bal: ₹{(plan.amountRequested * 0.7).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-slate-700">{plan.tenure} Months</div>
                    <div className="text-[10px] text-primary-600 font-bold">₹{(plan.amountRequested / plan.tenure).toFixed(0)}/mo</div>
                  </td>
                  <td className="px-6 py-4 text-center text-[10px]">
                    <div className="flex flex-col items-center">
                       <span className="font-bold text-slate-500">Next: Apr 15</span>
                       <span className="text-slate-400 mt-0.5">Start: Jan 01</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      plan.status === 'Active' ? 'bg-green-100 text-green-700' :
                      plan.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>{plan.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedPlan(plan)} className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-primary-600 rounded-lg">
                      <Eye size={16} />
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

const PlanDetail = ({ plan, onBack }) => {
  const [activeTab, setActiveTab] = useState('Schedule');

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold text-sm transition-colors">
          <ArrowRight className="rotate-180" size={18} /> Back to Plans
        </button>
        <div className="flex gap-2 font-bold text-[10px] uppercase">
          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">Mandate Active</span>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 font-mono italic">Agreement Signed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <PlanCardStat label="Total Payable" value={`₹${(plan.amountRequested * 1.15).toLocaleString()}`} icon={<CreditCard size={18} />} />
         <PlanCardStat label="Interest Rate" value="12.5% P.A." icon={<Calendar size={18} />} />
         <PlanCardStat label="Processing Fee" value="₹0" icon={<FileText size={18} />} />
         <PlanCardStat label="Balance Remaining" value={`₹${(plan.amountRequested * 0.8).toLocaleString()}`} icon={<ShieldCheck size={18} />} />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex border-b border-slate-100">
           {['Schedule', 'History', 'Document'].map(t => (
             <button 
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-8 py-4 text-xs font-bold transition-all ${activeTab === t ? 'border-b-2 border-primary-600 text-primary-600 bg-primary-50/30' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {t}
             </button>
           ))}
        </div>
        <div className="p-6">
           {activeTab === 'Schedule' && (
             <div className="p-12 text-center text-slate-300">
                <Calendar size={48} className="mx-auto mb-4 opacity-10" />
                <p className="text-sm font-medium">Repayment schedule will appear after first debit cycle.</p>
             </div>
           )}
           {activeTab === 'History' && (
              <div className="p-12 text-center text-slate-300">
                 <History size={48} className="mx-auto mb-4 opacity-10" />
                 <p className="text-sm font-medium">No activity log found for this subscription.</p>
              </div>
           )}
           {activeTab === 'Document' && (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                 <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                 <p className="text-sm font-bold text-slate-600">Agreement_ID_{plan._id?.slice(-6)}.pdf</p>
                 <button className="mt-4 px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50">Download Copy</button>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

const PlanCardStat = ({ label, value, icon }) => (
  <div className="glass-card p-5 bg-white shadow-sm border border-slate-100">
    <div className="flex justify-between items-center mb-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <div className="text-slate-300">{icon}</div>
    </div>
    <div className="text-lg font-bold text-slate-800">{value}</div>
  </div>
);

const ScheduleRow = ({ num, date, amount, status, pmtId, isDashed }) => (
  <div className={`flex items-center justify-between p-4 rounded-xl ${isDashed ? 'opacity-50 border border-dashed border-slate-200' : 'bg-white border border-slate-100 hover:border-slate-200'} transition-all mb-2`}>
    <div className="flex items-center gap-4 text-xs">
       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono ${status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
         {num}
       </div>
       <div>
          <div className="font-bold text-slate-800">{date}</div>
          <div className="text-[10px] text-slate-400">Pmt ID: {pmtId}</div>
       </div>
    </div>
    <div className="text-right">
       <div className="font-bold text-slate-800">{amount}</div>
       <div className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{status}</div>
    </div>
  </div>
);

const HistoryItem = ({ title, date, desc, isWarning }) => (
  <div className="flex gap-4">
     <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${isWarning ? 'bg-red-500' : 'bg-primary-600'} mt-1.5`} />
        <div className="flex-1 w-[2px] bg-slate-100 my-1" />
     </div>
     <div className="pb-6">
        <h5 className={`text-sm font-bold ${isWarning ? 'text-red-700' : 'text-slate-800'}`}>{title}</h5>
        <p className="text-[10px] text-slate-400 mb-1">{date}</p>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">{desc}</p>
     </div>
  </div>
);

export default ActivePlansTab;
