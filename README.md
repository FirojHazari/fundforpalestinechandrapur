# Community Fund Management System

A responsive, secure, and user-friendly web application for community fund collection and management across multiple villages. Built with a modern Iron Man/Jarvis-inspired dark theme interface.

## Features

### 🔐 User Roles & Access
- **Admin (Firoj)**: Full system access with all permissions
- **Core Team (5 members)**: Can add/edit/view all data, manage dashboard, and export reports
- **Village Managers (3 total)**: One manager per village (Chandrapur, Mohisguha, Chatra)
- **Mentors**: Can be added for each village to support or oversee data

### 📝 Data Entry Features
- **Mentor Management**: Add mentors with name, contact, and assigned village/locality
- **Locality Tracking**: Each village can have multiple localities
- **Donor Details**: Complete donor information with contribution tracking
- **Payment Types**: Cash, Online, Other with visual indicators

### 📊 Dashboard & Reports
- **Real-time Statistics**: Total funds, contributors, village breakdowns
- **Interactive Charts**: Bar charts, pie charts, line graphs
- **Advanced Filtering**: Filter by village, locality, donor, payment type, date range
- **Export Options**: Excel, CSV, and PDF reports

### 🌐 Technical Features
- **Google Sheets Integration**: Real-time data sync with Google Sheets backend
- **Responsive Design**: Mobile-friendly interface
- **Security**: Role-based access control
- **Modern UI**: Iron Man/Jarvis-inspired dark theme with glowing highlights

## Setup Instructions

### 1. Basic Setup (Local Storage)
1. Download all files to a folder
2. Open `index.html` in a web browser
3. The application will work with local storage by default

### 2. Google Sheets Integration (Recommended)

#### Step 1: Create Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Copy the Spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

#### Step 2: Enable Google Sheets API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create credentials (API Key)
5. Copy the API Key

#### Step 3: Configure the Application
1. Open `google-sheets.js`
2. Replace `YOUR_SPREADSHEET_ID` with your actual Spreadsheet ID
3. Replace `YOUR_API_KEY` with your actual API Key
4. Update the HTML to include the Google Sheets script:

```html
<script src="https://apis.google.com/js/api.js"></script>
<script src="google-sheets.js"></script>
```

#### Step 4: Initialize Sheets
1. Open the application
2. The system will automatically create the required sheets and data structure
3. Default users and villages will be set up automatically

## Login Credentials

### Admin Access
- **Username**: Firoj
- **Password**: Firoj#786
- **Permissions**: Full system access

### Core Team Access
- **Username**: User1, User2, User3, User4, User5
- **Password**: 123
- **Permissions**: Add/edit/view all data, manage dashboard, export reports

### Village Manager Access
- **Username**: ChandrapurManager, MohisguhaManager, ChatraManager
- **Password**: 123
- **Permissions**: Access only to their assigned village data

## File Structure

```
palastine/
├── index.html          # Main application file
├── styles.css          # Iron Man/Jarvis inspired styling
├── script.js           # Main application logic
├── google-sheets.js    # Google Sheets integration
└── README.md          # This file
```

## Usage Guide

### Adding Contributions
1. Login with appropriate credentials
2. Navigate to "Contributions" tab
3. Click "Add Contribution" button
4. Fill in donor details, village, locality, amount, payment type
5. Save the contribution

### Managing Mentors
1. Go to "Mentors" tab
2. Click "Add Mentor" to add new mentors
3. Edit or delete existing mentors as needed

### Viewing Reports
1. Navigate to "Reports" tab
2. View village performance and monthly trends
3. Export data in Excel, CSV, or PDF format

### Dashboard Analytics
1. Main dashboard shows real-time statistics
2. Interactive charts display fund distribution
3. Growth trends and payment type breakdowns

## Customization

### Adding New Villages
1. Update the `villages` array in `script.js`
2. Add corresponding village managers in the `users` object
3. Update Google Sheets with new village data

### Modifying User Roles
1. Edit the `users` object in `script.js`
2. Add new users with appropriate roles
3. Update Google Sheets user data

### Styling Changes
1. Modify `styles.css` for visual changes
2. Update color variables in `:root` section
3. Adjust responsive breakpoints as needed

## Security Features

- Role-based access control
- Secure login system
- Data validation and sanitization
- Google Sheets API security
- Responsive design for all devices

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Support

For technical support or feature requests, please contact the development team.

## License

This application is developed for community fund management purposes.

