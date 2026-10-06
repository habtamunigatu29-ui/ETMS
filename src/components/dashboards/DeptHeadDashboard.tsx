import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Application, Applicant, User, Department, Course } from '../../types';
import { Building2, Users, CheckCircle, XCircle, UserPlus, BookOpen, QrCode, Calendar, ShieldCheck, Award } from 'lucide-react';

interface DeptHeadDashboardProps {
  user: User;
}

export const DeptHeadDashboard: React.FC<DeptHeadDashboardProps> = ({ user }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Assignment selection states
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedMentorId, setSelectedMentorId] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadDeptHeadData();
  }, []);

  const loadDeptHeadData = async () => {
    try {
      const data = await api.getDeptHeadData();
      setDepartments(data.departments);
      setUsers(data.users);
      setApplications(data.applications);
      const applicantIds = data.applications.map(app => app.applicant_id);
      const applicantsData = data.applications.map(app => app.applicant).filter(Boolean);
      setApplicants(applicantsData);
    } catch (err) {
      console.error('Error loading department head data', err);
    }
  };

  const handleDecision = async (decision: 'APPROVE' | 'REJECT' | 'WAITLIST') => {
    if (!selectedApp) return;
    try {
      if (decision === 'APPROVE') {
        // Step 1: Approve application
        await api.decideApproval({
          applicationId: selectedApp.id,
          decision: 'APPROVE',
          department_id: selectedDeptId,
          decision_by: user.id,
          decision_by_name: user.full_name
        });

        // Step 2: Phase 4 Assign mentor and auto-generate onboarding & digital ID
        await api.assignApprentice({
          applicationId: selectedApp.id,
          department_id: selectedDeptId,
          mentor_id: selectedMentorId
        });
      } else {
        await api.decideApproval({
          applicationId: selectedApp.id,
          decision,
          rejection_reason: rejectionReason || 'Capacity constraints.',
          decision_by: user.id,
          decision_by_name: user.full_name
        });
      }

      setSelectedApp(null);
      loadDeptHeadData();
    } catch (err: any) {
      alert(err.message || 'Decision failed');
    }
  };

  const mentors = users.filter((u) => u.role === 'MENTOR' || u.role === 'DEPARTMENT_HEAD');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-green-100 text-[#006D32] rounded-full text-xs font-extrabold uppercase tracking-wider">
            Phases 3 & 4: Department Head Approval & Mentor Assignment
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-2">Department Approval & Capacity Manager</h1>
          <p className="text-xs text-gray-500">
            Review screened candidates, allocate department slots, assign mentors, and auto-generate onboarding schedules and Digital ID cards.
          </p>
        </div>
      </div>

      {/* Department Capacity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((d) => (
          <div key={d.id} className="bg-white/80 backdrop-blur-md p-5 rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#006D32] uppercase">{d.code}</span>
                <h4 className="font-extrabold text-sm text-gray-900">{d.name}</h4>
              </div>
              <Building2 className="w-5 h-5 text-[#006D32]" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span>Apprentice Slots Filled</span>
                <span>{d.current_apprentices} / {d.max_apprentices}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#007A3D] rounded-full"
                  style={{ width: `${Math.min((d.current_apprentices / d.max_apprentices) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Applications Approval Queue */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 space-y-4">
        <h3 className="text-lg font-black text-gray-900">Screened Candidates Awaiting Department Decision</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-extrabold text-[11px]">
              <tr>
                <th className="p-3">Applicant ID</th>
                <th className="p-3">Candidate</th>
                <th className="p-3">University</th>
                <th className="p-3">GPA</th>
                <th className="p-3">Screening Score</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.filter((a) => ['SCREENED', 'PENDING_APPROVAL'].includes(a.status)).map((app) => {
                const applicant = applicants.find((ap) => ap.id === app.applicant_id);
                if (!applicant) return null;

                return (
                  <tr key={app.id} className="hover:bg-gray-50/80">
                    <td className="p-3 font-mono font-bold text-[#007A3D]">{applicant.app_id}</td>
                    <td className="p-3 font-bold text-gray-900">{applicant.full_name}</td>
                    <td className="p-3">{applicant.university}</td>
                    <td className="p-3 font-bold text-[#007A3D]">{applicant.gpa}</td>
                    <td className="p-3 font-extrabold text-gray-900">{app.screening_score || 85} / 100</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 rounded-xl bg-[#007A3D] text-white font-bold text-xs hover:bg-[#006231]"
                      >
                        Approve & Assign
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision & Assignment Modal */}
      {selectedApp && (() => {
        const applicant = applicants.find((a) => a.id === selectedApp.applicant_id);
        if (!applicant) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-6 relative">
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full"
              >
                ✕
              </button>

              <h3 className="text-xl font-black text-gray-900">Approve & Assign Department/Mentor</h3>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
                <p className="font-bold text-gray-900">{applicant.full_name} ({applicant.app_id})</p>
                <p className="text-gray-600">{applicant.university} • GPA: {applicant.gpa}</p>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-gray-700 mb-1">Target Department *</label>
                  <select
                    value={selectedDeptId}
                    onChange={(e) => setSelectedDeptId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.current_apprentices}/{d.max_apprentices} slots)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Assign Senior Staff Mentor *</label>
                  <select
                    value={selectedMentorId}
                    onChange={(e) => setSelectedMentorId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                  >
                    {mentors.map((m) => (
                      <option key={m.id} value={m.id}>{m.full_name} ({m.department_name || 'Department Mentor'})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => handleDecision('APPROVE')}
                  className="flex-1 py-3 rounded-xl bg-[#007A3D] text-white font-extrabold text-xs shadow-md hover:bg-[#006231]"
                >
                  Approve & Generate Digital ID
                </button>
                <button
                  onClick={() => handleDecision('REJECT')}
                  className="py-3 px-4 rounded-xl bg-red-100 text-red-800 font-bold text-xs hover:bg-red-200"
                >
                  Reject
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
