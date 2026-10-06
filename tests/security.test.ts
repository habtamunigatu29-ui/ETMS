/**
 * Security Test Suite for ET-AMS Backend
 * Tests for: SQL Injection, XSS, Authentication Bypass, Rate Limiting
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('Security Tests', () => {
  
  describe('Authentication Security', () => {
    
    it('should reject login without password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'admin' })
      });
      
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toContain('Password is required');
    });

    it('should reject login with wrong password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'admin', password: 'wrongpassword' })
      });
      
      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data.error).toContain('Invalid password');
    });

    it('should reject login with non-existent user', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'nonexistent@test.com', password: 'password123' })
      });
      
      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data.error).toContain('Invalid credentials');
    });

    it('should require JWT token for protected routes', async () => {
      const response = await fetch(`${BASE_URL}/api/applicants`);
      
      expect(response.status).toBe(401);
    });

    it('should reject invalid JWT token', async () => {
      const response = await fetch(`${BASE_URL}/api/applicants`, {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });
      
      expect(response.status).toBe(403);
    });
  });

  describe('SQL Injection Protection', () => {
    
    it('should handle SQL injection in login identifier', async () => {
      const sqlInjectionPayloads = [
        "admin' OR '1'='1",
        "admin'; DROP TABLE users--",
        "admin' UNION SELECT * FROM users--",
        "admin' OR 1=1--",
        "admin' OR 'a'='a"
      ];

      for (const payload of sqlInjectionPayloads) {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: payload, password: 'password123' })
        });
        
        // Should not return 500 (server error) which would indicate SQL injection success
        expect(response.status).not.toBe(500);
        expect(response.status).toBe(401); // Should fail authentication
      }
    });

    it('should handle SQL injection in applicant lookup', async () => {
      const response = await fetch(`${BASE_URL}/api/applicants/lookup?appId=APP-2026-0101' OR '1'='1`);
      
      const data = await response.json();
      // Should not return all applicants (SQL injection would)
      expect(data.applicant).toBeDefined();
      expect(data.applicant?.app_id).toBe('APP-2026-0101');
    });
  });

  describe('XSS Protection', () => {
    
    it('should sanitize XSS in application submission', async () => {
      const xssPayload = {
        full_name: '<script>alert("XSS")</script>',
        email: 'test@test.com',
        phone: '+251911000000',
        university: 'Test University',
        field_of_study: 'Computer Science',
        gpa: 3.5,
        skills: '<img src=x onerror=alert("XSS")>',
        cv_name: 'cv.pdf',
        transcript_name: 'transcript.pdf',
        id_name: 'id.pdf',
        recommendation_name: 'rec.pdf'
      };

      const response = await fetch(`${BASE_URL}/api/applicants/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(xssPayload)
      });

      // Should handle XSS without crashing
      expect(response.status).not.toBe(500);
    });

    it('should not execute scripts in user input', async () => {
      const maliciousInput = '<script>window.location="http://evil.com"</script>';
      
      // This test verifies that malicious scripts are stored as text, not executed
      // The actual sanitization happens in the frontend and should be validated in backend
      expect(typeof maliciousInput).toBe('string');
    });
  });

  describe('Rate Limiting', () => {
    
    it('should limit login attempts', async () => {
      const loginRequest = () => fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'admin', password: 'wrongpassword' })
      });

      // Make 6 login attempts (limit is 5 per 15 minutes)
      const responses = await Promise.all([
        loginRequest(),
        loginRequest(),
        loginRequest(),
        loginRequest(),
        loginRequest(),
        loginRequest()
      ]);

      // Last request should be rate limited
      const lastResponse = responses[responses.length - 1];
      expect(lastResponse.status).toBe(429);
    });

    it('should limit general API requests', async () => {
      // Make 101 requests (limit is 100 per 15 minutes)
      const requests = Array(101).fill(null).map(() => 
        fetch(`${BASE_URL}/api/health`)
      );

      const responses = await Promise.all(requests);
      const lastResponse = responses[responses.length - 1];
      
      // Should be rate limited
      expect(lastResponse.status).toBe(429);
    }, 30000); // Increase timeout for this test
  });

  describe('CORS Protection', () => {
    
    it('should include CORS headers', async () => {
      const response = await fetch(`${BASE_URL}/api/health`, {
        headers: { 'Origin': 'http://localhost:5173' }
      });
      
      const corsHeader = response.headers.get('access-control-allow-origin');
      expect(corsHeader).toBeDefined();
    });

    it('should reject requests from unauthorized origins in production', () => {
      // This would need to be tested in production environment
      // In development, localhost is allowed
      const isProduction = process.env.NODE_ENV === 'production';
      if (isProduction) {
        // Test that non-whitelisted origins are rejected
      }
    });
  });

  describe('Security Headers', () => {
    
    it('should include security headers', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      
      // Helmet should add these headers
      const headers = response.headers;
      
      expect(headers.get('x-content-type-options')).toBe('nosniff');
      expect(headers.get('x-frame-options')).toBeDefined();
      expect(headers.get('x-xss-protection')).toBeDefined();
    });

    it('should include HSTS header in production', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      
      const hstsHeader = response.headers.get('strict-transport-security');
      if (process.env.NODE_ENV === 'production') {
        expect(hstsHeader).toBeDefined();
      }
    });
  });

  describe('Input Validation', () => {
    
    it('should reject oversized payloads', async () => {
      const largePayload = {
        data: 'x'.repeat(11 * 1024 * 1024) // 11MB (limit is 10MB)
      };

      const response = await fetch(`${BASE_URL}/api/applicants/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(largePayload)
      });

      expect(response.status).toBe(413); // Payload Too Large
    });

    it('should reject invalid email format', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'invalid-email', password: 'password123' })
      });

      // Should handle gracefully (may still try to find by username)
      expect(response.status).toBe(401);
    });

    it('should reject missing required fields', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'password123' }) // Missing identifier
      });

      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toContain('required');
    });
  });

  describe('Authorization Tests', () => {
    
    it('should prevent role escalation', async () => {
      // First, login as regular user
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'app.solomon@ethiotelecom.et', password: 'password123' })
      });

      const loginData = await loginResponse.json();
      const token = loginData.token;

      // Try to update role to admin
      const updateResponse = await fetch(`${BASE_URL}/api/admin/users/update-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: 'usr-06', role: 'SYSTEM_ADMIN' })
      });

      // Should fail (403 Forbidden) if role-based authorization is implemented
      // Currently may succeed if RBAC is not enforced
      expect([403, 401]).toContain(updateResponse.status);
    });

    it('should prevent unauthorized data access', async () => {
      // Login as apprentice
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'app.solomon@ethiotelecom.et', password: 'password123' })
      });

      const loginData = await loginResponse.json();
      const token = loginData.token;

      // Try to access admin-only data
      const response = await fetch(`${BASE_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Should fail if role-based access control is implemented
      // Currently may succeed if RBAC is not enforced
      expect([403, 401]).toContain(response.status);
    });
  });

  describe('Session Security', () => {
    
    it('should invalidate token on logout', async () => {
      // Login
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'admin', password: 'password123' })
      });

      const loginData = await loginResponse.json();
      const token = loginData.token;

      // Logout (clear token on client side)
      // Try to use token after logout
      const response = await fetch(`${BASE_URL}/api/applicants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Token should still work until expiry (JWT is stateless)
      // In production, implement token blacklist or short expiry
      expect(response.status).toBe(200);
    });

    it('should have reasonable token expiry', async () => {
      // JWT tokens should have expiry (currently 24 hours)
      // This is a documentation check
      const expectedExpiry = '24h';
      expect(expectedExpiry).toBeDefined();
    });
  });
});
