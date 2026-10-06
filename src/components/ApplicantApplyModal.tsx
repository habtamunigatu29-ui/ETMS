import React, { useState } from 'react';
import { api } from '../lib/api';
import { X, Upload, CheckCircle, FileText, Send, AlertCircle, Sparkles, Building, GraduationCap, Award, Paperclip, Eye, EyeOff } from 'lucide-react';

interface ApplicantApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (appId: string, resData?: any) => void;
}

export const ApplicantApplyModal: React.FC<ApplicantApplyModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '+2519',
    password: '',
    confirm_password: '',
    university: 'Addis Ababa University (AAiT)',
    field_of_study: 'Software Engineering',
    gpa: '3.75',
    skills: 'React, Node.js, PostgreSQL, Telecom Network Fundamentals',
    cv_name: '',
    transcript_name: '',
    id_name: '',
    recommendation_name: ''
  });

  if (!isOpen) return null;

  const universitiesList = [
    'Addis Ababa University (AAiT)',
    'Adama Science & Technology University (ASTU)',
    'Bahir Dar University (BiT)',
    'Hawassa University',
    'Mekelle University',
    'Gondar University',
    'Jimma University',
    'Arba Minch University',
    'Other Accredited Ethiopian University'
  ];

  const fieldsList = [
    'Software Engineering',
    'Computer Science',
    'Information Technology (IT)',
    'Telecommunications Engineering',
    'Electrical & Computer Engineering',
    'Information Systems',
    'Cyber Security Operations',
    'Data Science & Artificial Intelligence'
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Check password match when either password field changes
    if (field === 'password' || field === 'confirm_password') {
      const password = field === 'password' ? value : formData.password;
      const confirm = field === 'confirm_password' ? value : formData.confirm_password;
      setPasswordMatch(password === confirm);
    }
  };

  const handleRealFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        [field]: `${file.name} (${fileSizeInMB} MB)`
      }));
    }
  };

  const handleSimulateFileSelect = (field: string, defaultName: string) => {
    setFormData((prev) => ({ ...prev, [field]: defaultName }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.full_name) {
        setError('Full name is required');
        return false;
      }
      if (!formData.email) {
        setError('Email address is required');
        return false;
      }
      if (!formData.phone || formData.phone === '+2519') {
        setError('Valid phone number is required');
        return false;
      }
      if (!formData.password || formData.password.length < 12) {
        setError('Password must be at least 12 characters');
        return false;
      }
      if (!formData.confirm_password) {
        setError('Please confirm your password');
        return false;
      }
      if (formData.password !== formData.confirm_password) {
        setError('Passwords do not match');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.university) {
        setError('University is required');
        return false;
      }
      if (!formData.field_of_study) {
        setError('Field of study is required');
        return false;
      }
      if (!formData.gpa || parseFloat(formData.gpa) < 2.0 || parseFloat(formData.gpa) > 4.0) {
        setError('GPA must be between 2.0 and 4.0');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    setError(null);
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Prepare data for submission - only include password, not confirm_password
      const submitData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password, // This will be hashed on the server
        university: formData.university,
        field_of_study: formData.field_of_study,
        gpa: formData.gpa,
        skills: formData.skills,
        cv_name: formData.cv_name,
        transcript_name: formData.transcript_name,
        id_name: formData.id_name,
        recommendation_name: formData.recommendation_name
      };

      const res = await api.submitApplication(submitData);
      onSuccess(res.app_id, res);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Application submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#007A3D] text-white flex items-center justify-center font-bold text-xl shadow-md">
            et
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">Apprenticeship Application Form</h3>
            <p className="text-xs text-gray-500">Ethio Telecom Youth Skill Development & Industry Program 2026</p>
          </div>
        </div>

        {/* Multi-step progress indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          {[
            { num: 1, title: 'Personal Info' },
            { num: 2, title: 'Academic Record' },
            { num: 3, title: 'Documents Upload' }
          ].map((s) => (
            <div key={s.num} className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= s.num ? 'bg-[#007A3D] text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {s.num}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${
                step >= s.num ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center space-x-2 mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <Building className="w-4 h-4 text-[#007A3D]" />
                <span>Step 1: Personal & Contact Details</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solomon Worku Kassa"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#007A3D] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="solomon@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#007A3D] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+251 911 000 000"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#007A3D] text-sm"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Create Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 12 characters"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#007A3D] text-sm font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">This password will be used to log into your ET-AMS portal account.</p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter your password"
                  value={formData.confirm_password}
                  onChange={(e) => handleChange('confirm_password', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    formData.confirm_password && formData.password !== formData.confirm_password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-[#007A3D]'
                  } focus:ring-2 text-sm font-mono`}
                />
                {formData.confirm_password && formData.password !== formData.confirm_password && (
                  <p className="text-[10px] text-red-500 mt-1">Passwords do not match</p>
                )}
                {formData.confirm_password && formData.password === formData.confirm_password && (
                  <p className="text-[10px] text-green-600 mt-1">✓ Passwords match</p>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl bg-[#007A3D] hover:bg-[#006231] text-white font-bold text-sm shadow-md transition-all"
                >
                  Continue to Academic Record →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-[#007A3D]" />
                <span>Step 2: Academic Background & Skills</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">University / Higher Institute *</label>
                <select
                  value={formData.university}
                  onChange={(e) => handleChange('university', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#007A3D] text-sm"
                >
                  {universitiesList.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Field of Study *</label>
                  <select
                    value={formData.field_of_study}
                    onChange={(e) => handleChange('field_of_study', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#007A3D] text-sm"
                  >
                    {fieldsList.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cumulative GPA *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="2.0"
                    max="4.0"
                    required
                    value={formData.gpa}
                    onChange={(e) => handleChange('gpa', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#007A3D] text-sm font-bold text-[#007A3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Technical Skills & Certifications</label>
                <input
                  type="text"
                  placeholder="e.g. React, Python, Cisco Networking, 5G Basics"
                  value={formData.skills}
                  onChange={(e) => handleChange('skills', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#007A3D] text-sm"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl bg-[#007A3D] hover:bg-[#006231] text-white font-bold text-sm shadow-md transition-all"
                >
                  Continue to Documents →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#007A3D]" />
                <span>Step 3: Required Credentials Upload</span>
              </h4>

              <p className="text-xs text-gray-500">
                Automatic format validation enabled (PDF / Scanned Documents, max size 5MB).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* CV Upload */}
                <div className="p-3.5 border border-dashed border-emerald-300 rounded-xl hover:border-[#007A3D] transition-all bg-emerald-50/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-800">1. Curriculum Vitae (CV) *</span>
                    <label className="cursor-pointer text-[11px] font-extrabold text-white bg-[#007A3D] hover:bg-[#005527] px-2.5 py-1 rounded-lg transition-all shadow-xs inline-flex items-center space-x-1">
                      <Paperclip className="w-3 h-3" />
                      <span>Browse...</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleRealFileChange('cv_name', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-600 font-mono truncate max-w-[200px]">
                      {formData.cv_name ? `✓ ${formData.cv_name}` : 'No file attached'}
                    </span>
                    {!formData.cv_name && (
                      <button
                        type="button"
                        onClick={() => handleSimulateFileSelect('cv_name', `${formData.full_name.replace(/\s+/g, '_')}_CV.pdf (0.45 MB)`)}
                        className="text-[10px] text-[#007A3D] underline font-semibold"
                      >
                        Sample
                      </button>
                    )}
                  </div>
                </div>

                {/* Academic Transcript Upload */}
                <div className="p-3.5 border border-dashed border-emerald-300 rounded-xl hover:border-[#007A3D] transition-all bg-emerald-50/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-800">2. Academic Transcript *</span>
                    <label className="cursor-pointer text-[11px] font-extrabold text-white bg-[#007A3D] hover:bg-[#005527] px-2.5 py-1 rounded-lg transition-all shadow-xs inline-flex items-center space-x-1">
                      <Paperclip className="w-3 h-3" />
                      <span>Browse...</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={(e) => handleRealFileChange('transcript_name', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-600 font-mono truncate max-w-[200px]">
                      {formData.transcript_name ? `✓ ${formData.transcript_name}` : 'No file attached'}
                    </span>
                    {!formData.transcript_name && (
                      <button
                        type="button"
                        onClick={() => handleSimulateFileSelect('transcript_name', `Official_Transcript_${formData.university.substring(0, 5)}.pdf (1.20 MB)`)}
                        className="text-[10px] text-[#007A3D] underline font-semibold"
                      >
                        Sample
                      </button>
                    )}
                  </div>
                </div>

                {/* National ID Upload */}
                <div className="p-3.5 border border-dashed border-emerald-300 rounded-xl hover:border-[#007A3D] transition-all bg-emerald-50/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-800">3. National ID / Passport *</span>
                    <label className="cursor-pointer text-[11px] font-extrabold text-white bg-[#007A3D] hover:bg-[#005527] px-2.5 py-1 rounded-lg transition-all shadow-xs inline-flex items-center space-x-1">
                      <Paperclip className="w-3 h-3" />
                      <span>Browse...</span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleRealFileChange('id_name', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-600 font-mono truncate max-w-[200px]">
                      {formData.id_name ? `✓ ${formData.id_name}` : 'No file attached'}
                    </span>
                    {!formData.id_name && (
                      <button
                        type="button"
                        onClick={() => handleSimulateFileSelect('id_name', 'Ethiopian_National_ID_Card.pdf (0.85 MB)')}
                        className="text-[10px] text-[#007A3D] underline font-semibold"
                      >
                        Sample
                      </button>
                    )}
                  </div>
                </div>

                {/* Recommendation Letter Upload */}
                <div className="p-3.5 border border-dashed border-emerald-300 rounded-xl hover:border-[#007A3D] transition-all bg-emerald-50/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-800">4. Recommendation Letter</span>
                    <label className="cursor-pointer text-[11px] font-extrabold text-white bg-[#007A3D] hover:bg-[#005527] px-2.5 py-1 rounded-lg transition-all shadow-xs inline-flex items-center space-x-1">
                      <Paperclip className="w-3 h-3" />
                      <span>Browse...</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleRealFileChange('recommendation_name', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-600 font-mono truncate max-w-[200px]">
                      {formData.recommendation_name ? `✓ ${formData.recommendation_name}` : 'No file attached'}
                    </span>
                    {!formData.recommendation_name && (
                      <button
                        type="button"
                        onClick={() => handleSimulateFileSelect('recommendation_name', 'Dean_Recommendation_Letter.pdf (0.30 MB)')}
                        className="text-[10px] text-[#007A3D] underline font-semibold"
                      >
                        Sample
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-xl bg-[#007A3D] hover:bg-[#006231] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-lg shadow-emerald-900/20 transition-all flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Official Application</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

      </div>
    </div>
  );
};