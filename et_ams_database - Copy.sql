-- Ethio Telecom Apprenticeship Management System Database Schema
-- Generated from Prisma schema for MySQL 8.0
-- Import this file into MySQL Workbench 8.0 UE

-- Create database
CREATE DATABASE IF NOT EXISTS et_ams CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE et_ams;

-- Drop tables if they exist (for clean import)
DROP TABLE IF EXISTS `AuditLog`;
DROP TABLE IF EXISTS `NotificationItem`;
DROP TABLE IF EXISTS `Certificate`;
DROP TABLE IF EXISTS `Evaluation`;
DROP TABLE IF EXISTS `ApprenticeTask`;
DROP TABLE IF EXISTS `AttendanceRecord`;
DROP TABLE IF EXISTS `Course`;
DROP TABLE IF EXISTS `Application`;
DROP TABLE IF EXISTS `Applicant`;
DROP TABLE IF EXISTS `Department`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `ScreeningCriteriaConfig`;

-- Create User table
CREATE TABLE `User` (
  `id` VARCHAR(36) NOT NULL,
  `username` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `full_name` VARCHAR(191) NOT NULL,
  `role` VARCHAR(191) NOT NULL,
  `department_id` VARCHAR(36) NULL,
  `department_name` VARCHAR(191) NULL,
  `phone` VARCHAR(191) NOT NULL,
  `password_hash` VARCHAR(191) NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `last_login` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `User_email_key` (`email`),
  UNIQUE INDEX `User_username_key` (`username`),
  INDEX `User_email_idx` (`email`),
  INDEX `User_username_idx` (`username`),
  INDEX `User_role_idx` (`role`),
  INDEX `User_department_id_idx` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Applicant table
CREATE TABLE `Applicant` (
  `id` VARCHAR(36) NOT NULL,
  `app_id` VARCHAR(191) NOT NULL,
  `full_name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `university` VARCHAR(191) NOT NULL,
  `field_of_study` VARCHAR(191) NOT NULL,
  `gpa` DOUBLE NOT NULL,
  `skills` VARCHAR(191) NOT NULL,
  `cv_name` VARCHAR(191) NULL,
  `transcript_name` VARCHAR(191) NULL,
  `id_name` VARCHAR(191) NULL,
  `recommendation_name` VARCHAR(191) NULL,
  `password_hash` VARCHAR(191) NULL,
  `applied_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING_SCREENING',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Applicant_app_id_key` (`app_id`),
  UNIQUE INDEX `Applicant_email_key` (`email`),
  INDEX `Applicant_app_id_idx` (`app_id`),
  INDEX `Applicant_email_idx` (`email`),
  INDEX `Applicant_status_idx` (`status`),
  INDEX `Applicant_university_idx` (`university`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Department table
CREATE TABLE `Department` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NOT NULL,
  `max_apprentices` INT NOT NULL,
  `current_apprentices` INT NOT NULL DEFAULT 0,
  `head_id` VARCHAR(36) NULL,
  `head_name` VARCHAR(191) NULL,
  `location` VARCHAR(191) NOT NULL,
  `required_skills` VARCHAR(191) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Department_code_key` (`code`),
  INDEX `Department_code_idx` (`code`),
  INDEX `Department_head_id_idx` (`head_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Application table
CREATE TABLE `Application` (
  `id` VARCHAR(36) NOT NULL,
  `applicant_id` VARCHAR(36) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
  `department_id` VARCHAR(36) NULL,
  `department_name` VARCHAR(191) NULL,
  `mentor_id` VARCHAR(36) NULL,
  `mentor_name` VARCHAR(191) NULL,
  `screening_score` DOUBLE NULL,
  `screening_notes` VARCHAR(191) NULL,
  `rejection_reason` VARCHAR(191) NULL,
  `submitted_at` DATETIME(3) NULL,
  `screened_at` DATETIME(3) NULL,
  `approved_at` DATETIME(3) NULL,
  `assigned_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Application_applicant_id_key` (`applicant_id`),
  INDEX `Application_applicant_id_idx` (`applicant_id`),
  INDEX `Application_status_idx` (`status`),
  INDEX `Application_department_id_idx` (`department_id`),
  INDEX `Application_mentor_id_idx` (`mentor_id`),
  INDEX `Application_screening_score_idx` (`screening_score`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Course table
CREATE TABLE `Course` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NOT NULL,
  `department_id` VARCHAR(36) NOT NULL,
  `duration_weeks` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Course_department_id_idx` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create AttendanceRecord table
CREATE TABLE `AttendanceRecord` (
  `id` VARCHAR(36) NOT NULL,
  `apprentice_id` VARCHAR(36) NOT NULL,
  `apprentice_name` VARCHAR(191) NOT NULL,
  `date` VARCHAR(191) NOT NULL,
  `check_in_time` DATETIME(3) NULL,
  `check_out_time` DATETIME(3) NULL,
  `method` VARCHAR(191) NOT NULL,
  `lat` DOUBLE NULL,
  `lng` DOUBLE NULL,
  `location_name` VARCHAR(191) NULL,
  `status` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `AttendanceRecord_apprentice_id_idx` (`apprentice_id`),
  INDEX `AttendanceRecord_date_idx` (`date`),
  INDEX `AttendanceRecord_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create ApprenticeTask table
CREATE TABLE `ApprenticeTask` (
  `id` VARCHAR(36) NOT NULL,
  `apprentice_id` VARCHAR(36) NOT NULL,
  `apprentice_name` VARCHAR(191) NOT NULL,
  `mentor_id` VARCHAR(36) NOT NULL,
  `mentor_name` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NOT NULL,
  `due_date` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
  `evidence_notes` VARCHAR(191) NULL,
  `evidence_filename` VARCHAR(191) NULL,
  `submission_date` DATETIME(3) NULL,
  `verification_date` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `ApprenticeTask_apprentice_id_idx` (`apprentice_id`),
  INDEX `ApprenticeTask_mentor_id_idx` (`mentor_id`),
  INDEX `ApprenticeTask_status_idx` (`status`),
  INDEX `ApprenticeTask_due_date_idx` (`due_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Evaluation table
CREATE TABLE `Evaluation` (
  `id` VARCHAR(36) NOT NULL,
  `apprentice_id` VARCHAR(36) NOT NULL,
  `apprentice_name` VARCHAR(191) NOT NULL,
  `evaluator_id` VARCHAR(36) NOT NULL,
  `evaluator_name` VARCHAR(191) NOT NULL,
  `evaluation_type` VARCHAR(191) NOT NULL,
  `technical_score` INT NOT NULL,
  `communication_score` INT NOT NULL,
  `punctuality_score` INT NOT NULL,
  `teamwork_score` INT NOT NULL,
  `problem_solving_score` INT NOT NULL,
  `overall_score` DOUBLE NOT NULL,
  `attendance_percentage` DOUBLE NULL,
  `passed` BOOLEAN NOT NULL,
  `comments` VARCHAR(191) NULL,
  `evaluated_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Evaluation_apprentice_id_idx` (`apprentice_id`),
  INDEX `Evaluation_evaluator_id_idx` (`evaluator_id`),
  INDEX `Evaluation_evaluation_type_idx` (`evaluation_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Certificate table
CREATE TABLE `Certificate` (
  `id` VARCHAR(36) NOT NULL,
  `apprentice_id` VARCHAR(36) NOT NULL,
  `cert_number` VARCHAR(191) NOT NULL,
  `issue_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `overall_score` DOUBLE NOT NULL,
  `attendance_rate` VARCHAR(191) NOT NULL,
  `verification_url` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Certificate_cert_number_key` (`cert_number`),
  INDEX `Certificate_apprentice_id_idx` (`apprentice_id`),
  INDEX `Certificate_cert_number_idx` (`cert_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create NotificationItem table
CREATE TABLE `NotificationItem` (
  `id` VARCHAR(36) NOT NULL,
  `recipient_id` VARCHAR(191) NOT NULL,
  `recipient_name` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(191) NOT NULL,
  `message` VARCHAR(191) NOT NULL,
  `sent_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id`),
  INDEX `NotificationItem_recipient_id_idx` (`recipient_id`),
  INDEX `NotificationItem_type_idx` (`type`),
  INDEX `NotificationItem_sent_at_idx` (`sent_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create AuditLog table
CREATE TABLE `AuditLog` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `user_name` VARCHAR(191) NOT NULL,
  `user_role` VARCHAR(191) NOT NULL,
  `action` VARCHAR(191) NOT NULL,
  `entity_type` VARCHAR(191) NOT NULL,
  `entity_id` VARCHAR(191) NOT NULL,
  `details` VARCHAR(191) NOT NULL,
  `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `AuditLog_user_id_idx` (`user_id`),
  INDEX `AuditLog_action_idx` (`action`),
  INDEX `AuditLog_timestamp_idx` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create ScreeningCriteriaConfig table
CREATE TABLE `ScreeningCriteriaConfig` (
  `id` VARCHAR(36) NOT NULL,
  `min_gpa` DOUBLE NOT NULL DEFAULT 3.0,
  `passing_score` INT NOT NULL DEFAULT 60,
  `gpa_weight` INT NOT NULL DEFAULT 30,
  `field_weight` INT NOT NULL DEFAULT 20,
  `university_weight` INT NOT NULL DEFAULT 15,
  `skills_weight` INT NOT NULL DEFAULT 15,
  `recommendation_weight` INT NOT NULL DEFAULT 10,
  `cv_weight` INT NOT NULL DEFAULT 10,
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key constraints
ALTER TABLE `User` ADD CONSTRAINT `User_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Application` ADD CONSTRAINT `Application_applicant_id_fkey` FOREIGN KEY (`applicant_id`) REFERENCES `Applicant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Application` ADD CONSTRAINT `Application_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Application` ADD CONSTRAINT `Application_mentor_id_fkey` FOREIGN KEY (`mentor_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Course` ADD CONSTRAINT `Course_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `AttendanceRecord` ADD CONSTRAINT `AttendanceRecord_apprentice_id_fkey` FOREIGN KEY (`apprentice_id`) REFERENCES `Applicant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ApprenticeTask` ADD CONSTRAINT `ApprenticeTask_apprentice_id_fkey` FOREIGN KEY (`apprentice_id`) REFERENCES `Applicant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ApprenticeTask` ADD CONSTRAINT `ApprenticeTask_mentor_id_fkey` FOREIGN KEY (`mentor_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_apprentice_id_fkey` FOREIGN KEY (`apprentice_id`) REFERENCES `Applicant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_evaluator_id_fkey` FOREIGN KEY (`evaluator_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_apprentice_id_fkey` FOREIGN KEY (`apprentice_id`) REFERENCES `Applicant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert default screening criteria
INSERT INTO `ScreeningCriteriaConfig` (`id`, `min_gpa`, `passing_score`, `gpa_weight`, `field_weight`, `university_weight`, `skills_weight`, `recommendation_weight`, `cv_weight`)
VALUES ('default-criteria', 3.0, 60, 30, 20, 15, 15, 10, 10);

-- Database setup complete
