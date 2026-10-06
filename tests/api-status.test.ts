/**
 * End-to-End API Status Test Suite for ET-AMS Backend
 * Tests all API endpoints for functionality, response codes, and data integrity
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('End-to-End API Status Tests', () => {
  
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Login to get auth token for protected routes
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin', password: 'password123' })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      authToken = loginData.token;
      testUserId = loginData.user.id;
    }
  });

  describe('Health Check', () => {
    
    it('GET /api/health should return 200', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('ok');
      expect(data.app).toBe('Ethio Telecom ET-AMS');
      expect(data.timestamp).toBeDefined();
    });
  });

  describe('Authentication Endpoints', () => {
    
    it('POST /api/auth/login should authenticate valid credentials', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'admin', password: 'password123' })
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.user).toBeDefined();
      expect(data.user.role).toBe('SYSTEM_ADMIN');
      expect(data.token).toBeDefined();
    });

    it('POST /api/auth/login should reject invalid credentials', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'admin', password: 'wrongpassword' })
      });

      expect(response.status).toBe(401);
    });

    it('POST /api/auth/login should require password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'admin' })
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Applicant Endpoints', () => {
    
    it('GET /api/applicants should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/applicants`);
      
      expect(response.status).toBe(401);
    });

    it('GET /api/applicants should return data with valid token', async () => {
      if (!authToken) {
        console.warn('Skipping test - no auth token');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/applicants`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.applicants).toBeDefined();
      expect(data.applications).toBeDefined();
      expect(Array.isArray(data.applicants)).toBe(true);
    });

    it('GET /api/applicants/lookup should work without auth', async () => {
      const response = await fetch(`${BASE_URL}/api/applicants/lookup?appId=APP-2026-0101`);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.applicant).toBeDefined();
      expect(data.applicant.app_id).toBe('APP-2026-0101');
    });

    it('GET /api/applicants/lookup should return 404 for non-existent ID', async () => {
      const response = await fetch(`${BASE_URL}/api/applicants/lookup?appId=APP-9999-9999`);
      
      expect(response.status).toBe(404);
    });

    it('POST /api/applicants/submit should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/applicants/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: 'Test User',
          email: 'test@test.com',
          phone: '+251911000000',
          university: 'Test University',
          field_of_study: 'Computer Science',
          gpa: 3.5,
          skills: 'Test skills',
          cv_name: 'cv.pdf',
          transcript_name: 'transcript.pdf',
          id_name: 'id.pdf',
          recommendation_name: 'rec.pdf'
        })
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Screening Endpoints', () => {
    
    it('GET /api/screening/queue should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/screening/queue`);
      
      expect(response.status).toBe(401);
    });

    it('GET /api/screening/queue should return screening data with valid token', async () => {
      if (!authToken) {
        console.warn('Skipping test - no auth token');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/screening/queue`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.queue).toBeDefined();
      expect(data.screeningCriteria).toBeDefined();
      expect(Array.isArray(data.queue)).toBe(true);
    });

    it('POST /api/screening/evaluate should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/screening/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: 'apln-001',
          status: 'SCREENED',
          screening_notes: 'Test notes',
          custom_score: 85,
          evaluator_id: 'usr-02',
          evaluator_name: 'HR Manager'
        })
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Approval Endpoints', () => {
    
    it('POST /api/approvals/decide should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/approvals/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: 'apln-001',
          decision: 'APPROVE',
          department_id: 'dept-01',
          rejection_reason: '',
          decision_by: 'usr-03',
          decision_by_name: 'Department Head'
        })
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Assignment Endpoints', () => {
    
    it('POST /api/assignments/assign should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/assignments/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: 'apln-001',
          department_id: 'dept-01',
          mentor_id: 'usr-05',
          course_ids: ['crs-001']
        })
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Attendance Endpoints', () => {
    
    it('GET /api/attendance should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/attendance`);
      
      expect(response.status).toBe(401);
    });

    it('POST /api/attendance/check-in should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/attendance/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apprentice_id: 'app-001',
          apprentice_name: 'Test Apprentice',
          method: 'BIOMETRIC',
          lat: 9.0108,
          lng: 38.7612,
          location_name: 'Test Location'
        })
      });

      expect(response.status).toBe(401);
    });

    it('POST /api/attendance/check-out should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/attendance/check-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          record_id: 'att-001'
        })
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Task Endpoints', () => {
    
    it('GET /api/tasks should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/tasks`);
      
      expect(response.status).toBe(401);
    });

    it('POST /api/tasks/create should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/tasks/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apprentice_id: 'app-001',
          apprentice_name: 'Test Apprentice',
          mentor_id: 'usr-05',
          mentor_name: 'Test Mentor',
          title: 'Test Task',
          description: 'Test description',
          due_date: '2026-12-31'
        })
      });

      expect(response.status).toBe(401);
    });

    it('POST /api/tasks/submit should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/tasks/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: 'tsk-001',
          notes: 'Test notes',
          filename: 'test.pdf'
        })
      });

      expect(response.status).toBe(401);
    });

    it('POST /api/tasks/verify should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/tasks/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: 'tsk-001'
        })
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Evaluation Endpoints', () => {
    
    it('GET /api/evaluations should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/evaluations`);
      
      expect(response.status).toBe(401);
    });

    it('POST /api/evaluations/submit should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/evaluations/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apprentice_id: 'app-001',
          apprentice_name: 'Test Apprentice',
          evaluator_id: 'usr-05',
          evaluator_name: 'Test Mentor',
          evaluation_type: 'final',
          technical_score: 9,
          communication_score: 8,
          punctuality_score: 9,
          teamwork_score: 8,
          problem_solving_score: 9,
          comments: 'Test comments'
        })
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Certificate Endpoints', () => {
    
    it('GET /api/certificates should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/certificates`);
      
      expect(response.status).toBe(401);
    });

    it('GET /api/certificates/verify/:certNumber should work without auth', async () => {
      const response = await fetch(`${BASE_URL}/api/certificates/verify/CERT-2026-001`);
      
      // May return 404 if certificate doesn't exist, but should not be 401
      expect([200, 404]).toContain(response.status);
    });
  });

  describe('Reports Endpoints', () => {
    
    it('GET /api/reports/kpis should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/reports/kpis`);
      
      expect(response.status).toBe(401);
    });

    it('GET /api/reports/kpis should return KPI data with valid token', async () => {
      if (!authToken) {
        console.warn('Skipping test - no auth token');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/reports/kpis`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.totalApplications).toBeDefined();
      expect(data.screenedApplications).toBeDefined();
      expect(data.approvedApplications).toBeDefined();
      expect(data.activeApprentices).toBeDefined();
      expect(data.completedApprentices).toBeDefined();
      expect(data.overallAttendanceRate).toBeDefined();
      expect(data.departments).toBeDefined();
    });
  });

  describe('Admin Endpoints', () => {
    
    it('GET /api/admin/users should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/users`);
      
      expect(response.status).toBe(401);
    });

    it('GET /api/admin/users should return admin data with valid token', async () => {
      if (!authToken) {
        console.warn('Skipping test - no auth token');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.users).toBeDefined();
      expect(data.departments).toBeDefined();
      expect(data.auditLogs).toBeDefined();
      expect(data.screeningCriteria).toBeDefined();
    });

    it('POST /api/admin/users/create should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@test.com',
          full_name: 'Test User',
          role: 'APPRENTICE',
          department_id: 'dept-01',
          phone: '+251911000000'
        })
      });

      expect(response.status).toBe(401);
    });

    it('POST /api/admin/users/update-role should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/users/update-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr-01',
          role: 'SYSTEM_ADMIN'
        })
      });

      expect(response.status).toBe(401);
    });

    it('DELETE /api/admin/users/:id should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/users/usr-01`, {
        method: 'DELETE'
      });

      expect(response.status).toBe(401);
    });

    it('POST /api/admin/departments/create should require authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/departments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Department',
          code: 'TEST',
          description: 'Test description',
          max_apprentices: 20,
          location: 'Test location',
          required_skills: 'Test skills'
        })
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Response Format Validation', () => {
    
    it('should return JSON content type', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      
      expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('should include proper error messages', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'nonexistent@test.com', password: 'password123' })
      });

      const data = await response.json();
      expect(data.error).toBeDefined();
      expect(typeof data.error).toBe('string');
    });

    it('should handle malformed JSON gracefully', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      });

      expect(response.status).toBe(400);
    });
  });

  describe('HTTP Status Codes', () => {
    
    it('should return 200 for successful requests', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      expect(response.status).toBe(200);
    });

    it('should return 400 for bad requests', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Missing required fields
      });

      expect(response.status).toBe(400);
    });

    it('should return 401 for unauthorized requests', async () => {
      const response = await fetch(`${BASE_URL}/api/applicants`);
      expect(response.status).toBe(401);
    });

    it('should return 403 for forbidden requests', async () => {
      const response = await fetch(`${BASE_URL}/api/applicants`, {
        headers: { 'Authorization': 'Bearer invalid-token' }
      });

      expect(response.status).toBe(403);
    });

    it('should return 404 for not found resources', async () => {
      const response = await fetch(`${BASE_URL}/api/applicants/lookup?appId=NONEXISTENT`);
      expect(response.status).toBe(404);
    });

    it('should return 429 for rate limited requests', async () => {
      // Make 6 login attempts (limit is 5)
      const requests = Array(6).fill(null).map(() => 
        fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: 'admin', password: 'wrongpassword' })
        })
      );

      const responses = await Promise.all(requests);
      const lastResponse = responses[responses.length - 1];
      
      expect(lastResponse.status).toBe(429);
    }, 30000);
  });

  describe('Data Integrity', () => {
    
    it('should return consistent data types', async () => {
      const response = await fetch(`${BASE_URL}/api/applicants/lookup?appId=APP-2026-0101`);
      
      const data = await response.json();
      
      expect(typeof data.applicant).toBe('object');
      expect(typeof data.applicant.id).toBe('string');
      expect(typeof data.applicant.app_id).toBe('string');
      expect(typeof data.applicant.full_name).toBe('string');
      expect(typeof data.applicant.gpa).toBe('number');
    });

    it('should handle null/undefined fields gracefully', async () => {
      const response = await fetch(`${BASE_URL}/api/applicants/lookup?appId=APP-2026-0101`);
      
      const data = await response.json();
      
      // Optional fields may be null/undefined
      expect(data.application).toBeDefined();
    });
  });
});
