// Database Service - Simulates SQL database operations using localStorage
class DatabaseService {
    constructor() {
        this.tables = [
            'users', 
            'user_profiles', 
            'user_settings', 
            'user_activity_log',
            'user_dashboards',
            'chat_messages'
        ];
        this.init();
    }

    init() {
        // Initialize mock database if empty
        if (!localStorage.getItem('db_initialized')) {
            this.initializeMockData();
            localStorage.setItem('db_initialized', 'true');
        }
    }

    initializeMockData() {
        const mockData = {
            users: [
                {
                    user_id: 1,
                    username: 'jane.smith',
                    email: 'jane.smith@company.com',
                    password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                    first_name: 'Jane',
                    last_name: 'Smith',
                    profile_picture_url: 'https://randomuser.me/api/portraits/women/44.jpg',
                    bio: 'Experienced marketing professional with over 8 years in digital marketing strategy, brand development, and team leadership. Passionate about data-driven decision making and innovative campaign strategies.',
                    job_title: 'Senior Marketing Manager',
                    department: 'Marketing',
                    employee_id: 'EMP-2048',
                    phone_number: '+1 (555) 123-4567',
                    location: 'New York, USA',
                    date_of_birth: '1990-05-15',
                    hire_date: '2023-01-15',
                    is_active: true,
                    is_verified: true,
                    last_login: new Date().toISOString()
                },
                {
                    user_id: 2,
                    username: 'john.doe',
                    email: 'john.doe@company.com',
                    password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                    first_name: 'John',
                    last_name: 'Doe',
                    profile_picture_url: 'https://randomuser.me/api/portraits/men/32.jpg',
                    bio: 'Full-stack developer specializing in React and Node.js. Passionate about creating efficient, scalable web applications and mentoring junior developers.',
                    job_title: 'Senior Software Engineer',
                    department: 'Engineering',
                    employee_id: 'EMP-2049',
                    phone_number: '+1 (555) 987-6543',
                    location: 'San Francisco, USA',
                    date_of_birth: '1988-11-22',
                    hire_date: '2023-02-20',
                    is_active: true,
                    is_verified: true,
                    last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                }
            ],
            user_profiles: [
                {
                    profile_id: 1,
                    user_id: 1,
                    theme_preference: 'light',
                    color_scheme: 'blue',
                    layout_density: 'comfortable',
                    text_size: 'medium',
                    high_contrast_mode: false,
                    reduced_motion: false,
                    focus_indicators: true
                },
                {
                    profile_id: 2,
                    user_id: 2,
                    theme_preference: 'light',
                    color_scheme: 'green',
                    layout_density: 'compact',
                    text_size: 'medium',
                    high_contrast_mode: false,
                    reduced_motion: true,
                    focus_indicators: true
                }
            ],
            user_settings: [
                // Jane Smith's settings
                { setting_id: 1, user_id: 1, setting_category: 'notifications', setting_key: 'push_enabled', setting_value: 'true', data_type: 'boolean' },
                { setting_id: 2, user_id: 1, setting_category: 'notifications', setting_key: 'email_enabled', setting_value: 'false', data_type: 'boolean' },
                { setting_id: 3, user_id: 1, setting_category: 'privacy', setting_key: 'data_collection', setting_value: 'true', data_type: 'boolean' },
                { setting_id: 4, user_id: 1, setting_category: 'privacy', setting_key: 'auto_logout', setting_value: '30', data_type: 'integer' },

                // John Doe's settings
                { setting_id: 5, user_id: 2, setting_category: 'notifications', setting_key: 'push_enabled', setting_value: 'false', data_type: 'boolean' },
                { setting_id: 6, user_id: 2, setting_category: 'notifications', setting_key: 'email_enabled', setting_value: 'true', data_type: 'boolean' },
                { setting_id: 7, user_id: 2, setting_category: 'privacy', setting_key: 'data_collection', setting_value: 'false', data_type: 'boolean' },
                { setting_id: 8, user_id: 2, setting_category: 'privacy', setting_key: 'auto_logout', setting_value: '60', data_type: 'integer' }
            ],
            user_activity_log: [
                {
                    activity_id: 1,
                    user_id: 1,
                    activity_type: 'login',
                    activity_description: 'User logged in successfully',
                    created_at: new Date().toISOString()
                },
                {
                    activity_id: 2,
                    user_id: 2,
                    activity_type: 'login',
                    activity_description: 'User logged in successfully',
                    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                },
                {
                    activity_id: 3,
                    user_id: 1,
                    activity_type: 'profile_update',
                    activity_description: 'Updated profile information',
                    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
                }
            ],
            user_dashboards: [
                {
                    dashboard_id: 1,
                    user_id: 1,
                    dashboard_name: 'Main Dashboard',
                    dashboard_layout: '{"cards": [1, 2, 3, 4], "charts": ["revenue", "traffic"], "recentActivity": true}',
                    is_default: true
                },
                {
                    dashboard_id: 2,
                    user_id: 2,
                    dashboard_name: 'Developer Dashboard',
                    dashboard_layout: '{"cards": [2, 4], "charts": ["performance", "traffic"], "recentActivity": false}',
                    is_default: true
                }
            ],
            chat_messages: [
                {
                    message_id: 1,
                    user_id: 1,
                    message_text: 'Hello team! Welcome to our new chatroom! 👋',
                    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
                    message_type: 'text'
                },
                {
                    message_id: 2,
                    user_id: 2,
                    message_text: 'Hey Jane! This looks great! 😊',
                    timestamp: new Date(Date.now() - 115 * 60 * 1000).toISOString(),
                    message_type: 'text'
                },
                {
                    message_id: 3,
                    user_id: 1,
                    message_text: 'Thanks for testing the chat feature with me!',
                    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
                    message_type: 'text'
                }
            ]
        };

        // Store mock data in localStorage
        Object.keys(mockData).forEach(table => {
            localStorage.setItem(`db_${table}`, JSON.stringify(mockData[table]));
        });
    }

    // Generic query method
    async query(sql, params = []) {
        // Simulate database delay
        await this.delay(100);
        
        // Parse SQL-like queries (simplified for demo)
        const lowerSQL = sql.toLowerCase();
        
        if (lowerSQL.includes('select * from users where username = ?')) {
            return this.getUserByUsername(params[0]);
        } else if (lowerSQL.includes('select * from user_profiles where user_id = ?')) {
            return this.getUserProfile(params[0]);
        } else if (lowerSQL.includes('select * from user_settings where user_id = ?')) {
            return this.getUserSettings(params[0]);
        } else if (lowerSQL.includes('update user_profiles set')) {
            return this.updateUserProfile(params[0], this.parseUpdateParams(sql, params));
        } else if (lowerSQL.includes('update users set')) {
            return this.updateUser(params[0], this.parseUpdateParams(sql, params));
        } else if (lowerSQL.includes('insert into user_activity_log')) {
            return this.logActivity(params[0], params[1], params[2]);
        } else if (lowerSQL.includes('select * from user_activity_log where user_id = ? order by created_at desc limit ?')) {
            return this.getRecentActivity(params[0], params[1]);
        } else if (lowerSQL.includes('select * from users where is_active = true')) {
            return this.getAllActiveUsers();
        } else if (lowerSQL.includes('select * from chat_messages order by timestamp desc limit ?')) {
            return this.getChatMessages(params[0]);
        } else if (lowerSQL.includes('insert into chat_messages')) {
            return this.saveChatMessage(params[0], params[1], params[2]);
        } else if (lowerSQL.includes('delete from chat_messages')) {
            return this.clearChatMessages();
        }
        
        return [];
    }

    parseUpdateParams(sql, params) {
        // Simple parser for UPDATE statements
        const setClause = sql.match(/set (.+?) where/i);
        if (!setClause) return {};
        
        const assignments = setClause[1].split(',').map(assign => assign.trim());
        const updates = {};
        
        assignments.forEach((assign, index) => {
            const [key, value] = assign.split('=').map(part => part.trim());
            updates[key] = params[index] || value.replace(/['"]/g, '');
        });
        
        return updates;
    }

    async getUserByUsername(username) {
        const users = JSON.parse(localStorage.getItem('db_users') || '[]');
        return users.find(user => user.username === username) || null;
    }

    async getUserProfile(userId) {
        const profiles = JSON.parse(localStorage.getItem('db_user_profiles') || '[]');
        return profiles.find(profile => profile.user_id === userId) || null;
    }

    async getUserSettings(userId) {
        const settings = JSON.parse(localStorage.getItem('db_user_settings') || '[]');
        return settings.filter(setting => setting.user_id === userId);
    }

    async getAllActiveUsers() {
        const users = JSON.parse(localStorage.getItem('db_users') || '[]');
        return users.filter(user => user.is_active);
    }

    async updateUserProfile(userId, updates) {
        const profiles = JSON.parse(localStorage.getItem('db_user_profiles') || '[]');
        const profileIndex = profiles.findIndex(p => p.user_id === userId);
        
        if (profileIndex !== -1) {
            profiles[profileIndex] = { ...profiles[profileIndex], ...updates };
            localStorage.setItem('db_user_profiles', JSON.stringify(profiles));
            return { success: true, affectedRows: 1 };
        }
        
        return { success: false, affectedRows: 0 };
    }

    async updateUser(userId, updates) {
        const users = JSON.parse(localStorage.getItem('db_users') || '[]');
        const userIndex = users.findIndex(u => u.user_id === userId);
        
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('db_users', JSON.stringify(users));
            return { success: true, affectedRows: 1 };
        }
        
        return { success: false, affectedRows: 0 };
    }

    async updateUserLastLogin(userId) {
        const users = JSON.parse(localStorage.getItem('db_users') || '[]');
        const userIndex = users.findIndex(u => u.user_id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].last_login = new Date().toISOString();
            localStorage.setItem('db_users', JSON.stringify(users));
            return { success: true };
        }
        
        return { success: false };
    }

    async logActivity(userId, activityType, description) {
        const activities = JSON.parse(localStorage.getItem('db_user_activity_log') || '[]');
        const newActivity = {
            activity_id: activities.length + 1,
            user_id: userId,
            activity_type: activityType,
            activity_description: description,
            created_at: new Date().toISOString()
        };
        
        activities.push(newActivity);
        localStorage.setItem('db_user_activity_log', JSON.stringify(activities));
        return { success: true, insertId: newActivity.activity_id };
    }

    async getRecentActivity(userId, limit = 10) {
        const activities = JSON.parse(localStorage.getItem('db_user_activity_log') || '[]');
        return activities
            .filter(activity => activity.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, limit);
    }

    // Chatroom Methods
    async getChatMessages(limit = 100) {
        const messages = JSON.parse(localStorage.getItem('db_chat_messages') || '[]');
        return messages
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit)
            .reverse(); // Return in chronological order
    }

    async saveChatMessage(userId, messageText, messageType = 'text') {
        const messages = JSON.parse(localStorage.getItem('db_chat_messages') || '[]');
        const newMessage = {
            message_id: messages.length + 1,
            user_id: userId,
            message_text: messageText,
            timestamp: new Date().toISOString(),
            message_type: messageType
        };
        
        messages.push(newMessage);
        localStorage.setItem('db_chat_messages', JSON.stringify(messages));
        
        // Also log as activity
        await this.logActivity(userId, 'chat_message', `Sent a ${messageType} message in chatroom`);
        
        return { success: true, message: newMessage };
    }

    async clearChatMessages() {
        localStorage.setItem('db_chat_messages', JSON.stringify([]));
        return { success: true };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create global database instance
window.db = new DatabaseService();