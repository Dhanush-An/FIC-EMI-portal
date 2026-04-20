import React, { useState, useEffect } from 'react';
import { Calculator, Send, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import axios from 'axios';

const EMIApplicationForm = () => {
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(12);
  const [interestRate, setInterestRate] = useState(10); // 10% annual
  const [emi, setEmi] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    calculateEMI();
  }, [amount, tenure, interestRate]);

  const calculateEMI = () => {
    const r = (interestRate / 12) / 100;
    const n = tenure;
    const emiValue = amount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    setEmi(Math.round(emiValue || 0));
  };

  const handleApply = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:5002/api/candidate/apply', {
        amountRequested: amount,
        tenure: tenure,
        interestRate: interestRate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-card p-12 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Application Submitted!</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Your EMI application for ₹{amount.toLocaleString()} has been received. Our team will verify your documents and get back to you shortly.
        </p>
        <button 
          onClick={() => window.location.href = '/candidate/applications'}
          className="btn-primary"
        >
          View Application Status
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Left: Calculator */}
      <div className="lg:col-span-2 space-y-6">
        <section className="glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
              <Calculator size={20} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">EMI Calculator</h3>
          </div>

          <div className="space-y-8">
            {/* Amount Slider */}
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-lg font-semibold text-slate-700">Requested Amount</label>
                <span className="text-2xl font-bold text-primary-600">₹{amount.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="5000" 
                max="500000" 
                step="5000" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium tracking-wider">
                <span>₹5,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            {/* Tenure Select */}
            <div>
              <label className="block text-lg font-semibold text-slate-700 mb-4">Repayment Tenure</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[3, 6, 12, 18, 24, 36].map((months) => (
                  <button
                    key={months}
                    onClick={() => setTenure(months)}
                    className={`py-3 rounded-xl font-bold border-2 transition-all ${
                      tenure === months 
                      ? 'border-primary-600 bg-primary-50 text-primary-600' 
                      : 'border-slate-100 hover:border-slate-200 text-slate-500 bg-white'
                    }`}
                  >
                    {months}M
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-blue-800">
              <Info size={20} className="shrink-0" />
              <p className="text-sm italic">
                The interest rate is currently set at 10% per annum. Final interest rates may vary based on your credit profile and are subject to admin approval.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Right: Summary & Action */}
      <div className="space-y-6">
        <section className="glass-card p-8 bg-slate-900 text-white sticky top-8">
          <h3 className="text-xl font-bold mb-6">Application Summary</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-slate-400">
              <span>Principal Amount</span>
              <span className="text-white font-medium">₹{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Interest Rate</span>
              <span className="text-white font-medium">{interestRate}% p.a</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Tenure</span>
              <span className="text-white font-medium">{tenure} Months</span>
            </div>
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Estimated Monthly EMI</span>
              <span className="text-2xl font-bold text-primary-400">₹{emi.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={handleApply}
            disabled={loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-900/40 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> Apply Now</>}
          </button>
          
          <p className="mt-4 text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">
            Secure Application Process <ArrowRight size={10} className="inline ml-1" />
          </p>
        </section>
      </div>
    </div>
  );
};

// Loader component for internal use
const Loader2 = ({ size, className }) => <Calculator size={size} className={`animate-spin ${className}`} />;

export default EMIApplicationForm;
