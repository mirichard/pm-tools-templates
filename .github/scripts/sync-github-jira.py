#!/usr/bin/env python3
"""
GitHub-Jira Issue Sync Script
Automatically syncs GitHub issues with Jira when GitHub issues are modified
"""

import os
import json
import requests
import re
from typing import Dict, List, Optional

# Configuration from environment variables
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
JIRA_BASE_URL = os.getenv('JIRA_BASE_URL', 'https://flow-foundry.atlassian.net')
JIRA_EMAIL = os.getenv('JIRA_EMAIL')
JIRA_TOKEN = os.getenv('JIRA_TOKEN') 
JIRA_PROJECT_KEY = os.getenv('JIRA_PROJECT_KEY', 'SCRUM')
GITHUB_EVENT_NAME = os.getenv('GITHUB_EVENT_NAME')
GITHUB_EVENT_ACTION = os.getenv('GITHUB_EVENT_ACTION')

class GitHubJiraSync:
    def __init__(self):
        self.github_headers = {
            'Authorization': f'token {GITHUB_TOKEN}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        self.jira_headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        
        self.jira_auth = (JIRA_EMAIL, JIRA_TOKEN)
        
    def sanitize_label_name(self, label_name: str) -> str:
        """Sanitize GitHub label name for Jira compatibility"""
        sanitized = label_name.replace(' ', '-')
        sanitized = re.sub(r'[^a-zA-Z0-9\-_]', '', sanitized)
        return sanitized
    
    def map_github_labels_to_jira(self, labels: List[Dict]) -> Dict:
        """Map GitHub labels to Jira issue type and other fields"""
        label_names = [label['name'].lower() for label in labels]
        
        # Map to Jira issue types
        if 'epic' in label_names:
            issue_type = 'Epic'
        elif 'bug' in label_names:
            issue_type = 'Bug'
        elif 'enhancement' in label_names or 'feature' in label_names:
            issue_type = 'Story'
        elif 'task' in label_names:
            issue_type = 'Task'
        else:
            issue_type = 'Story'  # Default
            
        # Map priority - Skip priority for now due to screen configuration
        priority = None
        
        return {
            'issue_type': issue_type,
            'priority': priority,
            'labels': [self.sanitize_label_name(label['name']) for label in labels]
        }
    
    def format_jira_description(self, github_issue: Dict) -> str:
        """Format GitHub issue description for Jira"""
        description_parts = [
            f"*Migrated from GitHub Issue #{github_issue['number']}*",
            f"*Original URL: {github_issue['html_url']}*",
            f"*Created: {github_issue['created_at']}*",
            f"*Status: {github_issue['state']}*",
            ""
        ]
        
        if github_issue.get('body'):
            description_parts.extend([
                "*Original Description:*",
                github_issue['body'],
                ""
            ])
            
        if github_issue.get('labels'):
            labels = ", ".join([label['name'] for label in github_issue['labels']])
            description_parts.extend([
                f"*GitHub Labels:* {labels}",
                ""
            ])
            
        return "\\n".join(description_parts)
    
    def find_jira_issue_by_github_number(self, github_number: int) -> Optional[str]:
        """Find existing Jira issue by GitHub issue number"""
        try:
            # Search for Jira issues containing the GitHub issue number
            jql = f'project = {JIRA_PROJECT_KEY} AND description ~ "GitHub Issue #{github_number}"'
            
            response = requests.get(
                f"{JIRA_BASE_URL}/rest/api/3/search",
                headers=self.jira_headers,
                auth=self.jira_auth,
                params={'jql': jql, 'maxResults': 1}
            )
            
            if response.status_code == 200:
                issues = response.json().get('issues', [])
                if issues:
                    return issues[0]['key']
            
            return None
            
        except Exception as e:
            print(f"Error searching for Jira issue: {str(e)}")
            return None
    
    def create_jira_issue(self, github_issue: Dict) -> Optional[str]:
        """Create a new Jira issue from GitHub issue"""
        try:
            mapping = self.map_github_labels_to_jira(github_issue.get('labels', []))
            description = self.format_jira_description(github_issue)
            
            # Prepare Jira issue data
            jira_data = {
                "fields": {
                    "project": {"key": JIRA_PROJECT_KEY},
                    "summary": github_issue['title'],
                    "description": {
                        "type": "doc",
                        "version": 1,
                        "content": [
                            {
                                "type": "paragraph",
                                "content": [
                                    {"type": "text", "text": description}
                                ]
                            }
                        ]
                    },
                    "issuetype": {"name": mapping['issue_type']},
                    "labels": mapping['labels']
                }
            }
            
            # Only add priority if it's not None (avoid screen configuration issues)
            if mapping['priority']:
                jira_data["fields"]["priority"] = {"name": mapping['priority']}
            
            response = requests.post(
                f"{JIRA_BASE_URL}/rest/api/3/issue",
                json=jira_data,
                headers=self.jira_headers,
                auth=self.jira_auth
            )
            
            if response.status_code == 201:
                jira_issue = response.json()
                print(f"✅ Created Jira issue {jira_issue['key']} for GitHub issue #{github_issue['number']}")
                return jira_issue['key']
            else:
                print(f"❌ Failed to create Jira issue: {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Error creating Jira issue: {str(e)}")
            return None
    
    def update_jira_issue(self, jira_key: str, github_issue: Dict) -> bool:
        """Update existing Jira issue with GitHub issue data"""
        try:
            mapping = self.map_github_labels_to_jira(github_issue.get('labels', []))
            description = self.format_jira_description(github_issue)
            
            # Prepare update data
            update_data = {
                "fields": {
                    "summary": github_issue['title'],
                    "description": {
                        "type": "doc",
                        "version": 1,
                        "content": [
                            {
                                "type": "paragraph",
                                "content": [
                                    {"type": "text", "text": description}
                                ]
                            }
                        ]
                    },
                    "labels": mapping['labels']
                }
            }
            
            response = requests.put(
                f"{JIRA_BASE_URL}/rest/api/3/issue/{jira_key}",
                json=update_data,
                headers=self.jira_headers,
                auth=self.jira_auth
            )
            
            if response.status_code == 204:
                print(f"✅ Updated Jira issue {jira_key} for GitHub issue #{github_issue['number']}")
                return True
            else:
                print(f"❌ Failed to update Jira issue: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error updating Jira issue: {str(e)}")
            return False
    
    def transition_jira_issue(self, jira_key: str, github_state: str) -> bool:
        """Transition Jira issue based on GitHub issue state"""
        try:
            # Get available transitions
            response = requests.get(
                f"{JIRA_BASE_URL}/rest/api/3/issue/{jira_key}/transitions",
                headers=self.jira_headers,
                auth=self.jira_auth
            )
            
            if response.status_code != 200:
                print(f"Failed to get transitions for {jira_key}")
                return False
            
            transitions = response.json().get('transitions', [])
            
            # Map GitHub state to Jira transition
            target_transition = None
            if github_state == 'closed':
                # Look for Done, Closed, or similar transition
                for transition in transitions:
                    name = transition['name'].lower()
                    if any(keyword in name for keyword in ['done', 'close', 'resolve', 'complete']):
                        target_transition = transition['id']
                        break
            elif github_state == 'open':
                # Look for Reopen, To Do, or similar transition
                for transition in transitions:
                    name = transition['name'].lower()
                    if any(keyword in name for keyword in ['reopen', 'to do', 'open', 'backlog']):
                        target_transition = transition['id']
                        break
            
            if target_transition:
                transition_data = {"transition": {"id": target_transition}}
                
                response = requests.post(
                    f"{JIRA_BASE_URL}/rest/api/3/issue/{jira_key}/transitions",
                    json=transition_data,
                    headers=self.jira_headers,
                    auth=self.jira_auth
                )
                
                if response.status_code == 204:
                    print(f"✅ Transitioned Jira issue {jira_key} to match GitHub state: {github_state}")
                    return True
                else:
                    print(f"Failed to transition {jira_key}: {response.text}")
                    
            return False
            
        except Exception as e:
            print(f"❌ Error transitioning Jira issue: {str(e)}")
            return False
    
    def sync_issue(self, github_issue: Dict, action: str) -> None:
        """Main sync function to handle GitHub issue changes"""
        github_number = github_issue['number']
        
        print(f"🔄 Syncing GitHub issue #{github_number} (action: {action})")
        
        # Find existing Jira issue
        jira_key = self.find_jira_issue_by_github_number(github_number)
        
        if action == 'opened':
            if not jira_key:
                # Create new Jira issue
                self.create_jira_issue(github_issue)
            else:
                print(f"ℹ️ Jira issue {jira_key} already exists for GitHub issue #{github_number}")
                
        elif action in ['edited', 'labeled', 'unlabeled']:
            if jira_key:
                # Update existing Jira issue
                self.update_jira_issue(jira_key, github_issue)
            else:
                # Create new Jira issue if it doesn't exist
                print(f"⚠️ No Jira issue found for GitHub issue #{github_number}, creating new one")
                self.create_jira_issue(github_issue)
                
        elif action in ['closed', 'reopened']:
            if jira_key:
                # Update and transition Jira issue
                self.update_jira_issue(jira_key, github_issue)
                self.transition_jira_issue(jira_key, github_issue['state'])
            else:
                print(f"⚠️ No Jira issue found for GitHub issue #{github_number} to transition")

def main():
    """Main function to handle GitHub webhook events"""
    print(f"🚀 GitHub-Jira Sync triggered by {GITHUB_EVENT_NAME}:{GITHUB_EVENT_ACTION}")
    
    # Validate required environment variables
    required_vars = ['GITHUB_TOKEN', 'JIRA_EMAIL', 'JIRA_TOKEN']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"❌ Missing required environment variables: {', '.join(missing_vars)}")
        return
    
    # Load GitHub event payload
    try:
        with open(os.getenv('GITHUB_EVENT_PATH'), 'r') as f:
            event_data = json.load(f)
    except Exception as e:
        print(f"❌ Failed to load GitHub event data: {str(e)}")
        return
    
    # Get the issue from event data
    github_issue = event_data.get('issue')
    if not github_issue:
        print("ℹ️ No issue data found in event payload")
        return
    
    # Skip pull requests (they appear as issues in GitHub API)
    if 'pull_request' in github_issue:
        print("ℹ️ Skipping pull request")
        return
    
    # Initialize sync and process
    sync = GitHubJiraSync()
    sync.sync_issue(github_issue, GITHUB_EVENT_ACTION)
    
    print("✅ Sync completed")

if __name__ == "__main__":
    main()
