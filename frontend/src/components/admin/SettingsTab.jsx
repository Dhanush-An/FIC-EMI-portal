import React, { useState } from 'react';
import { 
  Settings, 
  Percent, 
  Calculator, 
  AlertTriangle, 
  Clock, 
  RefreshCcw, 
  ShieldCheck, 
  Save, 
  ArrowRight,
  Info,
  DollarSign
} from 'lucide-react';

const SettingsTab = () => {
  const [activeSection, setActiveSection] = useState('Global Rates');

  const sections = ['Global Rates', 'EMI Logic', 'Fees & Penalties', 'Recovery Rules', 'Settlement'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <Settings className="text-primary-600" size={24} /> Finance Rules & Logic
          </h2>
          <p className="text-xs text-slate-500">Configure global interest rates, penalty math, and automated collection rules.</p>
        </div>
        <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all">
           <Save size={18} /> Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Navigation */}
         <div className="lg:col-span-1 space-y-1">
            {sections.map(s => (
               <button 
                key={s}
                onClick={() => setActiveSection(s)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeSection === s ? 'bg-primary-50 text-primary-600 border border-primary-100' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                 {s}
                 <ArrowRight size={14} className={`${activeSection === s ? 'opacity-100' : 'opacity-0'}`} />
               </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="lg:col-span-3 glass-card p-8 min-h-[500px]">
            {activeSection === 'Global Rates' && (
               <div className="space-y-8">
                  <ConfigItem 
                    icon={<Percent size={20} />} 
                    title="Default Annual Interest Rate" 
                    desc="Applies to all new EMI plans created without custom overrides."
                    input={<div className="flex items-center gap-2 font-bold text-slate-700"><input type="number" defaultValue="14" className="w-16 p-2 border rounded-lg text-center" /> %</div>}
                  />
                  <ConfigItem 
                    icon={<Clock size={20} />} 
                    title="Promo/Early Bird Rate" 
                    desc="Reduced rate for first-time candidates for the first 6 months."
                    input={<div className="flex items-center gap-2 font-bold text-slate-700"><input type="number" defaultValue="11" className="w-16 p-2 border rounded-lg text-center" /> %</div>}
                  />
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-700">
                     <AlertTriangle size={20} className="shrink-0" />
                     <p className="text-[10px] font-bold leading-relaxed">Changing global rates will not affect already active/approved plans. It only applies to future applications submitted after the change.</p>
                  </div>
               </div>
            )}

            {activeSection === 'EMI Logic' && (
               <div className="space-y-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">Calculation Methodology</h4>
                  <div className="space-y-4">
                     <RadioMethod 
                      active title="Reducing Balance Method" 
                      desc="Interest is calculated on the remaining principal balance. Most common and customer-friendly." 
                     />
                     <RadioMethod 
                      title="Flat Interest Rate" 
                      desc="Interest is calculated on the original loan amount throughout the tenure." 
                     />
                     <RadioMethod 
                      title="Custom Installment Factor" 
                      desc="Allows manual definition of fixed monthly payouts regardless of principal." 
                     />
                  </div>
               </div>
            )}

            {activeSection === 'Fees & Penalties' && (
               <div className="space-y-8">
                  <ConfigItem 
                    icon={<Calculator size={20} />} 
                    title="Default Processing Fee" 
                    desc="One-time fee collected during plan activation."
                    input={<div className="flex items-center gap-2 font-bold text-slate-700">₹ <input type="number" defaultValue="499" className="w-20 p-2 border rounded-lg text-center" /></div>}
                  />
                  <ConfigItem 
                    icon={<AlertTriangle size={20} />} 
                    title="Late Payment Penalty" 
                    desc="Fixed charge applied after the grace period expires."
                    input={<div className="flex items-center gap-2 font-bold text-slate-700">₹ <input type="number" defaultValue="499" className="w-20 p-2 border rounded-lg text-center" /></div>}
                  />
                  <ConfigItem 
                    icon={<Clock size={20} />} 
                    title="Grace Period (Days)" 
                    desc="Number of days allowing delayed payment without penalty."
                    input={<div className="flex items-center gap-2 font-bold text-slate-700"><input type="number" defaultValue="3" className="w-16 p-2 border rounded-lg text-center" /> Days</div>}
                  />
               </div>
            )}

            {activeSection === 'Recovery Rules' && (
               <div className="space-y-8">
                  <ConfigItem 
                    icon={<RefreshCcw size={20} />} 
                    title="Auto-Retry Threshold" 
                    desc="How many times the system should automatically retry a failed mandate."
                    input={<div className="flex items-center gap-2 font-bold text-slate-700"><input type="number" defaultValue="3" className="w-16 p-2 border rounded-lg text-center" /> Times</div>}
                  />
                  <ConfigItem 
                    icon={<Info size={20} />} 
                    title="Auto-Retry Interval (Hours)" 
                    desc="Wait time between consecutive retry attempts."
                    input={<div className="flex items-center gap-2 font-bold text-slate-700"><input type="number" defaultValue="24" className="w-16 p-2 border rounded-lg text-center" /> Hrs</div>}
                  />
                  <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
                     <div className="flex items-center gap-2 text-primary-700 font-bold text-xs mb-2">
                        <ShieldCheck size={16} /> Automated Escalation
                     </div>
                     <p className="text-[10px] text-primary-600 font-medium">After max retries are exhausted, the record will automatically move to the "Critical Overdue" list and trigger a Staff Task.</p>
                  </div>
               </div>
            )}

            {activeSection === 'Settlement' && (
               <div className="space-y-8">
                  <ConfigItem 
                    icon={<DollarSign size={20} />} 
                    title="Pre-closure Charges" 
                    desc="Fee for candidates closing their EMI early. (% of remaining principal)"
                    input={<div className="flex items-center gap-2 font-bold text-slate-700"><input type="number" defaultValue="2" className="w-16 p-2 border rounded-lg text-center" /> %</div>}
                  />
                  <ConfigItem 
                    icon={<ShieldCheck size={20} />} 
                    title="Settlement Discount Limit" 
                    desc="Max percentage a Staff can waive during a manual settlement discussion."
                    input={<div className="flex items-center gap-2 font-bold text-slate-700"><input type="number" defaultValue="15" className="w-16 p-2 border rounded-lg text-center" /> %</div>}
                  />
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

const ConfigItem = ({ icon, title, desc, input }) => (
  <div className="flex items-start justify-between gap-6 pb-6 border-b border-slate-50 last:border-none">
     <div className="flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
           {icon}
        </div>
        <div>
           <h4 className="text-sm font-bold text-slate-800">{title}</h4>
           <p className="text-xs text-slate-400 max-w-xs leading-relaxed mt-1 font-medium">{desc}</p>
        </div>
     </div>
     <div className="shrink-0">
        {input}
     </div>
  </div>
);

const RadioMethod = ({ title, desc, active }) => (
  <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${active ? 'border-primary-600 bg-primary-50/10' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
     <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${active ? 'border-primary-600' : 'border-slate-300'}`}>
           {active && <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />}
        </div>
        <h5 className="text-xs font-bold text-slate-800">{title}</h5>
     </div>
     <p className="text-[10px] text-slate-500 mt-2 leading-relaxed ml-7">{desc}</p>
  </div>
);

export default SettingsTab;
