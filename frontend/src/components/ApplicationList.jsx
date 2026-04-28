import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, CreditCard } from 'lucide-react';
import API_BASE_URL from '../config';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/candidate/applications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(res.data.data);
        if (res.data.data.length > 0) {
          setExpandedApp(res.data.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={20} className="text-green-500" />;
      case 'Rejected': return <XCircle size={20} className="text-red-500" />;
      case 'Submitted': return <Clock size={20} className="text-orange-500" />;
      case 'Verified': return <AlertCircle size={20} className="text-blue-500" />;
      default: return <Clock size={20} className="text-slate-400" />;
    }
  };

  const handlePayment = async (app, isInstallment = false, installmentNo = null) => {
    try {
      const token = localStorage.getItem('token');
      const amount = isInstallment ? (app.amountRequested / app.tenure) : (app.amountRequested * 0.1);
      const type = isInstallment ? 'EMI' : 'DownPayment';

      // 1. Create order on backend
      const { data: orderRes } = await axios.post(`${API_BASE_URL}/api/payments/order`, {
        amount,
        type,
        applicationId: app._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!orderRes.success) throw new Error('Failed to create order');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderRes.data.amount,
        currency: 'INR',
        name: 'FORGE INDIA',
        description: `${type} for App #${app._id.slice(-6)}`,
        order_id: orderRes.data.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(`${API_BASE_URL}/api/payments/verify`, {
              ...response,
              applicationId: app._id
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (verifyRes.data.success) {
              alert('Payment Successful! Your application is now Active.');
              window.location.reload();
            }
          } catch (err) {
            alert('Verification failed: ' + err.message);
          }
        },
        prefill: {
          name: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : '',
          email: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '',
        },
        theme: { color: '#0f172a' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Payment initialization failed: ' + err.message);
    }
  };

  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100 font-bold text-xl text-slate-800 flex items-center gap-2">
        <FileText size={22} className="text-primary-600" />
        My EMI Applications
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Application ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Tenure</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 italic transition-all">
            {applications.map((app) => (
              <React.Fragment key={app._id}>
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">#{app._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(app.applicationDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                     <div>₹{app.amountRequested.toLocaleString()}</div>
                     <div className="text-[10px] text-primary-600 font-bold uppercase mt-1">EMI: ₹{(app.amountRequested / app.tenure).toLocaleString()} /mo</div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                     {app.tenure} Months
                     <button 
                      onClick={() => setExpandedApp(expandedApp === app._id ? null : app._id)}
                      className="ml-2 text-[10px] text-primary-600 hover:underline font-bold uppercase"
                     >
                       {expandedApp === app._id ? '(Hide Schedule)' : '(View Schedule)'}
                     </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <span className="text-sm font-semibold italic">{app.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button 
                      disabled={app.status !== 'Approved' && app.status !== 'Active'}
                      onClick={() => handlePayment(app)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold shadow-md active:scale-95 transition-all ${
                        app.status === 'Approved' || app.status === 'Active'
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                     >
                       Pay Now
                     </button>
                  </td>
                </tr>
                {expandedApp === app._id && (
                  <tr className="bg-slate-50/50">
                    <td colSpan="6" className="px-8 py-6">
                      <div className="max-w-xl mx-auto space-y-3 animate-slide-down">
                        <div className="flex justify-between items-center mb-4">
                           <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Full Repayment Schedule</h4>
                           <span className="text-[10px] font-bold text-slate-400 italic">Target Day: 05th of every month</span>
                        </div>
                        {Array.from({ length: app.tenure }).map((_, i) => {
                          const isLast = i === app.tenure - 1;
                          const ordinal = (n) => {
                            const s = ["th", "st", "nd", "rd"], v = n % 100;
                            return n + (s[(v - 20) % 10] || s[v] || s[0]);
                          };
                          
                          return (
                            <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-primary-200 transition-all group">
                              <div className="flex items-center gap-4">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[8px] font-black uppercase ${isLast ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                                    {isLast ? 'Last' : ordinal(i + 1)}
                                 </div>
                                 <div>
                                    <p className="text-xs font-bold text-slate-700">
                                       {new Date(new Date(app.applicationDate).setMonth(new Date(app.applicationDate).getMonth() + i + 1, 5)).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                       {isLast ? 'FINAL SETTLEMENT' : `${ordinal(i + 1)} Installment`}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-6">
                                 <div className="text-right">
                                    <p className="text-sm font-bold text-slate-900">₹{(app.amountRequested / app.tenure).toLocaleString()}</p>
                                    <span className={`text-[9px] font-bold uppercase ${isLast ? 'text-red-500' : 'text-amber-500'}`}>Upcoming</span>
                                 </div>
                                 <button 
                                  onClick={() => handlePayment(app, true, i + 1)}
                                  className={`p-2 rounded-lg transition-all ${isLast ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-slate-50 text-slate-400 hover:bg-green-600 hover:text-white'}`}
                                 >
                                    <CreditCard size={14} />
                                 </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && !loading && (
          <div className="p-12 text-center text-slate-400">
            <p>You haven't applied for any EMIs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationList;
