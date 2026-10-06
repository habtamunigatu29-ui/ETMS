import React from 'react';
import { UserRole } from '../types';
import { Shield, UserCheck, Briefcase, GraduationCap, BarChart3, Settings, Eye } from 'lucide-react';

interface RoleSwitcherBarProps {
  currentRole: UserRole | 'PUBLIC';
  onSelectRole: (role: UserRole | 'PUBLIC') => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  currentRole,
  onSelectRole
}) => {
  const roles: { role: UserRole | 'PUBLIC'; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'PUBLIC',
      label: 'Public Landing',
      icon: <Eye className="w-3.5 h-3.5" />,
      desc: 'Applicant Portal'
    },
    {
      role: 'APPRENTICE',
      label: 'Apprentice Workspace',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      desc: 'Check-In, Tasks & Cert'
    },
    {
      role: 'HR_MANAGER',
      label: 'HR Screening',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      desc: 'Verification & Scoring'
    },
    {
      role: 'DEPARTMENT_HEAD',
      label: 'Dept Head',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      desc: 'Approvals & Mentors'
    },
    {
      role: 'MENTOR',
      label: 'Mentor / Supervisor',
      icon: <Shield className="w-3.5 h-3.5" />,
      desc: 'Tasks & Evaluations'
    },
    {
      role: 'REPORTING_OFFICER',
      label: 'Analytics Officer',
      icon: <BarChart3 className="w-3.5 h-3.5" />,
      desc: 'KPIs & Reports'
    },
    {
      role: 'SYSTEM_ADMIN',
      label: 'System Admin',
      icon: <Settings className="w-3.5 h-3.5" />,
      desc: 'User Management'
    }
  ];

  return (
    <div className="bg-[#005226] text-white border-b border-[#006D32] px-4 py-2 text-xs shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="font-bold tracking-wide uppercase text-[11px] text-white/90">
            ET-AMS Enterprise Portal Preview:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {roles.map((r) => {
            const isActive = currentRole === r.role;
            return (
              <button
                key={r.role}
                onClick={() => onSelectRole(r.role)}
                title={r.desc}
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-[#006D32] shadow-sm font-extrabold'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
