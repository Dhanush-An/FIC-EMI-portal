import React from 'react';
import { 
  AlertCircle, 
  Search, 
  MoreVertical, 
  Bell, 
  UserPlus, 
  PauseCircle, 
  Calculator,
  ArrowRight,
  Clock,
  ExternalLink,
  MessageCircle,
  ShieldAlert
} from 'lucide-react';

const OverdueTab = ({ applications = [] }) => {
  // Mock fallback for demonstration when DB is empty
  const overdueItems = applications.filter(app => app.status === 'Overdue');
  
  // Dynamic Calculations
  const totalAmount = overdueItems.reduce((sum, item) => sum + (item.amountRequested || 0), 0);
  const candidatesCount = overdueItems.length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <MetricCard 
           title="Total Overdue" 
           value={`₹${(totalAmount / 100000).toFixed(2)}L`} 
           icon={<ShieldAlert className="text-red-600" size={20} />} 
           trend={`${candidatesCount} Candidates`} 
         />
         <MetricCard title="1-30 Days" value="₹0L" icon={<Clock className="text-amber-500" size={20} />} trend="0 Plans" />
         <MetricCard title="31-60 Days" value="₹0L" icon={<Clock className="text-orange-500" size={20} />} trend="0 Plans" />
         <MetricCard title="61+ Days" value="₹0L" icon={<AlertCircle className="text-red-700" size={20} />} trend="0 Plans" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-800">Recovery Dashboard</h3>
        <div className="flex gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input placeholder="Search recovery queue..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm" />
           </div>
           <button className="p-2 bg-primary-600 text-white rounded-lg"><Bell size={18} /></button>
        </div>
      </div>

      {/* Overdue Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-red-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-red-100">
                <th className="px-6 py-4">Overdue Candidate</th>
                <th className="px-6 py-4">Missed Amount</th>
                <th className="px-6 py-4 text-center">Aging / Retries</th>
                <th className="px-6 py-4">Assigned Staff</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {overdueItems.map((item) => (
                <tr key={item._id} className="hover:bg-red-50/20 transition-colors group">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                          {item.candidateId?.name?.charAt(0)}
                        </div>
                        <div>
                           <div className="font-bold text-slate-800 text-xs">{item.candidateId?.name}</div>
                           <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase">
                             <ArrowRight size={8} /> {item._id?.slice(-6)}
                           </div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-xs font-bold text-red-600">₹4,200 <span className="text-[10px] text-slate-400 font-normal ml-1">+ ₹499 Pen.</span></div>
                     <div className="text-[9px] text-slate-500 mt-0.5">Due since: Mar 15, 2026</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <div className="text-xs font-bold text-slate-700">14 Days</div>
                     <div className="flex justify-center gap-1 mt-1 text-[8px] font-bold">
                        <span className="w-4 h-4 rounded bg-red-50 text-red-600 flex items-center justify-center border border-red-100">2</span>
                        <span className="leading-4 text-slate-400">RETRIES</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <div className="text-[10px] font-bold text-slate-600">{item.staffId?.name || 'Unassigned'}</div>
                        <button className="p-0.5 text-primary-600 hover:bg-primary-50 rounded transition-colors"><UserPlus size={12} /></button>
                     </div>
                     <div className="text-[9px] text-slate-400 mt-0.5 font-medium italic italic">Follow-up: 2 hrs ago</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-1.5">
                        <button title="Send Reminder" className="p-1.5 bg-white border border-slate-200 text-amber-600 hover:bg-amber-600 hover:text-white rounded-lg transition-all"><Bell size={14} /></button>
                        <button title="Manual Payment Link" className="p-1.5 bg-white border border-slate-200 text-primary-600 hover:bg-primary-600 hover:text-white rounded-lg transition-all"><ExternalLink size={14} /></button>
                        <button title="Add/Waive Penalty" className="p-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-white rounded-lg transition-all"><Calculator size={14} /></button>
                        <button title="Settlement Discussion" className="p-1.5 bg-white border border-slate-200 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all"><MessageCircle size={14} /></button>
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

const MetricCard = ({ title, value, icon, trend }) => (
  <div className="glass-card p-5 border-l-4 border-red-500">
    <div className="flex justify-between items-center mb-1">
      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-sans">{title}</span>
      {icon}
    </div>
    <div className="text-xl font-bold text-slate-800">{value}</div>
    <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{trend}</div>
  </div>
);

export default OverdueTab;
