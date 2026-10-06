import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Application, Applicant, ScreeningCriteriaConfig } from '../../types';
import { Search, Filter, CheckCircle2, XCircle, AlertCircle, Award, FileText, Check, ArrowRight, Sliders, Users, Building, ShieldAlert } from 'lucide-react';

export const HRDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [screeningCriteria, setScreeningCriteria] = useState<ScreeningCriteriaConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Form state for evaluating
  const [evalNotes, setEvalNotes] = useState('');
  const [customScore, setCustomScore] = useState<number | undefined>(undefined);

  useEffect(() => {
    loadHRData();
  }, []);

  const loadHRData = async () => {
    setLoading(true);
    try {
      const data = await api.getApplicants();
      setApplicants(data.applicants);
      setApplications(data.applications);

      const screenData = await api.getScreeningQueue();
      setScreeningCriteria(screenData.screeningCriteria);
    } catch (err) {
      console.error('Error loading HR screening queue', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (status: 'SCREENED' | 'REQUESTS_ADDITIONAL_INFO' | 'REJECTED') => {
    if (!selectedApp) return;
    try {
      await api.evaluateScreening({
        applicationId: selectedApp.id,
        status,
        screening_notes: evalNotes || 'Screening verified by HR Officer.',
        custom_score: customScore,
        evaluator_id: 'current-user-id',
        evaluator_name: 'Current HR Officer'
      });

      setSelectedApp(null);
      setEvalNotes('');
      setCustomScore(undefined);
      loadHRData();
    } catch (err: any) {
      alert(err.message || 'Screening evaluation failed');
    }
  };

  const filteredApplications = applications.filter((app) => {
    const applicant = applicants.find((a) => a.id === app.applicant_id);
    const matchesQuery =
      !searchQuery ||
      (applicant &&
        (applicant.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.app_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.university.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-green-100 text-[#006D32] rounded-full text-xs font-extrabold uppercase tracking-wider">
            Phase 2: HR Screening & Credential Verification
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-2">Applicant Screening Queue</h1>
          <p className="text-xs text-gray-500">
            Automated GPA and credential weighted scoring (Appendix B: GPA 30%, Field Match 20%, Uni Rank 15%, Skills 15%, Rec 10%, CV 10%).
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-center min-w-[110px]">
            <p className="font-extrabold text-amber-800 text-xl">
              {applications.filter((a) => a.status === 'PENDING_SCREENING').length}
            </p>
            <p className="text-amber-700 font-bold text-[10px] uppercase">Pending Screening</p>
          </div>
          <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 text-center min-w-[110px]">
            <p className="font-extrabold text-[#006D32] text-xl">
              {applications.filter((a) => a.status === 'SCREENED' || a.status === 'APPROVED').length}
            </p>
            <p className="text-emerald-800 font-bold text-[10px] uppercase">Shortlisted</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, APP ID, or University..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006D32]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 font-semibold"
          >
            <option value="ALL">All Application Statuses</option>
            <option value="PENDING_SCREENING">Pending Screening</option>
            <option value="SCREENED">Screened & Shortlisted</option>
            <option value="APPROVED">Approved by Dept Head</option>
            <option value="ACTIVE">Active Apprentices</option>
            <option value="COMPLETED">Completed Program</option>
          </select>
        </div>
      </div>

      {/* Main Table / Grid */}
      <div className="bg-white/80 backdrop-blur-lg rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-100/70 text-gray-700 uppercase font-extrabold text-[10px] tracking-wider border-b border-gray-200/60">
              <tr>
                <th className="p-4">Applicant ID</th>
                <th className="p-4">Candidate Name</th>
                <th className="p-4">University & Field</th>
                <th className="p-4">GPA</th>
                <th className="p-4">Screening Score</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApplications.map((app) => {
                const applicant = applicants.find((a) => a.id === app.applicant_id);
                if (!applicant) return null;

                return (
                  <tr key={app.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#006D32]">{applicant.app_id}</td>
                    <td className="p-4">
                      <p className="font-extrabold text-gray-900">{applicant.full_name}</p>
                      <p className="text-[11px] text-gray-400">{applicant.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{applicant.university}</p>
                      <p className="text-[11px] text-gray-500">{applicant.field_of_study}</p>
                    </td>
                    <td className="p-4 font-extrabold text-[#006D32] text-sm">{applicant.gpa.toFixed(2)}</td>
                    <td className="p-4">
                      {app.screening_score !== undefined ? (
                        <span className={`font-black text-sm ${app.screening_score >= 60 ? 'text-[#006D32]' : 'text-amber-600'}`}>
                          {app.screening_score} / 100
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not Calculated</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        app.status === 'SCREENED' ? 'bg-green-100 text-green-700' :
                        app.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'PENDING_SCREENING' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3.5 py-1.5 rounded-xl bg-green-50 hover:bg-green-100 text-[#006D32] font-extrabold transition-colors shadow-2xs"
                      >
                        Inspect & Screen
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Inspection & Screening Modal */}
      {selectedApp && (() => {
        const applicant = applicants.find((a) => a.id === selectedApp.applicant_id);
        if (!applicant) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative">
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full"
              >
                ✕
              </button>

              <div className="border-b border-gray-100 pb-4">
                <span className="px-2.5 py-1 bg-emerald-100 text-[#007A3D] font-mono font-bold text-xs rounded-md">
                  {applicant.app_id}
                </span>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{applicant.full_name}</h3>
                <p className="text-xs text-gray-500">{applicant.university} • {applicant.field_of_study}</p>
              </div>

              {/* Applicant Credentials Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div>GPA: <strong className="text-[#007A3D]">{applicant.gpa} / 4.0</strong></div>
                <div>Phone: <strong>{applicant.phone}</strong></div>
                <div>Skills: <strong>{applicant.skills.join(', ')}</strong></div>
                <div>Applied Date: <strong>{new Date(applicant.applied_at).toLocaleDateString()}</strong></div>
              </div>

              {/* Document Attachments */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-800 uppercase">Uploaded Credentials</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white border border-gray-200 rounded-xl flex justify-between items-center">
                    <span>CV Resume</span>
                    <span className="text-[#007A3D] font-bold text-[11px]">Verified PDF</span>
                  </div>
                  <div className="p-2.5 bg-white border border-gray-200 rounded-xl flex justify-between items-center">
                    <span>Transcript</span>
                    <span className="text-[#007A3D] font-bold text-[11px]">Verified PDF</span>
                  </div>
                </div>
              </div>

              {/* Screening Notes & Action */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-gray-700">HR Screening Notes & Recommendation</label>
                <textarea
                  rows={2}
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  placeholder="Enter verification notes..."
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs"
                />

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleEvaluate('SCREENED')}
                    className="flex-1 py-2.5 rounded-xl bg-[#007A3D] text-white font-bold text-xs shadow-md hover:bg-[#006231]"
                  >
                    Pass Screening & Shortlist
                  </button>
                  <button
                    onClick={() => handleEvaluate('REQUESTS_ADDITIONAL_INFO')}
                    className="py-2.5 px-4 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs hover:bg-amber-200"
                  >
                    Request Info
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
