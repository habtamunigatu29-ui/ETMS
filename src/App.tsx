import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ApplicantLanding } from './components/ApplicantLanding';
import { StatusCheckerModal } from './components/StatusCheckerModal';
import { ApplicantApplyModal } from './components/ApplicantApplyModal';
import { CertificateModal } from './components/CertificateModal';
import { ErrorBoundary } from './components/ErrorBoundary';

import { ApprenticeDashboard } from './components/dashboards/ApprenticeDashboard';
import { HRDashboard } from './components/dashboards/HRDashboard';
import { DeptHeadDashboard } from './components/dashboards/DeptHeadDashboard';
import { MentorDashboard } from './components/dashboards/MentorDashboard';
import { ReportingDashboard } from './components/dashboards/ReportingDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

import { User, UserRole, Certificate } from './types';
import { api } from './lib/api';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRoleView, setActiveRoleView] = useState<UserRole | 'PUBLIC'>('PUBLIC');

  // Load JWT token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('et_ams_token');
    if (savedToken) {
      api.setToken(savedToken);
      api.get<{ user: User }>('/api/auth/me')
        .then(({ user }) => {
          setCurrentUser(user);
          setActiveRoleView(user.role);
        })
        .catch(() => handleLogout());
    }
  }, []);

  // Modals state
  const [isStatusCheckerOpen, setIsStatusCheckerOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Success alert toast state
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [registrationNotice, setRegistrationNotice] = useState<{
    appId: string;
    message?: string;
    role?: UserRole;
  } | null>(null);

  const handleApplicantApplySuccess = (appId: string, resData?: any) => {
    console.log('Application success:', appId, resData);
    
    setSubmittedAppId(appId);
    
    if (resData?.token) {
      api.setToken(resData.token);
      localStorage.setItem('et_ams_token', resData.token);
      console.log('Token stored from application submission');
    }
    
    if (resData?.user) {
      setCurrentUser(resData.user);
      if (resData.user.role) {
        setActiveRoleView(resData.user.role);
      }
    }
    
    setRegistrationNotice({
      appId,
      message: resData?.message,
      role: resData?.assignedRole || resData?.user?.role
    });
  };

  const handleLogin = async (identifier: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMessage = data?.error || data?.message || 'Login failed. Please try again later.';
        alert(errorMessage);
        return;
      }

      console.log('Login response:', data);

      if (data?.user) {
        setCurrentUser(data.user);
        setActiveRoleView(data.user.role);
      }

      if (data?.token) {
        localStorage.setItem('et_ams_token', data.token);
        api.setToken(data.token);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      alert(err?.message || 'Network error occurred. Please check your connection and try again.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveRoleView('PUBLIC');
    localStorage.removeItem('et_ams_token');
    api.clearToken();
    console.log('Logged out, token cleared');
  };

  const handleOpenCertificate = (cert: Certificate) => {
    setActiveCertificate(cert);
    setIsCertModalOpen(true);
  };

  const handleNavigate = (sectionId: string) => {
    if (activeRoleView !== 'PUBLIC') {
      setActiveRoleView('PUBLIC');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f0] text-gray-900 font-sans antialiased selection:bg-[#006D32] selection:text-white">
      
      <Header
        currentUser={currentUser}
        onOpenStatusChecker={() => setIsStatusCheckerOpen(true)}
        onOpenApplyModal={() => setIsApplyModalOpen(true)}
        onLogout={handleLogout}
        onGoHome={() => handleNavigate('home')}
        onNavigate={handleNavigate}
      />

      {submittedAppId && (
        <div className="py-3 px-4 text-center text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 text-white bg-[#007A3D]">
          <span>🎉 Application Submitted Successfully! Your Official Application ID is <strong>{submittedAppId}</strong>.</span>
          <button
            onClick={() => {
              setSubmittedAppId(null);
              setIsStatusCheckerOpen(true);
            }}
            className="underline font-black bg-white/20 px-2.5 py-0.5 rounded-md hover:bg-white/30 transition-colors ml-2"
          >
            Track Status
          </button>
        </div>
      )}

      <main className="flex-1">
        {activeRoleView === 'PUBLIC' && (
          <ApplicantLanding
            onLogin={handleLogin}
            onOpenApplyModal={() => setIsApplyModalOpen(true)}
            onOpenStatusChecker={() => setIsStatusCheckerOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {activeRoleView === 'APPRENTICE' && currentUser && (
          <ApprenticeDashboard
            user={currentUser}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {activeRoleView === 'HR_MANAGER' && (
          <HRDashboard />
        )}

        {activeRoleView === 'DEPARTMENT_HEAD' && currentUser && (
          <DeptHeadDashboard user={currentUser} />
        )}

        {activeRoleView === 'MENTOR' && currentUser && (
          <MentorDashboard user={currentUser} />
        )}

        {activeRoleView === 'REPORTING_OFFICER' && (
          <ReportingDashboard />
        )}

        {activeRoleView === 'SYSTEM_ADMIN' && (
          <AdminDashboard />
        )}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onOpenApplyModal={() => setIsApplyModalOpen(true)}
        onOpenStatusChecker={() => setIsStatusCheckerOpen(true)}
      />

      <StatusCheckerModal
        isOpen={isStatusCheckerOpen}
        onClose={() => setIsStatusCheckerOpen(false)}
        onOpenCertificate={handleOpenCertificate}
      />

      <ApplicantApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={handleApplicantApplySuccess}
      />

      <CertificateModal
        isOpen={isCertModalOpen}
        certificate={activeCertificate}
        onClose={() => setIsCertModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
