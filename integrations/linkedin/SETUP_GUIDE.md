# LinkedIn Profile Analyzer Setup Guide

## Prerequisites
✅ Python 3.7+ installed  
✅ Virtual environment activated  
✅ Dependencies installed via `requirements.txt`  

## Step 1: Get LinkedIn API Credentials

### 1.1 Visit LinkedIn Developer Portal
Go to: https://www.linkedin.com/developers/

### 1.2 Sign In
Use your existing LinkedIn account credentials

### 1.3 Create a New Application
1. Click **"Create App"**
2. Fill out the application form:
   - **App name**: `LinkedIn Profile Analyzer`
   - **LinkedIn Page**: Select your personal profile or company page
   - **Privacy policy URL**: `https://example.com/privacy` (placeholder)
   - **App logo**: Optional (you can skip this)
3. Accept the **Legal Agreement**
4. Click **"Create App"**

### 1.4 Configure OAuth Settings
1. Go to the **"Auth"** tab
2. Under **"OAuth 2.0 settings"**:
   - Add **Redirect URL**: `http://localhost:8080/callback`
   - Click **"Update"**

### 1.5 Get Your Credentials
1. Note down your **Client ID** and **Client Secret**
2. Keep these secure - never share them publicly

## Step 2: Configure Environment Variables

### 2.1 Edit the .env file
```bash
nano .env
```

### 2.2 Update with your credentials
Replace the placeholder values:
```env
LINKEDIN_CLIENT_ID=your_actual_client_id_here
LINKEDIN_CLIENT_SECRET=your_actual_client_secret_here
LOG_LEVEL=INFO
```

## Step 3: Run the Analyzer

### 3.1 Activate the virtual environment
```bash
source linkedin_env/bin/activate
```

### 3.2 Run the analyzer
```bash
python linkedin_profile_analyzer.py
```

## What Happens Next

1. The script will open your browser to LinkedIn's authorization page
2. You'll be asked to authorize the application
3. After authorization, you'll be redirected to a localhost URL
4. Copy the authorization code from the URL and paste it into the terminal
5. The analyzer will fetch your profile data and generate a comprehensive report

## Output Files

The analyzer will create:
- `linkedin_analysis_YYYYMMDD_HHMMSS.json` - Raw analysis data
- `linkedin_report_YYYYMMDD_HHMMSS.md` - Formatted report with recommendations

## Troubleshooting

### Common Issues:

**"Invalid redirect_uri"**
- Ensure you added `http://localhost:8080/callback` exactly as shown in the Auth tab

**"Missing CLIENT_ID or CLIENT_SECRET"**
- Check that your .env file has the correct variable names
- Ensure there are no extra spaces or quotes around the values

**"Insufficient permissions"**
- LinkedIn may require additional verification for certain profile data
- The basic profile information should be accessible with the default permissions

## Security Notes

- Never commit your `.env` file to version control
- Keep your API credentials secure
- The localhost callback URL is safe for development use only

## Next Steps

Once you have a successful analysis, you can:
1. Review the generated recommendations
2. Implement the suggested improvements
3. Re-run the analysis to track progress
4. Schedule regular profile audits
