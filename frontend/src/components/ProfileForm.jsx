import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, MapPin, Briefcase, Camera, Save, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:5002/api/candidate/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data.data);
      reset(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://127.0.0.1:5002/api/candidate/profile', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:5002/api/candidate/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      fetchProfile();
      setMessage({ type: 'success', text: 'Document uploaded successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Upload failed.' });
    } finally {
      setUploading(true);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          <CheckCircle size={20} />
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Info */}
        <section className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
              <User size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Father's Name</label>
              <input {...register('personalInfo.fatherName')} className="input-field" placeholder="Enter father's name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
              <input {...register('personalInfo.dob')} type="date" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
              <select {...register('personalInfo.gender')} className="input-field">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Address Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
              <input {...register('address.street')} className="input-field" placeholder="123 Main St" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
              <input {...register('address.city')} className="input-field" placeholder="City" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
              <input {...register('address.state')} className="input-field" placeholder="State" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Zip Code</label>
              <input {...register('address.zip')} className="input-field" placeholder="123456" />
            </div>
          </div>
        </section>

        {/* Employment */}
        <section className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Briefcase size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Employment & Income</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type</label>
              <select {...register('employment.type')} className="input-field">
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Business">Business</option>
                <option value="Student">Student</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Employer Name</label>
              <input {...register('employment.employerName')} className="input-field" placeholder="Company Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Income (₹)</label>
              <input {...register('employment.monthlyIncome')} type="number" className="input-field" placeholder="0" />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Profile
          </button>
        </div>
      </form>

      {/* KYC Documents */}
      <section className="glass-card p-6 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <Camera size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">KYC Documents</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'aadharCard', label: 'Aadhar Card' },
            { id: 'panCard', label: 'PAN Card' },
            { id: 'profilePhoto', label: 'Profile Photo' }
          ].map((doc) => (
            <div key={doc.id} className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary-300 transition-colors bg-slate-50 relative overflow-hidden group">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                  <Camera size={24} className="text-slate-400" />
                </div>
                <span className="font-semibold text-slate-700">{doc.label}</span>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG or PDF up to 5MB</p>
                
                {profile?.documents?.[doc.id] ? (
                  <div className="mt-4 flex flex-col items-center">
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Uploaded</span>
                    <a href={`http://127.0.0.1:5002${profile.documents[doc.id]}`} target="_blank" className="text-xs text-primary-600 hover:underline mt-1">View File</a>
                  </div>
                ) : (
                  <label className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-50 shadow-sm transition-all">
                    Choose File
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} disabled={uploading} />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfileForm;
