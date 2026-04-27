import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  User, 
  Phone, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  ArrowRight,
  Download,
  FileText,
  History,
  CreditCard,
  MessageSquare
} from 'lucide-react';

const CandidatesTab = ({ applications }) => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const filters = ['All', 'New', 'Approved', 'Active EMI', 'Overdue', 'Closed', 'Cancelled'];

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.candidateId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.candidateId?._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'All') return matchesSearch;
    if (filter === 'New') return matchesSearch && app.status === 'Submitted';
    if (filter === 'Approved') return matchesSearch && app.status === 'Approved';
    if (filter === 'Active EMI') return matchesSearch && app.status === 'Active';
    // Add logic for other filters as needed
    return matchesSearch;
  });

  if (selectedCandidate) {
    return <CandidateDetail candidate={selectedCandidate} onBack={() => setSelectedCandidate(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 'text-slate-500 hover:text-primary-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Name or ID..." 
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-64 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Candidate Info</th>
                <th className="px-6 py-4">Staff / Status</th>
                <th className="px-6 py-4">EMI Financials</th>
                <th className="px-6 py-4">Next Due / Mandate</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr key={app._id} className="hover:bg-primary-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{app.candidateId?.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase tracking-tight">ID: {app._id?.slice(-8)}</div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5"><Phone size={10} /> {app.candidateId?.phone || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-semibold text-slate-600">{app.staffId?.name || 'Unassigned'}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        app.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>{app.status}</span>
                      {app.isRisk && <span className="bg-red-100 text-red-600 p-0.5 rounded"><AlertCircle size={10} /></span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="font-bold text-slate-800">₹{app.amountRequested?.toLocaleString()}</div>
                    <div className="text-slate-500 mt-0.5">Bal: ₹{(app.amountRequested * 0.8).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="flex items-center gap-1 text-slate-600"><Clock size={12} /> Apr 15, 2026</div>
                    <div className={`flex items-center gap-1 text-[10px] mt-1 font-bold ${app.mandateStatus === 'Active' ? 'text-green-600' : 'text-amber-600'}`}>
                      <ShieldCheck size={10} /> Mandate {app.mandateStatus || 'Pending'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                       <button 
                        onClick={() => setSelectedCandidate(app)}
                        className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-300 rounded-lg transition-all"
                       >
                        <Eye size={16} />
                       </button>
                       <button className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-lg">
                        <MoreVertical size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApps.length === 0 && (
            <div className="p-20 text-center">
              <User size={48} className="mx-auto mb-4 text-slate-200" />
              <p className="text-slate-500">No candidates found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CandidateDetail = ({ candidate, onBack }) => {
  const [activeTab, setActiveTab] = useState('Profile');
  const tabs = ['Profile', 'KYC Documents', 'EMI Plan', 'Payment History', 'Staff Remarks', 'Audit Trail'];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Detail Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold text-sm transition-colors">
          <ArrowRight className="rotate-180" size={18} /> Back to List
        </button>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 flex items-center gap-2">
            <Download size={14} /> Export Ledger
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 shadow-md shadow-red-200 flex items-center gap-2">
            <AlertCircle size={14} /> Flag Risk
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Card: Summary */}
        <div className="glass-card p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-3xl mb-4 border-4 border-white shadow-lg">
            {candidate.candidateId?.name?.charAt(0)}
          </div>
          <h3 className="text-xl font-bold text-slate-800">{candidate.candidateId?.name}</h3>
          <p className="text-slate-500 text-sm mb-6 uppercase tracking-widest font-bold">ID: {candidate._id?.slice(-12)}</p>
          
          <div className="w-full space-y-3">
            <DetailItem label="Email" value={candidate.candidateId?.email} />
            <DetailItem label="Phone" value={candidate.candidateId?.phone} />
            <DetailItem label="Status" value={
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">{candidate.status}</span>
            } />
            <DetailItem label="Mandate" value="✅ Active (UPI AutoPay)" />
          </div>

          <div className="w-full mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="flex justify-between items-center mb-1">
               <span className="text-[10px] font-bold text-slate-400 uppercase">EMI Progress</span>
               <span className="text-[10px] font-bold text-slate-600">4 / 12 PMT</span>
             </div>
             <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
               <div className="w-1/3 h-full bg-primary-600" />
             </div>
          </div>
        </div>

        {/* Right Section: Multi-Tab Detail */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
            {tabs.map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 px-4 py-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === t ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="glass-card p-8 min-h-[400px]">
            {activeTab === 'Profile' && (
              <div className="grid grid-cols-2 gap-8">
                <Section title="Personal Info" items={[
                  {label: 'Full Name', value: candidate.candidateId?.name},
                  {label: 'DOB', value: '12 Jan 1995'},
                  {label: 'Occupation', value: 'Self Employed'},
                  {label: 'Monthly Income', value: '₹45,000'}
                ]} />
                <Section title="Address Info" items={[
                  {label: 'Current City', value: 'New Delhi'},
                  {label: 'Zip Code', value: '110001'},
                  {label: 'State', value: 'Delhi'}
                ]} />
              </div>
            )}
            {activeTab === 'KYC Documents' && (
              <div className="grid grid-cols-2 gap-4">
                 <DocCard title="Aadhar Card" status="Verified" icon={<ShieldCheck size={20} />} />
                 <DocCard title="PAN Card" status="Verified" icon={<ShieldCheck size={20} />} />
                 <DocCard title="Bank Statement" status="Pending Review" icon={<Clock size={20} />} />
                 <DocCard title="Live Photo" status="Verified" icon={<Eye size={20} />} />
              </div>
            )}
            {activeTab === 'EMI Plan' && (
              <div className="space-y-6">
                 <div className="p-4 bg-primary-50 rounded-xl border border-primary-100 flex justify-between items-center text-primary-700">
                    <div>
                      <h4 className="font-bold">Reducing Balance Plan</h4>
                      <p className="text-[10px] opacity-70 italic">Approved on 12 Feb 2026</p>
                    </div>
                    <FileText size={24} />
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    <SummaryItem label="Int. Rate" value={`${candidate.interestRate || 12}% P.A.`} />
                    <SummaryItem label="Proc. Fee" value="₹499" />
                    <SummaryItem label="Tenure" value={`${candidate.tenure} Months`} />
                 </div>
              </div>
            )}
            {activeTab === 'Payment History' && (
               <div className="space-y-3">
                 {candidate.payments && candidate.payments.length > 0 ? (
                   candidate.payments.map(p => (
                     <PaymentRow key={p._id} id={`TXN-${p._id.slice(-6).toUpperCase()}`} date={new Date(p.paymentDate).toLocaleDateString()} amount={`₹${p.amount.toLocaleString()}`} status={p.status} />
                   ))
                 ) : (
                   <div className="py-12 text-center text-slate-400">
                     <CreditCard size={40} className="mx-auto mb-3 opacity-20" />
                     <p className="text-sm">No transaction history found for this candidate.</p>
                   </div>
                 )}
               </div>
            )}
            {activeTab === 'Staff Remarks' && (
              <div className="space-y-4">
                {candidate.remarks && candidate.remarks.length > 0 ? (
                  candidate.remarks.map((r, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                          {r.by?.name?.charAt(0) || 'S'}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{r.by?.name || 'Staff Member'}</span>
                        <span className="ml-auto text-[10px] text-slate-400">{new Date(r.date).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{r.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <MessageSquare size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No internal remarks recorded yet.</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'Audit Trail' && (
              <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                <TimelineItem title="Current Status" actor={candidate.status} date={new Date(candidate.applicationDate).toLocaleString()} />
                {candidate.approvalDate && (
                  <TimelineItem title="Application Approved" actor="Admin" date={new Date(candidate.approvalDate).toLocaleString()} />
                )}
                <TimelineItem title="Application Created" actor="Candidate" date={new Date(candidate.applicationDate).toLocaleString()} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-400 font-medium">{label}</span>
    <span className="text-slate-700 font-bold">{value}</span>
  </div>
);

const Section = ({ title, items }) => (
  <div className="space-y-4">
    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h4>
    <div className="space-y-3">
      {items.map(i => (
        <div key={i.label} className="border-b border-slate-50 pb-2">
          <p className="text-[10px] text-slate-400 font-bold uppercase">{i.label}</p>
          <p className="text-sm font-bold text-slate-800">{i.value}</p>
        </div>
      ))}
    </div>
  </div>
);

const DocCard = ({ title, status, icon }) => (
  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-4 group hover:border-primary-200 hover:bg-white transition-all">
    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary-600">
      {icon}
    </div>
    <div>
      <h5 className="text-sm font-bold text-slate-700">{title}</h5>
      <p className={`text-[10px] font-bold ${status === 'Verified' ? 'text-green-600' : 'text-amber-600'}`}>{status}</p>
    </div>
  </div>
);

const PaymentRow = ({ id, date, amount, status }) => (
  <div className="p-4 rounded-xl border border-slate-50 bg-white flex items-center justify-between hover:border-slate-200 transition-all">
    <div className="flex items-center gap-4 text-xs">
      <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><CreditCard size={18} /></div>
      <div>
        <div className="font-bold text-slate-800">{id}</div>
        <div className="text-[10px] text-slate-400">{date}</div>
      </div>
    </div>
    <div className="text-right">
       <div className="font-bold text-slate-800">{amount}</div>
       <div className="text-[10px] text-green-600 font-bold">{status}</div>
    </div>
  </div>
);

const SummaryItem = ({ label, value }) => (
  <div className="p-3 bg-white border border-slate-100 rounded-xl text-center shadow-sm">
    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
    <p className="font-bold text-slate-800">{value}</p>
  </div>
);

const TimelineItem = ({ title, actor, date }) => (
  <div className="relative">
    <div className="absolute -left-[30px] top-1 w-[12px] h-[12px] rounded-full bg-white border-2 border-primary-600 z-10" />
    <h5 className="text-sm font-bold text-slate-800">{title}</h5>
    <p className="text-xs text-slate-500 font-medium">{actor}</p>
    <p className="text-[10px] text-slate-400 mt-0.5">{date}</p>
  </div>
);

export default CandidatesTab;
