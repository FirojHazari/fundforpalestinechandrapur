# Google Sheets Integration Setup for Palestine Fund Collection

## Your Spreadsheet
**Spreadsheet URL**: https://docs.google.com/spreadsheets/d/1vFeTykyakyL3JUj2ZIz7Y3P3emf2xJlG91-myfBbhiI/edit?usp=sharing

## Setup Instructions

### Step 1: Get Google Sheets API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API Key

### Step 2: Configure the Application

1. Open `google-sheets.js` file
2. Replace `YOUR_API_KEY` with your actual API key:

```javascript
this.API_KEY = 'your-actual-api-key-here';
```

### Step 3: Set Up Spreadsheet Permissions

1. Open your [Palestine Fund Collection Spreadsheet](https://docs.google.com/spreadsheets/d/1vFeTykyakyL3JUj2ZIz7Y3P3emf2xJlG91-myfBbhiI/edit?usp=sharing)
2. Click "Share" button
3. Add the API key service account email (if using service account) or make the sheet publicly readable
4. For testing, you can make it "Anyone with the link can view"

### Step 4: Test the Integration

1. Open `index.html` in your browser
2. Login with any credentials
3. Try adding a contribution
4. Check your Google Sheets - the data should appear automatically

## How It Works

### Automatic Data Sync
- **On Login**: The app fetches all data from your Google Sheets
- **On Save**: Every contribution is automatically saved to Google Sheets
- **Real-time**: Data is synced immediately after each entry

### Data Format
Your spreadsheet structure:
- **Row 1**: "FUND COLLECTION REPORT FOR PALESTINE"
- **Row 2**: Headers (Date, Donor Name, Contact, Village, Locality, Amount, Payment Type)
- **Row 3+**: Data rows (automatically added by the app)

### Features
- ✅ **Automatic Sync**: Data syncs on every login
- ✅ **Real-time Save**: Contributions saved immediately to Google Sheets
- ✅ **Data Persistence**: Previous entries always visible
- ✅ **Backup**: Local storage as fallback
- ✅ **Multi-user**: Multiple users can access the same data

## Troubleshooting

### If Google Sheets Integration Fails
1. Check your API key is correct
2. Verify the spreadsheet is accessible
3. Check browser console for error messages
4. The app will fall back to local storage

### If Data Doesn't Appear
1. Refresh the page and login again
2. Check the Google Sheets for new entries
3. Verify the API key has proper permissions

### Testing the Setup
1. Open browser developer tools (F12)
2. Go to Console tab
3. Login to the application
4. Look for "Google Sheets integration enabled" message
5. Try adding a contribution
6. Check for "Data synced with Google Sheets" message

## Security Notes

- Keep your API key secure
- Don't share the API key publicly
- Consider using service account authentication for production
- Regularly backup your Google Sheets data

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all setup steps were completed
3. Test with a simple contribution first
4. Ensure your Google Sheets has the correct format
