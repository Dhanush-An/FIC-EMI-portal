import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  User, 
  Shield, 
  Lock, 
  CreditCard, 
  FileCheck, 
  AlertCircle,
  Activity,
  Globe,
  ArrowRight
} from 'lucide-react';

import axios from 'axios';

const AuditTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:5002/api/admin/audit', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('Approved')) return <FileCheck className="text-green-600" size={16} />;
    if (action.includes('Interest')) return <Activity className="text-amber-600" size={16} />;
    if (action.includes('Refund')) return <CreditCard className="text-blue-600" size={16} />;
    if (action.includes('Login')) return <Lock className="text-slate-600" size={16} />;
    return <ArrowRight className="text-slate-400" size={16} />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">System Audit Trail</h2>
          <p className="text-xs text-slate-500">Master timeline tracking every financial and administrative action on the platform.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search actor or action..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm" />
           </div>
           <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 flex items-center gap-2">
              <Download size={14} /> Export Logs
           </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Timestamp & ID</th>
                <th className="px-6 py-4">Actor Details</th>
                <th className="px-6 py-4">Action & Module</th>
                <th className="px-6 py-4">State Change</th>
                <th className="px-6 py-4 text-right">Device / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {logs.length > 0 ? logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                     <div className="text-xs font-bold text-slate-700">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                     <div className="text-[9px] text-slate-400 font-mono italic">{log._id?.slice(-8).toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px]"><User size={12} /></div>
                        <div>
                           <div className="text-xs font-bold text-slate-800">{log.actor?.name || 'System'}</div>
                           <div className="text-[9px] text-primary-600 font-bold uppercase tracking-tighter">{log.actor?.role || 'Service'}</div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        {getActionIcon(log.action)}
                        {log.action}
                     </div>
                     <div className="text-[10px] text-slate-500 font-medium ml-6">{log.module}</div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-1.5 text-[10px] font-bold">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded truncate max-w-[80px]">{log.oldValue || 'None'}</span>
                        <ArrowRight size={10} className="text-slate-300" />
                        <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded truncate max-w-[80px]">{log.newValue || 'Updated'}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                       <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                          <Globe size={8} /> {log.ipAddress || 'Internal'}
                       </div>
                       <div className="text-[9px] text-slate-400 font-medium truncate max-w-[100px]">{log.userAgent || 'Server'}</div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-300">
                    <History size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="text-sm font-medium">No system activity logged yet.</p>
                    <p className="text-[10px] mt-1 uppercase font-bold tracking-widest opacity-40">System startup complete</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700">
         <AlertCircle size={20} />
         <p className="text-[10px] font-bold leading-relaxed">
           CRITICAL NOTE: System logs are immutable and cannot be edited or deleted by any user role (including Super Admins) to ensure financial compliance and platform security.
         </p>
      </div>
    </div>
  );
};

export default AuditTab;
