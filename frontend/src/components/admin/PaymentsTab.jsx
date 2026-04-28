import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { 
  Search, 
  Filter, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Download,
  Calendar,
  Layers,
  ExternalLink,
  User,
  Eye
} from 'lucide-react';

const PaymentsTab = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const paymentFilters = ['All', 'Today', 'This Week', 'This Month', 'Success', 'Failed', 'Refunded'];

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/payments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => {
    const candidateName = p.userId?.name || '';
    const matchesSearch = p._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          candidateName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filter !== 'All') {
      if (['Success', 'Failed', 'Refunded'].includes(filter)) {
        matchesFilter = p.status.toLowerCase() === filter.toLowerCase();
      } else {
        const paymentDate = new Date(p.createdAt);
        const today = new Date();
        
        if (filter === 'Today') {
          matchesFilter = paymentDate.toDateString() === today.toDateString();
        } else if (filter === 'This Week') {
          const oneWeekAgo = new Date(today);
          oneWeekAgo.setDate(today.getDate() - 7);
          matchesFilter = paymentDate >= oneWeekAgo;
        } else if (filter === 'This Month') {
          matchesFilter = paymentDate.getMonth() === today.getMonth() && 
                          paymentDate.getFullYear() === today.getFullYear();
        }
      }
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    alert(`Exporting ${filteredPayments.length} records to CSV...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
          {paymentFilters.map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${filter === f ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 'text-slate-400 hover:text-primary-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Txn ID, name..." 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-48 focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
              />
            </div>
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shadow-lg shadow-slate-200 active:scale-95 transition-all"
            >
               <Download size={14} /> Export
            </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Candidate & Plan</th>
                <th className="px-6 py-4 text-center">Inst #</th>
                <th className="px-6 py-4">Amount & Type</th>
                <th className="px-6 py-4">Date & Mode</th>
                <th className="px-6 py-4">Status / Recon</th>
                <th className="px-6 py-4 text-right">Raw ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length > 0 ? filteredPayments.map((pmt) => (
                <tr key={pmt._id} className="hover:bg-slate-50 transition-colors group text-xs">
                  <td className="px-6 py-4">
                     <span className="font-bold text-slate-800 font-mono tracking-tighter">{pmt.transactionId?.toUpperCase() || 'TXN-PENDING'}</span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="font-bold text-slate-700">{pmt.userId?.name || 'Unknown Candidate'}</div>
                     <div className="text-[10px] text-primary-600 font-bold uppercase">{pmt.userId?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-500">{(pmt.installmentNo || 0).toString().padStart(2, '0')}</td>
                  <td className="px-6 py-4">
                     <div className={`font-bold ${pmt.status === 'Failed' ? 'text-red-600 line-through opacity-70' : 'text-slate-800'}`}>₹{pmt.amount?.toLocaleString()}</div>
                     <div className="text-[10px] text-slate-400 font-medium uppercase font-sans">{pmt.type || 'Recurring'}</div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-1 text-slate-600 font-medium"><Calendar size={10} /> {new Date(pmt.createdAt).toLocaleDateString()}</div>
                     <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">{pmt.method || 'Razorpay'}</div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          pmt.status === 'Success' ? 'bg-green-100 text-green-700' :
                          pmt.status === 'Failed' ? 'bg-red-100 text-red-600' :
                          'bg-amber-100 text-amber-700'
                        }`}>{pmt.status}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-slate-400 font-mono text-[10px]">
                      {pmt.razorpayPaymentId || 'N/A'} <ExternalLink size={12} className="hover:text-primary-600 cursor-pointer" />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="7" className="px-6 py-20 text-center text-slate-300">
                      <CreditCard size={48} className="mx-auto mb-4 opacity-10" />
                      <p className="text-sm font-medium">No payments recorded yet.</p>
                      <p className="text-[10px] mt-1 uppercase font-bold tracking-widest opacity-40">System startup complete</p>
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

export default PaymentsTab;
