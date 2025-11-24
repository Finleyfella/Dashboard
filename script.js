// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initializing...');
    
    // Initialize all dashboard functionality
    generateRealisticData();
    initCharts();
    initMenuInteractions();
    initSearch();
    initCardInteractions();
    initChartFilters();
    loadProfileData();
    initProfileEditing();
    initSettings();
    
    // Load user data
    loadCurrentUser().then(() => {
        console.log('User data loaded successfully');
    }).catch(error => {
        console.error('Error loading user data:', error);
        setupDefaultUser();
    });
});

let allUsers = [];
let currentUser = null;

// ==================== CHART DATA AND FUNCTIONS ====================

let revenueChartInstance = null;

// Dummy data for different timeframes
const revenueData = {
    week: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [3200, 4500, 5200, 5800, 6200, 3800, 2900],
        total: '$29,400',
        change: '+12%'
    },
    month: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [12500, 14200, 13800, 16800],
        total: '$57,300',
        change: '+8%'
    },
    year: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [42000, 48000, 52000, 45000, 58000, 62000, 55000, 59000, 63000, 68000, 72000, 75000],
        total: '$699,000',
        change: '+15%'
    }
};

function generateRealisticData() {
    // Data is already defined above
    console.log('Realistic data generated');
}

function initCharts() {
    console.log('Initializing charts...');
    createRevenueChart('week'); // Default to week view
    
    // Initialize traffic chart
    const trafficCtx = document.getElementById('trafficChart');
    if (trafficCtx) {
        const trafficChart = new Chart(trafficCtx, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'Social', 'Referral', 'Organic'],
                datasets: [{
                    data: [35, 25, 20, 20],
                    backgroundColor: [
                        '#3a7bd5',
                        '#00d2ff',
                        '#ff9a9e',
                        '#a8e6cf'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        console.log('Traffic chart initialized');
    } else {
        console.warn('Traffic chart canvas not found');
    }
}

function createRevenueChart(timeframe) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) {
        console.warn('Revenue chart canvas not found');
        return;
    }
    
    // Destroy existing chart if it exists
    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }
    
    const data = revenueData[timeframe];
    
    revenueChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Revenue',
                data: data.data,
                borderColor: '#3a7bd5',
                backgroundColor: 'rgba(58, 123, 213, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3a7bd5',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { size: 14 },
                    bodyFont: { size: 14 },
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return `Revenue: $${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear'
                }
            }
        }
    });
    console.log('Revenue chart created for timeframe:', timeframe);
}

function initChartFilters() {
    const timeframeButtons = document.querySelectorAll('.timeframe-btn');
    
    timeframeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const timeframe = this.getAttribute('data-timeframe');
            
            // Remove active class from all buttons
            timeframeButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update chart
            createRevenueChart(timeframe);
        });
    });
}

// ==================== MENU NAVIGATION ====================

function initMenuInteractions() {
    const menuItems = document.querySelectorAll('.menu li');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const viewName = this.getAttribute('data-view');
            
            // Remove active class from all menu items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all views
            document.querySelectorAll('.view').forEach(view => {
                view.classList.remove('active-view');
            });
            
            // Show selected view
            const targetView = document.getElementById(`${viewName}-view`);
            if (targetView) {
                targetView.classList.add('active-view');
                
                // Reinitialize charts if needed when returning to dashboard
                if (viewName === 'dashboard') {
                    initCharts();
                }
                // Load chat messages when switching to chat view
                else if (viewName === 'chat') {
                    loadChatMessages();
                    updateOnlineUsers();
                }
            }
        });
    });
}

// ==================== SEARCH FUNCTIONALITY ====================

function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm.length > 2) {
                // Filter activity items in dashboard view
                document.querySelectorAll('.activity-item').forEach(item => {
                    const text = item.textContent.toLowerCase();
                    item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
                });
            } else {
                // Show all items if search term is too short or empty
                document.querySelectorAll('.activity-item').forEach(item => {
                    item.style.display = 'flex';
                });
            }
        });
    }
}

// ==================== CARD INTERACTIONS ====================

function initCardInteractions() {
    // Click on cards to see details
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const cardType = this.querySelector('h3').textContent;
            showNotification(`Showing details for: ${cardType}`);
        });
    });
    
    // Simulate live data updates
    setInterval(updateLiveData, 5000);
}

function updateLiveData() {
    const cards = document.querySelectorAll('.card .value');
    
    if (cards.length >= 4) {
        // Update revenue with random fluctuation
        const currentRevenue = cards[0].textContent.replace('$', '').replace(',', '');
        const newRevenue = parseInt(currentRevenue) + Math.floor(Math.random() * 100 - 50);
        cards[0].textContent = '$' + Math.max(24000, newRevenue).toLocaleString();
        
        // Update users
        const currentUsers = cards[1].textContent.replace(',', '');
        const newUsers = parseInt(currentUsers) + Math.floor(Math.random() * 10);
        cards[1].textContent = newUsers.toLocaleString();
        
        // Update orders
        const currentOrders = cards[2].textContent;
        const newOrders = parseInt(currentOrders) + Math.floor(Math.random() * 5 - 2);
        cards[2].textContent = Math.max(350, newOrders);
        
        // Update growth with random percentage
        const currentGrowth = parseFloat(cards[3].textContent.replace('+', '').replace('%', ''));
        const newGrowth = Math.max(10, Math.min(20, currentGrowth + (Math.random() * 2 - 1)));
        cards[3].textContent = '+' + newGrowth.toFixed(1) + '%';
        
        // Update progress bars
        updateProgressBars();
    }
}

function updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const currentWidth = parseInt(bar.style.width) || 75;
        const newWidth = Math.max(10, Math.min(95, currentWidth + Math.floor(Math.random() * 10 - 5)));
        bar.style.width = newWidth + '%';
    });
}

// ==================== PROFILE EDITING ====================

function initProfileEditing() {
    // Bio editing
    const editBioBtn = document.querySelector('.edit-bio-btn');
    const saveBioBtn = document.querySelector('.save-bio-btn');
    const cancelBioBtn = document.querySelector('.cancel-bio-btn');
    
    if (editBioBtn) {
        editBioBtn.addEventListener('click', enableBioEdit);
    }
    
    if (saveBioBtn) {
        saveBioBtn.addEventListener('click', saveBio);
    }
    
    if (cancelBioBtn) {
        cancelBioBtn.addEventListener('click', cancelBioEdit);
    }
    
    // Profile picture upload
    initProfilePictureUpload();
    
    // Make profile fields editable
    makeProfileEditable();
}

function enableBioEdit() {
    // Get current bio text
    const currentBio = document.getElementById('bio-text').textContent;
    
    // Hide display, show edit
    document.getElementById('bio-display').style.display = 'none';
    document.getElementById('bio-edit').style.display = 'block';
    
    // Set textarea value
    document.getElementById('bio-textarea').value = currentBio;
    
    // Focus on textarea
    document.getElementById('bio-textarea').focus();
}

function cancelBioEdit() {
    // Show display, hide edit
    document.getElementById('bio-display').style.display = 'block';
    document.getElementById('bio-edit').style.display = 'none';
}

function saveBio() {
    const newBio = document.getElementById('bio-textarea').value.trim();
    
    if (newBio) {
        // Update displayed bio
        document.getElementById('bio-text').textContent = newBio;
        
        // Save to localStorage
        localStorage.setItem('userBio', newBio);
        
        // Show success message
        showNotification('Bio updated successfully!');
        
        // Return to display mode
        cancelBioEdit();
    } else {
        showNotification('Please enter some text for your bio.', 'error');
    }
}

function makeProfileEditable() {
    // Make name editable
    const nameElement = document.querySelector('.profile-info h2');
    if (nameElement) {
        nameElement.setAttribute('contenteditable', 'true');
        nameElement.style.borderBottom = '2px dashed #3a7bd5';
        nameElement.style.paddingBottom = '2px';
        nameElement.style.cursor = 'text';
    }
    
    // Make title editable
    const titleElement = document.querySelector('.profile-info p');
    if (titleElement) {
        titleElement.setAttribute('contenteditable', 'true');
        titleElement.style.borderBottom = '2px dashed #3a7bd5';
        titleElement.style.paddingBottom = '2px';
        titleElement.style.cursor = 'text';
    }
    
    // Add event listeners for saving profile changes
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', saveProfileChanges);
    }
}

function saveProfileChanges() {
    const nameElement = document.querySelector('.profile-info h2');
    const titleElement = document.querySelector('.profile-info p');
    
    if (nameElement && titleElement) {
        const name = nameElement.textContent;
        const title = titleElement.textContent;
        
        // Save to localStorage
        localStorage.setItem('userName', name);
        localStorage.setItem('userTitle', title);
        
        // Update header name
        const headerName = document.querySelector('.user-info span');
        if (headerName) {
            headerName.textContent = name;
        }
        
        showNotification('Profile updated successfully!');
    }
}

function loadProfileData() {
    // Load bio
    const savedBio = localStorage.getItem('userBio');
    if (savedBio) {
        document.getElementById('bio-text').textContent = savedBio;
    }
    
    // Load name and title
    const savedName = localStorage.getItem('userName');
    const savedTitle = localStorage.getItem('userTitle');
    
    if (savedName) {
        const nameElement = document.querySelector('.profile-info h2');
        const headerName = document.querySelector('.user-info span');
        if (nameElement) nameElement.textContent = savedName;
        if (headerName) headerName.textContent = savedName;
    }
    
    if (savedTitle) {
        const titleElement = document.querySelector('.profile-info p');
        if (titleElement) titleElement.textContent = savedTitle;
    }
}

// ==================== PROFILE PICTURE FUNCTIONALITY ====================

function initProfilePictureUpload() {
    const profilePictureInput = document.getElementById('profile-picture-input');
    const profilePicture = document.getElementById('profile-picture');
    
    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                if (validateImageFile(file)) {
                    showImagePreview(file);
                }
            }
        });
    }
    
    // Load saved profile picture
    loadProfilePicture();
}

function validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
        showNotification('Please select a valid image file (JPEG, PNG, GIF, or WebP).', 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showNotification('Image size must be less than 5MB.', 'error');
        return false;
    }
    
    return true;
}

function showImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const profilePicture = document.getElementById('profile-picture');
        const headerPicture = document.querySelector('.user-info img');
        
        if (profilePicture) {
            profilePicture.src = e.target.result;
        }
        if (headerPicture) {
            headerPicture.src = e.target.result;
        }
        
        // Save to localStorage
        localStorage.setItem('profilePicture', e.target.result);
        
        showNotification('Profile picture updated successfully!');
    };
    reader.readAsDataURL(file);
}

function loadProfilePicture() {
    const savedPicture = localStorage.getItem('profilePicture');
    const profilePicture = document.getElementById('profile-picture');
    const headerPicture = document.querySelector('.user-info img');
    
    if (savedPicture && profilePicture) {
        profilePicture.src = savedPicture;
        if (headerPicture) {
            headerPicture.src = savedPicture;
        }
    }
}

// ==================== SETTINGS FUNCTIONALITY ====================

function initSettings() {
    initSettingsNavigation();
    initThemeSettings();
    initAccessibilitySettings();
    initNotificationSettings();
    initPrivacySettings();
    initSettingsActions();
    loadSettings();
}

function initSettingsNavigation() {
    const categoryButtons = document.querySelectorAll('.settings-category');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active category
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected section
            showSettingsSection(category);
        });
    });
}

function showSettingsSection(category) {
    // Hide all sections
    document.querySelectorAll('.settings-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${category}-settings`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function initThemeSettings() {
    // Theme selection
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
            
            // Update active state
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Color scheme selection
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const scheme = this.getAttribute('data-scheme');
            setColorScheme(scheme);
            
            // Update active state
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Layout density
    const densityRadios = document.querySelectorAll('input[name="density"]');
    densityRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                setLayoutDensity(this.value);
            }
        });
    });
}

function initAccessibilitySettings() {
    // Text size slider
    const textSizeSlider = document.getElementById('textSizeSlider');
    const textSizeValue = document.getElementById('textSizeValue');
    
    if (textSizeSlider && textSizeValue) {
        textSizeSlider.addEventListener('input', function() {
            const sizes = ['Very Small', 'Small', 'Medium', 'Large', 'Very Large'];
            textSizeValue.textContent = sizes[this.value - 1];
            setTextSize(this.value);
        });
    }
    
    // High contrast toggle
    const highContrastToggle = document.getElementById('highContrastToggle');
    if (highContrastToggle) {
        highContrastToggle.addEventListener('change', function() {
            setHighContrast(this.checked);
        });
    }
    
    // Reduced motion toggle
    const reducedMotionToggle = document.getElementById('reducedMotionToggle');
    if (reducedMotionToggle) {
        reducedMotionToggle.addEventListener('change', function() {
            setReducedMotion(this.checked);
        });
    }
    
    // Focus indicators toggle
    const focusIndicatorsToggle = document.getElementById('focusIndicatorsToggle');
    if (focusIndicatorsToggle) {
        focusIndicatorsToggle.addEventListener('change', function() {
            setFocusIndicators(this.checked);
        });
    }
}

function initNotificationSettings() {
    // Push notifications toggle
    const pushNotificationsToggle = document.getElementById('pushNotificationsToggle');
    if (pushNotificationsToggle) {
        pushNotificationsToggle.addEventListener('change', function() {
            localStorage.setItem('pushNotifications', this.checked);
            showNotification(`Push notifications ${this.checked ? 'enabled' : 'disabled'}`);
        });
    }
    
    // Email notifications toggle
    const emailNotificationsToggle = document.getElementById('emailNotificationsToggle');
    if (emailNotificationsToggle) {
        emailNotificationsToggle.addEventListener('change', function() {
            localStorage.setItem('emailNotifications', this.checked);
            showNotification(`Email notifications ${this.checked ? 'enabled' : 'disabled'}`);
        });
    }
}

function initPrivacySettings() {
    // Data collection toggle
    const dataCollectionToggle = document.getElementById('dataCollectionToggle');
    if (dataCollectionToggle) {
        dataCollectionToggle.addEventListener('change', function() {
            localStorage.setItem('dataCollection', this.checked);
            showNotification(`Data collection ${this.checked ? 'enabled' : 'disabled'}`);
        });
    }
    
    // Auto logout select
    const autoLogoutSelect = document.getElementById('autoLogoutSelect');
    if (autoLogoutSelect) {
        autoLogoutSelect.addEventListener('change', function() {
            localStorage.setItem('autoLogout', this.value);
            const time = this.value === '0' ? 'Never' : `${this.value} minutes`;
            showNotification(`Auto logout set to ${time}`);
        });
    }
}

function initSettingsActions() {
    // Save settings
    const saveButton = document.getElementById('saveSettings');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            showNotification('All settings have been saved!');
        });
    }
    
    // Reset settings
    const resetButton = document.getElementById('resetSettings');
    if (resetButton) {
        resetButton.addEventListener('click', resetSettings);
    }
}

// Theme Functions
function setTheme(theme) {
    // Remove previous theme classes
    document.body.classList.remove('light-theme', 'dark-theme', 'auto-theme');
    
    // Apply new theme
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('theme', theme);
    
    showNotification(`Theme changed to ${theme}`);
}

function setColorScheme(scheme) {
    const root = document.documentElement;
    let primaryColor, secondaryColor, sidebarGradient;
    
    switch(scheme) {
        case 'blue':
            primaryColor = '#3a7bd5';
            secondaryColor = '#00d2ff';
            sidebarGradient = 'linear-gradient(to bottom, #3a7bd5, #00d2ff)';
            break;
        case 'green':
            primaryColor = '#00b09b';
            secondaryColor = '#96c93d';
            sidebarGradient = 'linear-gradient(to bottom, #00b09b, #96c93d)';
            break;
        case 'purple':
            primaryColor = '#667eea';
            secondaryColor = '#764ba2';
            sidebarGradient = 'linear-gradient(to bottom, #667eea, #764ba2)';
            break;
        case 'orange':
            primaryColor = '#f093fb';
            secondaryColor = '#f5576c';
            sidebarGradient = 'linear-gradient(to bottom, #f093fb, #f5576c)';
            break;
        default:
            primaryColor = '#3a7bd5';
            secondaryColor = '#00d2ff';
            sidebarGradient = 'linear-gradient(to bottom, #3a7bd5, #00d2ff)';
    }
    
    // Update CSS variables
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--secondary-color', secondaryColor);
    
    // Update sidebar gradient
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.style.background = sidebarGradient;
    }
    
    // For dark theme, create a darker version of the gradient
    if (document.body.classList.contains('dark-theme')) {
        updateDarkThemeSidebar(scheme);
    }
    
    localStorage.setItem('colorScheme', scheme);
    showNotification(`Color scheme changed to ${scheme}`);
}

// New function to handle dark theme sidebar colors
function updateDarkThemeSidebar(scheme) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    let darkGradient;
    
    switch(scheme) {
        case 'blue':
            darkGradient = 'linear-gradient(to bottom, #2c5282, #2b6cb0)';
            break;
        case 'green':
            darkGradient = 'linear-gradient(to bottom, #2d7a5c, #4a9c7d)';
            break;
        case 'purple':
            darkGradient = 'linear-gradient(to bottom, #553c9a, #6b46c1)';
            break;
        case 'orange':
            darkGradient = 'linear-gradient(to bottom, #b83280, #c53030)';
            break;
        default:
            darkGradient = 'linear-gradient(to bottom, #2c5282, #2b6cb0)';
    }
    
    sidebar.style.background = darkGradient;
}

function setLayoutDensity(density) {
    document.body.setAttribute('data-density', density);
    localStorage.setItem('layoutDensity', density);
    showNotification(`Layout density set to ${density}`);
}

// Accessibility Functions
function setTextSize(level) {
    const sizes = {
        '1': '12px',
        '2': '14px', 
        '3': '16px',
        '4': '18px',
        '5': '20px'
    };
    
    document.documentElement.style.setProperty('--base-font-size', sizes[level]);
    localStorage.setItem('textSize', level);
}

function setHighContrast(enabled) {
    if (enabled) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', enabled);
    showNotification(`High contrast mode ${enabled ? 'enabled' : 'disabled'}`);
}

function setReducedMotion(enabled) {
    if (enabled) {
        document.body.classList.add('reduced-motion');
    } else {
        document.body.classList.remove('reduced-motion');
    }
    localStorage.setItem('reducedMotion', enabled);
    showNotification(`Reduced motion ${enabled ? 'enabled' : 'disabled'}`);
}

function setFocusIndicators(enabled) {
    if (enabled) {
        document.body.classList.add('focus-indicators');
    } else {
        document.body.classList.remove('focus-indicators');
    }
    localStorage.setItem('focusIndicators', enabled);
}

// Settings Management
function loadSettings() {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Load color scheme
    const savedScheme = localStorage.getItem('colorScheme') || 'blue';
    setColorScheme(savedScheme);
    
    // Load layout density
    const savedDensity = localStorage.getItem('layoutDensity') || 'comfortable';
    const densityRadio = document.querySelector(`input[name="density"][value="${savedDensity}"]`);
    if (densityRadio) {
        densityRadio.checked = true;
        setLayoutDensity(savedDensity);
    }
    
    // Load text size
    const savedTextSize = localStorage.getItem('textSize') || '3';
    const textSizeSlider = document.getElementById('textSizeSlider');
    if (textSizeSlider) {
        textSizeSlider.value = savedTextSize;
        setTextSize(savedTextSize);
    }
    
    // Load accessibility settings
    const highContrast = localStorage.getItem('highContrast') === 'true';
    const reducedMotion = localStorage.getItem('reducedMotion') === 'true';
    const focusIndicators = localStorage.getItem('focusIndicators') !== 'false';
    
    if (document.getElementById('highContrastToggle')) document.getElementById('highContrastToggle').checked = highContrast;
    if (document.getElementById('reducedMotionToggle')) document.getElementById('reducedMotionToggle').checked = reducedMotion;
    if (document.getElementById('focusIndicatorsToggle')) document.getElementById('focusIndicatorsToggle').checked = focusIndicators;
    
    setHighContrast(highContrast);
    setReducedMotion(reducedMotion);
    setFocusIndicators(focusIndicators);
    
    // Load notification settings
    const pushNotifications = localStorage.getItem('pushNotifications') !== 'false';
    const emailNotifications = localStorage.getItem('emailNotifications') === 'true';
    
    if (document.getElementById('pushNotificationsToggle')) document.getElementById('pushNotificationsToggle').checked = pushNotifications;
    if (document.getElementById('emailNotificationsToggle')) document.getElementById('emailNotificationsToggle').checked = emailNotifications;
    
    // Load privacy settings
    const dataCollection = localStorage.getItem('dataCollection') === 'true';
    const autoLogout = localStorage.getItem('autoLogout') || '30';
    
    if (document.getElementById('dataCollectionToggle')) document.getElementById('dataCollectionToggle').checked = dataCollection;
    if (document.getElementById('autoLogoutSelect')) document.getElementById('autoLogoutSelect').value = autoLogout;
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        // Clear all settings from localStorage
        const keysToKeep = ['userBio', 'userName', 'userTitle', 'profilePicture'];
        const allKeys = Object.keys(localStorage);
        
        allKeys.forEach(key => {
            if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        });
        
        // Reload settings
        loadSettings();
        showNotification('All settings have been reset to defaults!');
    }
}

// ==================== DATABASE-POWERED FUNCTIONS ====================

async function loadCurrentUser() {
    try {
        // In a real app, you'd get this from login/session
        const user = await db.getUserByUsername('jane.smith');
        if (user) {
            currentUser = user;
            
            // Load all users for chatroom
            allUsers = await db.getAllActiveUsers();
            
            await loadUserProfile();
            await loadUserSettings();
            await loadRecentActivity();
            updateUIWithUserData();
            
            // Initialize user switcher
            initializeUserSwitcher();
            
            // Initialize chatroom if needed
            initChatroom();
        }
    } catch (error) {
        console.error('Error loading user:', error);
        // Fallback to default data
        setupDefaultUser();
    }
}

async function loadUserProfile() {
    if (!currentUser) return;
    
    try {
        const profile = await db.getUserProfile(currentUser.user_id);
        if (profile) {
            currentUser.profile = profile;
            console.log('Loaded user profile:', profile);
        } else {
            console.warn('No profile found for user:', currentUser.user_id);
            // Set default profile if none exists
            currentUser.profile = {
                theme_preference: 'light',
                color_scheme: 'blue',
                layout_density: 'comfortable',
                text_size: 'medium',
                high_contrast_mode: false,
                reduced_motion: false,
                focus_indicators: true
            };
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        // Set default profile on error
        currentUser.profile = {
            theme_preference: 'light',
            color_scheme: 'blue',
            layout_density: 'comfortable',
            text_size: 'medium',
            high_contrast_mode: false,
            reduced_motion: false,
            focus_indicators: true
        };
    }
}

async function loadUserSettings() {
    if (!currentUser) return;
    
    try {
        const settings = await db.getUserSettings(currentUser.user_id);
        currentUser.settings = settings;
    } catch (error) {
        console.error('Error loading user settings:', error);
    }
}

async function loadRecentActivity() {
    if (!currentUser) return;
    
    try {
        const activities = await db.getRecentActivity(currentUser.user_id, 10);
        currentUser.recentActivity = activities;
    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

function updateUIWithUserData() {
    if (!currentUser) return;

    // Update header
    const userInfoElements = document.querySelectorAll('.user-info span');
    userInfoElements.forEach(element => {
        element.textContent = `${currentUser.first_name} ${currentUser.last_name}`;
    });

    const userImages = document.querySelectorAll('.user-info img, .profile-image img');
    userImages.forEach(img => {
        img.src = currentUser.profile_picture_url;
        img.alt = `${currentUser.first_name} ${currentUser.last_name}`;
    });

    // Update profile page
    updateProfilePage();

    // Apply user preferences
    applyUserPreferences();

    // Update recent activity
    updateRecentActivityUI();
}

function updateProfilePage() {
    if (!currentUser) return;

    const profileName = document.querySelector('.profile-info h2');
    const profileTitle = document.querySelector('.profile-info p');
    const profileBio = document.getElementById('bio-text');
    const memberSince = document.querySelector('.member-since');

    if (profileName) profileName.textContent = `${currentUser.first_name} ${currentUser.last_name}`;
    if (profileTitle) profileTitle.textContent = currentUser.job_title;
    if (profileBio) profileBio.textContent = currentUser.bio;
    if (memberSince && currentUser.hire_date) {
        const hireDate = new Date(currentUser.hire_date);
        memberSince.textContent = `Member since ${hireDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }

    // Update profile details grid
    updateProfileDetails();
}

function updateProfileDetails() {
    const detailGrid = document.querySelector('.detail-grid');
    if (!detailGrid || !currentUser) return;

    detailGrid.innerHTML = `
        <div class="detail-item">
            <label>Full Name</label>
            <p>${currentUser.first_name} ${currentUser.last_name}</p>
        </div>
        <div class="detail-item">
            <label>Email</label>
            <p>${currentUser.email}</p>
        </div>
        <div class="detail-item">
            <label>Phone</label>
            <p>${currentUser.phone_number}</p>
        </div>
        <div class="detail-item">
            <label>Location</label>
            <p>${currentUser.location}</p>
        </div>
        <div class="detail-item">
            <label>Department</label>
            <p>${currentUser.department}</p>
        </div>
        <div class="detail-item">
            <label>Employee ID</label>
            <p>${currentUser.employee_id}</p>
        </div>
    `;
}

function applyUserPreferences() {
    if (!currentUser || !currentUser.profile) return;

    const profile = currentUser.profile;

    // Apply theme
    if (profile.theme_preference) {
        setTheme(profile.theme_preference);
        
        // Update theme selector UI
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-theme') === profile.theme_preference) {
                option.classList.add('active');
            }
        });
    }

    // Apply color scheme
    if (profile.color_scheme) {
        setColorScheme(profile.color_scheme);
        
        // Update color scheme selector UI
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-scheme') === profile.color_scheme) {
                option.classList.add('active');
            }
        });
    }

    // Apply layout density
    if (profile.layout_density) {
        setLayoutDensity(profile.layout_density);
        
        // Update layout density radio buttons
        const densityRadio = document.querySelector(`input[name="density"][value="${profile.layout_density}"]`);
        if (densityRadio) {
            densityRadio.checked = true;
        }
    }

    // Apply accessibility settings
    if (profile.text_size) {
        setTextSize(profile.text_size);
        const textSizeSlider = document.getElementById('textSizeSlider');
        if (textSizeSlider) {
            textSizeSlider.value = profile.text_size;
        }
    }

    if (profile.high_contrast_mode !== undefined) {
        setHighContrast(profile.high_contrast_mode);
        const highContrastToggle = document.getElementById('highContrastToggle');
        if (highContrastToggle) {
            highContrastToggle.checked = profile.high_contrast_mode;
        }
    }

    if (profile.reduced_motion !== undefined) {
        setReducedMotion(profile.reduced_motion);
        const reducedMotionToggle = document.getElementById('reducedMotionToggle');
        if (reducedMotionToggle) {
            reducedMotionToggle.checked = profile.reduced_motion;
        }
    }

    if (profile.focus_indicators !== undefined) {
        setFocusIndicators(profile.focus_indicators);
        const focusIndicatorsToggle = document.getElementById('focusIndicatorsToggle');
        if (focusIndicatorsToggle) {
            focusIndicatorsToggle.checked = profile.focus_indicators;
        }
    }
}

function updateRecentActivityUI() {
    if (!currentUser || !currentUser.recentActivity) return;

    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    activityList.innerHTML = currentUser.recentActivity.map(activity => `
        <li class="activity-item">
            <div class="activity-icon" style="background-color: ${getActivityColor(activity.activity_type)};">
                <i class="fas ${getActivityIcon(activity.activity_type)}"></i>
            </div>
            <div class="activity-details">
                <h4>${activity.activity_description}</h4>
                <p>${formatActivityDetails(activity)}</p>
            </div>
            <span>${formatTimeAgo(activity.created_at)}</span>
        </li>
    `).join('');
}

function getActivityColor(activityType) {
    const colors = {
        'login': '#3a7bd5',
        'profile_update': '#00d2ff',
        'settings_change': '#ff9a9e',
        'dashboard_view': '#a8e6cf',
        'chat_message': '#a8e6cf'
    };
    return colors[activityType] || '#3a7bd5';
}

function getActivityIcon(activityType) {
    const icons = {
        'login': 'fa-sign-in-alt',
        'profile_update': 'fa-user-edit',
        'settings_change': 'fa-cog',
        'dashboard_view': 'fa-chart-line',
        'chat_message': 'fa-comments'
    };
    return icons[activityType] || 'fa-circle';
}

function formatActivityDetails(activity) {
    return activity.activity_description || 'System activity';
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
}

// Fallback function if database fails
function setupDefaultUser() {
    currentUser = {
        user_id: 1,
        username: 'jane.smith',
        first_name: 'Jane',
        last_name: 'Smith',
        profile_picture_url: 'https://randomuser.me/api/portraits/women/44.jpg',
        job_title: 'Senior Marketing Manager',
        bio: 'Experienced marketing professional with over 8 years in digital marketing strategy, brand development, and team leadership. Passionate about data-driven decision making and innovative campaign strategies.',
        department: 'Marketing',
        email: 'jane.smith@company.com',
        phone_number: '+1 (555) 123-4567',
        location: 'New York, USA',
        employee_id: 'EMP-2048',
        hire_date: '2023-01-15',
        profile: {
            theme_preference: 'light',
            color_scheme: 'blue',
            layout_density: 'comfortable',
            text_size: 'medium'
        }
    };
    
    // Create mock users for switcher
    allUsers = [
        currentUser,
        {
            user_id: 2,
            username: 'john.doe',
            first_name: 'John',
            last_name: 'Doe',
            profile_picture_url: 'https://randomuser.me/api/portraits/men/32.jpg',
            job_title: 'Senior Software Engineer',
            department: 'Engineering',
            last_login: new Date().toISOString()
        }
    ];
    
    updateUIWithUserData();
    initializeUserSwitcher();
}

// ==================== USER SWITCHER FUNCTIONS ====================

function initializeUserSwitcher() {
    console.log('Initializing user switcher with', allUsers.length, 'users');
    populateUserDropdown();
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    
    if (dropdown.style.display === 'block') {
        closeUserDropdown();
    } else {
        openUserDropdown();
    }
}

function openUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    
    // Create backdrop if it doesn't exist
    let backdrop = document.getElementById('dropdown-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'dropdown-backdrop';
        backdrop.className = 'dropdown-backdrop';
        backdrop.onclick = closeUserDropdown;
        document.body.appendChild(backdrop);
    }
    
    dropdown.style.display = 'block';
    backdrop.style.display = 'block';
    
    // Populate user list if not already done
    populateUserDropdown();
}

function closeUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    const backdrop = document.getElementById('dropdown-backdrop');
    
    if (dropdown) {
        dropdown.style.display = 'none';
    }
    if (backdrop) {
        backdrop.style.display = 'none';
    }
}

function populateUserDropdown() {
    const userList = document.getElementById('switch-user-list');
    if (!userList || allUsers.length === 0) return;
    
    userList.innerHTML = allUsers.map(user => {
        const isCurrentUser = currentUser && user.user_id === currentUser.user_id;
        const status = getUserStatus(user.last_login);
        
        return `
            <button class="switch-user-item ${isCurrentUser ? 'active' : ''}" onclick="switchUser(${user.user_id})">
                <img class="user-avatar-sm" src="${user.profile_picture_url}" alt="${user.first_name}">
                <div class="user-details-sm">
                    <div class="user-name-sm">${user.first_name} ${user.last_name}</div>
                    <div class="user-role-sm">${user.job_title}</div>
                    <div class="user-department-sm">${user.department}</div>
                </div>
                <div class="user-status ${status}"></div>
            </button>
        `;
    }).join('');
}

function getUserStatus(lastLogin) {
    if (!lastLogin) return 'offline';
    
    const lastLoginTime = new Date(lastLogin);
    const now = new Date();
    const diffMs = now - lastLoginTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    // Consider user online if they've been active in the last 10 minutes
    return diffMins <= 10 ? 'online' : 'offline';
}

async function switchUser(userId) {
    const user = allUsers.find(u => u.user_id === userId);
    if (!user) return;

    showNotification(`Switching to ${user.first_name} ${user.last_name}...`);
    closeUserDropdown();

    // Update current user
    currentUser = user;
    
    // Load the new user's complete data
    try {
        await loadUserProfile();
        await loadUserSettings();
        await loadRecentActivity();
        
        // Update user's last login
        await db.updateUserLastLogin(userId);
    } catch (error) {
        console.error('Error loading user data:', error);
    }

    // Update UI with new user data
    updateUIWithUserData();
    
    // Apply user preferences (this was missing!)
    applyUserPreferences();
    
    // Update chatroom if it's active
    if (document.getElementById('chat-view').classList.contains('active-view')) {
        await loadChatMessages();
        updateOnlineUsers();
    }

    showNotification(`Welcome back, ${user.first_name}!`);
}


// ==================== CHATROOM FUNCTIONALITY ====================

let chatMessages = [];
let emojiPickerVisible = false;
let userListVisible = true;

function initChatroom() {
    console.log('Initializing chatroom...');
    loadChatMessages();
    setupChatEventListeners();
    startChatUpdates();
}

async function loadChatMessages() {
    try {
        const previousCount = chatMessages.length;
        chatMessages = await db.getChatMessages(100);
        
        // Only re-render if messages actually changed
        if (chatMessages.length !== previousCount || lastMessageCount !== chatMessages.length) {
            renderChatMessages();
            scrollToBottom();
            lastMessageCount = chatMessages.length;
        }
    } catch (error) {
        console.error('Error loading chat messages:', error);
    }
}

// Update the sendMessage function to force a refresh
async function sendMessage() {
    const input = document.getElementById('message-input');
    if (!input || !currentUser) return;

    const messageText = input.value.trim();
    if (!messageText) return;

    try {
        input.disabled = true;
        
        await db.saveChatMessage(currentUser.user_id, messageText, 'text');
        
        input.value = '';
        updateCharCount();
        
        // Force refresh of messages
        await loadChatMessages();
        
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Error sending message. Please try again.', 'error');
    } finally {
        input.disabled = false;
        input.focus();
    }
}

function renderChatMessages() {
    const container = document.getElementById('messages-container');
    if (!container) return;

    container.innerHTML = chatMessages.map(message => {
        const user = allUsers.find(u => u.user_id === message.user_id);
        const isOwnMessage = currentUser && message.user_id === currentUser.user_id;
        const messageTime = formatMessageTime(message.timestamp);
        
        if (!user) return '';

        return `
            <div class="message ${isOwnMessage ? 'own-message' : ''}">
                <img class="message-avatar" src="${user.profile_picture_url}" alt="${user.first_name}">
                <div class="message-content">
                    <div class="message-sender">${user.first_name} ${user.last_name}</div>
                    <div class="message-bubble">
                        <div class="message-text">${escapeHtml(message.message_text)}</div>
                        <div class="message-time">${messageTime}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Add system message if no messages
    if (chatMessages.length === 0) {
        container.innerHTML = `
            <div class="system-message">
                <div class="message-bubble">
                    No messages yet. Start the conversation! 💬
                </div>
            </div>
        `;
    }
}

function formatMessageTime(timestamp) {
    const messageTime = new Date(timestamp);
    const now = new Date();
    const diffMs = now - messageTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return messageTime.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function setupChatEventListeners() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    if (messageInput) {
        // Send message on Enter key
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Update character count
        messageInput.addEventListener('input', updateCharCount);
    }

    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    // Search functionality
    const chatSearch = document.getElementById('chat-search');
    if (chatSearch) {
        chatSearch.addEventListener('input', filterMessages);
    }
}

function updateCharCount() {
    const input = document.getElementById('message-input');
    const charCount = document.getElementById('char-count');
    if (input && charCount) {
        const count = input.value.length;
        charCount.textContent = `${count}/500`;
        
        // Change color when approaching limit
        if (count > 450) {
            charCount.style.color = '#dc3545';
        } else if (count > 400) {
            charCount.style.color = '#ffc107';
        } else {
            charCount.style.color = '#999';
        }
    }
}

async function sendMessage() {
    const input = document.getElementById('message-input');
    if (!input || !currentUser) return;

    const messageText = input.value.trim();
    if (!messageText) return;

    try {
        // Disable input while sending
        input.disabled = true;
        
        // Save message to database
        await db.saveChatMessage(currentUser.user_id, messageText, 'text');
        
        // Clear input
        input.value = '';
        updateCharCount();
        
        // Reload messages to show the new one
        await loadChatMessages();
        
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Error sending message. Please try again.', 'error');
    } finally {
        input.disabled = false;
        input.focus();
    }
}

function toggleEmojiPicker() {
    const picker = document.getElementById('emoji-picker');
    if (!picker) return;

    emojiPickerVisible = !emojiPickerVisible;
    picker.style.display = emojiPickerVisible ? 'block' : 'none';
}

function addEmoji(emoji) {
    const input = document.getElementById('message-input');
    if (input) {
        input.value += emoji;
        input.focus();
        updateCharCount();
    }
    toggleEmojiPicker();
}

function toggleUserList() {
    const sidebar = document.querySelector('.chat-sidebar');
    if (sidebar) {
        userListVisible = !userListVisible;
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('mobile-open', userListVisible);
        } else {
            sidebar.style.display = userListVisible ? 'flex' : 'none';
        }
    }
}

function filterMessages() {
    const searchTerm = document.getElementById('chat-search').value.toLowerCase();
    const messages = document.querySelectorAll('.message');
    
    messages.forEach(message => {
        const text = message.textContent.toLowerCase();
        message.style.display = text.includes(searchTerm) ? 'flex' : 'none';
    });
}

function scrollToBottom() {
    const container = document.getElementById('messages-container');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

function updateOnlineUsers() {
    const userList = document.getElementById('chat-user-list');
    const onlineCount = document.getElementById('online-count');
    
    if (!userList || !onlineCount) return;

    const onlineUsers = allUsers.filter(user => getUserStatus(user.last_login) === 'online');
    onlineCount.textContent = `${onlineUsers.length} online`;

    userList.innerHTML = onlineUsers.map(user => `
        <button class="user-item ${user.user_id === currentUser?.user_id ? 'active' : ''}">
            <img class="user-avatar" src="${user.profile_picture_url}" alt="${user.first_name}">
            <div class="user-details">
                <div class="user-name">${user.first_name} ${user.last_name}</div>
                <div class="user-role">${user.job_title}</div>
            </div>
            <div class="user-status online"></div>
        </button>
    `).join('');
}

async function clearChat() {
    if (!confirm('Are you sure you want to clear all chat messages? This action cannot be undone.')) {
        return;
    }

    try {
        await db.clearChatMessages();
        await loadChatMessages();
        showNotification('Chat cleared successfully');
    } catch (error) {
        console.error('Error clearing chat:', error);
        showNotification('Error clearing chat', 'error');
    }
}

function startChatUpdates() {
    // Reduce refresh rate from 5 seconds to 30 seconds for better performance
    setInterval(async () => {
        if (document.getElementById('chat-view').classList.contains('active-view')) {
            await loadChatMessages();
            updateOnlineUsers();
        }
    }, 30000); // Changed from 5000ms to 30000ms (30 seconds)

    // Initial update
    updateOnlineUsers();
}

// File upload functions (simplified for now)
function handleFileSelect(files) {
    showNotification('File upload functionality coming soon!');
}

function handleImageSelect(files) {
    showNotification('Image upload functionality coming soon!');
}

function removeFile() {
    // Implementation for file removal
}

// ==================== UTILITY FUNCTIONS ====================

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border-left: 4px solid #28a745;
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
            }
            .notification.error {
                border-left-color: #dc3545;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification i {
                font-size: 18px;
            }
            .notification.success i {
                color: #28a745;
            }
            .notification.error i {
                color: #dc3545;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Make functions globally available
window.toggleUserDropdown = toggleUserDropdown;
window.closeUserDropdown = closeUserDropdown;
window.switchUser = switchUser;
window.toggleEmojiPicker = toggleEmojiPicker;
window.addEmoji = addEmoji;
window.toggleUserList = toggleUserList;
window.clearChat = clearChat;
window.sendMessage = sendMessage;
window.handleFileSelect = handleFileSelect;
window.handleImageSelect = handleImageSelect;
window.removeFile = removeFile;