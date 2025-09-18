// Configuration file for Community Fund Management System
// Update these values to customize your application

const CONFIG = {
    // Google Sheets Configuration
    // Replace these with your actual values
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID', // Get this from your Google Sheets URL
    API_KEY: 'YOUR_API_KEY', // Get this from Google Cloud Console
    
    // Application Settings
    APP_NAME: 'Community Fund Management System',
    VERSION: '1.0.0',
    
    // Default Villages
    VILLAGES: ['Chandrapur', 'Mohisguha', 'Chatra'],
    
    // Default Localities for each village
    LOCALITIES: {
        'Chandrapur': ['Main Market', 'Temple Area', 'School Road'],
        'Mohisguha': ['Village Center', 'Market Area', 'Near Hospital'],
        'Chatra': ['Near School', 'Market Street', 'Temple Road']
    },
    
    // Payment Types
    PAYMENT_TYPES: ['Cash', 'Online', 'Other'],
    
    // User Roles
    ROLES: {
        ADMIN: 'admin',
        CORE_TEAM: 'core_team',
        VILLAGE_MANAGER: 'village_manager',
        MENTOR: 'mentor'
    },
    
    // Default Users (can be overridden by Google Sheets)
    DEFAULT_USERS: {
        'Firoj': { 
            password: 'Firoj#786', 
            role: 'admin', 
            name: 'Firoj (Admin)' 
        },
        'User1': { 
            password: '123', 
            role: 'core_team', 
            name: 'User 1 (Core Team)' 
        },
        'User2': { 
            password: '123', 
            role: 'core_team', 
            name: 'User 2 (Core Team)' 
        },
        'User3': { 
            password: '123', 
            role: 'core_team', 
            name: 'User 3 (Core Team)' 
        },
        'User4': { 
            password: '123', 
            role: 'core_team', 
            name: 'User 4 (Core Team)' 
        },
        'User5': { 
            password: '123', 
            role: 'core_team', 
            name: 'User 5 (Core Team)' 
        },
        'ChandrapurManager': { 
            password: '123', 
            role: 'village_manager', 
            name: 'Chandrapur Manager', 
            village: 'Chandrapur' 
        },
        'MohisguhaManager': { 
            password: '123', 
            role: 'village_manager', 
            name: 'Mohisguha Manager', 
            village: 'Mohisguha' 
        },
        'ChatraManager': { 
            password: '123', 
            role: 'village_manager', 
            name: 'Chatra Manager', 
            village: 'Chatra' 
        }
    },
    
    // Chart Colors (Iron Man/Jarvis theme)
    CHART_COLORS: {
        PRIMARY: 'rgba(0, 212, 255, 0.8)',
        SECONDARY: 'rgba(0, 255, 136, 0.8)',
        ACCENT: 'rgba(255, 107, 53, 0.8)',
        SUCCESS: 'rgba(0, 255, 136, 0.8)',
        WARNING: 'rgba(255, 170, 0, 0.8)',
        ERROR: 'rgba(255, 68, 68, 0.8)'
    },
    
    // Export Settings
    EXPORT: {
        EXCEL_FILENAME: 'contributions.xlsx',
        CSV_FILENAME: 'contributions.csv',
        PDF_FILENAME: 'contributions.pdf'
    },
    
    // UI Settings
    UI: {
        THEME: 'dark',
        ANIMATION_SPEED: 300,
        CHART_ANIMATION_DURATION: 1000
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}

