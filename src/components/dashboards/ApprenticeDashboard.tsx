import React, { useState } from 'react';
import { api } from '../../lib/api';
import { User, AttendanceRecord, ApprenticeTask, Evaluation, Certificate, Department } from '../../types';
import { QrCode, MapPin, CheckCircle, Clock, Calendar, Award, FileText, Send, Upload, Sparkles, Building2, UserCheck, Shield, GraduationCap } from 'lucide-react';

interface ApprenticeDashboardProps {
  user: User;
  onOpenCertificate: (cert: Certificate) => void;
}

export const ApprenticeDashboard: React.FC<ApprenticeDashboardProps> = ({
  user,
  onOpenCertificate
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ATTENDANCE' | 'TASKS' | 'CERTIFICATE'>('OVERVIEW');
  const [checkInMethod, setCheckInMethod] = useState<'BIOMETRIC' | 'QR_CODE' | 'GPS_MOBILE'>('BIOMETRIC');
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState<string | null>(null);

  // Evidence submission state
  const [selectedTask, setSelectedTask] = useState<ApprenticeTask | null>(null);
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [evidenceFile, setEvidenceFile] = useState('Task_Evidence_Doc.pdf');
  const [taskSubmitLoading, setTaskSubmitLoading] = useState(false);

  // Loaded states
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [tasks, setTasks] = useState<ApprenticeTask[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  React.useEffect(() => {
    loadApprenticeData();
  }, [user.id]);

  const loadApprenticeData = async () => {
    try {
      const attData = await api.getAttendance();
      setAttendance(attData.attendance.filter((a) => a.apprentice_id === user.id));

      const tskData = await api.getTasks();
      setTasks(tskData.tasks.filter((t) => t.apprentice_id === user.id));

      const evalData = await api.getEvaluations();
      setEvaluations(evalData.evaluations.filter((e) => e.apprentice_id === user.id));

      const certData = await api.getCertificates();
      const foundCert = certData.certificates.find((c) => c.apprentice_id === user.id);
      if (foundCert) setCertificate(foundCert);
    } catch (err) {
      console.error('Error loading apprentice workspace', err);
    }
  };

  const handleCheckIn = async () => {
    setCheckInLoading(true);
    setCheckInSuccess(null);
    try {
      const res = await api.checkInAttendance({
        apprentice_id: user.id,
        apprentice_name: user.full_name,
        method: checkInMethod,
        lat: 9.0108,
        lng: 38.7612,
        location_name: 'Ethio Telecom HQ Campus'
      });
      setCheckInSuccess(res.message);
      loadApprenticeData();
    } catch (err: any) {
      alert(err.message || 'Check-in failed');
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    setTaskSubmitLoading(true);
    try {
      await api.submitTaskEvidence(selectedTask.id, evidenceNotes, evidenceFile);
      setSelectedTask(null);
      setEvidenceNotes('');
      loadApprenticeData();
    } catch (err: any) {
      alert(err.message || 'Task submission failed');
    } finally {
      setTaskSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Workspace Header */}
      <div className="bg-gradient-to-r from-[#006D32] to-emerald-900 rounded-[2rem] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-800">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-black/20 border border-white/20 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-[#F2A900]" />
            <span>Apprentice Workspace • Ethio Telecom</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{user.full_name}</h1>
          <p className="text-xs sm:text-sm text-emerald-100 flex items-center space-x-4">
            <span>Dept: <strong className="text-white">{user.department_name || 'Information Technology & Cloud Systems'}</strong></span>
            <span>App ID: <strong className="text-white">APP-2026-0101</strong></span>
          </p>
        </div>

        {/* Digital ID Quick Badge */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[200px]">
          <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center text-[#006D32] font-black text-xl shadow-sm">
            et
          </div>
          <p className="text-[11px] font-bold tracking-widest text-[#F2A900] uppercase">Digital ID Card</p>
          <p className="text-xs font-mono font-extrabold text-white">APP-2026-0101</p>
          <div className="mt-2 flex justify-center">
            <QrCode className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200/80 text-xs sm:text-sm font-bold space-x-6 overflow-x-auto">
        {[
          { key: 'OVERVIEW', label: 'Workspace Overview' },
          { key: 'ATTENDANCE', label: 'Daily Check-In & Attendance' },
          { key: 'TASKS', label: 'Assigned Tasks & Evidence' },
          { key: 'CERTIFICATE', label: 'Digital Certificate & Evaluations' }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-3 transition-all border-b-2 whitespace-nowrap ${
              activeTab === t.key
                ? 'border-[#006D32] text-[#006D32]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Daily Quick Check-in Box */}
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] space-y-4">
            <div className="flex items-center space-x-2 text-[#006D32]">
              <QrCode className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-gray-900">Daily Attendance Check-In</h3>
            </div>
            <p className="text-xs text-gray-500">
              Verify your presence using Biometric Fingerprint Scanner, QR ID Code, or Geofenced GPS Mobile.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Select Verification Method</label>
              <select
                value={checkInMethod}
                onChange={(e) => setCheckInMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-[#006D32]"
              >
                <option value="BIOMETRIC">Biometric Terminal (Gate Scanner)</option>
                <option value="QR_CODE">QR Badge Scanner (Floor Point)</option>
                <option value="GPS_MOBILE">GPS Mobile Geofence (15m Radius)</option>
              </select>
            </div>

            {checkInSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#006D32]" />
                <span>{checkInSuccess}</span>
              </div>
            )}

            <button
              onClick={handleCheckIn}
              disabled={checkInLoading}
              className="w-full py-3 rounded-xl bg-[#006D32] hover:bg-[#005527] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>{checkInLoading ? 'Verifying...' : 'Record Check-In Now'}</span>
            </button>
          </div>

          {/* Active Tasks Widget */}
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#006D32]" />
              <span>Assigned Mentor Tasks ({tasks.length})</span>
            </h3>

            <div className="space-y-3">
              {tasks.slice(0, 3).map((tsk) => (
                <div key={tsk.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">{tsk.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tsk.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                      tsk.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {tsk.status}
                    </span>
                  </div>
                  <p className="text-gray-500 line-clamp-2">{tsk.description}</p>
                  <p className="text-[10px] font-medium text-gray-400">Due: {tsk.due_date} • Mentor: {tsk.mentor_name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation & Certificate Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-gray-900 flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#F2A900]" />
                <span>Performance & Certification</span>
              </h3>

              {evaluations.length > 0 ? (
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-2">
                  <p className="font-bold text-gray-900">Latest Evaluation Grade</p>
                  <div className="text-2xl font-black text-[#007A3D]">
                    {evaluations[0].overall_score} <span className="text-xs text-gray-500">/ 10.0</span>
                  </div>
                  <p className="text-gray-600 italic">"{evaluations[0].comments}"</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500">Mid-term evaluation scheduled for Week 6.</p>
              )}
            </div>

            {certificate && (
              <button
                onClick={() => onOpenCertificate(certificate)}
                className="w-full py-3 rounded-xl bg-[#007A3D] text-white font-extrabold text-xs shadow-md hover:bg-[#006231] transition-all flex items-center justify-center space-x-2"
              >
                <Award className="w-4 h-4 text-[#F2A900]" />
                <span>View Digital Certificate</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Attendance Logs */}
      {activeTab === 'ATTENDANCE' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
          <h3 className="text-lg font-black text-gray-900">Attendance Verification Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-extrabold text-[11px]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Check-In Time</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Location Point</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-gray-50/80">
                    <td className="p-3 font-bold text-gray-900">{att.date}</td>
                    <td className="p-3">{new Date(att.check_in_time).toLocaleTimeString()}</td>
                    <td className="p-3 font-semibold text-gray-700">{att.check_in_method}</td>
                    <td className="p-3">{att.location_name}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        att.status === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Tasks */}
      {activeTab === 'TASKS' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
            <h3 className="text-lg font-black text-gray-900">Task Assignments & Evidence Submission</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((tsk) => (
                <div key={tsk.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-gray-900">{tsk.title}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tsk.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                      tsk.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {tsk.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{tsk.description}</p>

                  {tsk.evidence_notes && (
                    <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs">
                      <p className="font-bold text-gray-800">Submitted Notes & Evidence:</p>
                      <p className="text-gray-600">{tsk.evidence_notes}</p>
                      <p className="text-[10px] text-[#007A3D] font-mono mt-1">Attachment: {tsk.evidence_filename}</p>
                    </div>
                  )}

                  {tsk.status === 'PENDING' || tsk.status === 'IN_PROGRESS' ? (
                    <button
                      onClick={() => setSelectedTask(tsk)}
                      className="px-4 py-2 rounded-xl bg-[#007A3D] text-white font-bold text-xs shadow-xs hover:bg-[#006231] transition-colors"
                    >
                      Submit Completion Evidence
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Submission Modal */}
          {selectedTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
                <h4 className="font-extrabold text-base text-gray-900">Submit Evidence for: {selectedTask.title}</h4>
                <form onSubmit={handleTaskSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Completion Notes / Code Details *</label>
                    <textarea
                      required
                      rows={3}
                      value={evidenceNotes}
                      onChange={(e) => setEvidenceNotes(e.target.value)}
                      placeholder="Describe what work was completed..."
                      className="w-full p-3 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Attached Evidence File</label>
                    <input
                      type="text"
                      value={evidenceFile}
                      onChange={(e) => setEvidenceFile(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-mono"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTask(null)}
                      className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={taskSubmitLoading}
                      className="px-5 py-2 rounded-xl bg-[#007A3D] text-white text-xs font-bold shadow-md"
                    >
                      Submit Evidence
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Certificate & Evaluations */}
      {activeTab === 'CERTIFICATE' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-6">
          <h3 className="text-lg font-black text-gray-900">Evaluation Reports & Official Certificates</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-extrabold text-sm text-gray-800 mb-3">Evaluation Rubric Scores (Appendix C)</h4>
              <div className="space-y-3">
                {evaluations.map((ev) => (
                  <div key={ev.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                    <div className="flex justify-between font-bold">
                      <span className="uppercase text-[#007A3D]">{ev.evaluation_type} Evaluation</span>
                      <span>Score: {ev.overall_score} / 10.0</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                      <div>Technical Skills: <strong>{ev.technical_score}/10</strong></div>
                      <div>Communication: <strong>{ev.communication_score}/10</strong></div>
                      <div>Punctuality: <strong>{ev.punctuality_score}/10</strong></div>
                      <div>Teamwork & Initiative: <strong>{ev.teamwork_score}/10</strong></div>
                    </div>
                    <p className="text-gray-500 italic pt-1 border-t border-gray-200">"{ev.comments}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center items-center text-center p-6 bg-emerald-50/50 rounded-3xl border border-emerald-200 space-y-4">
              <Award className="w-16 h-16 text-[#F2A900]" />
              <div>
                <h4 className="font-extrabold text-lg text-gray-900">Digital Certificate Registry</h4>
                <p className="text-xs text-gray-500 max-w-xs mt-1">
                  Certificates are automatically generated upon passing program criteria (Attendance ≥ 80%, Grade ≥ 6.0/10).
                </p>
              </div>

              {certificate ? (
                <button
                  onClick={() => onOpenCertificate(certificate)}
                  className="px-6 py-3 rounded-xl bg-[#007A3D] text-white font-extrabold text-xs shadow-md hover:bg-[#006231] transition-all"
                >
                  View Official Digital Certificate
                </button>
              ) : (
                <p className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full">
                  Certificate Pending Final Evaluation
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
