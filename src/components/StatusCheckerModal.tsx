import React, { useState } from 'react';
import { api } from '../lib/api';
import { Applicant, Application, Certificate } from '../types';
import { X, Search, CheckCircle2, Clock, AlertCircle, Award, FileText, ArrowRight, Building2, User, Sparkles } from 'lucide-react';

interface StatusCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCertificate?: (cert: Certificate) => void;
}

export const StatusCheckerModal: React.FC<StatusCheckerModalProps> = ({
  isOpen,
  onClose,
  onOpenCertificate
}) => {
  const [appIdInput, setAppIdInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    applicant: Applicant;
    application: Application;
    certificate?: Certificate;
  } | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appIdInput || !emailInput) {
      setError('Enter both your Application ID and registered email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await api.lookupApplication(appIdInput || undefined, emailInput || undefined);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Application record not found');
    } finally {
      setLoading(false);
    }
  };

  // Phase tracker definition
  const phases = [
    { title: '1. Application Submission', key: 'SUBMITTED', desc: 'Received & Validated' },
    { title: '2. Document Verification', key: 'SCREENED', desc: 'GPA & Field Eligibility' },
    { title: '3. Dept Head Approval', key: 'APPROVED', desc: 'Department Selection' },
    { title: '4. Mentor & Course Assign', key: 'ASSIGNED', desc: 'Onboarding & Digital ID' },
    { title: '5. Program Attendance', key: 'ACTIVE', desc: 'Tasks & Evaluations' },
    { title: '6. Final Certification', key: 'COMPLETED', desc: 'Digital Certificate Issued' }
  ];

  const getPhaseStepNumber = (status: string) => {
    switch (status) {
      case 'PENDING_SCREENING':
      case 'UNDER_SCREENING':
        return 1;
      case 'SCREENED':
      case 'REQUESTS_ADDITIONAL_INFO':
        return 2;
      case 'PENDING_APPROVAL':
        return 3;
      case 'APPROVED':
        return 3;
      case 'ASSIGNED':
        return 4;
      case 'ACTIVE':
        return 5;
      case 'COMPLETED':
        return 6;
      case 'REJECTED':
        return -1;
      default:
        return 1;
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

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#007A3D]">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">Check Application Status</h3>
            <p className="text-xs text-gray-500">Track your Ethio Telecom Apprenticeship progress in real-time</p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Application ID (e.g., APP-2026-0101)</label>
              <input
                type="text"
                placeholder="APP-2026-XXXX"
                value={appIdInput}
                onChange={(e) => setAppIdInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#007A3D] text-sm uppercase tracking-wider"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Registered Email Address</label>
              <input
                type="email"
                placeholder="applicant@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#007A3D] text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#007A3D] hover:bg-[#006231] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Checking Registry...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Verify Status</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center space-x-3 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Card */}
        {result && (
          <div className="space-y-6 bg-gray-50/80 p-5 rounded-2xl border border-gray-200">
            
            {/* Candidate Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-100 text-[#007A3D] text-[11px] font-mono font-bold">
                  {result.applicant.app_id}
                </span>
                <h4 className="text-lg font-extrabold text-gray-900 mt-1">{result.applicant.full_name}</h4>
                <p className="text-xs text-gray-500">{result.applicant.university} • {result.applicant.field_of_study}</p>
              </div>

              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                  result.applicant.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                  result.applicant.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                  result.applicant.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {result.applicant.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Department & Mentor if assigned */}
            {result.application.department_name && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-[#007A3D]" />
                  <div>
                    <p className="text-gray-400 font-medium">Assigned Department</p>
                    <p className="font-bold text-gray-900">{result.application.department_name}</p>
                  </div>
                </div>
                {result.application.mentor_name && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#007A3D]" />
                    <div>
                      <p className="text-gray-400 font-medium">Assigned Mentor</p>
                      <p className="font-bold text-gray-900">{result.application.mentor_name}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6-Phase Timeline Progress */}
            <div>
              <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">6-Phase Application Lifecycle</h5>
              <div className="space-y-2">
                {phases.map((ph, idx) => {
                  const currentStep = getPhaseStepNumber(result.applicant.status);
                  const isDone = idx + 1 < currentStep || result.applicant.status === 'COMPLETED';
                  const isCurrent = idx + 1 === currentStep && result.applicant.status !== 'COMPLETED';

                  return (
                    <div
                      key={ph.key}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : isCurrent
                          ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-400'
                          : 'bg-white border-gray-200 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          isDone ? 'bg-[#007A3D] text-white' : isCurrent ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div>
                          <p className="font-bold">{ph.title}</p>
                          <p className="text-[11px] opacity-80">{ph.desc}</p>
                        </div>
                      </div>

                      <div className="text-right font-semibold text-[11px]">
                        {isDone ? (
                          <span className="text-[#007A3D] font-bold">Completed</span>
                        ) : isCurrent ? (
                          <span className="text-amber-700 font-bold flex items-center space-x-1">
                            <Clock className="w-3 h-3 animate-spin" />
                            <span>In Progress</span>
                          </span>
                        ) : (
                          <span>Pending</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Certificate View Link if Completed */}
            {result.certificate && (
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-[#F2A900]" />
                  <div>
                    <h5 className="font-extrabold text-sm">Official Digital Certificate Issued</h5>
                    <p className="text-xs text-emerald-100">Cert No: {result.certificate.cert_number}</p>
                  </div>
                </div>
                {onOpenCertificate && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCertificate(result.certificate!);
                    }}
                    className="px-4 py-2 rounded-xl bg-white text-[#007A3D] font-bold text-xs shadow-md hover:bg-emerald-50 transition-colors flex items-center space-x-1"
                  >
                    <span>View Certificate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
