import React, { useState } from 'react';
import { 
  Search, 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  XSquare, 
  RefreshCcw, 
  FileText, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Download,
  CheckCircle2,
  XCircle,
  FileSearch,
  MessageSquare
} from 'lucide-react';

const KYCQueue = ({ applications = [], onVerify }) => {
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const kycList = applications.filter(a => ['Submitted', 'Under Review', 'Verified'].includes(a.status));

  if (selectedKyc) {
    return <KYCDetail app={selectedKyc} onBack={() => setSelectedKyc(null)} onVerify={onVerify} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileSearch className="text-primary-600" size={24} /> KYC Verification Center
          </h2>
          <p className="text-xs text-slate-500">Review candidate identity and financial documents for compliance.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate or doc ref..." 
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-64 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm font-medium"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Candidate & Applied On</th>
                <th className="px-6 py-4 text-center">Docs Status</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4 text-center">Current Status</th>
                <th className="px-6 py-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kycList.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                           {app.candidateId?.name?.charAt(0)}
                        </div>
                        <div>
                           <div className="font-bold text-slate-800 text-sm">{app.candidateId?.name}</div>
                           <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Applied: Apr 18, 2026</div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <div className="flex justify-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-green-100 text-green-600 flex items-center justify-center text-[8px] font-bold" title="Aadhar Card">ID</span>
                        <span className="w-5 h-5 rounded bg-green-100 text-green-600 flex items-center justify-center text-[8px] font-bold" title="PAN Card">PAN</span>
                        <span className="w-5 h-5 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-[8px] font-bold" title="Bank Statement">BNK</span>
                     </div>
                     <div className="text-[8px] text-slate-400 mt-1 uppercase font-bold">Files Uploaded: 3/4</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">
                     {app.staffId?.name || 'Self Assigned'}
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        app.status === 'Verified' ? 'bg-green-100 text-green-700' : 
                        app.status === 'Submitted' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                     }`}>{app.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button onClick={() => setSelectedKyc(app)} className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all shadow-sm">
                        <Eye size={18} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {kycList.length === 0 && (
             <div className="p-20 text-center text-slate-300">
                <FileSearch size={64} className="mx-auto mb-4 opacity-10" />
                <p>No applications in the KYC queue.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const KYCDetail = ({ app, onBack, onVerify }) => {
  const [activeTab, setActiveTab] = useState('Documents');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
       <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold text-sm transition-colors">
          <ArrowRight className="rotate-180" size={18} /> Back to Queue
       </button>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Candidate Summary */}
          <div className="space-y-6">
             <div className="glass-card p-6 flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-2xl mb-4 shadow-lg border-2 border-white">
                  {app.candidateId?.name?.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{app.candidateId?.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-6 tracking-widest">{app._id?.slice(-8)}</p>
                
                <div className="w-full space-y-3 pt-4 border-t border-slate-50">
                   <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Service</span>
                      <span className="text-slate-700 font-bold">Finance Cert.</span>
                   </div>
                   <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Amount</span>
                      <span className="text-slate-700 font-bold">₹1.2L / 12m</span>
                   </div>
                </div>
             </div>

             <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-[11px] mb-2 uppercase tracking-widest">
                   <ShieldAlert size={14} /> Attention Needed
                </div>
                <p className="text-[10px] text-amber-600 font-medium leading-relaxed">
                   Bank statement is from last year. Please request the latest 3-month statement before approving.
                </p>
             </div>
          </div>

          {/* Right: Docs & Actions */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                {['Documents', 'Remarks', 'History'].map(t => (
                  <button 
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 px-4 py-3 rounded-lg text-xs font-bold transition-all ${activeTab === t ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {t}
                  </button>
                ))}
             </div>

             <div className="glass-card p-8 min-h-[400px]">
                {activeTab === 'Documents' && (
                   <div className="space-y-6">
                      <DocRow title="Aadhar Card" status="Verified" icon={<ShieldCheck className="text-green-600" size={18} />} />
                      <DocRow title="PAN Card" status="Verified" icon={<ShieldCheck className="text-green-600" size={18} />} />
                      <DocRow title="Bank Statement" status="Attention" icon={<AlertCircle className="text-amber-600" size={18} />} />
                      <DocRow title="Address Proof" status="Pending" icon={<Clock className="text-slate-400" size={18} />} />
                   </div>
                )}
                {activeTab === 'Remarks' && (
                   <div className="space-y-4">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={16} className="text-primary-600" /> Internal Notes</h5>
                      <textarea className="w-full h-32 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 text-xs font-medium" placeholder="Add your verification notes here..."></textarea>
                   </div>
                )}
                {activeTab === 'History' && (
                   <div className="space-y-4">
                      <div className="flex gap-3 text-[11px]">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-1" />
                         <div>
                            <p className="font-bold text-slate-800">KYC Started</p>
                            <p className="text-slate-400">Apr 18, 2026 / 11:30 AM</p>
                         </div>
                      </div>
                   </div>
                )}

                <div className="mt-12 flex gap-4 pt-8 border-t border-slate-50">
                   <button onClick={() => onVerify(app._id)} className="flex-1 py-3.5 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 shadow-xl shadow-green-100 transition-all uppercase tracking-widest text-[10px]">
                      <CheckCircle2 size={18} /> Approve KYC
                   </button>
                   <button className="flex-1 py-3.5 bg-white border border-slate-200 text-amber-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-50 transition-all uppercase tracking-widest text-[10px]">
                      <RefreshCcw size={18} /> Re-Upload
                   </button>
                   <button className="flex-1 py-3.5 bg-white border border-slate-200 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all uppercase tracking-widest text-[10px]">
                      <XCircle size={18} /> Reject KYC
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const DocRow = ({ title, status, icon }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary-200 hover:bg-white transition-all group">
     <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary-600">
           {icon}
        </div>
        <div>
           <h5 className="text-xs font-bold text-slate-800">{title}</h5>
           <p className={`text-[9px] font-bold uppercase tracking-widest ${status === 'Verified' ? 'text-green-600' : status === 'Attention' ? 'text-amber-600' : 'text-slate-400'}`}>{status}</p>
        </div>
     </div>
     <div className="flex gap-2">
        <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Eye size={16} /></button>
        <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Download size={16} /></button>
     </div>
  </div>
);

export default KYCQueue;
