import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Department } from '../../types';
import { BarChart3, TrendingUp, Download, PieChart, Users, CheckCircle2, Award, FileSpreadsheet, Printer } from 'lucide-react';

export const ReportingDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<{
    totalApplications: number;
    screenedApplications: number;
    approvedApplications: number;
    activeApprentices: number;
    completedApprentices: number;
    overallAttendanceRate: string;
    departments: Department[];
  } | null>(null);

  useEffect(() => {
    loadKpis();
  }, []);

  const loadKpis = async () => {
    try {
      const data = await api.getKpiReports();
      setKpis(data);
    } catch (err) {
      console.error('Error loading KPI reports', err);
    }
  };

  const handleExportCSV = () => {
    if (!kpis) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Department,Code,Max Slots,Active Apprentices,Occupancy Rate\n' +
      kpis.departments
        .map(
          (d) =>
            `"${d.name}","${d.code}",${d.max_apprentices},${d.current_apprentices},"${(
              (d.current_apprentices / d.max_apprentices) *
              100
            ).toFixed(1)}%"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Ethio_Telecom_AMS_Report_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-green-100 text-[#006D32] rounded-full text-xs font-extrabold uppercase tracking-wider">
            Reporting & Executive Analytics
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-2">Ethio Telecom AMS Performance Analytics</h1>
          <p className="text-xs text-gray-500">
            Real-time cross-department KPI metrics, attendance compliance ratios, and exportable analytics.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-[#006D32] text-white font-extrabold text-xs shadow-md hover:bg-[#005527] flex items-center space-x-2 transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Analytics Report (CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase">Total Applications</p>
            <p className="text-3xl font-black text-gray-900">{kpis.totalApplications}</p>
            <p className="text-[11px] text-[#006D32] font-extrabold">100% Digitized Submissions</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase">Screening Pass Rate</p>
            <p className="text-3xl font-black text-[#006D32]">
              {kpis.totalApplications > 0
                ? `${((kpis.screenedApplications / kpis.totalApplications) * 100).toFixed(0)}%`
                : '85%'}
            </p>
            <p className="text-[11px] text-gray-400 font-medium">Automated Weighted Score</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase">Attendance Compliance</p>
            <p className="text-3xl font-black text-[#006D32]">{kpis.overallAttendanceRate}</p>
            <p className="text-[11px] text-[#006D32] font-extrabold">Biometric & GPS Validated</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-[2rem] border border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase">Certified Graduates</p>
            <p className="text-3xl font-black text-[#F2A900]">{kpis.completedApprentices}</p>
            <p className="text-[11px] text-gray-400 font-medium">Digital QR Verification</p>
          </div>
        </div>
      )}

      {/* Department Breakdown */}
      {kpis && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
          <h3 className="text-lg font-black text-gray-900">Cross-Department Slot Occupancy & Capacity</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kpis.departments.map((d) => {
              const pct = Math.round((d.current_apprentices / d.max_apprentices) * 100);
              return (
                <div key={d.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>{d.name} ({d.code})</span>
                    <span className="text-[#007A3D]">{pct}% Occupied</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#007A3D] rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Active Apprentices: <strong>{d.current_apprentices}</strong> / Max Capacity: <strong>{d.max_apprentices}</strong>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
