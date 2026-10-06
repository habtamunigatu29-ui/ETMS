import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { User, ApprenticeTask, Evaluation, AttendanceRecord, Applicant } from '../../types';
import { FileText, CheckCircle, Plus, Send, Award, Clock, Users, Shield } from 'lucide-react';

interface MentorDashboardProps {
  user: User;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({ user }) => {
  const [tasks, setTasks] = useState<ApprenticeTask[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  // Task creation modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedApprenticeId, setSelectedApprenticeId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('2026-07-30');

  // Evaluation modal
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [selectedEvalApprenticeId, setSelectedEvalApprenticeId] = useState('');
  const [evalType, setEvalType] = useState<'mid_term' | 'final'>('final');
  const [techScore, setTechScore] = useState(9);
  const [commScore, setCommScore] = useState(8);
  const [puncScore, setPuncScore] = useState(9);
  const [teamScore, setTeamScore] = useState(9);
  const [probSolveScore, setProbSolveScore] = useState(9);
  const [evalComments, setEvalComments] = useState('');

  useEffect(() => {
    loadMentorData();
  }, []);

  const loadMentorData = async () => {
    try {
      const tskData = await api.getTasks();
      setTasks(tskData.tasks);

      const attData = await api.getAttendance();
      setAttendance(attData.attendance);

      const evalData = await api.getEvaluations();
      setEvaluations(evalData.evaluations);

      const appData = await api.getMentorApprentices();
      setApplicants(appData.apprentices);
    } catch (err) {
      console.error('Error loading mentor data', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedApprentice = applicants.find((ap) => ap.id === selectedApprenticeId);
      if (!selectedApprentice) {
        alert('Please select an apprentice to assign task');
        return;
      }

      await api.createTask({
        apprentice_id: selectedApprentice.id,
        apprentice_name: selectedApprentice.full_name,
        mentor_id: user.id,
        mentor_name: user.full_name,
        title: taskTitle,
        description: taskDesc,
        due_date: taskDueDate
      });

      setShowTaskModal(false);
      setSelectedApprenticeId('');
      setTaskTitle('');
      setTaskDesc('');
      loadMentorData();
    } catch (err: any) {
      alert(err.message || 'Failed to assign task');
    }
  };

  const handleVerifyTask = async (taskId: string) => {
    try {
      await api.verifyTask(taskId);
      loadMentorData();
    } catch (err: any) {
      alert(err.message || 'Task verification failed');
    }
  };

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedApprentice = applicants.find((ap) => ap.id === selectedEvalApprenticeId);
      if (!selectedApprentice) {
        alert('Please select an apprentice to evaluate');
        return;
      }

      await api.submitEvaluation({
        apprentice_id: selectedApprentice.id,
        apprentice_name: selectedApprentice.full_name,
        evaluator_id: user.id,
        evaluator_name: user.full_name,
        evaluation_type: evalType,
        technical_score: techScore,
        communication_score: commScore,
        punctuality_score: puncScore,
        teamwork_score: teamScore,
        problem_solving_score: probSolveScore,
        comments: evalComments || 'Apprentice completed all department objectives successfully.'
      });

      setShowEvalModal(false);
      setSelectedEvalApprenticeId('');
      setEvalComments('');
      loadMentorData();
      alert('Evaluation submitted! If final evaluation passed, digital certificate generated.');
    } catch (err: any) {
      alert(err.message || 'Evaluation submission failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-green-100 text-[#006D32] rounded-full text-xs font-extrabold uppercase tracking-wider">
            Phase 5: Mentor Task Tracking & Evaluation Rubric
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-2">Supervisor & Mentor Portal</h1>
          <p className="text-xs text-gray-500">
            Assign weekly technical tasks, review completion evidence, verify attendance, and conduct Appendix C evaluations.
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#006D32] text-white font-extrabold text-xs shadow-md hover:bg-[#005527] flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Task</span>
          </button>

          <button
            onClick={() => setShowEvalModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#F2A900] text-gray-900 font-extrabold text-xs shadow-md hover:bg-amber-400 flex items-center space-x-1.5 transition-all"
          >
            <Award className="w-4 h-4" />
            <span>Conduct Evaluation</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Task Reviews */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
          <h3 className="text-base font-extrabold text-gray-900">Task Review & Verification Queue</h3>

          <div className="space-y-3">
            {tasks.map((tsk) => (
              <div key={tsk.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sm text-gray-900">{tsk.title}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    tsk.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                    tsk.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {tsk.status}
                  </span>
                </div>
                <p className="text-gray-600">{tsk.description}</p>
                <p className="text-[10px] text-gray-400">Apprentice: <strong>{tsk.apprentice_name}</strong> • Due: {tsk.due_date}</p>

                {tsk.evidence_notes && (
                  <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs space-y-1">
                    <p className="font-bold text-gray-800">Submitted Evidence:</p>
                    <p className="text-gray-600">{tsk.evidence_notes}</p>
                    {tsk.status === 'COMPLETED' && (
                      <button
                        onClick={() => handleVerifyTask(tsk.id)}
                        className="mt-2 px-3 py-1 rounded-lg bg-[#007A3D] text-white font-bold text-[11px] shadow-xs hover:bg-[#006231]"
                      >
                        Verify & Approve Evidence
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Active Apprentices */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
          <h3 className="text-base font-extrabold text-gray-900">Assigned Apprentices</h3>
          <div className="space-y-3">
            {applicants.map((ap) => (
              <div key={ap.id} className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-1">
                <p className="font-extrabold text-gray-900">{ap.full_name}</p>
                <p className="text-gray-600">{ap.university} • {ap.field_of_study}</p>
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-[#007A3D] text-[10px] font-bold font-mono">
                  {ap.app_id}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <h4 className="font-extrabold text-[#007A3D]">Assign Technical Task to Apprentice</h4>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Apprentice *</label>
                <select
                  required
                  value={selectedApprenticeId}
                  onChange={(e) => setSelectedApprenticeId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                >
                  <option value="">Choose an apprentice...</option>
                  {applicants.map((ap) => (
                    <option key={ap.id} value={ap.id}>{ap.full_name} ({ap.app_id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement 5G Core Network Security Logs"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Task Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed task instructions..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#007A3D] text-white font-bold shadow-md"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evaluation Rubric Modal */}
      {showEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4">
            <h4 className="font-extrabold text-base text-gray-900">Conduct Appendix C Evaluation Rubric</h4>
            <form onSubmit={handleSubmitEvaluation} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-gray-700 mb-1">Select Apprentice *</label>
                <select
                  required
                  value={selectedEvalApprenticeId}
                  onChange={(e) => setSelectedEvalApprenticeId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200"
                >
                  <option value="">Choose an apprentice...</option>
                  {applicants.map((ap) => (
                    <option key={ap.id} value={ap.id}>{ap.full_name} ({ap.app_id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Evaluation Type</label>
                <select
                  value={evalType}
                  onChange={(e) => setEvalType(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-gray-200"
                >
                  <option value="mid_term">Mid-Term Evaluation (Week 6)</option>
                  <option value="final">Final Program Evaluation (Program End)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700">Technical Skills (30%): {techScore}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={techScore}
                    onChange={(e) => setTechScore(parseInt(e.target.value))}
                    className="w-full accent-[#007A3D]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Communication (20%): {commScore}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={commScore}
                    onChange={(e) => setCommScore(parseInt(e.target.value))}
                    className="w-full accent-[#007A3D]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Punctuality (20%): {puncScore}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={puncScore}
                    onChange={(e) => setPuncScore(parseInt(e.target.value))}
                    className="w-full accent-[#007A3D]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Teamwork (15%): {teamScore}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={teamScore}
                    onChange={(e) => setTeamScore(parseInt(e.target.value))}
                    className="w-full accent-[#007A3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700">Problem Solving (15%): {probSolveScore}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={probSolveScore}
                  onChange={(e) => setProbSolveScore(parseInt(e.target.value))}
                  className="w-full accent-[#007A3D]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Supervisor Final Comments *</label>
                <textarea
                  required
                  rows={2}
                  value={evalComments}
                  onChange={(e) => setEvalComments(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEvalModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#007A3D] text-white font-bold shadow-md"
                >
                  Submit Official Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
