import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  ArrowRight, 
  Calculator, 
  CircleDollarSign,
  Briefcase,
  Calendar,
  X,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { getCandidates, onboardCandidate } from '../../services/StaffService';

const ApplyLoan = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [loanData, setLoanData] = useState({
    purpose: '',
    service: 'Professional Course',
    amount: '',
    initialPayment: '',
    monthlyDue: '',
    tenure: '12'
  });

  useEffect(() => {
    const amount = parseFloat(loanData.amount) || 0;
    const initial = parseFloat(loanData.initialPayment) || 0;
    const tenure = parseInt(loanData.tenure) || 12;

    const balance = amount - initial;
    const emi = balance > 0 ? (balance / tenure).toFixed(2) : '0.00';
    
    setLoanData(prev => {
      if (prev.monthlyDue === emi) return prev;
      return { ...prev, monthlyDue: emi };
    });
  }, [loanData.amount, loanData.initialPayment, loanData.tenure]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await getCandidates();
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleApplyLoan = (candidate) => {
    setSelectedCandidate(candidate);
    setLoanData({
      ...loanData,
      amount: '',
      initialPayment: '',
      monthlyDue: '',
      purpose: ''
    });
    setShowModal(true);
  };

  const handleSubmitLoan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Reusing onboardCandidate logic but for an existing candidate
      // The backend onboardCandidate already checks if user exists
      await onboardCandidate({
        name: selectedCandidate.name,
        email: selectedCandidate.email,
        phone: selectedCandidate.phone,
        address: 'Existing Candidate', // Placeholder or fetch from profile
        service: loanData.service,
        amount: loanData.amount,
        tenure: loanData.tenure,
        notes: `Purpose: ${loanData.purpose}. Initial: ${loanData.initialPayment}. Monthly: ${loanData.monthlyDue}`
      });
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowModal(false);
      }, 2000);
    } catch (err) {
      alert(err || 'Failed to apply loan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Apply New Loan</h2>
          <p className="text-slate-500 text-sm">Select a candidate to initiate a new loan application.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search candidates..."
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl w-full md:w-80 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : activeCandidates.length > 0 ? (
          activeCandidates.map(candidate => (
            <div key={candidate._id} className="glass-card p-6 group hover:border-primary-300 transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xl group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  {candidate.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{candidate.name}</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Candidate ID: {candidate._id.slice(-8)}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail size={14} className="text-slate-400" /> {candidate.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone size={14} className="text-slate-400" /> {candidate.phone}
                </div>
              </div>
              <button 
                disabled={candidate.hasActiveLoan}
                onClick={() => handleApplyLoan(candidate)}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  candidate.hasActiveLoan 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                  : 'bg-slate-50 text-slate-600 hover:bg-primary-600 hover:text-white group-hover:border-primary-100'
                }`}
              >
                 {candidate.hasActiveLoan ? (
                   <>
                     <CheckCircle2 size={16} className="text-green-500" />
                     {candidate.tenure}m Due Active ({candidate.loanStatus})
                   </>
                 ) : (
                   <>
                     <CircleDollarSign size={16} /> Apply Loan
                   </>
                 )}
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass-card">
            <User size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="text-slate-500 font-medium">No candidates found.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            {success ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Loan Application Submitted!</h3>
                <p className="text-slate-500">The loan request for {selectedCandidate.name} has been initiated.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
                      {selectedCandidate.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">New Loan Application</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{selectedCandidate.name} • {selectedCandidate.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmitLoan} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-full">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Briefcase size={14} /> Purpose of Loan
                      </label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g., Professional Development, Certification Fee"
                        className="input-field"
                        value={loanData.purpose}
                        onChange={(e) => setLoanData({...loanData, purpose: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         Loan Service Type
                      </label>
                      <select 
                        className="input-field cursor-pointer"
                        value={loanData.service}
                        onChange={(e) => {
                          const service = e.target.value;
                          let amount = '0';
                          if (service === 'IT') amount = '120000';
                          else if (service === 'BANKING') amount = '80000';
                          else if (service === 'NON-IT') amount = '60000';
                          setLoanData(prev => ({...prev, service, amount}));
                        }}
                      >
                        <option value="">Select Service</option>
                        <option value="IT">IT (Information Technology)</option>
                        <option value="BANKING">BANKING & FINANCE</option>
                        <option value="NON-IT">NON-IT / VOCATIONAL</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <CircleDollarSign size={14} /> Total Loan Amount
                      </label>
                      <input 
                        required
                        type="number" 
                        placeholder="Requested Amount"
                        className="input-field font-bold text-slate-700"
                        value={loanData.amount}
                        onChange={(e) => setLoanData({...loanData, amount: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        Initial Down Payment
                      </label>
                      <input 
                        required
                        type="number" 
                        placeholder="Payment to be made now"
                        className="input-field"
                        value={loanData.initialPayment}
                        onChange={(e) => setLoanData({...loanData, initialPayment: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        Monthly Due Amount
                      </label>
                      <div className="relative">
                        <input 
                          readOnly
                          type="text" 
                          placeholder="Installment amount"
                          className="input-field bg-slate-50 text-primary-700 font-bold border-primary-100"
                          value={loanData.monthlyDue}
                        />
                        {loanData.amount && (
                          <p className="text-[9px] text-slate-400 mt-1 font-medium italic">
                            Calculation: (₹{loanData.amount} - ₹{loanData.initialPayment || 0}) / {loanData.tenure}m
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={14} /> EMI Period (Months)
                      </label>
                      <div className="flex gap-2">
                        {['3', '6', '12', '18', '24'].map(t => (
                          <button 
                            key={t}
                            type="button"
                            onClick={() => setLoanData(prev => ({...prev, tenure: t}))}
                            className={`flex-1 py-3 rounded-xl border-2 text-xs font-bold transition-all ${loanData.tenure === t ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}
                          >
                            {t}m
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {loanData.amount && (
                    <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Balance Amount</p>
                        <p className="text-xl font-black text-primary-900">₹{(parseFloat(loanData.amount) - (parseFloat(loanData.initialPayment) || 0)).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{loanData.tenure} Months EMI</p>
                        <p className="text-xl font-black text-primary-900">₹{parseFloat(loanData.monthlyDue).toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="flex-[2] py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Calculator size={16} /> Finalize Loan Request</>}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyLoan;
