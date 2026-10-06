// src/data/mockData.ts

import { 
  Applicant, 
  Application, 
  Department, 
  Course, 
  AttendanceRecord, 
  ApprenticeTask, 
  Evaluation, 
  Certificate, 
  User, 
  NotificationItem, 
  AuditLog, 
  ScreeningCriteriaConfig 
} from '../types';

// ============================================
// DEPARTMENT DATA
// ============================================
export const initialDepartments: Department[] = [
  {
    id: 'dept-001',
    name: 'Information Technology (IT) & Cloud Systems',
    code: 'IT',
    description: 'Manages enterprise software infrastructure, cloud databases, billing OSS/BSS, IT operations, and internal web applications.',
    max_apprentices: 25,
    current_apprentices: 18,
    head_name: 'Dr. Getachew Bekele',
    location: 'Ethio Telecom HQ, Bole, Addis Ababa',
    required_skills: ['React', 'Node.js', 'Cloud', 'DevOps'],
    is_active: true,
    created_at: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'dept-002',
    name: 'Network Infrastructure & 5G Engineering',
    code: 'NET',
    description: 'Manages fiber optic networks, 5G base stations, microwave links, core network elements, and network monitoring systems.',
    max_apprentices: 30,
    current_apprentices: 22,
    head_name: 'Eng. Solomon Tadesse',
    location: 'Network Operations Center, Addis Ababa',
    required_skills: ['5G', 'Fiber Optics', 'Networking', 'Cisco'],
    is_active: true,
    created_at: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'dept-003',
    name: 'Digital Financial Services (Telebirr)',
    code: 'FIN',
    description: 'Manages mobile money platform, payment gateway integrations, fintech APIs, and digital wallet systems.',
    max_apprentices: 20,
    current_apprentices: 15,
    head_name: 'Wro. Tigist Assefa',
    location: 'Telebirr HQ, Bole, Addis Ababa',
    required_skills: ['Fintech', 'APIs', 'Security', 'Mobile'],
    is_active: true,
    created_at: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'dept-004',
    name: 'Customer Service & Support',
    code: 'CS',
    description: 'Manages call center operations, customer relationship management, support ticket systems, and service quality monitoring.',
    max_apprentices: 35,
    current_apprentices: 28,
    head_name: 'Ato. Kifle Demissie',
    location: 'Customer Service Center, Bole, Addis Ababa',
    required_skills: ['CRM', 'Communication', 'Support', 'Analytics'],
    is_active: true,
    created_at: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'dept-005',
    name: 'Enterprise Business Solutions',
    code: 'EBS',
    description: 'Manages corporate client solutions, B2B services, enterprise connectivity, and business process automation.',
    max_apprentices: 15,
    current_apprentices: 12,
    head_name: 'Drs. Almaz Haile',
    location: 'Business Center, Kazanchis, Addis Ababa',
    required_skills: ['B2B', 'Enterprise', 'Sales', 'Solutions'],
    is_active: true,
    created_at: '2026-01-01T08:00:00.000Z'
  }
];

// ============================================
// USER DATA - ALL DEMO USERS
// ============================================
export const initialUsers: User[] = [
  {
    id: 'usr-001',
    username: 'admin',
    email: 'admin@ethiotelecom.et',
    full_name: 'Abebe Bikila (Admin)',
    role: 'SYSTEM_ADMIN',
    phone: '+251911223344',
    password_hash: '$2b$10$X7O9Z8Y6W5V4U3T2S1R0Qe9i8o7p6l5k4j3h2g1f0d9c8b7a6',
    is_active: true,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'usr-002',
    username: 'hrmanager',
    email: 'hr.manager@ethiotelecom.et',
    full_name: 'Bethlehem Tilahun (HR Director)',
    role: 'HR_MANAGER',
    phone: '+251911556677',
    password_hash: '$2b$10$X7O9Z8Y6W5V4U3T2S1R0Qe9i8o7p6l5k4j3h2g1f0d9c8b7a6',
    is_active: true,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'usr-003',
    username: 'depthead_it',
    email: 'dept.it@ethiotelecom.et',
    full_name: 'Dr. Getachew Bekele',
    role: 'DEPARTMENT_HEAD',
    department_id: 'dept-001',
    department_name: 'Information Technology (IT) & Cloud Systems',
    phone: '+251911889900',
    password_hash: '$2b$10$X7O9Z8Y6W5V4U3T2S1R0Qe9i8o7p6l5k4j3h2g1f0d9c8b7a6',
    is_active: true,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'usr-004',
    username: 'depthead_net',
    email: 'dept.network@ethiotelecom.et',
    full_name: 'Eng. Solomon Tadesse',
    role: 'DEPARTMENT_HEAD',
    department_id: 'dept-002',
    department_name: 'Network Infrastructure & 5G Engineering',
    phone: '+251912112233',
    password_hash: '$2b$10$X7O9Z8Y6W5V4U3T2S1R0Qe9i8o7p6l5k4j3h2g1f0d9c8b7a6',
    is_active: true,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'usr-005',
    username: 'mentor_kebede',
    email: 'mentor.kebede@ethiotelecom.et',
    full_name: 'Eng. Kebede Kassahun',
    role: 'MENTOR',
    department_id: 'dept-001',
    department_name: 'Information Technology (IT) & Cloud Systems',
    phone: '+251913334455',
    password_hash: '$2b$10$X7O9Z8Y6W5V4U3T2S1R0Qe9i8o7p6l5k4j3h2g1f0d9c8b7a6',
    is_active: true,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'usr-006',
    username: 'apprentice_solomon',
    email: 'app.solomon@ethiotelecom.et',
    full_name: 'Solomon Worku Kassa',
    role: 'APPRENTICE',
    department_id: 'dept-001',
    department_name: 'Information Technology (IT) & Cloud Systems',
    phone: '+251914445566',
    password_hash: '$2b$10$X7O9Z8Y6W5V4U3T2S1R0Qe9i8o7p6l5k4j3h2g1f0d9c8b7a6',
    is_active: true,
    created_at: '2026-01-15T08:00:00.000Z',
    updated_at: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'usr-007',
    username: 'reporting_officer',
    email: 'reports@ethiotelecom.et',
    full_name: 'Meron Tsegaye',
    role: 'REPORTING_OFFICER',
    phone: '+251915556677',
    password_hash: '$2b$10$X7O9Z8Y6W5V4U3T2S1R0Qe9i8o7p6l5k4j3h2g1f0d9c8b7a6',
    is_active: true,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'usr-008',
    username: 'habte',
    email: 'habte@ethiotelecom.et',
    full_name: 'Habte Gebremariam',
    role: 'APPRENTICE',
    department_id: 'dept-001',
    department_name: 'Information Technology (IT) & Cloud Systems',
    phone: '+251916667788',
    password_hash: '$2b$10$X7O9Z8Y6W5V4U3T2S1R0Qe9i8o7p6l5k4j3h2g1f0d9c8b7a6',
    is_active: true,
    created_at: '2026-01-25T08:00:00.000Z',
    updated_at: '2026-01-25T08:00:00.000Z'
  },
  {
    id: 'usr-009',
    username: 'apprentice_hiwot',
    email: 'hiwot.alemu@ethiotelecom.et',
    full_name: 'Hiwot Alemu Desta',
    role: 'APPRENTICE',
    department_id: 'dept-002',
    department_name: 'Network Infrastructure & 5G Engineering',
    phone: '+251917778899',
    password_hash: '$2b$10$X7O9Z8Y6W5V4U3T2S1R0Qe9i8o7p6l5k4j3h2g1f0d9c8b7a6',
    is_active: true,
    created_at: '2026-01-20T08:00:00.000Z',
    updated_at: '2026-01-20T08:00:00.000Z'
  },
  {
    id: 'usr-010',
    username: 'depthead_fin',
    email: 'dept.fin@ethiotelecom.et',
    full_name: 'Wro. Tigist Assefa',
    role: 'DEPARTMENT_HEAD',
    department_id: 'dept-003',
    department_name: 'Digital Financial Services (Telebirr)',
    phone: '+251918889900',
    password_hash: '$2b$10$X7O9Z8Y6W5V4U3T2S1R0Qe9i8o7p6l5k4j3h2g1f0d9c8b7a6',
    is_active: true,
    created_at: '2026-01-01T08:00:00.000Z',
    updated_at: '2026-01-01T08:00:00.000Z'
  }
];

// ============================================
// APPLICANT DATA - REMOVED DUPLICATE SOLOMON
// ============================================
export const initialApplicants: Applicant[] = [
  {
    id: 'app-001',
    app_id: 'APP-2026-0101',
    full_name: 'Solomon Worku Kassa',
    email: 'app.solomon@ethiotelecom.et',
    phone: '+251914445566',
    university: 'Addis Ababa University (AAiT)',
    field_of_study: 'Software Engineering',
    gpa: 3.75,
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    cv_path: '/uploads/solomon_cv.pdf',
    cv_filename: 'Solomon_Worku_CV.pdf',
    transcript_path: '/uploads/solomon_transcript.pdf',
    id_card_path: '/uploads/solomon_id.jpg',
    recommendation_path: '/uploads/solomon_rec.pdf',
    status: 'ACTIVE',
    applied_at: '2026-01-15T08:00:00.000Z',
    updated_at: '2026-01-20T08:00:00.000Z'
  },
  {
    id: 'app-002',
    app_id: 'APP-2026-0102',
    full_name: 'Hiwot Alemu Desta',
    email: 'hiwot.alemu@ethiotelecom.et',
    phone: '+251912223344',
    university: 'Addis Ababa University (AAiT)',
    field_of_study: 'Electrical & Computer Engineering',
    gpa: 3.68,
    skills: ['5G', 'RF Engineering', 'Network Simulation', 'Python'],
    cv_path: '/uploads/hiwot_cv.pdf',
    cv_filename: 'Hiwot_Alemu_CV.pdf',
    transcript_path: '/uploads/hiwot_transcript.pdf',
    id_card_path: '/uploads/hiwot_id.jpg',
    recommendation_path: '/uploads/hiwot_rec.pdf',
    status: 'SCREENED',
    applied_at: '2026-01-16T08:00:00.000Z',
    updated_at: '2026-01-22T08:00:00.000Z'
  },
  {
    id: 'app-003',
    app_id: 'APP-2026-0103',
    full_name: 'Abel Tesfaye Hailu',
    email: 'abel.tesfaye@ethiotelecom.et',
    phone: '+251913334455',
    university: 'Addis Ababa Science & Technology University (ASTU)',
    field_of_study: 'Information Systems',
    gpa: 3.45,
    skills: ['Fintech', 'Java', 'Spring Boot', 'MySQL'],
    cv_path: '/uploads/abel_cv.pdf',
    cv_filename: 'Abel_Tesfaye_CV.pdf',
    transcript_path: '/uploads/abel_transcript.pdf',
    id_card_path: '/uploads/abel_id.jpg',
    recommendation_path: '/uploads/abel_rec.pdf',
    status: 'PENDING_SCREENING',
    applied_at: '2026-01-18T08:00:00.000Z',
    updated_at: '2026-01-18T08:00:00.000Z'
  },
  {
    id: 'app-004',
    app_id: 'APP-2026-0104',
    full_name: 'Habte Gebremariam',
    email: 'habte@ethiotelecom.et',
    phone: '+251916667788',
    university: 'Addis Ababa University (AAiT)',
    field_of_study: 'Computer Science',
    gpa: 3.55,
    skills: ['Python', 'Django', 'PostgreSQL', 'Linux'],
    cv_path: '/uploads/habte_cv.pdf',
    cv_filename: 'Habte_Gebremariam_CV.pdf',
    transcript_path: '/uploads/habte_transcript.pdf',
    id_card_path: '/uploads/habte_id.jpg',
    recommendation_path: '/uploads/habte_rec.pdf',
    status: 'ACTIVE',
    applied_at: '2026-01-25T08:00:00.000Z',
    updated_at: '2026-01-25T08:00:00.000Z'
  }
];

// ============================================
// APPLICATION DATA
// ============================================
export const initialApplications: Application[] = [
  {
    id: 'apln-001',
    applicant_id: 'app-001',
    batch_id: 'BATCH-2026-Q3',
    status: 'ACTIVE',
    department_id: 'dept-001',
    department_name: 'Information Technology (IT) & Cloud Systems',
    mentor_id: 'usr-005',
    mentor_name: 'Eng. Kebede Kassahun',
    screening_score: 85,
    screening_breakdown: {
      gpaScore: 28,
      fieldScore: 20,
      universityScore: 15,
      skillsScore: 12,
      recommendationScore: 5,
      cvScore: 5
    },
    screening_notes: 'Excellent candidate with strong software engineering background.',
    approved_at: '2026-01-22T08:00:00.000Z',
    created_at: '2026-01-15T08:00:00.000Z',
    updated_at: '2026-01-23T08:00:00.000Z'
  },
  {
    id: 'apln-002',
    applicant_id: 'app-002',
    batch_id: 'BATCH-2026-Q3',
    status: 'SCREENED',
    screening_score: 78,
    screening_breakdown: {
      gpaScore: 27,
      fieldScore: 20,
      universityScore: 15,
      skillsScore: 8,
      recommendationScore: 4,
      cvScore: 4
    },
    screening_notes: 'Strong candidate in telecommunications and network engineering.',
    created_at: '2026-01-16T08:00:00.000Z',
    updated_at: '2026-01-22T08:00:00.000Z'
  },
  {
    id: 'apln-003',
    applicant_id: 'app-003',
    batch_id: 'BATCH-2026-Q3',
    status: 'PENDING_SCREENING',
    created_at: '2026-01-18T08:00:00.000Z',
    updated_at: '2026-01-18T08:00:00.000Z'
  },
  {
    id: 'apln-004',
    applicant_id: 'app-004',
    batch_id: 'BATCH-2026-Q3',
    status: 'ACTIVE',
    department_id: 'dept-001',
    department_name: 'Information Technology (IT) & Cloud Systems',
    mentor_id: 'usr-005',
    mentor_name: 'Eng. Kebede Kassahun',
    screening_score: 82,
    screening_breakdown: {
      gpaScore: 26,
      fieldScore: 20,
      universityScore: 15,
      skillsScore: 11,
      recommendationScore: 5,
      cvScore: 5
    },
    screening_notes: 'Strong candidate with excellent programming skills.',
    approved_at: '2026-01-26T08:00:00.000Z',
    created_at: '2026-01-25T08:00:00.000Z',
    updated_at: '2026-01-26T08:00:00.000Z'
  }
];

// ============================================
// COURSE DATA
// ============================================
export const initialCourses: Course[] = [
  {
    id: 'crs-001',
    title: 'Cloud Infrastructure & DevOps',
    code: 'CLD-101',
    description: 'Learn cloud computing, containerization, and CI/CD pipelines.',
    department_id: 'dept-001',
    duration_weeks: 8,
    max_students: 25,
    enrolled_students: 18,
    start_date: '2026-02-01T08:00:00.000Z',
    end_date: '2026-03-26T08:00:00.000Z',
    is_active: true
  },
  {
    id: 'crs-002',
    title: '5G Network Engineering',
    code: '5G-101',
    description: 'Hands-on training with 5G core network elements and radio access.',
    department_id: 'dept-002',
    duration_weeks: 10,
    max_students: 30,
    enrolled_students: 22,
    start_date: '2026-02-01T08:00:00.000Z',
    end_date: '2026-04-11T08:00:00.000Z',
    is_active: true
  },
  {
    id: 'crs-003',
    title: 'Telebirr API Development',
    code: 'FIN-101',
    description: 'Learn fintech API integration, payment gateway development, and digital wallet systems.',
    department_id: 'dept-003',
    duration_weeks: 6,
    max_students: 20,
    enrolled_students: 15,
    start_date: '2026-02-15T08:00:00.000Z',
    end_date: '2026-03-29T08:00:00.000Z',
    is_active: true
  }
];

// ============================================
// ATTENDANCE DATA
// ============================================
export const initialAttendance: AttendanceRecord[] = [
  {
    id: 'att-001',
    apprentice_id: 'app-001',
    apprentice_name: 'Solomon Worku Kassa',
    date: '2026-01-24',
    check_in_time: '2026-01-24T08:15:00.000Z',
    check_in_method: 'BIOMETRIC',
    location_lat: 9.0108,
    location_lng: 38.7612,
    location_name: 'Ethio Telecom HQ Campus',
    status: 'present',
    notes: 'Checked in on time.',
    created_at: '2026-01-24T08:15:00.000Z'
  },
  {
    id: 'att-002',
    apprentice_id: 'app-001',
    apprentice_name: 'Solomon Worku Kassa',
    date: '2026-01-25',
    check_in_time: '2026-01-25T08:45:00.000Z',
    check_in_method: 'BIOMETRIC',
    location_lat: 9.0108,
    location_lng: 38.7612,
    location_name: 'Ethio Telecom HQ Campus',
    status: 'late',
    notes: 'Checked in late - traffic delay.',
    created_at: '2026-01-25T08:45:00.000Z'
  },
  {
    id: 'att-003',
    apprentice_id: 'app-004',
    apprentice_name: 'Habte Gebremariam',
    date: '2026-01-26',
    check_in_time: '2026-01-26T08:10:00.000Z',
    check_in_method: 'BIOMETRIC',
    location_lat: 9.0108,
    location_lng: 38.7612,
    location_name: 'Ethio Telecom HQ Campus',
    status: 'present',
    notes: 'Checked in on time.',
    created_at: '2026-01-26T08:10:00.000Z'
  }
];

// ============================================
// TASK DATA
// ============================================
export const initialTasks: ApprenticeTask[] = [
  {
    id: 'tsk-001',
    apprentice_id: 'app-001',
    apprentice_name: 'Solomon Worku Kassa',
    mentor_id: 'usr-005',
    mentor_name: 'Eng. Kebede Kassahun',
    title: 'Onboarding & Orientation for Information Technology (IT) & Cloud Systems',
    description: 'Review Ethio Telecom security protocols, sign IT access guidelines, and set up your workstations.',
    due_date: '2026-01-31',
    status: 'PENDING',
    created_at: '2026-01-23T08:00:00.000Z'
  },
  {
    id: 'tsk-002',
    apprentice_id: 'app-004',
    apprentice_name: 'Habte Gebremariam',
    mentor_id: 'usr-005',
    mentor_name: 'Eng. Kebede Kassahun',
    title: 'Onboarding & Orientation for Information Technology (IT) & Cloud Systems',
    description: 'Review Ethio Telecom security protocols, sign IT access guidelines, and set up your workstations.',
    due_date: '2026-02-02',
    status: 'PENDING',
    created_at: '2026-01-26T08:00:00.000Z'
  },
  {
    id: 'tsk-003',
    apprentice_id: 'app-001',
    apprentice_name: 'Solomon Worku Kassa',
    mentor_id: 'usr-005',
    mentor_name: 'Eng. Kebede Kassahun',
    title: 'Cloud Infrastructure Setup',
    description: 'Set up a basic cloud infrastructure using AWS or GCP with Terraform.',
    due_date: '2026-02-15',
    status: 'PENDING',
    created_at: '2026-01-25T08:00:00.000Z'
  }
];

// ============================================
// EVALUATION DATA
// ============================================
export const initialEvaluations: Evaluation[] = [
  {
    id: 'eval-001',
    apprentice_id: 'app-001',
    apprentice_name: 'Solomon Worku Kassa',
    evaluator_id: 'usr-005',
    evaluator_name: 'Eng. Kebede Kassahun',
    evaluation_type: 'mid_term',
    technical_score: 8,
    communication_score: 7,
    punctuality_score: 9,
    teamwork_score: 8,
    problem_solving_score: 7,
    overall_score: 7.85,
    attendance_percentage: 95.0,
    passed: true,
    comments: 'Solomon is performing well. Shows strong technical skills and good communication.',
    evaluated_at: '2026-02-01T08:00:00.000Z',
    created_at: '2026-02-01T08:00:00.000Z'
  }
];

// ============================================
// CERTIFICATE DATA
// ============================================
export const initialCertificates: Certificate[] = [];

// ============================================
// NOTIFICATION DATA - FIXED to use 'recipient' (matches your types.ts)
// ============================================
export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-001',
    recipient: 'usr-006',
    recipient_name: 'Solomon Worku Kassa',
    type: 'EMAIL',
    title: 'Welcome to Ethio Telecom Apprenticeship',
    message: 'Dear Solomon, welcome to the Ethio Telecom Apprenticeship Program!',
    sent_at: '2026-01-23T08:00:00.000Z',
    is_read: false
  },
  {
    id: 'notif-002',
    recipient: 'usr-008',
    recipient_name: 'Habte Gebremariam',
    type: 'EMAIL',
    title: 'Welcome to Ethio Telecom Apprenticeship',
    message: 'Dear Habte, welcome to the Ethio Telecom Apprenticeship Program!',
    sent_at: '2026-01-26T08:00:00.000Z',
    is_read: false
  },
  {
    id: 'notif-003',
    recipient: 'usr-009',
    recipient_name: 'Hiwot Alemu Desta',
    type: 'EMAIL',
    title: 'Welcome to Ethio Telecom Apprenticeship',
    message: 'Dear Hiwot, welcome to the Ethio Telecom Apprenticeship Program!',
    sent_at: '2026-01-20T08:00:00.000Z',
    is_read: false
  }
];

// ============================================
// AUDIT LOG DATA
// ============================================
export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    user_id: 'usr-001',
    user_name: 'Abebe Bikila (Admin)',
    user_role: 'SYSTEM_ADMIN',
    action: 'USER_LOGIN',
    target_type: 'User',
    target_id: 'usr-001',
    details: 'Admin user logged in successfully',
    timestamp: '2026-01-23T08:00:00.000Z'
  },
  {
    id: 'log-002',
    user_id: 'usr-001',
    user_name: 'Abebe Bikila (Admin)',
    user_role: 'SYSTEM_ADMIN',
    action: 'CREATE_USER',
    target_type: 'User',
    target_id: 'usr-008',
    details: 'Created user Habte Gebremariam (habte@ethiotelecom.et) with role APPRENTICE',
    timestamp: '2026-01-25T08:00:00.000Z'
  },
  {
    id: 'log-003',
    user_id: 'usr-001',
    user_name: 'Abebe Bikila (Admin)',
    user_role: 'SYSTEM_ADMIN',
    action: 'CREATE_USER',
    target_type: 'User',
    target_id: 'usr-009',
    details: 'Created user Hiwot Alemu Desta (hiwot.alemu@ethiotelecom.et) with role APPRENTICE',
    timestamp: '2026-01-20T08:00:00.000Z'
  }
];

// ============================================
// SCREENING CRITERIA
// ============================================
export const initialScreeningCriteria: ScreeningCriteriaConfig = {
  min_gpa: 3.0,
  passing_score: 60,
  gpa_weight: 30,
  field_weight: 20,
  university_weight: 15,
  skills_weight: 15,
  recommendation_weight: 10,
  cv_weight: 10
};