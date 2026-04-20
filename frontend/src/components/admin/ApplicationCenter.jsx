import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Calculator, 
  ShieldCheck, 
  Clock, 
  User, 
  IndianRupee, 
  ArrowRight,
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';

const ApplicationCenter = ({ applications = [], onApprove }) => {
  const [selectedApp, setSelectedApp] = useState(null);

  if (selectedApp) {
    return <DecisionWorkflow app={selectedApp} onBack={() => setSelectedApp(null)} onConfirm={onApprove} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Decisions & Approvals</h2>
          <p className="text-xs text-slate-500">Review verified applications and configure final EMI structures.</p>
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold border border-amber-100 flex items-center gap-1">
             <Clock size={12} /> {applications.filter(a => a.status === 'Verified').length} Pending Decisions
           </span>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Application Details</th>
                <th className="px-6 py-4">Requested Structure</th>
                <th className="px-6 py-4">Verification Status</th>
                <th className="px-6 py-4">Verification Note</th>
                <th className="px-6 py-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.filter(a => a.status === 'Verified' || a.status === 'Submitted').map((app) => (
                <tr key={app._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                           <User size={20} />
                        </div>
                        <div>
                           <div className="font-bold text-slate-800 text-sm">{app.candidateId?.name}</div>
                           <div className="text-[10px] text-slate-400 font-mono tracking-tighter">APP-ID: {app._id?.slice(-8)}</div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-xs font-bold text-slate-700">₹{app.amountRequested?.toLocaleString()}</div>
                     <div className="text-[10px] text-slate-400 font-bold uppercase">{app.tenureRequested || 12} Months</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                       app.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                     }`}>{app.status}</span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-xs text-slate-500 font-medium italic truncate max-w-[200px]">
                       "{app.verificationNote || 'Documents verified by staff'}"
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button 
                      onClick={() => setSelectedApp(app)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 shadow-md shadow-primary-200 transition-all flex items-center justify-center gap-2 ml-auto"
                     >
                       <ShieldCheck size={16} /> Decision
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.filter(a => a.status === 'Verified').length === 0 && (
            <div className="p-20 text-center text-slate-300">
               <ShieldCheck size={48} className="mx-auto mb-4 opacity-20" />
               <p className="text-sm font-medium">No pending verified applications found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DecisionWorkflow = ({ app, onBack, onConfirm }) => {
  const [amount, setAmount] = useState(app.amountRequested || 50000);
  const [tenure, setTenure] = useState(12);
  const [interest, setInterest] = useState(14);
  const [processingFee, setProcessingFee] = useState(499);
  
  const monthlyEmi = ((amount * (1 + (interest/100))) / tenure).toFixed(0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
       <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold text-sm transition-colors">
          <ArrowRight className="rotate-180" size={18} /> Back to Requests
       </button>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Summary */}
          <div className="lg:col-span-1 space-y-6">
             <div className="glass-card p-6 bg-slate-900 text-white border-none shadow-2xl">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Decision Summary</div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Monthly EMI</p>
                         <p className="text-2xl font-bold flex items-center gap-1 leading-none mt-1">
                           <IndianRupee size={20} /> {parseInt(monthlyEmi).toLocaleString()}
                         </p>
                      </div>
                      <Calculator size={24} className="text-primary-400" />
                   </div>
                   <div className="space-y-3 pt-4 border-t border-white/10">
                      <SummaryLine label="Total Interest" value={`₹${(amount * (interest/100)).toLocaleString()}`} />
                      <SummaryLine label="Processing Fee" value={`₹${processingFee}`} />
                      <SummaryLine label="Total Payout" value={`₹${(amount * (1 + (interest/100))).toLocaleString()}`} />
                   </div>
                </div>
             </div>
             
             <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs mb-2">
                   <AlertTriangle size={16} /> Risk Analysis
                </div>
                <p className="text-[10px] text-amber-600 font-medium leading-relaxed">
                   Based on candidate income (₹45,000) and this EMI (₹{monthlyEmi}), the DTI ratio is {((monthlyEmi/45000)*100).toFixed(1)}%. This is within safe limits (Max 40%).
                </p>
             </div>
          </div>

          {/* Right: Controls */}
          <div className="lg:col-span-2 glass-card p-8">
             <h3 className="text-lg font-bold text-slate-800 mb-8 border-b border-slate-50 pb-4 flex items-center gap-2">
                <Edit3 className="text-primary-600" size={20} /> Finalize EMI Structure
             </h3>
             
             <div className="space-y-8">
                <ControlSlider label="Modify Approved Amount" value={amount} set={setAmount} min={10000} max={200000} step={5000} unit="₹" />
                <div className="grid grid-cols-2 gap-8 text-center">
                   <ControlSlider label="Tenure (Months)" value={tenure} set={setTenure} min={3} max={36} step={3} />
                   <ControlSlider label="Interest Rate (%)" value={interest} set={setInterest} min={8} max={24} step={1} color="amber" />
                </div>
                
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Zap size={18} className="text-primary-600" />
                      <div>
                         <p className="text-xs font-bold text-slate-800">Start Repayment Cycle</p>
                         <p className="text-[10px] text-slate-400">First installment date: May 15, 2026</p>
                      </div>
                   </div>
                   <div className="w-10 h-6 bg-primary-600 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                    onClick={() => { onConfirm(app._id); onBack(); }}
                    className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 shadow-xl shadow-green-100 transition-all uppercase tracking-widest text-xs"
                   >
                     <CheckCircle size={20} /> Final Approve
                   </button>
                   <button className="flex-1 py-4 bg-white border-2 border-slate-200 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all uppercase tracking-widest text-xs">
                     <XCircle size={20} /> Reject Request
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const SummaryLine = ({ label, value }) => (
  <div className="flex justify-between text-xs font-medium">
     <span className="text-slate-500">{label}</span>
     <span className="font-bold text-slate-300">{value}</span>
  </div>
);

const ControlSlider = ({ label, value, set, min, max, step, unit = '', color = 'primary' }) => (
  <div className="space-y-4">
     <div className="flex justify-between items-center text-xs font-bold">
        <span className="text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={`text-lg font-bold ${color === 'amber' ? 'text-amber-600' : 'text-primary-600'}`}>{unit}{value.toLocaleString()}</span>
     </div>
     <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => set(parseInt(e.target.value))}
      className={`w-full h-2 rounded-full appearance-none bg-slate-100 accent-primary-600`}
     />
  </div>
);

export default ApplicationCenter;
