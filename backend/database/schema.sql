-- ============================================================
-- Student & Employee Management System - Database Schema
-- ============================================================
-- Usage:
--   mysql -u root -p < schema.sql
-- or, inside the MySQL shell:
--   SOURCE schema.sql;
-- ============================================================

CREATE DATABASE IF NOT EXISTS sms_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sms_db;

-- ------------------------------------------------------------
-- Table: admins
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,          -- bcrypt hash, never plain text
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: students
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(30) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  college VARCHAR(200) NOT NULL,
  course ENUM('BCA', 'B.Tech', 'MCA', 'MBA', 'Other') NOT NULL DEFAULT 'Other',
  year VARCHAR(20) NOT NULL,
  internship VARCHAR(200) DEFAULT NULL,
  join_date DATE NOT NULL,
  status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_students_course (course),
  INDEX idx_students_status (status),
  INDEX idx_students_full_name (full_name)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: employees
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(30) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  department VARCHAR(100) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  join_date DATE NOT NULL,
  employee_type ENUM('Full Time', 'Part Time', 'Intern', 'Contract') NOT NULL DEFAULT 'Full Time',
  status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_employees_department (department),
  INDEX idx_employees_status (status),
  INDEX idx_employees_full_name (full_name)
) ENGINE=InnoDB;
