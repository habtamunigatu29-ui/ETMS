// src/types.ts

export type UserRole = 
  | 'SYSTEM_ADMIN' 
  | 'HR_MANAGER' 
  | 'DEPARTMENT_HEAD' 
  | 'MENTOR' 
  | 'APPRENTICE' 
  | 'REPORTING_OFFICER';

export type ApplicationStatus = 
  | 'DRAFT'
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

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'REJECTED';

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
  app_id: string;
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
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  applicant_id: string;
  applicant?: Applicant;
  batch_id?: string;
  status: ApplicationStatus;
  department_id?: string;
  department_name?: string;
  mentor_id?: string;
  mentor_name?: string;
  screening_score?: number;
  screening_breakdown?: {
    gpaScore: number;
    fieldScore: number;
    universityScore: number;
    skillsScore: number;
    recommendationScore: number;
    cvScore: number;
  };
  screening_notes?: string;
  rejection_reason?: string;
  approved_by?: string;
  approved_by_name?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  max_apprentices: number;
  current_apprentices: number;
  head_name?: string;
  head_id?: string;
  location?: string;
  required_skills: string[];
  is_active: boolean;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description?: string;
  department_id: string;
  duration_weeks: number;
  max_students: number;
  enrolled_students: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface AttendanceRecord {
  id: string;
  apprentice_id: string;
  apprentice_name: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  check_in_method?: string;
  location_lat?: number;
  location_lng?: number;
  location_name?: string;
  status: AttendanceStatus;
  notes?: string;
  created_at: string;
}

export interface ApprenticeTask {
  id: string;
  apprentice_id: string;
  apprentice_name: string;
  mentor_id: string;
  mentor_name: string;
  title: string;
  description?: string;
  due_date: string;
  status: TaskStatus;
  evidence_notes?: string;
  evidence_filename?: string;
  submission_date?: string;
  verification_date?: string;
  created_at: string;
}

export interface Evaluation {
  id: string;
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
  overall_score: number;
  attendance_percentage?: number;
  passed: boolean;
  comments?: string;
  evaluated_at: string;
  created_at: string;
}

export interface Certificate {
  id: string;
  apprentice_id: string;
  apprentice_name: string;
  cert_number: string;
  issue_date: string;
  department_id?: string;
  department_name?: string;
  qr_code?: string;
  issued_by?: string;
  issued_by_name?: string;
  verification_url?: string;
  overall_score: number;
  attendance_rate: number;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  recipient_id: string;
  recipient_name: string;
  type: string;
  subject: string;
  message: string;
  sent_at: string;
  is_read: boolean;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
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