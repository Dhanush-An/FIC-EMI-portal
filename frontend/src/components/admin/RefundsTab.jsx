import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  RefreshCcw, 
  Search, 
  Filter, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText,
  AlertCircle,
  MoreVertical,
  Banknote
} from 'lucide-react';

const RefundsTab = () => {
  const [filter, setFilter] = useState('All');
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:5002/api/admin/refunds', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRefundRequests(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingRequests = refundRequests.filter(r => r.status === 'Pending');
  const pendingAmount = pendingRequests.reduce((sum, r) => sum + (r.amount || 0), 0);
  const mtdApprovedAmount = refundRequests
    .filter(r => r.status === 'Approved')
    .reduce((sum, r) => sum + (r.amount || 0), 0);
  const netImpact = refundRequests.reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Refund Management</h2>
          <p className="text-xs text-slate-500">Approve and track full or partial reversals of candidate payments.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input placeholder="Search Pmt ID..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm" />
           </div>
           <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 flex items-center gap-2">
              <Download size={14} /> Refund Report
           </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="glass-card p-4 border-l-4 border-amber-500">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Pending Requests</p>
            <p className="text-2xl font-bold text-slate-800">
              {pendingRequests.length} <span className="text-xs text-slate-400">/ ₹{pendingAmount.toLocaleString()}</span>
            </p>
         </div>
         <div className="glass-card p-4 border-l-4 border-green-500">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Approved (MTD)</p>
            <p className="text-2xl font-bold text-slate-800">
              ₹{(mtdApprovedAmount / 100000).toFixed(2)}L <span className="text-xs text-slate-400">Total</span>
            </p>
         </div>
         <div className="glass-card p-4 border-l-4 border-primary-500">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Settlement Adjustments</p>
            <p className="text-2xl font-bold text-slate-800">
              ₹{netImpact.toLocaleString()} <span className="text-xs text-slate-400">Net Impact</span>
            </p>
         </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Refund Details</th>
                <th className="px-6 py-4">Amount & Type</th>
                <th className="px-6 py-4">Requested By / Reason</th>
                <th className="px-6 py-4">Settlement Impact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {refundRequests.length > 0 ? refundRequests.map((ref) => (
                <tr key={ref._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                     <div className="font-bold text-slate-800 text-xs">{ref._id?.slice(-8).toUpperCase()}</div>
                     <div className="text-[10px] text-slate-400 font-mono">For: {ref.paymentId?.transactionId || ref.paymentId}</div>
                     <div className="text-[10px] text-primary-600 font-bold mt-1 uppercase">{ref.candidateId?.name || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-xs font-bold text-slate-700">₹{(ref.amount || 0).toLocaleString()}</div>
                     <div className="text-[9px] font-bold text-indigo-600 uppercase mt-0.5">{ref.type || 'Full Refund'}</div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-[10px] font-bold text-slate-600">{ref.requestedBy?.name || 'Staff'}</div>
                     <p className="text-[10px] text-slate-400 italic">"{ref.reason || 'No reason provided'}"</p>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-mono text-slate-500">
                     {ref.impact || 'Standard Settlement'}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                       ref.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                       ref.status === 'Approved' ? 'bg-green-100 text-green-700' :
                       'bg-blue-100 text-blue-700'
                     }`}>{ref.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button title="Issue Full" className="p-1 px-3 bg-green-600 text-white rounded-lg text-[9px] font-bold transition-all hover:bg-green-700 shadow-md shadow-green-100">FULL</button>
                        <button title="Issue Partial" className="p-1 px-3 bg-primary-600 text-white rounded-lg text-[9px] font-bold transition-all hover:bg-primary-700 shadow-md shadow-primary-100">PARTIAL</button>
                        <button title="Reject Refund" className="p-1.5 bg-white border border-slate-200 text-red-600 hover:bg-red-50 rounded-lg"><XCircle size={14} /></button>
                        <button title="Internal Note" className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-lg"><FileText size={14} /></button>
                     </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="6" className="px-6 py-20 text-center text-slate-300">
                      <RefreshCcw size={48} className="mx-auto mb-4 opacity-10" />
                      <p className="text-sm font-medium">No refund requests found.</p>
                      <p className="text-[10px] mt-1 uppercase font-bold tracking-widest opacity-40">All settlements balanced</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RefundsTab;
