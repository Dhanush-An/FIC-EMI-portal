import React, { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  FileUp, 
  Save, 
  Send,
  Plus,
  Loader2,
  CheckCircle2,
  X,
  Calendar,
  Briefcase,
  IndianRupee,
  Landmark,
  Map,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { onboardCandidate } from '../../services/StaffService';

const AddCandidate = ({ onCandidateAdded }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState({ idProof: null, photo: null, incomeProof: null });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    occupation: '',
    income: '',
    address: '',
    city: '',
    zip: '',
    state: '',
    notes: '',
    password: '',
    confirmPassword: ''
  });

  const handleFileUpload = (key, file) => {
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (type) => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      alert('Please fill in required demographic and security fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await onboardCandidate(formData);
      setLoading(false);
      setSuccess(true);
      if (onCandidateAdded) onCandidateAdded();
    } catch (err) {
      setLoading(false);
      const errorMsg = typeof err === 'string' ? err : (err?.response?.data?.error || 'Failed to onboard candidate');
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  if (success) {
    return (
      <div className="glass-card p-12 text-center animate-fade-in flex flex-col items-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Registration initiated!</h3>
        <p className="text-slate-500 mb-8 max-w-sm">A secure login link has been sent to candidate's email and mobile. They can now complete their KYC.</p>
        <div className="flex gap-4">
           <button onClick={() => setSuccess(false)} className="btn-primary">Add Another</button>
           <button onClick={() => window.location.href = '/staff/apply-loan'} className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">Go to Apply Loan</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
           <h2 className="text-xl font-bold text-slate-800">New Candidate Enrollment</h2>
           <p className="text-xs text-slate-500 italic mt-1 font-medium">Quickly onboard a new candidate and initiate the loan lifecycle.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => handleSubmit('draft')} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 flex items-center gap-2 border border-slate-200">
             <Save size={16} /> Save Draft
           </button>
           <button onClick={() => handleSubmit('submit')} disabled={loading} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 flex items-center gap-2">
             {loading ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Submit & Notify</>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="glass-card p-8 space-y-8">
               <Section title="Basic Demographics">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <InputField icon={<UserPlus size={16} />} label="Full Name" placeholder="Student's Legal Name" value={formData.name} set={(v) => setFormData({...formData, name: v})} />
                     <InputField icon={<Phone size={16} />} label="Mobile Number" placeholder="10-digit number" value={formData.phone} set={(v) => setFormData({...formData, phone: v})} />
                     <InputField icon={<Mail size={16} />} label="Email Address" placeholder="name@example.com" value={formData.email} set={(v) => setFormData({...formData, email: v})} />
                     <InputField icon={<Calendar size={16} />} label="Date of Birth" type="date" value={formData.dob} set={(v) => setFormData({...formData, dob: v})} />
                     <InputField icon={<Lock size={16} />} label="Set Password" type="password" placeholder="Min 6 characters" value={formData.password} set={(v) => setFormData({...formData, password: v})} />
                     <InputField icon={<Lock size={16} />} label="Confirm Password" type="password" placeholder="Repeat password" value={formData.confirmPassword} set={(v) => setFormData({...formData, confirmPassword: v})} />
                     <InputField icon={<Briefcase size={16} />} label="Occupation" placeholder="e.g. Student, Private Employee" value={formData.occupation} set={(v) => setFormData({...formData, occupation: v})} />
                     <InputField icon={<IndianRupee size={16} />} label="Monthly Income" placeholder="Annual income / 12" value={formData.income} set={(v) => setFormData({...formData, income: v})} />
                  </div>
               </Section>

               <Section title="Address Info">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="md:col-span-2">
                        <InputField icon={<MapPin size={16} />} label="Current Address" placeholder="Full residential address" value={formData.address} set={(v) => setFormData({...formData, address: v})} />
                     </div>
                     <InputField icon={<Landmark size={16} />} label="Current City" placeholder="e.g. Chennai" value={formData.city} set={(v) => setFormData({...formData, city: v})} />
                     <InputField icon={<Send size={16} />} label="Zip Code" placeholder="6-digit PIN" value={formData.zip} set={(v) => setFormData({...formData, zip: v})} />
                     <div className="md:col-span-2">
                        <InputField icon={<Map size={16} />} label="State" placeholder="e.g. Tamil Nadu" value={formData.state} set={(v) => setFormData({...formData, state: v})} />
                     </div>
                  </div>
               </Section>
           </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
             <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2"><FileUp size={18} className="text-primary-600" /> Mandatory Vault</h4>
             <div className="space-y-4">
                <UploadPlaceholder label="ID Proof (Aadhar/PAN)" file={files.idProof} onUpload={(f) => handleFileUpload('idProof', f)} />
                <UploadPlaceholder label="Recent Photo" file={files.photo} onUpload={(f) => handleFileUpload('photo', f)} />
                <UploadPlaceholder label="Income Proof (3mo Stmt)" file={files.incomeProof} onUpload={(f) => handleFileUpload('incomeProof', f)} optional />
             </div>
          </div>

          <div className="glass-card p-6 bg-slate-50 border-dashed border-2 border-slate-200">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3">Staff Recommendations</h4>
             <textarea 
              className="w-full h-32 bg-transparent border-none focus:ring-0 text-xs text-slate-600 font-medium leading-relaxed italic" 
              placeholder="Add any specific context or remarks about this candidate..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="space-y-6">
     <h3 className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg inline-block uppercase tracking-widest">{title}</h3>
     {children}
  </div>
);

const InputField = ({ icon, label, placeholder, type = 'text', value, set }) => (
  <div className="space-y-2">
     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">{icon} {label}</p>
     <input 
      type={type} 
      className="input-field" 
      placeholder={placeholder} 
      value={value}
      onChange={(e) => set(e.target.value)}
     />
  </div>
);

const UploadPlaceholder = ({ label, optional, file, onUpload }) => {
  const fileInputRef = React.useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (f) onUpload(f);
  };

  return (
    <div 
      onClick={handleClick}
      className={`group relative p-4 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer ${file ? 'border-green-400 bg-green-50' : 'border-slate-200 hover:border-primary-400 hover:bg-primary-50'}`}
    >
       <input type="file" ref={fileInputRef} onChange={handleChange} className="hidden" accept="image/*,application/pdf" />
       {file ? (
         <div className="flex flex-col items-center gap-1">
            <CheckCircle2 size={16} className="text-green-600" />
            <p className="text-[10px] font-bold text-green-700 truncate max-w-full px-2">{file.name}</p>
         </div>
       ) : (
         <>
           <p className="text-[10px] font-bold text-slate-700">{label}</p>
           <p className="text-[8px] text-slate-400 mt-1 uppercase font-bold">{optional ? '(Optional)' : '(Required - Max 5MB)'}</p>
           <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus size={14} className="text-primary-600" />
           </div>
         </>
       )}
    </div>
  );
};

export default AddCandidate;
