/**
 * Ethio Telecom Apprenticeship Management System (ET-AMS)
 * Data Models & Types Specification
 */

export type UserRole = 
  | 'SYSTEM_ADMIN'
  | 'HR_MANAGER'
  | 'DEPARTMENT_HEAD'
  | 'MENTOR'
  | 'APPRENTICE'
  | 'REPORTING_OFFICER';

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PENDING_SCREENING'
  | 'UNDER_SCREENING'
  | 'SCREENED'
  | 'REQUESTS_ADDITIONAL_INFO'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'WAITLISTED'
  | 'ASSIGNED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'DROPPED_OUT';

export type CheckInMethod = 'BIOMETRIC' | 'QR_CODE' | 'GPS_MOBILE';

export type AttendanceStatus = 'present' | 'late' | 'absent';

export type EvaluationType = 'mid_term' | 'final';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';

export type NotificationType = 'SMS' | 'EMAIL' | 'IN_APP';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  department_id?: string;
  department_name?: string;
  phone: string;
  password_hash?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Applicant {
  id: string;
  app_id: string; // e.g. APP-2026-0101
  full_name: string;
  email: string;
  phone: string;
  university: string;
  field_of_study: string;
  gpa: number;
  skills: string[];
  cv_path?: string;
  cv_filename?: string;
  transcript_path?: string;
  id_card_path?: string;
  recommendation_path?: string;
  password_hash?: string;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  applicant_id: string;
  applicant?: Applicant;
  batch_id: string;
  department_id?: string;
  department_name?: string;
  screening_score?: number; // 0-100
  screening_breakdown?: {
    gpaScore: number;         // Max 30
    fieldScore: number;       // Max 20
    universityScore: number;  // Max 15
    skillsScore: number;      // Max 15
    recommendationScore: number; // Max 10
    cvScore: number;          // Max 10
  };
  screening_notes?: string;
  approved_by?: string; // User ID
  approved_by_name?: string;
  approved_at?: string; // Timestamp
  rejection_reason?: string;
  mentor_id?: string;
  mentor_name?: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  max_apprentices: number;
  current_apprentices: number;
  head_id?: string;
  head_name?: string;
  location: string;
  is_active: boolean;
  required_skills: string[];
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  department_id: string;
  department_name?: string;
  duration_weeks: number;
  instructor_id?: string;
  instructor_name?: string;
  max_students: number;
  enrolled_students: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface AttendanceRecord {
  id: string;
  apprentice_id: string; // User or Applicant ID
  apprentice_name: string;
  check_in_time: string;
  check_out_time?: string;
  check_in_method: CheckInMethod;
  location_lat: number;
  location_lng: number;
  location_name?: string;
  status: AttendanceStatus;
  notes?: string;
  verified_by?: string;
  date: string; // YYYY-MM-DD
  created_at: string;
}

export interface Evaluation {
  id: string;
  apprentice_id: string;
  apprentice_name: string;
  evaluator_id: string;
  evaluator_name: string;
  evaluation_type: EvaluationType;
  technical_score: number;      // 1-10 (30% weight)
  communication_score: number;   // 1-10 (20% weight)
  punctuality_score: number;    // 1-10 (20% weight)
  teamwork_score: number;       // 1-10 (15% weight)
  problem_solving_score: number;// 1-10 (15% weight)
  overall_score: number;         // Calculated weighted average out of 10
  attendance_percentage?: number;
  passed: boolean;
  comments: string;
  evaluated_at: string;
  created_at: string;
}

export interface Certificate {
  id: string;
  cert_number: string; // e.g. ET-CERT-2026-8841
  apprentice_id: string;
  apprentice_name: string;
  issue_date: string;
  expiry_date?: string;
  department_id: string;
  department_name: string;
  qr_code: string;
  issued_by: string;
  issued_by_name: string;
  verification_url: string;
  overall_score: number;
  attendance_rate: number;
  created_at: string;
}

export interface ApprenticeTask {
  id: string;
  apprentice_id: string;
  apprentice_name: string;
  mentor_id: string;
  mentor_name: string;
  title: string;
  description: string;
  due_date: string;
  status: TaskStatus;
  evidence_notes?: string;
  evidence_filename?: string;
  submission_date?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id?: string;
  recipient: string; // email or phone or username
  recipient_name?: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  sent_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  action: string;
  target_type: string;
  target_id: string;
  details: string;
  timestamp: string;
}

export interface ScreeningCriteriaConfig {
  min_gpa: number;
  passing_score: number;
  gpa_weight: number;
  field_weight: number;
  university_weight: number;
  skills_weight: number;
  recommendation_weight: number;
  cv_weight: number;
}
