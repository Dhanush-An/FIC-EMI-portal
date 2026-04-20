import React, { useState } from 'react';
import { 
  ScrollText, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  FileCheck, 
  IndianRupee, 
  AlertCircle, 
  Clock, 
  Target,
  ArrowRight,
  TrendingUp,
  Loader2
} from 'lucide-react';

const DailyReportForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="glass-card p-12 text-center animate-fade-in flex flex-col items-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Daily report submitted!</h3>
        <p className="text-slate-500 mb-8 max-w-sm">Thank you for your report. The Admin has been notified about your daily performance and achievements.</p>
        <div className="flex gap-4">
           <button onClick={() => setSubmitted(false)} className="btn-primary">Edit Report</button>
           <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">Download Copy</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 italic">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ScrollText className="text-primary-600" size={24} /> Daily Productivity Report
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Submission of this report is mandatory before logging out.</p>
        </div>
        <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-bold uppercase border border-amber-100 flex items-center gap-2 animate-pulse">
           <Clock size={12} /> Pending Submission
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 space-y-8">
           <Section title="Operational Metrics">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 <ReportInput label="Calls Made" icon={<PhoneCall size={14} />} placeholder="42" />
                 <ReportInput label="Candidates Met" icon={<TrendingUp size={14} />} placeholder="8" />
                 <ReportInput label="KYC Verified" icon={<FileCheck size={14} />} placeholder="5" />
                 <ReportInput label="Payments Logged" icon={<IndianRupee size={14} />} placeholder="₹45,000" />
                 <ReportInput label="Follow-ups Done" icon={<Clock size={14} />} placeholder="12" />
                 <ReportInput label="Escalations" icon={<AlertCircle size={14} />} placeholder="2" />
              </div>
           </Section>

           <Section title="Reflection & Challenges">
              <div className="space-y-4">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Today's Key Achievement</p>
                    <textarea required className="input-field h-24 py-4" placeholder="Briefly describe what went well today..."></textarea>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Issues or blockers faced</p>
                    <textarea className="input-field h-24 py-4" placeholder="Any technical or field issues encountered?"></textarea>
                 </div>
              </div>
           </Section>

           <div className="pt-6 border-t border-slate-50">
              <button type="submit" disabled={loading} className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all uppercase tracking-widest text-xs">
                 {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> Finalize & Submit Report</>}
              </button>
           </div>
        </div>

        <div className="space-y-6">
           <div className="glass-card p-6 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full blur-[70px] opacity-10" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Execution Summary</h4>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                       <span className="text-slate-400">Target Efficiency</span>
                       <span className="text-primary-400">85%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                       <div className="w-[85%] h-full bg-primary-500" />
                    </div>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Admin Feedback Index</p>
                    <div className="flex gap-1 text-amber-400">
                       <Target size={14} /><Target size={14} /><Target size={14} /><Target size={14} /><Target size={14} className="opacity-30" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-5 bg-primary-50 rounded-2xl border border-primary-100 flex items-start gap-3">
              <AlertCircle className="text-primary-600 mt-0.5" size={18} />
              <p className="text-[10px] text-primary-700 font-medium leading-relaxed">
                 By submitting this report, you certify that all information logged is accurate and reflects your actual operational activities for today.
              </p>
           </div>
        </div>
      </form>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="space-y-4">
     <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
        <Target size={16} className="text-primary-600" /> {title}
     </h3>
     {children}
  </div>
);

const ReportInput = ({ label, icon, placeholder }) => (
  <div className="space-y-2">
     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">{icon} {label}</p>
     <input required className="input-field text-center py-2.5 font-bold text-slate-700" placeholder={placeholder} />
  </div>
);

export default DailyReportForm;
