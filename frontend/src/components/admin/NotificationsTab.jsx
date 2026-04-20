import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  CreditCard, 
  UserPlus, 
  ShieldAlert, 
  RefreshCcw,
  ExternalLink,
  Mail,
  Zap
} from 'lucide-react';

const NotificationsTab = () => {
  const [activeTab, setActiveTab] = useState('All');

  const notifications = [
    { id: 'NT-1002', title: 'New EMI Request Submitted', desc: 'Candidate "Rahul Sharma" has submitted a new EMI application for ₹1.2L.', module: 'Applications', time: '5 mins ago', priority: 'High', isRead: false, icon: <UserPlus className="text-primary-600" size={18} /> },
    { id: 'NT-1003', title: 'Failed Auto-Debit Alert', desc: 'Auto-debit for #EMI-8821 failed. Reason: Insufficient Funds.', module: 'Failures', time: '12 mins ago', priority: 'Critical', isRead: false, icon: <CreditCard className="text-red-600" size={18} /> },
    { id: 'NT-1004', title: 'Webhook Failure Detected', desc: 'Razorpay webhook "payment.captured" failed to process 3 times.', module: 'System', time: '45 mins ago', priority: 'Critical', isRead: false, icon: <Zap className="text-red-500" size={18} /> },
    { id: 'NT-1005', title: 'Refund Request Raised', desc: 'Staff John Doe requested a full refund for TXN-8818.', module: 'Refunds', time: '1 hr ago', priority: 'Medium', isRead: true, icon: <RefreshCcw className="text-amber-500" size={18} /> },
    { id: 'NT-1006', title: 'Overdue Threshold Crossed', desc: 'Delhi Cluster overdue amount has crossed ₹5L threshold.', module: 'Recovery', time: '3 hrs ago', priority: 'High', isRead: true, icon: <ShieldAlert className="text-red-700" size={18} /> },
    { id: 'NT-1007', title: 'Recon Mismatch Found', desc: 'Gateway settlement mismatch of ₹450 found for Apr 18.', module: 'Finance', time: 'Yesterday', priority: 'Medium', isRead: true, icon: <AlertCircle className="text-amber-600" size={18} /> }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <Bell className="text-primary-600" size={24} /> Notification Center
          </h2>
          <p className="text-xs text-slate-500">Real-time alerts and internal communication for all platform events.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold uppercase hover:bg-slate-200">Mark all as read</button>
           <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={20} /></button>
        </div>
      </div>

      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
         {['All', 'Unread', 'System', 'Financial', 'Priority'].map(t => (
           <button 
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === t ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
           >
             {t}
           </button>
         ))}
      </div>

      <div className="space-y-3">
         {notifications.map((notif) => (
           <NotificationItem key={notif.id} notif={notif} />
         ))}
      </div>
    </div>
  );
};

const NotificationItem = ({ notif }) => (
  <div className={`glass-card p-5 border-l-4 transition-all hover:bg-white/50 cursor-pointer group ${
    notif.isRead ? 'border-slate-100 opacity-80' : 
    notif.priority === 'Critical' ? 'border-red-600 bg-red-50/10' : 
    notif.priority === 'High' ? 'border-amber-500 bg-amber-50/10' : 'border-primary-500'
  }`}>
    <div className="flex gap-4">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform`}>
          {notif.icon}
       </div>
       <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
             <div>
                <h4 className={`text-sm font-bold ${notif.isRead ? 'text-slate-600' : 'text-slate-800'}`}>
                   {notif.title}
                   {!notif.isRead && <span className="ml-2 w-2 h-2 rounded-full bg-primary-600 inline-block animate-pulse" />}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                   <span className="text-[10px] font-bold text-primary-600 uppercase bg-primary-100 px-2 rounded">{notif.module}</span>
                   <span className={`text-[10px] font-bold px-2 rounded uppercase ${
                      notif.priority === 'Critical' ? 'text-red-600 bg-red-100' : 
                      notif.priority === 'High' ? 'text-amber-600 bg-amber-100' : 'text-slate-500 bg-slate-100'
                   }`}>{notif.priority}</span>
                   <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Clock size={10} /> {notif.time}</span>
                </div>
             </div>
             <div className="flex gap-1">
                <button title="Email copy sent" className="p-1 text-slate-300 hover:text-primary-600"><Mail size={14} /></button>
                <button title="View Details" className="p-1 text-slate-300 hover:text-primary-600"><ExternalLink size={14} /></button>
             </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">{notif.desc}</p>
       </div>
    </div>
  </div>
);

export default NotificationsTab;
