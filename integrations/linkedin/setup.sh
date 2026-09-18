#!/bin/bash

echo "LinkedIn Profile Analyzer Setup"
echo "================================"

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv linkedin_env
source linkedin_env/bin/activate

# Install requirements
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file template
echo "Creating environment file template..."
cat > .env << 'EOF'
# LinkedIn API Credentials
# Get these from https://www.linkedin.com/developers/
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here

# Optional: Set logging level
LOG_LEVEL=INFO
EOF

echo ""
echo "Setup Instructions:"
echo "==================="
echo ""
echo "1. Visit LinkedIn Developer Portal:"
echo "   https://www.linkedin.com/developers/"
echo ""
echo "2. Sign in with your LinkedIn account"
echo ""
echo "3. Click 'Create App' and fill out the form:"
echo "   - App name: LinkedIn Profile Analyzer"
echo "   - LinkedIn Page: Your personal profile or company page"
echo "   - App logo: Optional"
echo "   - Legal agreement: Accept terms"
echo ""
echo "4. After creating the app:"
echo "   - Go to the 'Auth' tab"
echo "   - Add redirect URL: http://localhost:8080/callback"
echo "   - Note down your Client ID and Client Secret"
echo ""
echo "5. Edit the .env file and add your credentials:"
echo "   nano .env"
echo ""
echo "6. Run the analyzer:"
echo "   python linkedin_profile_analyzer.py"
echo ""
echo "Note: You may need to request additional permissions from LinkedIn"
echo "for full profile access depending on your use case."
