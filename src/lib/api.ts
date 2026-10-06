// src/lib/api.ts

import {
  Applicant,
  Application,
  AttendanceRecord,
  Certificate,
  Evaluation,
  ApprenticeTask,
  User,
  UserRole,
  AuditLog,
  Department,
  Course,
  ScreeningCriteriaConfig
} from '../types';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = typeof window !== 'undefined' ? localStorage.getItem('et_ams_token') : null;
  }

  public setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('et_ams_token', token);
    }
  }

  public clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('et_ams_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public loadTokenFromStorage(): string | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('et_ams_token');
      if (stored) {
        this.token = stored;
        return this.token;
      }
    }
    return null;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isFormData = options.body instanceof FormData;

    // Check if this is a public endpoint (no token required)
    const isPublicEndpoint = endpoint.includes('/api/auth/login') || 
                            endpoint.includes('/api/applicants/submit') ||
                            endpoint.includes('/api/applicants/lookup') ||
                            endpoint.includes('/api/certificates/verify');

    // Do NOT set Content-Type header manually if sending FormData (browser automatically handles multipart boundaries)
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers as Record<string, string>),
    };

    // Only add token if NOT a public endpoint
    if (this.token && !isPublicEndpoint) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    console.log(`[API] Request: ${endpoint}`, { isPublicEndpoint, hasToken: !!this.token });

    try {
      const response = await fetch(endpoint, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error(`[API] Error Response (${endpoint}):`, data);
        throw new Error(data?.error || data?.message || `Request failed with status ${response.status}`);
      }

      return data as T;
    } catch (error: any) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ============================================
  // 1. AUTHENTICATION
  // ============================================
  public async login(identifier: string, password: string) {
    const result = await this.request<{ success: boolean; user: User; applicant?: Applicant; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    
    if (result.success && result.token) {
      this.setToken(result.token);
    }
    
    return result;
  }

  public logout() {
    this.clearToken();
  }

  // ============================================
  // 2. APPLICANTS & SUBMISSIONS
  // ============================================
  
  // ✅ FIXED: Public endpoint - No authentication required
  public async submitApplication(formData: Record<string, any>) {
    console.log('[API] Submitting application:', formData);
    
    const response = await fetch('/api/applicants/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('[API] Submit error:', data);
      throw new Error(data.error || 'Submission failed');
    }

    console.log('[API] Submit success:', data);

    // If token is returned, store it (for auto-login)
    if (data.token) {
      this.setToken(data.token);
    }

    return data as {
      success: boolean;
      app_id: string;
      applicant: Applicant;
      application: Application;
      assignedRole?: UserRole;
      isFirstAdmin?: boolean;
      user?: User;
      token?: string;
      message: string;
    };
  }

  // ✅ Public - No authentication required
  public async lookupApplication(appId?: string, email?: string) {
    const params = new URLSearchParams();
    if (!appId || !email) throw new Error('Application ID and registered email are required.');
    params.set('appId', appId);
    params.set('email', email);
    
    const response = await fetch(`/api/applicants/lookup?${params.toString()}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Lookup failed');
    }
    
    return data as { applicant: Applicant; application: Application; certificate?: Certificate };
  }

  // 🔒 Protected - Requires authentication
  public async getApplicants() {
    return this.request<{ applicants: Applicant[]; applications: Application[] }>('/api/applicants');
  }

  // 🔒 Protected - Mentor only
  public async getMentorApprentices() {
    return this.request<{ apprentices: Applicant[] }>('/api/mentor/apprentices');
  }

  // 🔒 Protected - Department Head only
  public async getDeptHeadData() {
    return this.request<{ departments: Department[]; users: User[]; applications: Application[] }>('/api/dept-head/data');
  }

  // ============================================
  // 3. SCREENING (Protected)
  // ============================================
  public async getScreeningQueue() {
    return this.request<{ queue: Application[]; screeningCriteria: ScreeningCriteriaConfig }>('/api/screening/queue');
  }

  public async evaluateScreening(payload: {
    applicationId: string;
    status: string;
    screening_notes: string;
    custom_score?: number;
    evaluator_id?: string;
    evaluator_name?: string;
  }) {
    return this.request<{ success: boolean; application: Application; applicant: Applicant }>('/api/screening/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ============================================
  // 4. APPROVALS (Protected)
  // ============================================
  public async decideApproval(payload: {
    applicationId: string;
    decision: 'APPROVE' | 'REJECT' | 'WAITLIST';
    department_id?: string;
    rejection_reason?: string;
    decision_by?: string;
    decision_by_name?: string;
  }) {
    return this.request<{ success: boolean; application: Application; applicant: Applicant }>('/api/approvals/decide', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ============================================
  // 5. ASSIGNMENTS (Protected)
  // ============================================
  public async assignApprentice(payload: {
    applicationId: string;
    department_id: string;
    mentor_id: string;
    course_ids?: string[];
  }) {
    return this.request<{
      success: boolean;
      application: Application;
      applicant: Applicant;
      userAccount: User;
      message: string;
    }>('/api/assignments/assign', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ============================================
  // 6. ATTENDANCE (Protected)
  // ============================================
  public async getAttendance() {
    return this.request<{ attendance: AttendanceRecord[] }>('/api/attendance');
  }

  public async checkInAttendance(payload: {
    apprentice_id: string;
    apprentice_name?: string;
    method: 'BIOMETRIC' | 'QR_CODE' | 'GPS_MOBILE';
    lat?: number;
    lng?: number;
    location_name?: string;
  }) {
    return this.request<{ success: boolean; attendance: AttendanceRecord; message: string }>('/api/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async checkOutAttendance(record_id: string) {
    return this.request<{ success: boolean; attendance: AttendanceRecord; message: string }>('/api/attendance/check-out', {
      method: 'POST',
      body: JSON.stringify({ record_id }),
    });
  }

  // ============================================
  // 7. TASKS (Protected)
  // ============================================
  public async getTasks() {
    return this.request<{ tasks: ApprenticeTask[] }>('/api/tasks');
  }

  public async createTask(payload: {
    apprentice_id: string;
    apprentice_name: string;
    mentor_id: string;
    mentor_name: string;
    title: string;
    description: string;
    due_date?: string;
  }) {
    return this.request<{ success: boolean; task: ApprenticeTask }>('/api/tasks/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async submitTaskEvidence(taskId: string, notes: string, filename?: string) {
    return this.request<{ success: boolean; task: ApprenticeTask }>('/api/tasks/submit', {
      method: 'POST',
      body: JSON.stringify({ taskId, notes, filename }),
    });
  }

  public async verifyTask(taskId: string) {
    return this.request<{ success: boolean; task: ApprenticeTask }>('/api/tasks/verify', {
      method: 'POST',
      body: JSON.stringify({ taskId }),
    });
  }

  // ============================================
  // 8. EVALUATIONS (Protected)
  // ============================================
  public async getEvaluations() {
    return this.request<{ evaluations: Evaluation[] }>('/api/evaluations');
  }

  public async submitEvaluation(payload: {
    apprentice_id: string;
    apprentice_name: string;
    evaluator_id: string;
    evaluator_name: string;
    evaluation_type: string;
    technical_score: number;
    communication_score: number;
    punctuality_score: number;
    teamwork_score: number;
    problem_solving_score: number;
    comments?: string;
  }) {
    return this.request<{ success: boolean; evaluation: Evaluation; certificateGenerated: boolean }>('/api/evaluations/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ============================================
  // 9. CERTIFICATES
  // ============================================
  
  // 🔒 Protected - Requires authentication
  public async getCertificates() {
    return this.request<{ certificates: Certificate[] }>('/api/certificates');
  }

  // ✅ Public - No authentication required
  public async verifyCertificate(certNumber: string) {
    const response = await fetch(`/api/certificates/verify/${certNumber}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Verification failed');
    }
    
    return data as { valid: boolean; certificate?: Certificate; error?: string };
  }

  // ============================================
  // 10. REPORTS (Protected)
  // ============================================
  public async getKpiReports() {
    return this.request<{
      totalApplications: number;
      screenedApplications: number;
      approvedApplications: number;
      activeApprentices: number;
      completedApprentices: number;
      overallAttendanceRate: string;
      departments: Department[];
    }>('/api/reports/kpis');
  }

  // ============================================
  // 11. ADMIN (Protected)
  // ============================================
  public async getAdminData() {
    return this.request<{
      users: User[];
      departments: Department[];
      auditLogs: AuditLog[];
      screeningCriteria: ScreeningCriteriaConfig;
      applicants?: Applicant[];
      applications?: Application[];
    }>('/api/admin/users');
  }

  public async createUser(userData: {
    username: string;
    email: string;
    full_name: string;
    role: UserRole;
    department_id?: string;
    phone?: string;
  }) {
    return this.request<{ success: boolean; user: User }>('/api/admin/users/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  public async updateUserRole(userId: string, role: UserRole) {
    return this.request<{ success: boolean; user: User }>('/api/admin/users/update-role', {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    });
  }

  public async deleteUser(userId: string) {
    return this.request<{ success: boolean; message: string }>(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  public async createDepartment(deptData: {
    name: string;
    code: string;
    description?: string;
    max_apprentices?: number;
    location?: string;
    required_skills?: string[];
  }) {
    return this.request<{ success: boolean; department: Department }>('/api/admin/departments/create', {
      method: 'POST',
      body: JSON.stringify(deptData),
    });
  }

  // ============================================
  // 12. GENERIC HELPER METHODS
  // ============================================
  public async get<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public async post<T = any>(endpoint: string, body: any) {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  public async put<T = any>(endpoint: string, body: any) {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  public async delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export individual functions for React components
export const submitApplication = api.submitApplication.bind(api);
export const login = api.login.bind(api);
export const logout = api.logout.bind(api);
export const getToken = api.getToken.bind(api);
export const setToken = api.setToken.bind(api);
export const loadTokenFromStorage = api.loadTokenFromStorage.bind(api);
export const lookupApplication = api.lookupApplication.bind(api);
export const verifyCertificate = api.verifyCertificate.bind(api);
