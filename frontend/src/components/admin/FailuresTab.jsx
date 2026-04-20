import React from 'react';
import { 
  AlertOctagon, 
  RefreshCcw, 
  Bell, 
  ExternalLink, 
  PauseCircle, 
  Calculator, 
  LifeBuoy, 
  MoreVertical,
  ArrowRight,
  ShieldX,
  CreditCard
} from 'lucide-react';

const FailuresTab = ({ applications = [] }) => {
  // Filter for failures (for demo purposes if none exist)
  const failures = [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Auto-Debit Failure Center</h2>
          <p className="text-xs text-slate-500">Monitor and recover failed recurring collections from Razorpay Subscriptions.</p>
        </div>
        <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
           <AlertOctagon className="text-red-600" size={20} />
           <div>
              <p className="text-[10px] font-bold text-red-700 uppercase">System Alert</p>
              <p className="text-xs font-bold text-red-600">3 Subscriptions requiring action</p>
           </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-t-4 border-red-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Candidate & Plan</th>
                <th className="px-6 py-4">Failed Amount / Reason</th>
                <th className="px-6 py-4 text-center">Retries / Mandate</th>
                <th className="px-6 py-4">Assigned Staff</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {failures.map((f) => (
                <tr key={f.id} className="hover:bg-red-50/20 transition-colors group">
                  <td className="px-6 py-4">
                     <div className="font-bold text-slate-800 text-sm">{f.name}</div>
                     <div className="flex items-center gap-1 text-[10px] text-primary-600 font-bold uppercase mt-0.5">
                       {f.plan} <ArrowRight size={8} /> {f.date}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-xs font-bold text-red-600">{f.amount}</div>
                     <div className="text-[10px] text-slate-400 font-medium italic mt-0.5">"{f.reason}"</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                           <span className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${f.retries >= 2 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                             {f.retries}
                           </span>
                           <span className={`text-[10px] font-bold ${f.status === 'Retrying' ? 'text-amber-600' : 'text-slate-400'}`}>
                             {f.status}
                           </span>
                        </div>
                        <span className={`text-[9px] font-bold mt-1 px-1.5 rounded uppercase ${f.mandate === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                          Mandate: {f.mandate}
                        </span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">
                     {f.staff}
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex justify-end gap-1.5">
                        <ActionButton onClick={() => alert('Initiating manual retry via Razorpay API...')} icon={<RefreshCcw size={14} />} title="Retry Manually" color="primary" />
                        <ActionButton onClick={() => alert('Sending payment reminder to candidate...')} icon={<Bell size={14} />} title="Notify Candidate" color="amber" />
                        <ActionButton onClick={() => alert('Generating manual payment link...')} icon={<ExternalLink size={14} />} title="Manual Pmt Link" color="blue" />
                        <ActionButton onClick={() => alert('Subscription paused. System will not retry automatically.')} icon={<PauseCircle size={14} />} title="Pause Subscription" color="slate" />
                        <ActionButton onClick={() => alert('Penalty waived for this installment.')} icon={<Calculator size={14} />} title="Waive Penalty" color="indigo" />
                        <ActionButton onClick={() => alert('Case escalated to support team.')} icon={<LifeBuoy size={14} />} title="Escalate Support" color="red" />
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Razorpay Smart Retry Info */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
         <CreditCard className="text-primary-600 mt-1" size={24} />
         <div>
            <h4 className="text-sm font-bold text-slate-800">Razorpay Smart Retries Active</h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
               The system is configured with Razorpay smart retries. Automatic attempts will be made every 24 hours for "Insufficient Funds" errors. 
               Manual intervention is recommended for "Mandate Revoked" or "Expired" status.
            </p>
         </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, title, color, onClick }) => {
  const colors = {
    primary: 'text-primary-600 hover:bg-primary-600',
    amber: 'text-amber-600 hover:bg-amber-600',
    blue: 'text-blue-600 hover:bg-blue-600',
    slate: 'text-slate-600 hover:bg-slate-600',
    indigo: 'text-indigo-600 hover:bg-indigo-600',
    red: 'text-red-600 hover:bg-red-600'
  };

  return (
    <button 
      onClick={onClick}
      title={title} 
      className={`p-2 bg-white border border-slate-200 rounded-xl transition-all hover:text-white shadow-sm active:scale-95 ${colors[color]}`}
    >
      {icon}
    </button>
  );
};

export default FailuresTab;
