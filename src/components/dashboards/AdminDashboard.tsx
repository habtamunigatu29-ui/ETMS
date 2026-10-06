import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { User, AuditLog, Department, UserRole, Applicant, Application } from '../../types';
import { Settings, Users, Shield, Plus, Database, Clock, Lock, CheckCircle2, AlertTriangle, Key, Trash2, Building2, Search, GraduationCap, FileText, Award, Filter } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // Search & Filter state
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'STAFF' | 'APPRENTICE'>('ALL');
  const [studentSearch, setStudentSearch] = useState('');

  // User creation state
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('HR_MANAGER');
  const [newDeptId, setNewDeptId] = useState('');

  // Department creation state
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptCapacity, setDeptCapacity] = useState('30');
  const [deptDescription, setDeptDescription] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const data = await api.getAdminData();
      setUsers(data.users);
      setDepartments(data.departments);
      setAuditLogs(data.auditLogs);
      if (data.applicants) setApplicants(data.applicants);
      if (data.applications) setApplications(data.applications);
    } catch (err) {
      console.error('Error loading admin data', err);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete account for "${userName}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.deleteUser(userId);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user account');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createUser({
        username: newUsername,
        email: newEmail,
        full_name: newName,
        role: newRole,
        department_id: newDeptId
      });

      setShowUserModal(false);
      setNewUsername('');
      setNewEmail('');
      setNewName('');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'User creation failed');
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDepartment({
        name: deptName,
        code: deptCode,
        max_apprentices: parseInt(deptCapacity) || 30,
        description: deptDescription
      });

      setShowDeptModal(false);
      setDeptName('');
      setDeptCode('');
      setDeptCapacity('30');
      setDeptDescription('');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Department creation failed');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !userSearch ||
      u.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());

    const matchesRole =
      roleFilter === 'ALL' ||
      (roleFilter === 'STAFF' && u.role !== 'APPRENTICE') ||
      (roleFilter === 'APPRENTICE' && u.role === 'APPRENTICE');

    return matchesSearch && matchesRole;
  });

  const filteredApplicants = applicants.filter((app) => {
    return (
      !studentSearch ||
      app.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      app.app_id.toLowerCase().includes(studentSearch.toLowerCase()) ||
      app.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      app.university.toLowerCase().includes(studentSearch.toLowerCase()) ||
      app.field_of_study.toLowerCase().includes(studentSearch.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-green-100 text-[#006D32] rounded-full text-xs font-extrabold uppercase tracking-wider">
            System Administration & Audit Logs
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-2">Ethio Telecom AMS System Administration</h1>
          <p className="text-xs text-gray-500">
            RBAC user management, department parameters, database audit trail, and security policy configuration.
          </p>
        </div>

        <button
          onClick={() => setShowUserModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#006D32] text-white font-extrabold text-xs shadow-md hover:bg-[#005527] flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add System User Account</span>
        </button>
      </div>

      {/* Users & Roles List */}
      <div className="bg-white/80 backdrop-blur-lg rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-gray-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#006D32]" />
              <span>User Accounts & RBAC Roles ({filteredUsers.length} of {users.length})</span>
            </h3>
            <p className="text-xs text-gray-500">Manage portal access, assign roles, promote to Admin, or delete accounts.</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006D32]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-[10px] font-bold">
              <button
                onClick={() => setRoleFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg transition-all ${roleFilter === 'ALL' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'}`}
              >
                All
              </button>
              <button
                onClick={() => setRoleFilter('STAFF')}
                className={`px-2.5 py-1 rounded-lg transition-all ${roleFilter === 'STAFF' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'}`}
              >
                Staff
              </button>
              <button
                onClick={() => setRoleFilter('APPRENTICE')}
                className={`px-2.5 py-1 rounded-lg transition-all ${roleFilter === 'APPRENTICE' ? 'bg-[#006D32] text-white shadow-xs' : 'text-gray-600'}`}
              >
                Students
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-100/70 text-gray-700 uppercase font-extrabold text-[10px] tracking-wider border-b border-gray-200/60">
              <tr>
                <th className="p-3">Username</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">RBAC Role</th>
                <th className="p-3">Department</th>
                <th className="p-3">Last Login</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#006D32]">{u.username}</td>
                  <td className="p-3 font-bold text-gray-900">{u.full_name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-green-100 text-[#006D32] uppercase border-0 cursor-pointer focus:ring-2 focus:ring-[#006D32]"
                    >
                      <option value="SYSTEM_ADMIN">System Admin</option>
                      <option value="HR_MANAGER">HR Manager</option>
                      <option value="DEPARTMENT_HEAD">Department Head</option>
                      <option value="MENTOR">Mentor</option>
                      <option value="REPORTING_OFFICER">Reporting Officer</option>
                      <option value="APPRENTICE">Apprentice / Student</option>
                    </select>
                  </td>
                  <td className="p-3 font-semibold">{u.department_name || 'All Departments'}</td>
                  <td className="p-3 font-mono text-[11px] text-gray-500">
                    {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                  </td>
                  <td className="p-3 text-right flex items-center justify-end space-x-2">
                    {u.role !== 'SYSTEM_ADMIN' && (
                      <button
                        onClick={() => handleRoleChange(u.id, 'SYSTEM_ADMIN')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-extrabold text-[10px] hover:bg-emerald-800 transition-colors"
                      >
                        Make Admin
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(u.id, u.full_name)}
                      title="Delete User Account"
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internship & Apprentice Students Directory Section */}
      <div className="bg-white/80 backdrop-blur-lg rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-gray-900 flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-[#006D32]" />
              <span>Internship & Apprentice Students Directory ({filteredApplicants.length})</span>
            </h3>
            <p className="text-xs text-gray-500">Comprehensive roster of registered student applicants, academic GPA, university, attached credentials, and status.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, App ID, Uni..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006D32]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-emerald-50/60 text-gray-700 uppercase font-extrabold text-[10px] tracking-wider border-b border-emerald-100">
              <tr>
                <th className="p-3">App ID</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">University & Major</th>
                <th className="p-3">GPA</th>
                <th className="p-3">Documents</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Delete / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApplicants.map((app) => (
                <tr key={app.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#006D32]">{app.app_id}</td>
                  <td className="p-3">
                    <p className="font-bold text-gray-900">{app.full_name}</p>
                    <p className="text-[10px] text-gray-500">{app.email}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-gray-800">{app.university}</p>
                    <p className="text-[10px] text-[#007A3D] font-mono font-bold">{app.field_of_study}</p>
                  </td>
                  <td className="p-3 font-mono font-extrabold text-[#006D32]">{app.gpa.toFixed(2)}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1.5 text-[10px]">
                      <span title={app.cv_filename} className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono font-semibold">
                        CV
                      </span>
                      <span title="Transcript" className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono font-semibold">
                        TR
                      </span>
                      <span title="National ID" className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono font-semibold">
                        ID
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      app.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-[#006D32]'
                        : app.status === 'PENDING_SCREENING'
                        ? 'bg-amber-100 text-amber-800'
                        : app.status === 'APPROVED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteUser(app.id, app.full_name)}
                      title="Delete Internship Student Record"
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Departments Management */}
      <div className="bg-white/80 backdrop-blur-lg rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-[#006D32]" />
              <span>Ethio Telecom Departments & Divisions ({departments.length})</span>
            </h3>
            <p className="text-xs text-gray-500">Manage apprenticeship host departments, capacity limits, and required skills.</p>
          </div>
          <button
            onClick={() => setShowDeptModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#006D32] text-white font-extrabold text-xs hover:bg-[#005527] flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department (e.g. IT)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {departments.map((dept) => (
            <div key={dept.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#006D32] font-mono font-black text-[10px] uppercase">
                    {dept.code}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900 mt-1">{dept.name}</h4>
                </div>
                <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
                  Cap: {dept.max_apprentices}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{dept.description}</p>
              {dept.required_skills && (() => {
                const skills = typeof dept.required_skills === 'string' 
                  ? JSON.parse(dept.required_skills) 
                  : dept.required_skills;
                return Array.isArray(skills) && skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {skills.slice(0, 3).map((s: any, i: number) => (
                      <span key={i} className="text-[9px] font-semibold bg-white text-gray-700 px-2 py-0.5 rounded-md border border-gray-100">
                        {s}
                      </span>
                    ))}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Viewer */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 space-y-4">
        <h3 className="text-lg font-black text-gray-900">System Audit Log & Compliance Trail</h3>

        <div className="space-y-2 max-h-96 overflow-y-auto text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start justify-between">
              <div>
                <p className="font-bold text-gray-900">
                  <span className="text-[#007A3D]">{log.user_name}</span> ({log.user_role}): {log.action}
                </p>
                <p className="text-gray-600">{log.details}</p>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Create User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <h4 className="font-extrabold text-base text-gray-900">Create System User Account</h4>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Almaz Haile"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="user@ethiotelecom.et"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. hr_almaz"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">RBAC Role *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                >
                  <option value="HR_MANAGER">HR Manager / Officer</option>
                  <option value="DEPARTMENT_HEAD">Department Head</option>
                  <option value="MENTOR">Mentor / Supervisor</option>
                  <option value="REPORTING_OFFICER">Reporting & Analytics Officer</option>
                  <option value="SYSTEM_ADMIN">System Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Department</label>
                <select
                  value={newDeptId}
                  onChange={(e) => setNewDeptId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                >
                  <option value="">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#007A3D] text-white font-bold shadow-md"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <h4 className="font-extrabold text-base text-gray-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-[#006D32]" />
              <span>Add New Ethio Telecom Department</span>
            </h4>
            <form onSubmit={handleCreateDepartment} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-gray-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Information Technology (IT)"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1">Dept Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IT"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Capacity Limit *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="30"
                    value={deptCapacity}
                    onChange={(e) => setDeptCapacity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief overview of department functions and team responsibilities..."
                  value={deptDescription}
                  onChange={(e) => setDeptDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#007A3D] text-white font-bold shadow-md"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
