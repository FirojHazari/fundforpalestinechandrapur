// Community Fund Management System
// Iron Man / Jarvis Inspired Interface

class FundManagementSystem {
    constructor() {
        this.currentUser = null;
        this.contributions = [];
        this.mentors = [];
        this.villages = ['Chandrapur', 'Mohisguha', 'Chatra'];
        this.localities = {
            'Chandrapur': [],
            'Mohisguha': [],
            'Chatra': []
        };
        
        // User credentials and roles
        this.users = {
            'Firoj': { password: 'Firoj#786', role: 'admin', name: 'Firoj (Admin)' },
            'User1': { password: '123', role: 'core_team', name: 'User 1 (Core Team)' },
            'User2': { password: '123', role: 'core_team', name: 'User 2 (Core Team)' },
            'User3': { password: '123', role: 'core_team', name: 'User 3 (Core Team)' },
            'User4': { password: '123', role: 'core_team', name: 'User 4 (Core Team)' },
            'User5': { password: '123', role: 'core_team', name: 'User 5 (Core Team)' },
            'ChandrapurManager': { password: '123', role: 'village_manager', name: 'Chandrapur Manager', village: 'Chandrapur' },
            'MohisguhaManager': { password: '123', role: 'village_manager', name: 'Mohisguha Manager', village: 'Mohisguha' },
            'ChatraManager': { password: '123', role: 'village_manager', name: 'Chatra Manager', village: 'Chatra' }
        };
        
        this.charts = {};
        this.sheetsIntegration = null;
        this.useGoogleSheets = false;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.initializeDataStorage();
        this.setupDateInputs();
    }

    async initializeDataStorage() {
        // Always try to initialize Google Sheets integration first
        if (window.GoogleSheetsIntegration) {
            try {
                this.sheetsIntegration = new GoogleSheetsIntegration();
                const initialized = await this.sheetsIntegration.init();
                if (initialized) {
                    this.useGoogleSheets = true;
                    await this.loadDataFromSheets();
                    console.log('Google Sheets integration enabled - data synced from spreadsheet');
                    return;
                }
            } catch (error) {
                console.warn('Google Sheets integration failed:', error);
            }
        }
        
        // Fallback to local storage
        this.loadSampleData();
        this.loadFromLocalStorage();
        console.log('Using local storage as fallback');
    }

    async loadDataFromSheets() {
        try {
            const data = await this.sheetsIntegration.syncData();
            if (data) {
                this.contributions = data.contributions || [];
                this.mentors = data.mentors || [];
                this.users = { ...this.users, ...data.users };
            }
        } catch (error) {
            console.error('Error loading data from sheets:', error);
            this.loadSampleData();
        }
    }

    loadFromLocalStorage() {
        try {
            // Load from localStorage if available
            const savedContributions = localStorage.getItem('contributions');
            const savedMentors = localStorage.getItem('mentors');
            const savedVillages = localStorage.getItem('villages');
            const savedLocalities = localStorage.getItem('localities');
            const savedUsers = localStorage.getItem('users');
            
            if (savedContributions) {
                this.contributions = JSON.parse(savedContributions);
            }
            if (savedMentors) {
                this.mentors = JSON.parse(savedMentors);
            }
            if (savedVillages) {
                this.villages = JSON.parse(savedVillages);
            }
            if (savedLocalities) {
                this.localities = JSON.parse(savedLocalities);
            }
            if (savedUsers) {
                this.users = { ...this.users, ...JSON.parse(savedUsers) };
            }
            console.log('Data loaded from localStorage successfully');
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('contributions', JSON.stringify(this.contributions));
            localStorage.setItem('mentors', JSON.stringify(this.mentors));
            localStorage.setItem('villages', JSON.stringify(this.villages));
            localStorage.setItem('localities', JSON.stringify(this.localities));
            localStorage.setItem('users', JSON.stringify(this.users));
            console.log('Data saved to localStorage successfully');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // Add contribution button
        document.getElementById('addContributionBtn').addEventListener('click', () => {
            this.openContributionModal();
        });

        // Refresh data button
        document.getElementById('refreshDataBtn').addEventListener('click', async () => {
            await this.syncWithGoogleSheets();
            this.loadContributions();
            this.loadDashboard();
        });

        // Add mentor button
        document.getElementById('addMentorBtn').addEventListener('click', () => {
            this.openMentorModal();
        });

        // Form submissions
        document.getElementById('contributionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContribution();
        });

        document.getElementById('mentorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMentor();
        });

        // Filter buttons
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Export buttons
        document.getElementById('exportExcel').addEventListener('click', () => {
            this.exportToExcel();
        });

        document.getElementById('exportCSV').addEventListener('click', () => {
            this.exportToCSV();
        });

        document.getElementById('exportPDF').addEventListener('click', () => {
            this.exportToPDF();
        });

        // Cancel buttons
        document.getElementById('cancelContribution').addEventListener('click', () => {
            this.closeModal(document.getElementById('contributionModal'));
        });

        document.getElementById('cancelMentor').addEventListener('click', () => {
            this.closeModal(document.getElementById('mentorModal'));
        });

        // Add user and village buttons
        document.getElementById('addUserBtn').addEventListener('click', () => {
            this.openUserModal();
        });

        document.getElementById('addVillageBtn').addEventListener('click', () => {
            this.openVillageModal();
        });

        // User and village form submissions
        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUser();
        });

        document.getElementById('villageForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveVillage();
        });

        // Cancel buttons for user and village modals
        document.getElementById('cancelUser').addEventListener('click', () => {
            this.closeModal(document.getElementById('userModal'));
        });

        document.getElementById('cancelVillage').addEventListener('click', () => {
            this.closeModal(document.getElementById('villageModal'));
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
    }

    setupDateInputs() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('contributionDate').value = today;
    }

    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        if (this.users[username] && this.users[username].password === password) {
            this.currentUser = { username, ...this.users[username] };
            this.showMainApp();
            this.updateUserInterface();
            
            // Always try to sync with Google Sheets on login
            await this.syncWithGoogleSheets();
            
            this.loadDashboard();
            errorDiv.style.display = 'none';
        } else {
            errorDiv.textContent = 'Invalid username or password';
            errorDiv.style.display = 'block';
        }
    }

    async syncWithGoogleSheets() {
        // Always try to sync with Google Sheets if available
        if (window.GoogleSheetsIntegration) {
            try {
                if (!this.sheetsIntegration) {
                    this.sheetsIntegration = new GoogleSheetsIntegration();
                    const initialized = await this.sheetsIntegration.init();
                    if (initialized) {
                        this.useGoogleSheets = true;
                    }
                }
                
                if (this.useGoogleSheets && this.sheetsIntegration) {
                    console.log('Syncing with Google Sheets...');
                    this.showMessage('Syncing with Google Sheets...', 'info');
                    await this.loadDataFromSheets();
                    console.log('Data synced successfully from Google Sheets');
                    this.showMessage('✅ Data synced with Google Sheets', 'success');
                }
            } catch (error) {
                console.error('Error syncing with Google Sheets:', error);
                this.showMessage('⚠️ Could not sync with Google Sheets. Using local data.', 'error');
            }
        }
    }

    logout() {
        this.currentUser = null;
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('loginForm').reset();
        document.getElementById('loginError').style.display = 'none';
    }

    showMainApp() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
    }

    updateUserInterface() {
        // Update user info
        document.getElementById('userInfo').textContent = this.currentUser.name;

        // Show/hide settings tab based on role
        const settingsTab = document.getElementById('settingsTab');
        if (this.currentUser.role === 'admin') {
            settingsTab.style.display = 'flex';
        } else {
            settingsTab.style.display = 'none';
        }

        // Update village filter based on role
        const villageFilter = document.getElementById('villageFilter');
        if (this.currentUser.role === 'village_manager') {
            // Village managers can only see their village
            villageFilter.innerHTML = `<option value="${this.currentUser.village}">${this.currentUser.village}</option>`;
            villageFilter.disabled = true;
        } else {
            // Core team and admin can see all villages
            villageFilter.innerHTML = `
                <option value="">All Villages</option>
                <option value="Chandrapur">Chandrapur</option>
                <option value="Mohisguha">Mohisguha</option>
                <option value="Chatra">Chatra</option>
            `;
            villageFilter.disabled = false;
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Load specific tab data
        if (tabName === 'dashboard') {
            this.loadDashboard();
        } else if (tabName === 'contributions') {
            this.loadContributions();
        } else if (tabName === 'mentors') {
            this.loadMentors();
        } else if (tabName === 'reports') {
            this.loadReports();
        }
    }

    loadSampleData() {
        // Sample contributions
        this.contributions = [
            {
                id: 1,
                donorName: 'Rajesh Kumar',
                donorContact: '9876543210',
                village: 'Chandrapur',
                locality: 'Main Market',
                amount: 5000,
                paymentType: 'Cash',
                date: '2024-01-15'
            },
            {
                id: 2,
                donorName: 'Priya Sharma',
                donorContact: '9876543211',
                village: 'Mohisguha',
                locality: 'Village Center',
                amount: 3000,
                paymentType: 'Online',
                date: '2024-01-16'
            },
            {
                id: 3,
                donorName: 'Amit Singh',
                donorContact: '9876543212',
                village: 'Chatra',
                locality: 'Near School',
                amount: 7500,
                paymentType: 'Cash',
                date: '2024-01-17'
            },
            {
                id: 4,
                donorName: 'Sunita Devi',
                donorContact: '9876543213',
                village: 'Chandrapur',
                locality: 'Temple Area',
                amount: 2000,
                paymentType: 'Other',
                date: '2024-01-18'
            }
        ];

        // Sample mentors
        this.mentors = [
            {
                id: 1,
                name: 'Dr. Ramesh Kumar',
                contact: '9876543200',
                village: 'Chandrapur',
                locality: 'Main Market'
            },
            {
                id: 2,
                name: 'Mrs. Geeta Singh',
                contact: '9876543201',
                village: 'Mohisguha',
                locality: 'Village Center'
            },
            {
                id: 3,
                name: 'Mr. Suresh Yadav',
                contact: '9876543202',
                village: 'Chatra',
                locality: 'Near School'
            }
        ];

        // Sample localities
        this.localities = {
            'Chandrapur': ['Main Market', 'Temple Area', 'School Road'],
            'Mohisguha': ['Village Center', 'Market Area', 'Near Hospital'],
            'Chatra': ['Near School', 'Market Street', 'Temple Road']
        };
    }

    loadDashboard() {
        this.updateDashboardStats();
        this.createCharts();
    }

    updateDashboardStats() {
        const totalFunds = this.contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
        const totalContributors = new Set(this.contributions.map(c => c.donorName)).size;
        const today = new Date().toISOString().split('T')[0];
        const todayContributions = this.contributions
            .filter(c => c.date === today)
            .reduce((sum, contrib) => sum + contrib.amount, 0);

        document.getElementById('totalFunds').textContent = `₹${totalFunds.toLocaleString()}`;
        document.getElementById('totalContributors').textContent = totalContributors;
        document.getElementById('todayContributions').textContent = `₹${todayContributions.toLocaleString()}`;
    }

    createCharts() {
        this.createVillageChart();
        this.createPaymentChart();
        this.createGrowthChart();
    }

    createVillageChart() {
        const ctx = document.getElementById('villageChart').getContext('2d');
        
        if (this.charts.village) {
            this.charts.village.destroy();
        }

        const villageData = this.villages.map(village => {
            const total = this.contributions
                .filter(c => c.village === village)
                .reduce((sum, contrib) => sum + contrib.amount, 0);
            return total;
        });

        this.charts.village = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.villages,
                datasets: [{
                    label: 'Funds Collected',
                    data: villageData,
                    backgroundColor: [
                        'rgba(0, 212, 255, 0.8)',
                        'rgba(0, 255, 136, 0.8)',
                        'rgba(255, 107, 53, 0.8)'
                    ],
                    borderColor: [
                        'rgba(0, 212, 255, 1)',
                        'rgba(0, 255, 136, 1)',
                        'rgba(255, 107, 53, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#b0b0b0',
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: '#333333'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#b0b0b0'
                        },
                        grid: {
                            color: '#333333'
                        }
                    }
                }
            }
        });
    }

    createPaymentChart() {
        const ctx = document.getElementById('paymentChart').getContext('2d');
        
        if (this.charts.payment) {
            this.charts.payment.destroy();
        }

        const paymentTypes = ['Cash', 'Online', 'Other'];
        const paymentData = paymentTypes.map(type => {
            return this.contributions
                .filter(c => c.paymentType === type)
                .reduce((sum, contrib) => sum + contrib.amount, 0);
        });

        this.charts.payment = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: paymentTypes,
                datasets: [{
                    data: paymentData,
                    backgroundColor: [
                        'rgba(0, 212, 255, 0.8)',
                        'rgba(0, 255, 136, 0.8)',
                        'rgba(255, 107, 53, 0.8)'
                    ],
                    borderColor: [
                        'rgba(0, 212, 255, 1)',
                        'rgba(0, 255, 136, 1)',
                        'rgba(255, 107, 53, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }

    createGrowthChart() {
        const ctx = document.getElementById('growthChart').getContext('2d');
        
        if (this.charts.growth) {
            this.charts.growth.destroy();
        }

        // Create last 7 days data
        const last7Days = [];
        const growthData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            last7Days.push(date.toLocaleDateString());
            
            const dayTotal = this.contributions
                .filter(c => c.date === dateStr)
                .reduce((sum, contrib) => sum + contrib.amount, 0);
            growthData.push(dayTotal);
        }

        this.charts.growth = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Daily Collections',
                    data: growthData,
                    borderColor: 'rgba(0, 212, 255, 1)',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#b0b0b0',
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: '#333333'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#b0b0b0'
                        },
                        grid: {
                            color: '#333333'
                        }
                    }
                }
            }
        });
    }

    loadContributions() {
        this.displayContributions(this.contributions);
    }

    displayContributions(contributions) {
        const tbody = document.getElementById('contributionsTableBody');
        tbody.innerHTML = '';

        contributions.forEach(contrib => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(contrib.date).toLocaleDateString()}</td>
                <td>${contrib.donorName}</td>
                <td>${contrib.village}</td>
                <td>${contrib.locality}</td>
                <td>₹${contrib.amount.toLocaleString()}</td>
                <td><span class="payment-badge ${contrib.paymentType.toLowerCase()}">${contrib.paymentType}</span></td>
                <td>
                    <button class="btn-secondary" onclick="app.editContribution(${contrib.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-secondary" onclick="app.deleteContribution(${contrib.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    applyFilters() {
        const villageFilter = document.getElementById('villageFilter').value;
        const paymentFilter = document.getElementById('paymentFilter').value;
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const searchInput = document.getElementById('searchInput').value.toLowerCase();

        let filteredContributions = this.contributions;

        // Apply role-based filtering
        if (this.currentUser.role === 'village_manager') {
            filteredContributions = filteredContributions.filter(c => c.village === this.currentUser.village);
        }

        // Apply filters
        if (villageFilter) {
            filteredContributions = filteredContributions.filter(c => c.village === villageFilter);
        }

        if (paymentFilter) {
            filteredContributions = filteredContributions.filter(c => c.paymentType === paymentFilter);
        }

        if (dateFrom) {
            filteredContributions = filteredContributions.filter(c => c.date >= dateFrom);
        }

        if (dateTo) {
            filteredContributions = filteredContributions.filter(c => c.date <= dateTo);
        }

        if (searchInput) {
            filteredContributions = filteredContributions.filter(c => 
                c.donorName.toLowerCase().includes(searchInput) ||
                c.donorContact.includes(searchInput)
            );
        }

        this.displayContributions(filteredContributions);
    }

    clearFilters() {
        document.getElementById('villageFilter').value = '';
        document.getElementById('paymentFilter').value = '';
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        document.getElementById('searchInput').value = '';
        this.loadContributions();
    }

    openContributionModal(contribution = null) {
        const modal = document.getElementById('contributionModal');
        const form = document.getElementById('contributionForm');
        
        if (contribution) {
            // Edit mode
            document.getElementById('donorName').value = contribution.donorName;
            document.getElementById('donorContact').value = contribution.donorContact || '';
            document.getElementById('contributionVillage').value = contribution.village;
            document.getElementById('contributionLocality').value = contribution.locality;
            document.getElementById('contributionAmount').value = contribution.amount;
            document.getElementById('contributionPaymentType').value = contribution.paymentType;
            document.getElementById('contributionDate').value = contribution.date;
        } else {
            // Add mode
            form.reset();
            document.getElementById('contributionDate').value = new Date().toISOString().split('T')[0];
        }
        
        modal.style.display = 'block';
    }

    async saveContribution() {
        // Validate form data first
        const donorName = document.getElementById('donorName').value.trim();
        const village = document.getElementById('contributionVillage').value;
        const locality = document.getElementById('contributionLocality').value.trim();
        const amount = document.getElementById('contributionAmount').value;
        const paymentType = document.getElementById('contributionPaymentType').value;
        const date = document.getElementById('contributionDate').value;

        // Basic validation
        if (!donorName || !village || !locality || !amount || !paymentType || !date) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (isNaN(amount) || parseFloat(amount) <= 0) {
            this.showMessage('Please enter a valid amount.', 'error');
            return;
        }

        const contribution = {
            id: Date.now(), // Simple ID generation
            donorName: donorName,
            donorContact: document.getElementById('donorContact').value.trim(),
            village: village,
            locality: locality,
            amount: parseInt(amount),
            paymentType: paymentType,
            date: date
        };

        try {
            // Always add to local array first
            this.contributions.push(contribution);
            
            // Try Google Sheets if available, but don't fail if it doesn't work
            if (this.useGoogleSheets && this.sheetsIntegration) {
                try {
                    const success = await this.sheetsIntegration.saveContribution(contribution);
                    if (!success) {
                        console.warn('Google Sheets save failed, but data saved locally');
                    }
                } catch (sheetsError) {
                    console.warn('Google Sheets error, but data saved locally:', sheetsError);
                }
            }
            
            // Always save to localStorage as backup
            this.saveToLocalStorage();
            
            this.closeModal(document.getElementById('contributionModal'));
            this.loadContributions();
            this.loadDashboard();
            this.showMessage('Contribution saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving contribution:', error);
            // Remove from array if save failed
            this.contributions = this.contributions.filter(c => c.id !== contribution.id);
            this.showMessage('Error saving contribution. Please try again.', 'error');
        }
    }

    editContribution(id) {
        const contribution = this.contributions.find(c => c.id === id);
        if (contribution) {
            this.openContributionModal(contribution);
        }
    }

    deleteContribution(id) {
        if (confirm('Are you sure you want to delete this contribution?')) {
            this.contributions = this.contributions.filter(c => c.id !== id);
            this.loadContributions();
            this.loadDashboard();
            this.showMessage('Contribution deleted successfully!', 'success');
        }
    }

    loadMentors() {
        this.displayMentors();
    }

    displayMentors() {
        const grid = document.getElementById('mentorsGrid');
        grid.innerHTML = '';

        this.mentors.forEach(mentor => {
            const card = document.createElement('div');
            card.className = 'mentor-card';
            card.innerHTML = `
                <h3>${mentor.name}</h3>
                <p><i class="fas fa-phone"></i> ${mentor.contact}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${mentor.village}</p>
                <p><i class="fas fa-home"></i> ${mentor.locality}</p>
                <div class="mentor-actions">
                    <button class="btn-secondary" onclick="app.editMentor(${mentor.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-secondary" onclick="app.deleteMentor(${mentor.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    openMentorModal(mentor = null) {
        const modal = document.getElementById('mentorModal');
        const form = document.getElementById('mentorForm');
        
        if (mentor) {
            // Edit mode
            document.getElementById('mentorName').value = mentor.name;
            document.getElementById('mentorContact').value = mentor.contact;
            document.getElementById('mentorVillage').value = mentor.village;
            document.getElementById('mentorLocality').value = mentor.locality || '';
        } else {
            // Add mode
            form.reset();
        }
        
        modal.style.display = 'block';
    }

    async saveMentor() {
        // Validate form data first
        const name = document.getElementById('mentorName').value.trim();
        const contact = document.getElementById('mentorContact').value.trim();
        const village = document.getElementById('mentorVillage').value;
        const locality = document.getElementById('mentorLocality').value.trim();

        // Basic validation
        if (!name || !contact || !village) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        const mentor = {
            id: Date.now(),
            name: name,
            contact: contact,
            village: village,
            locality: locality
        };

        try {
            // Always add to local array first
            this.mentors.push(mentor);
            
            // Try Google Sheets if available, but don't fail if it doesn't work
            if (this.useGoogleSheets && this.sheetsIntegration) {
                try {
                    const success = await this.sheetsIntegration.saveMentor(mentor);
                    if (!success) {
                        console.warn('Google Sheets save failed, but data saved locally');
                    }
                } catch (sheetsError) {
                    console.warn('Google Sheets error, but data saved locally:', sheetsError);
                }
            }
            
            // Always save to localStorage as backup
            this.saveToLocalStorage();
            
            this.closeModal(document.getElementById('mentorModal'));
            this.loadMentors();
            this.showMessage('Mentor saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving mentor:', error);
            // Remove from array if save failed
            this.mentors = this.mentors.filter(m => m.id !== mentor.id);
            this.showMessage('Error saving mentor. Please try again.', 'error');
        }
    }

    editMentor(id) {
        const mentor = this.mentors.find(m => m.id === id);
        if (mentor) {
            this.openMentorModal(mentor);
        }
    }

    deleteMentor(id) {
        if (confirm('Are you sure you want to delete this mentor?')) {
            this.mentors = this.mentors.filter(m => m.id !== id);
            this.loadMentors();
            this.showMessage('Mentor deleted successfully!', 'success');
        }
    }

    loadReports() {
        this.updateVillagePerformance();
        this.createMonthlyTrendsChart();
    }

    updateVillagePerformance() {
        const container = document.getElementById('villagePerformance');
        container.innerHTML = '';

        this.villages.forEach(village => {
            const villageContributions = this.contributions.filter(c => c.village === village);
            const totalAmount = villageContributions.reduce((sum, c) => sum + c.amount, 0);
            const contributorCount = new Set(villageContributions.map(c => c.donorName)).size;

            const item = document.createElement('div');
            item.className = 'performance-item';
            item.innerHTML = `
                <div>
                    <strong>${village}</strong>
                    <br>
                    <small>${contributorCount} contributors</small>
                </div>
                <div>
                    <strong>₹${totalAmount.toLocaleString()}</strong>
                </div>
            `;
            container.appendChild(item);
        });
    }

    createMonthlyTrendsChart() {
        const ctx = document.getElementById('monthlyTrendsChart').getContext('2d');
        
        if (this.charts.monthly) {
            this.charts.monthly.destroy();
        }

        // Create last 6 months data
        const months = [];
        const monthlyData = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStr = date.toISOString().substring(0, 7); // YYYY-MM
            months.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
            
            const monthTotal = this.contributions
                .filter(c => c.date.startsWith(monthStr))
                .reduce((sum, contrib) => sum + contrib.amount, 0);
            monthlyData.push(monthTotal);
        }

        this.charts.monthly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Monthly Collections',
                    data: monthlyData,
                    borderColor: 'rgba(0, 255, 136, 1)',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#b0b0b0',
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: '#333333'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#b0b0b0'
                        },
                        grid: {
                            color: '#333333'
                        }
                    }
                }
            }
        });
    }

    exportToExcel() {
        const data = this.contributions.map(c => ({
            'Date': c.date,
            'Donor Name': c.donorName,
            'Contact': c.donorContact,
            'Village': c.village,
            'Locality': c.locality,
            'Amount': c.amount,
            'Payment Type': c.paymentType
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Contributions');
        XLSX.writeFile(wb, 'contributions.xlsx');
        this.showMessage('Excel file exported successfully!', 'success');
    }

    exportToCSV() {
        const headers = ['Date', 'Donor Name', 'Contact', 'Village', 'Locality', 'Amount', 'Payment Type'];
        const csvContent = [
            headers.join(','),
            ...this.contributions.map(c => [
                c.date,
                `"${c.donorName}"`,
                `"${c.donorContact}"`,
                `"${c.village}"`,
                `"${c.locality}"`,
                c.amount,
                `"${c.paymentType}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contributions.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        this.showMessage('CSV file exported successfully!', 'success');
    }

    exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text('Community Fund Contributions Report', 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text(`Total Contributions: ${this.contributions.length}`, 20, 40);
        
        const totalAmount = this.contributions.reduce((sum, c) => sum + c.amount, 0);
        doc.text(`Total Amount: ₹${totalAmount.toLocaleString()}`, 20, 50);
        
        // Add table
        const tableData = this.contributions.map(c => [
            c.date,
            c.donorName,
            c.village,
            c.locality,
            `₹${c.amount}`,
            c.paymentType
        ]);
        
        doc.autoTable({
            head: [['Date', 'Donor', 'Village', 'Locality', 'Amount', 'Payment Type']],
            body: tableData,
            startY: 60,
            styles: { fontSize: 8 }
        });
        
        doc.save('contributions.pdf');
        this.showMessage('PDF file exported successfully!', 'success');
    }

    closeModal(modal) {
        modal.style.display = 'none';
    }

    // User Management Methods
    openUserModal(user = null) {
        const modal = document.getElementById('userModal');
        const form = document.getElementById('userForm');
        
        if (user) {
            // Edit mode
            document.getElementById('userUsername').value = user.username;
            document.getElementById('userPassword').value = user.password;
            document.getElementById('userName').value = user.name;
            document.getElementById('userRole').value = user.role;
            document.getElementById('userVillage').value = user.village || '';
        } else {
            // Add mode
            form.reset();
        }
        
        // Show/hide village selection based on role
        const roleSelect = document.getElementById('userRole');
        const villageGroup = document.getElementById('villageGroup');
        
        roleSelect.addEventListener('change', () => {
            if (roleSelect.value === 'village_manager') {
                villageGroup.style.display = 'block';
            } else {
                villageGroup.style.display = 'none';
            }
        });
        
        modal.style.display = 'block';
    }

    async saveUser() {
        const user = {
            username: document.getElementById('userUsername').value,
            password: document.getElementById('userPassword').value,
            name: document.getElementById('userName').value,
            role: document.getElementById('userRole').value,
            village: document.getElementById('userVillage').value || null
        };

        try {
            // Add to users object
            this.users[user.username] = {
                password: user.password,
                role: user.role,
                name: user.name,
                village: user.village
            };

            // Save to localStorage
            this.saveToLocalStorage();
            
            this.closeModal(document.getElementById('userModal'));
            this.showMessage('User saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving user:', error);
            this.showMessage('Error saving user. Please try again.', 'error');
        }
    }

    // Village Management Methods
    openVillageModal(village = null) {
        const modal = document.getElementById('villageModal');
        const form = document.getElementById('villageForm');
        
        if (village) {
            // Edit mode
            document.getElementById('villageName').value = village.name;
            document.getElementById('villageLocalities').value = village.localities.join(', ');
        } else {
            // Add mode
            form.reset();
        }
        
        modal.style.display = 'block';
    }

    async saveVillage() {
        const villageName = document.getElementById('villageName').value;
        const localitiesText = document.getElementById('villageLocalities').value;
        const localities = localitiesText.split(',').map(loc => loc.trim()).filter(loc => loc);

        try {
            // Add to villages array if not exists
            if (!this.villages.includes(villageName)) {
                this.villages.push(villageName);
            }

            // Update localities
            this.localities[villageName] = localities;

            // Save to localStorage
            this.saveToLocalStorage();
            
            this.closeModal(document.getElementById('villageModal'));
            this.showMessage('Village saved successfully!', 'success');
            
            // Update village dropdowns
            this.updateVillageDropdowns();
        } catch (error) {
            console.error('Error saving village:', error);
            this.showMessage('Error saving village. Please try again.', 'error');
        }
    }

    updateVillageDropdowns() {
        // Update all village dropdowns in the application
        const villageSelects = [
            'contributionVillage',
            'mentorVillage',
            'userVillage',
            'villageFilter'
        ];

        villageSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                const currentValue = select.value;
                const hasAllOption = select.querySelector('option[value=""]');
                
                // Clear existing options except "All" or "Select" option
                select.innerHTML = '';
                
                // Add "All" or "Select" option if it existed
                if (hasAllOption) {
                    const allOption = document.createElement('option');
                    allOption.value = '';
                    allOption.textContent = selectId === 'villageFilter' ? 'All Villages' : 'Select Village';
                    select.appendChild(allOption);
                }
                
                // Add villages
                this.villages.forEach(village => {
                    const option = document.createElement('option');
                    option.value = village;
                    option.textContent = village;
                    select.appendChild(option);
                });
                
                // Restore previous value if it still exists
                if (this.villages.includes(currentValue)) {
                    select.value = currentValue;
                }
            }
        });
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Debug function to check system status
    debugSystem() {
        console.log('=== System Debug Info ===');
        console.log('Current User:', this.currentUser);
        console.log('Use Google Sheets:', this.useGoogleSheets);
        console.log('Contributions Count:', this.contributions.length);
        console.log('Mentors Count:', this.mentors.length);
        console.log('Villages:', this.villages);
        console.log('Local Storage Available:', typeof(Storage) !== "undefined");
        console.log('========================');
    }
}

// Initialize the application
const app = new FundManagementSystem();

// Add some CSS for payment badges
const style = document.createElement('style');
style.textContent = `
    .payment-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .payment-badge.cash {
        background: rgba(0, 255, 136, 0.2);
        color: #00ff88;
        border: 1px solid #00ff88;
    }
    .payment-badge.online {
        background: rgba(0, 212, 255, 0.2);
        color: #00d4ff;
        border: 1px solid #00d4ff;
    }
    .payment-badge.other {
        background: rgba(255, 107, 53, 0.2);
        color: #ff6b35;
        border: 1px solid #ff6b35;
    }
`;
document.head.appendChild(style);
