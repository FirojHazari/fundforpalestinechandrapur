// Google Sheets Integration for Community Fund Management System
// This file handles all Google Sheets API interactions

class GoogleSheetsIntegration {
    constructor() {
        this.SPREADSHEET_ID = '1vFeTykyakyL3JUj2ZIz7Y3P3emf2xJlG91-myfBbhiI'; // Your Palestine fund collection spreadsheet
        this.API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
        this.CONTRIBUTIONS_SHEET = 'Sheet1'; // Using Sheet1 as specified
        this.MENTORS_SHEET = 'Mentors';
        this.USERS_SHEET = 'Users';
        this.VILLAGES_SHEET = 'Villages';
        
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    }

    // Initialize Google Sheets API
    async init() {
        try {
            // Check if API key is configured
            if (this.API_KEY === 'YOUR_API_KEY') {
                console.warn('Google Sheets API key not configured. Using local storage only.');
                return false;
            }
            
            // Load Google Sheets API
            if (!window.gapi) {
                await this.loadGapi();
            }
            
            // Initialize the API
            await new Promise((resolve, reject) => {
                window.gapi.load('client', async () => {
                    try {
                        await window.gapi.client.init({
                            apiKey: this.API_KEY,
                            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
                        });
                        console.log('Google Sheets API initialized successfully');
                        resolve();
                    } catch (error) {
                        console.error('Failed to initialize Google Sheets API:', error);
                        reject(error);
                    }
                });
            });
            
            return true;
        } catch (error) {
            console.error('Failed to initialize Google Sheets API:', error);
            return false;
        }
    }

    // Load Google API script
    loadGapi() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Generic method to read data from a sheet
    async readSheet(sheetName, range = 'A:Z') {
        try {
            const response = await window.gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: this.SPREADSHEET_ID,
                range: `${sheetName}!${range}`
            });
            
            return response.result.values || [];
        } catch (error) {
            console.error(`Error reading sheet ${sheetName}:`, error);
            return [];
        }
    }

    // Generic method to write data to a sheet
    async writeSheet(sheetName, values, range = 'A1') {
        try {
            const response = await window.gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: this.SPREADSHEET_ID,
                range: `${sheetName}!${range}`,
                valueInputOption: 'RAW',
                values: values
            });
            
            return response.result;
        } catch (error) {
            console.error(`Error writing to sheet ${sheetName}:`, error);
            throw error;
        }
    }

    // Append data to a sheet
    async appendToSheet(sheetName, values) {
        try {
            const response = await window.gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: this.SPREADSHEET_ID,
                range: `${sheetName}!A:Z`,
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                values: values
            });
            
            return response.result;
        } catch (error) {
            console.error(`Error appending to sheet ${sheetName}:`, error);
            throw error;
        }
    }

    // Load all contributions from Google Sheets
    async loadContributions() {
        try {
            const data = await this.readSheet(this.CONTRIBUTIONS_SHEET, 'A:H');
            if (data.length <= 2) return []; // No data or only headers (rows 1 and 2)
            
            const contributions = [];
            
            // Start from row 3 (index 2) since row 1 is title and row 2 is headers
            for (let i = 2; i < data.length; i++) {
                const row = data[i];
                if (row.length >= 7 && row[0] && row[1]) { // Check if row has data
                    const contribution = {
                        id: Date.now() + i, // Generate ID
                        donorName: row[1] || '', // Column B
                        donorContact: row[2] || '', // Column C
                        village: row[3] || '', // Column D
                        locality: row[4] || '', // Column E
                        amount: parseInt(row[5]) || 0, // Column F
                        paymentType: row[6] || '', // Column G
                        date: row[0] || new Date().toISOString().split('T')[0] // Column A
                    };
                    contributions.push(contribution);
                }
            }
            
            return contributions;
        } catch (error) {
            console.error('Error loading contributions:', error);
            return [];
        }
    }

    // Save a new contribution to Google Sheets
    async saveContribution(contribution) {
        try {
            // Format data to match your spreadsheet structure
            const values = [[
                contribution.date,           // Column A - Date
                contribution.donorName,     // Column B - Donor Name
                contribution.donorContact,  // Column C - Contact
                contribution.village,       // Column D - Village
                contribution.locality,      // Column E - Locality
                contribution.amount,        // Column F - Amount
                contribution.paymentType    // Column G - Payment Type
            ]];
            
            await this.appendToSheet(this.CONTRIBUTIONS_SHEET, values);
            return true;
        } catch (error) {
            console.error('Error saving contribution:', error);
            return false;
        }
    }

    // Update an existing contribution
    async updateContribution(contribution) {
        try {
            // First, find the row number of the contribution
            const data = await this.readSheet(this.CONTRIBUTIONS_SHEET);
            let rowIndex = -1;
            
            for (let i = 1; i < data.length; i++) {
                if (parseInt(data[i][0]) === contribution.id) {
                    rowIndex = i + 1; // +1 because sheets are 1-indexed
                    break;
                }
            }
            
            if (rowIndex === -1) {
                throw new Error('Contribution not found');
            }
            
            const values = [[
                contribution.id,
                contribution.donorName,
                contribution.donorContact,
                contribution.village,
                contribution.locality,
                contribution.amount,
                contribution.paymentType,
                contribution.date
            ]];
            
            await this.writeSheet(this.CONTRIBUTIONS_SHEET, values, `A${rowIndex}:H${rowIndex}`);
            return true;
        } catch (error) {
            console.error('Error updating contribution:', error);
            return false;
        }
    }

    // Delete a contribution
    async deleteContribution(contributionId) {
        try {
            // Find the row number
            const data = await this.readSheet(this.CONTRIBUTIONS_SHEET);
            let rowIndex = -1;
            
            for (let i = 1; i < data.length; i++) {
                if (parseInt(data[i][0]) === contributionId) {
                    rowIndex = i + 1;
                    break;
                }
            }
            
            if (rowIndex === -1) {
                throw new Error('Contribution not found');
            }
            
            // Clear the row
            await this.writeSheet(this.CONTRIBUTIONS_SHEET, [['', '', '', '', '', '', '', '']], `A${rowIndex}:H${rowIndex}`);
            return true;
        } catch (error) {
            console.error('Error deleting contribution:', error);
            return false;
        }
    }

    // Load all mentors from Google Sheets
    async loadMentors() {
        try {
            const data = await this.readSheet(this.MENTORS_SHEET);
            if (data.length <= 1) return [];
            
            const mentors = [];
            const headers = data[0];
            
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                if (row.length >= headers.length) {
                    const mentor = {
                        id: parseInt(row[0]) || Date.now() + i,
                        name: row[1] || '',
                        contact: row[2] || '',
                        village: row[3] || '',
                        locality: row[4] || ''
                    };
                    mentors.push(mentor);
                }
            }
            
            return mentors;
        } catch (error) {
            console.error('Error loading mentors:', error);
            return [];
        }
    }

    // Save a new mentor
    async saveMentor(mentor) {
        try {
            const values = [[
                mentor.id,
                mentor.name,
                mentor.contact,
                mentor.village,
                mentor.locality
            ]];
            
            await this.appendToSheet(this.MENTORS_SHEET, values);
            return true;
        } catch (error) {
            console.error('Error saving mentor:', error);
            return false;
        }
    }

    // Load users from Google Sheets
    async loadUsers() {
        try {
            const data = await this.readSheet(this.USERS_SHEET);
            if (data.length <= 1) return {};
            
            const users = {};
            
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                if (row.length >= 4) {
                    users[row[0]] = {
                        password: row[1],
                        role: row[2],
                        name: row[3],
                        village: row[4] || null
                    };
                }
            }
            
            return users;
        } catch (error) {
            console.error('Error loading users:', error);
            return {};
        }
    }

    // Initialize sheets with headers if they don't exist
    async initializeSheets() {
        try {
            // Initialize Contributions sheet
            await this.writeSheet(this.CONTRIBUTIONS_SHEET, [[
                'ID', 'Donor Name', 'Contact', 'Village', 'Locality', 'Amount', 'Payment Type', 'Date'
            ]], 'A1:H1');
            
            // Initialize Mentors sheet
            await this.writeSheet(this.MENTORS_SHEET, [[
                'ID', 'Name', 'Contact', 'Village', 'Locality'
            ]], 'A1:E1');
            
            // Initialize Users sheet
            await this.writeSheet(this.USERS_SHEET, [[
                'Username', 'Password', 'Role', 'Name', 'Village'
            ]], 'A1:E1');
            
            // Add default users
            const defaultUsers = [
                ['Firoj', 'Firoj#786', 'admin', 'Firoj (Admin)', ''],
                ['User1', '123', 'core_team', 'User 1 (Core Team)', ''],
                ['User2', '123', 'core_team', 'User 2 (Core Team)', ''],
                ['User3', '123', 'core_team', 'User 3 (Core Team)', ''],
                ['User4', '123', 'core_team', 'User 4 (Core Team)', ''],
                ['User5', '123', 'core_team', 'User 5 (Core Team)', ''],
                ['ChandrapurManager', '123', 'village_manager', 'Chandrapur Manager', 'Chandrapur'],
                ['MohisguhaManager', '123', 'village_manager', 'Mohisguha Manager', 'Mohisguha'],
                ['ChatraManager', '123', 'village_manager', 'Chatra Manager', 'Chatra']
            ];
            
            await this.appendToSheet(this.USERS_SHEET, defaultUsers);
            
            // Initialize Villages sheet
            await this.writeSheet(this.VILLAGES_SHEET, [[
                'Village Name', 'Localities'
            ]], 'A1:B1');
            
            const villagesData = [
                ['Chandrapur', 'Main Market, Temple Area, School Road'],
                ['Mohisguha', 'Village Center, Market Area, Near Hospital'],
                ['Chatra', 'Near School, Market Street, Temple Road']
            ];
            
            await this.appendToSheet(this.VILLAGES_SHEET, villagesData);
            
            console.log('Sheets initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing sheets:', error);
            return false;
        }
    }

    // Get real-time data sync
    async syncData() {
        try {
            const [contributions, mentors, users] = await Promise.all([
                this.loadContributions(),
                this.loadMentors(),
                this.loadUsers()
            ]);
            
            return {
                contributions,
                mentors,
                users
            };
        } catch (error) {
            console.error('Error syncing data:', error);
            return null;
        }
    }

    // Export data to Google Sheets (backup)
    async exportToSheets(data, sheetName) {
        try {
            const headers = Object.keys(data[0]);
            const values = [headers, ...data.map(item => headers.map(header => item[header]))];
            
            await this.writeSheet(sheetName, values, 'A1');
            return true;
        } catch (error) {
            console.error('Error exporting to sheets:', error);
            return false;
        }
    }
}

// Usage Instructions:
/*
1. Create a new Google Spreadsheet
2. Copy the Spreadsheet ID from the URL
3. Enable Google Sheets API in Google Cloud Console
4. Create an API key
5. Replace YOUR_SPREADSHEET_ID and YOUR_API_KEY in this file
6. Make sure to share the spreadsheet with the API key service account
7. Call sheetsIntegration.init() to initialize the connection
*/

// Export for use in main application
window.GoogleSheetsIntegration = GoogleSheetsIntegration;

