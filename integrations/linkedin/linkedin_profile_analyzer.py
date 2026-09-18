#!/usr/bin/env python3
"""
LinkedIn Profile Analyzer
Comprehensive LinkedIn profile audit and optimization tool
"""

import requests
import json
import os
import webbrowser
from urllib.parse import urlencode, parse_qs, urlparse
from datetime import datetime
import pandas as pd
import markdown
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class LinkedInProfileAnalyzer:
    def __init__(self):
        self.client_id = os.getenv('LINKEDIN_CLIENT_ID')
        self.client_secret = os.getenv('LINKEDIN_CLIENT_SECRET')
        self.redirect_uri = 'http://localhost:8080/callback'
        self.access_token = None
        self.profile_data = {}
        
    def get_authorization_url(self):
        """Generate LinkedIn OAuth authorization URL"""
        params = {
            'response_type': 'code',
            'client_id': self.client_id,
            'redirect_uri': self.redirect_uri,
            'state': 'linkedin_profile_analysis',
            'scope': 'r_liteprofile r_emailaddress w_member_social'
        }
        
        auth_url = f"https://www.linkedin.com/oauth/v2/authorization?{urlencode(params)}"
        return auth_url
    
    def get_access_token(self, auth_code):
        """Exchange authorization code for access token"""
        url = 'https://www.linkedin.com/oauth/v2/accessToken'
        
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        data = {
            'grant_type': 'authorization_code',
            'code': auth_code,
            'redirect_uri': self.redirect_uri,
            'client_id': self.client_id,
            'client_secret': self.client_secret
        }
        
        response = requests.post(url, headers=headers, data=data)
        
        if response.status_code == 200:
            token_data = response.json()
            self.access_token = token_data.get('access_token')
            return token_data
        else:
            raise Exception(f"Failed to get access token: {response.text}")
    
    def get_profile_data(self):
        """Fetch comprehensive profile data"""
        if not self.access_token:
            raise Exception("No access token available. Please authenticate first.")
        
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'X-Restli-Protocol-Version': '2.0.0'
        }
        
        # Basic profile information
        profile_url = 'https://api.linkedin.com/v2/me'
        
        try:
            response = requests.get(profile_url, headers=headers)
            if response.status_code == 200:
                self.profile_data['basic'] = response.json()
            else:
                print(f"Error fetching basic profile: {response.status_code} - {response.text}")
        
        except Exception as e:
            print(f"Error fetching profile data: {e}")
        
        return self.profile_data
    
    def analyze_profile(self):
        """Comprehensive profile analysis based on the framework"""
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'scores': {},
            'recommendations': {
                'quick_wins': [],
                'medium_term': [],
                'strategic': []
            },
            'keyword_analysis': {},
            'benchmarking': {}
        }
        
        # Recruiter Attraction Analysis (35% weight)
        recruiter_score = self._analyze_recruiter_attraction()
        analysis['scores']['recruiter_attraction'] = recruiter_score
        
        # ATS Compatibility Analysis (25% weight)
        ats_score = self._analyze_ats_compatibility()
        analysis['scores']['ats_compatibility'] = ats_score
        
        # Expertise Signaling Analysis (20% weight)
        expertise_score = self._analyze_expertise_signaling()
        analysis['scores']['expertise_signaling'] = expertise_score
        
        # Visual & UX Analysis (20% weight)
        visual_score = self._analyze_visual_ux()
        analysis['scores']['visual_ux'] = visual_score
        
        # Calculate overall score
        total_score = (
            recruiter_score * 0.35 +
            ats_score * 0.25 +
            expertise_score * 0.20 +
            visual_score * 0.20
        )
        analysis['scores']['overall'] = total_score
        
        return analysis
    
    def _analyze_recruiter_attraction(self):
        """Analyze profile elements that attract recruiters"""
        score = 0
        
        # Placeholder analysis - would need actual profile data
        # Check headline clarity, quantified achievements, power verbs, etc.
        
        return score
    
    def _analyze_ats_compatibility(self):
        """Analyze ATS (Applicant Tracking System) compatibility"""
        score = 0
        
        # Analyze keyword density, standardized titles, formatting
        
        return score
    
    def _analyze_expertise_signaling(self):
        """Analyze expertise and thought leadership signals"""
        score = 0
        
        # Check for publications, posts, endorsements, recommendations
        
        return score
    
    def _analyze_visual_ux(self):
        """Analyze visual appeal and user experience"""
        score = 0
        
        # Check banner, headshot, section organization, mobile compatibility
        
        return score
    
    def generate_report(self, analysis):
        """Generate comprehensive markdown report"""
        report = f"""
# LinkedIn Profile Audit Report
*Generated on {analysis['timestamp']}*

## Executive Summary

### Overall Score: {analysis['scores'].get('overall', 0):.1f}/100

| Dimension | Score | Weight | Weighted Score |
|-----------|-------|--------|----------------|
| Recruiter Attraction | {analysis['scores'].get('recruiter_attraction', 0):.1f}/100 | 35% | {analysis['scores'].get('recruiter_attraction', 0) * 0.35:.1f} |
| ATS Compatibility | {analysis['scores'].get('ats_compatibility', 0):.1f}/100 | 25% | {analysis['scores'].get('ats_compatibility', 0) * 0.25:.1f} |
| Expertise Signaling | {analysis['scores'].get('expertise_signaling', 0):.1f}/100 | 20% | {analysis['scores'].get('expertise_signaling', 0) * 0.20:.1f} |
| Visual & UX | {analysis['scores'].get('visual_ux', 0):.1f}/100 | 20% | {analysis['scores'].get('visual_ux', 0) * 0.20:.1f} |

## Quick Wins (≤ 48 hours)

{self._format_recommendations(analysis['recommendations']['quick_wins'])}

## Medium-Term Improvements (3-7 days)

{self._format_recommendations(analysis['recommendations']['medium_term'])}

## Strategic Enhancements (≤ 30 days)

{self._format_recommendations(analysis['recommendations']['strategic'])}

## Task Completion Checklist

- [ ] Automated tests passed
- [ ] Rollback plan tested and documented
- [ ] User acceptance verified
- [ ] Documentation updated
- [ ] Change log entry created
- [ ] Root Cause Analysis performed (if applicable)
- [ ] Peer review completed
- [ ] Stakeholder notifications sent
- [ ] Security scan completed
- [ ] Compliance validated
- [ ] Lessons learned recorded
- [ ] Feedback link provided

"""
        return report
    
    def _format_recommendations(self, recommendations):
        """Format recommendations list"""
        if not recommendations:
            return "*No specific recommendations at this time.*"
        
        formatted = ""
        for i, rec in enumerate(recommendations, 1):
            formatted += f"{i}. {rec}\n"
        
        return formatted
    
    def save_analysis_data(self, analysis):
        """Save analysis data in multiple formats"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save JSON data
        json_file = f"linkedin_analysis_{timestamp}.json"
        with open(json_file, 'w') as f:
            json.dump(analysis, f, indent=2)
        
        # Generate and save report
        report = self.generate_report(analysis)
        report_file = f"linkedin_report_{timestamp}.md"
        with open(report_file, 'w') as f:
            f.write(report)
        
        print(f"Analysis saved to {json_file}")
        print(f"Report saved to {report_file}")
        
        return json_file, report_file


def main():
    """Main execution flow"""
    analyzer = LinkedInProfileAnalyzer()
    
    print("LinkedIn Profile Analyzer")
    print("=" * 50)
    
    # Check for required environment variables
    if not analyzer.client_id or not analyzer.client_secret:
        print("ERROR: Missing LinkedIn API credentials.")
        print("Please set the following environment variables:")
        print("- LINKEDIN_CLIENT_ID")
        print("- LINKEDIN_CLIENT_SECRET")
        print("\nTo get these credentials:")
        print("1. Visit https://www.linkedin.com/developers/")
        print("2. Create a new app")
        print("3. Get your Client ID and Client Secret")
        return
    
    print("Starting LinkedIn authentication...")
    
    # Get authorization URL
    auth_url = analyzer.get_authorization_url()
    print(f"\nPlease visit this URL to authorize the application:")
    print(auth_url)
    
    # Open browser automatically
    webbrowser.open(auth_url)
    
    # Get authorization code from user
    auth_code = input("\nEnter the authorization code from the callback URL: ")
    
    try:
        # Get access token
        token_data = analyzer.get_access_token(auth_code)
        print("✓ Successfully authenticated with LinkedIn")
        
        # Fetch profile data
        print("Fetching profile data...")
        profile_data = analyzer.get_profile_data()
        
        # Analyze profile
        print("Analyzing profile...")
        analysis = analyzer.analyze_profile()
        
        # Save results
        json_file, report_file = analyzer.save_analysis_data(analysis)
        
        print(f"\n✓ Analysis complete!")
        print(f"Overall Score: {analysis['scores'].get('overall', 0):.1f}/100")
        
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
