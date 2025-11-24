-- User Information Database for Dashboard
-- Created: 2024-01-15
-- Purpose: Store user information, profiles, settings, and activities

-- Create database
DROP DATABASE IF EXISTS dashboard_db;
CREATE DATABASE dashboard_db;
USE dashboard_db;

-- Main users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    profile_picture_url VARCHAR(500) DEFAULT 'https://randomuser.me/api/portraits/women/44.jpg',
    bio TEXT,
    job_title VARCHAR(100),
    department VARCHAR(100),
    employee_id VARCHAR(20) UNIQUE,
    phone_number VARCHAR(20),
    location VARCHAR(100),
    date_of_birth DATE,
    hire_date DATE,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Extended user profile information
CREATE TABLE user_profiles (
    profile_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    theme_preference ENUM('light', 'dark', 'auto') DEFAULT 'light',
    color_scheme VARCHAR(20) DEFAULT 'blue',
    layout_density ENUM('comfortable', 'compact') DEFAULT 'comfortable',
    text_size ENUM('very_small', 'small', 'medium', 'large', 'very_large') DEFAULT 'medium',
    high_contrast_mode BOOLEAN DEFAULT FALSE,
    reduced_motion BOOLEAN DEFAULT FALSE,
    focus_indicators BOOLEAN DEFAULT TRUE,
    language_code VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
    currency_code VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_profile (user_id)
);

-- User settings and preferences
CREATE TABLE user_settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    setting_category VARCHAR(50) NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    data_type ENUM('boolean', 'string', 'integer', 'json') DEFAULT 'string',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_setting (user_id, setting_category, setting_key)
);

-- Roles table
CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles mapping
CREATE TABLE user_roles (
    user_role_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (user_id, role_id)
);

-- User login sessions
CREATE TABLE user_sessions (
    session_id VARCHAR(128) PRIMARY KEY,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- User activity log
CREATE TABLE user_activity_log (
    activity_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- User dashboard preferences
CREATE TABLE user_dashboards (
    dashboard_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    dashboard_name VARCHAR(100) NOT NULL,
    dashboard_layout JSON,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- User widget preferences
CREATE TABLE user_widgets (
    widget_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    widget_type VARCHAR(50) NOT NULL,
    widget_position INT,
    widget_settings JSON,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================

-- Insert sample roles
INSERT INTO roles (role_name, role_description) VALUES
('admin', 'System administrator with full access'),
('manager', 'Manager with elevated permissions'),
('user', 'Regular user with basic access'),
('viewer', 'Read-only user');

-- Insert sample users (passwords are 'password123' hashed with bcrypt)
INSERT INTO users (username, email, password_hash, first_name, last_name, profile_picture_url, bio, job_title, department, employee_id, phone_number, location, date_of_birth, hire_date, is_verified) VALUES
(
    'jane.smith', 
    'jane.smith@company.com', 
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'Jane', 
    'Smith', 
    'https://randomuser.me/api/portraits/women/44.jpg',
    'Experienced marketing professional with over 8 years in digital marketing strategy, brand development, and team leadership. Passionate about data-driven decision making and innovative campaign strategies.',
    'Senior Marketing Manager',
    'Marketing',
    'EMP-2048',
    '+1 (555) 123-4567',
    'New York, USA',
    '1990-05-15',
    '2023-01-15',
    TRUE
),
(
    'john.doe', 
    'john.doe@company.com', 
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'John', 
    'Doe', 
    'https://randomuser.me/api/portraits/men/32.jpg',
    'Full-stack developer specializing in React and Node.js. Passionate about creating efficient, scalable web applications and mentoring junior developers.',
    'Senior Software Engineer',
    'Engineering',
    'EMP-2049',
    '+1 (555) 987-6543',
    'San Francisco, USA',
    '1988-11-22',
    '2023-02-20',
    TRUE
),
(
    'sarah.johnson', 
    'sarah.johnson@company.com', 
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'Sarah', 
    'Johnson', 
    'https://randomuser.me/api/portraits/women/68.jpg',
    'Data analyst with expertise in SQL, Python, and data visualization. Focused on transforming raw data into actionable business insights.',
    'Data Analyst',
    'Analytics',
    'EMP-2050',
    '+1 (555) 456-7890',
    'Chicago, USA',
    '1992-03-10',
    '2023-03-10',
    TRUE
),
(
    'mike.wilson', 
    'mike.wilson@company.com', 
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'Mike', 
    'Wilson', 
    'https://randomuser.me/api/portraits/men/75.jpg',
    'Sales professional with 10+ years of experience in B2B software sales. Strong track record of exceeding targets and building lasting client relationships.',
    'Sales Director',
    'Sales',
    'EMP-2051',
    '+1 (555) 234-5678',
    'Austin, USA',
    '1985-07-30',
    '2023-04-05',
    TRUE
);

-- Insert user profiles
INSERT INTO user_profiles (user_id, theme_preference, color_scheme, layout_density, text_size, high_contrast_mode, reduced_motion, focus_indicators) VALUES
(1, 'dark', 'blue', 'comfortable', 'medium', FALSE, FALSE, TRUE),
(2, 'light', 'green', 'compact', 'medium', FALSE, TRUE, TRUE),
(3, 'auto', 'purple', 'comfortable', 'large', TRUE, FALSE, TRUE),
(4, 'light', 'orange', 'compact', 'small', FALSE, FALSE, FALSE);

-- Insert user roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 2), -- Jane is a manager
(2, 3), -- John is a regular user
(3, 3), -- Sarah is a regular user
(4, 2); -- Mike is a manager

-- Insert user settings
INSERT INTO user_settings (user_id, setting_category, setting_key, setting_value, data_type) VALUES
-- Jane Smith's settings
(1, 'notifications', 'push_enabled', 'true', 'boolean'),
(1, 'notifications', 'email_enabled', 'false', 'boolean'),
(1, 'notifications', 'system_alerts', 'true', 'boolean'),
(1, 'notifications', 'security_updates', 'true', 'boolean'),
(1, 'notifications', 'marketing_comm', 'false', 'boolean'),
(1, 'privacy', 'data_collection', 'true', 'boolean'),
(1, 'privacy', 'auto_logout', '30', 'integer'),
(1, 'privacy', 'two_factor_auth', 'false', 'boolean'),

-- John Doe's settings
(2, 'notifications', 'push_enabled', 'false', 'boolean'),
(2, 'notifications', 'email_enabled', 'true', 'boolean'),
(2, 'notifications', 'system_alerts', 'true', 'boolean'),
(2, 'notifications', 'security_updates', 'true', 'boolean'),
(2, 'notifications', 'marketing_comm', 'true', 'boolean'),
(2, 'privacy', 'data_collection', 'false', 'boolean'),
(2, 'privacy', 'auto_logout', '60', 'integer'),
(2, 'privacy', 'two_factor_auth', 'true', 'boolean'),

-- Sarah Johnson's settings
(3, 'notifications', 'push_enabled', 'true', 'boolean'),
(3, 'notifications', 'email_enabled', 'true', 'boolean'),
(3, 'notifications', 'system_alerts', 'true', 'boolean'),
(3, 'notifications', 'security_updates', 'false', 'boolean'),
(3, 'notifications', 'marketing_comm', 'false', 'boolean'),
(3, 'privacy', 'data_collection', 'true', 'boolean'),
(3, 'privacy', 'auto_logout', '15', 'integer'),
(3, 'privacy', 'two_factor_auth', 'false', 'boolean'),

-- Mike Wilson's settings
(4, 'notifications', 'push_enabled', 'true', 'boolean'),
(4, 'notifications', 'email_enabled', 'false', 'boolean'),
(4, 'notifications', 'system_alerts', 'false', 'boolean'),
(4, 'notifications', 'security_updates', 'true', 'boolean'),
(4, 'notifications', 'marketing_comm', 'true', 'boolean'),
(4, 'privacy', 'data_collection', 'false', 'boolean'),
(4, 'privacy', 'auto_logout', '120', 'integer'),
(4, 'privacy', 'two_factor_auth', 'true', 'boolean');

-- Insert sample dashboard layouts
INSERT INTO user_dashboards (user_id, dashboard_name, dashboard_layout, is_default) VALUES
(1, 'Main Dashboard', '{"cards": [1, 2, 3, 4], "charts": ["revenue", "traffic"], "recentActivity": true}', TRUE),
(2, 'Developer Dashboard', '{"cards": [2, 4], "charts": ["performance", "traffic"], "recentActivity": false}', TRUE),
(3, 'Analytics Dashboard', '{"cards": [1, 3], "charts": ["revenue", "performance", "traffic"], "recentActivity": true}', TRUE),
(4, 'Sales Dashboard', '{"cards": [1, 2, 4], "charts": ["revenue"], "recentActivity": true}', TRUE);

-- Insert sample widget preferences
INSERT INTO user_widgets (user_id, widget_type, widget_position, widget_settings, is_visible) VALUES
(1, 'revenue_card', 1, '{"color": "blue", "compact": false}', TRUE),
(1, 'users_card', 2, '{"color": "green", "compact": false}', TRUE),
(1, 'orders_card', 3, '{"color": "orange", "compact": false}', TRUE),
(1, 'growth_card', 4, '{"color": "purple", "compact": false}', TRUE),
(1, 'revenue_chart', 5, '{"timeframe": "week", "height": 300}', TRUE),
(1, 'traffic_chart', 6, '{"showLegend": true, "height": 250}', TRUE),
(1, 'activity_feed', 7, '{"maxItems": 10, "autoRefresh": true}', TRUE);

-- Insert sample activity log
INSERT INTO user_activity_log (user_id, activity_type, activity_description, ip_address, metadata) VALUES
(1, 'login', 'User logged in successfully', '192.168.1.100', '{"browser": "Chrome", "os": "Windows"}'),
(1, 'profile_update', 'Updated profile information', '192.168.1.100', '{"fields": ["bio", "job_title"]}'),
(1, 'settings_change', 'Changed theme to dark mode', '192.168.1.100', '{"setting": "theme", "value": "dark"}'),
(1, 'dashboard_view', 'Viewed dashboard overview', '192.168.1.100', '{"section": "main"}'),
(2, 'login', 'User logged in successfully', '192.168.1.101', '{"browser": "Firefox", "os": "macOS"}'),
(2, 'profile_update', 'Updated profile picture', '192.168.1.101', '{"action": "picture_upload"}'),
(3, 'login', 'User logged in successfully', '192.168.1.102', '{"browser": "Safari", "os": "macOS"}'),
(4, 'login', 'User logged in successfully', '192.168.1.103', '{"browser": "Chrome", "os": "Linux"}');

-- Insert sample sessions
INSERT INTO user_sessions (session_id, user_id, ip_address, user_agent, expires_at) VALUES
('session_001', 1, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', DATE_ADD(NOW(), INTERVAL 2 HOUR)),
('session_002', 2, '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', DATE_ADD(NOW(), INTERVAL 2 HOUR)),
('session_003', 3, '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', DATE_ADD(NOW(), INTERVAL 2 HOUR));

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_activity_user_id ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity_log(created_at);
CREATE INDEX idx_user_activity_type ON user_activity_log(activity_type);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_user_settings_category ON user_settings(setting_category);
CREATE INDEX idx_user_settings_key ON user_settings(setting_key);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_dashboards_user_id ON user_dashboards(user_id);
CREATE INDEX idx_user_widgets_user_id ON user_widgets(user_id);

-- ============================================================================
-- USEFUL VIEWS
-- ============================================================================

-- View for user profile with settings
CREATE VIEW user_profile_view AS
SELECT 
    u.user_id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.profile_picture_url,
    u.bio,
    u.job_title,
    u.department,
    u.employee_id,
    u.phone_number,
    u.location,
    u.hire_date,
    up.theme_preference,
    up.color_scheme,
    up.layout_density,
    up.text_size,
    up.high_contrast_mode,
    up.reduced_motion,
    up.focus_indicators,
    r.role_name,
    u.last_login,
    u.is_active
FROM users u
LEFT JOIN user_profiles up ON u.user_id = up.user_id
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.role_id;

-- View for user settings by category
CREATE VIEW user_settings_view AS
SELECT 
    u.user_id,
    u.username,
    us.setting_category,
    us.setting_key,
    us.setting_value,
    us.data_type
FROM users u
JOIN user_settings us ON u.user_id = us.user_id
ORDER BY u.user_id, us.setting_category, us.setting_key;

-- ============================================================================
-- SAMPLE QUERIES
-- ============================================================================

-- Query to get complete user information
SELECT '=== COMPLETE USER INFORMATION ===' as info;
SELECT * FROM user_profile_view WHERE username = 'jane.smith';

-- Query to get user settings
SELECT '=== USER SETTINGS ===' as info;
SELECT * FROM user_settings_view WHERE username = 'jane.smith';

-- Query to get recent activity
SELECT '=== RECENT ACTIVITY ===' as info;
SELECT 
    u.username,
    ual.activity_type,
    ual.activity_description,
    ual.created_at-
    
FROM user_activity_log ual
JOIN users u ON ual.user_id = u.user_id
ORDER BY ual.created_at DESC
LIMIT 5;

-- Query to update user profile (example)
SELECT '=== PROFILE UPDATE EXAMPLE ===' as info;
-- UPDATE user_profiles SET theme_preference = 'dark' WHERE user_id = 1;

-- Query to insert new activity (example)
SELECT '=== ACTIVITY LOG EXAMPLE ===' as info;
-- INSERT INTO user_activity_log (user_id, activity_type, activity_description) 
-- VALUES (1, 'settings_change', 'Updated notification preferences');

-- ============================================================================
-- DATABASE INFORMATION
-- ============================================================================

SELECT '=== DATABASE CREATED SUCCESSFULLY ===' as info;
SELECT 'Database: dashboard_db' as info;
SELECT 'Total Users: ' AS info, COUNT(*) AS count FROM users;
SELECT 'Total Roles: ' AS info, COUNT(*) AS count FROM roles;
SELECT 'Total Settings: ' AS info, COUNT(*) AS count FROM user_settings;
SELECT 'Total Activities: ' AS info, COUNT(*) AS count FROM user_activity_log;