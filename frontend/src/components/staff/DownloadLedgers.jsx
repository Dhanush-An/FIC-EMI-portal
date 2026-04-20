import React from 'react';
import { 
  Download, 
  Search, 
  FileText, 
  ScrollText, 
  ArrowRight,
  Calculator,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Filter
} from 'lucide-react';

const DownloadLedgers = () => {
  const ledgers = [
    { name: 'Rahul Sharma', id: 'EMI-442', status: 'Active', balance: '₹42,000' },
    { name: 'Anita Verma', id: 'EMI-210', status: 'Overdue', balance: '₹8,500' },
    { name: 'Suresh Gupta', id: 'EMI-312', status: 'Active', balance: '₹12,400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Download className="text-primary-600" size={24} /> Financial Ledgers
          </h2>
          <p className="text-xs text-slate-500">Generate and download official EMI statements and payment histories.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input placeholder="Search candidate..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm" />
           </div>
           <button className="p-2 border border-slate-200 rounded-xl text-slate-500"><Filter size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {ledgers.map((l, i) => (
           <div key={i} className="glass-card p-6 hover:shadow-2xl hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <ScrollText size={24} />
                 </div>
                 <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${l.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{l.status}</span>
              </div>
              
              <h4 className="font-bold text-slate-800 text-sm mb-1">{l.name}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Plan Ref: {l.id}</p>
              
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl mb-6">
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Balance</p>
                    <p className="text-sm font-bold text-slate-700">{l.balance}</p>
                 </div>
                 <Calculator className="text-slate-300" size={20} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <button className="py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-primary-600 transition-all">
                    <Download size={14} /> PDF
                 </button>
                 <button className="py-2 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                    <Download size={14} /> EXCEL
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default DownloadLedgers;
