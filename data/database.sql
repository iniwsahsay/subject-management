CREATE DATABASE IF NOT EXISTS school_management;

USE school_management;

CREATE TABLE IF NOT EXISTS subject (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(255) NOT NULL,
    subject_code VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    credits INT NOT NULL,
    course_id INT NOT NULL,
    school_id INT NOT NULL
);