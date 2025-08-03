# GitHub-Jira Integration Setup Steps

## Step 1: Install GitHub for Jira App

1. **Go to your Jira instance**: https://flow-foundry.atlassian.net/
2. **Navigate to Apps**:
   - Click the gear icon (⚙️) in top right
   - Select "Apps" from dropdown
   - Or go directly to: https://flow-foundry.atlassian.net/plugins/servlet/upm

3. **Find and Install GitHub App**:
   - Click "Find new apps"
   - Search for "GitHub for Jira"
   - Install the official app by Atlassian (free for up to 10 users)

## Step 2: Connect GitHub Account

1. **Access GitHub Integration**:
   - Go to Apps → GitHub integration
   - Or navigate to: https://flow-foundry.atlassian.net/plugins/servlet/github/setup

2. **Authenticate with GitHub**:
   - Click "Connect GitHub account"
   - Authorize the Jira app to access your GitHub account
   - Grant permissions for the `mirichard` organization

## Step 3: Connect Repository

1. **Add Repository**:
   - In the GitHub integration page
   - Click "Connect repository"
   - Select organization: `mirichard`
   - Select repository: `pm-tools-templates`
   - Click "Connect"

2. **Configure Repository Settings**:
   - Enable "Smart commits"
   - Enable "Issue transitions"
   - Enable "Branch and pull request status"

## Step 4: Test the Integration

1. **Create a test issue in Jira**:
   - Go to your SCRUM project
   - Create a new issue (note the issue key, e.g., SCRUM-101)

2. **Test with a commit**:
   ```bash
   # In your local repository
   git checkout -b SCRUM-101-test-integration
   echo "Test file for Jira integration" > test-integration.txt
   git add test-integration.txt
   git commit -m "SCRUM-101 #comment Testing GitHub-Jira integration"
   git push origin SCRUM-101-test-integration
   ```

3. **Verify in Jira**:
   - Go to the SCRUM-101 issue in Jira
   - Check the "Development" panel on the right
   - You should see the commit, branch, and repository linked

## Step 5: Configure Workflow Automation (Optional)

1. **Set up automatic transitions**:
   - In Jira project settings → Workflows
   - Configure transitions triggered by GitHub events

2. **Common automation rules**:
   - Move issue to "In Progress" when branch is created
   - Move to "In Review" when PR is opened
   - Move to "Done" when PR is merged

## Smart Commit Examples

Once set up, use these commit message formats:

```bash
# Add a comment to the issue
git commit -m "SCRUM-123 #comment Updated PMBOK templates with new sections"

# Log time spent
git commit -m "SCRUM-123 #time 2h #comment Implemented Agile framework templates"

# Transition issue status
git commit -m "SCRUM-123 #resolve Fixed template validation issues"

# Multiple actions
git commit -m "SCRUM-123 #time 1h #comment Added Hybrid methodology templates #transition In Review"
```

## Verification Checklist

- [ ] GitHub for Jira app installed in Flow Foundry Jira
- [ ] GitHub account connected and authorized
- [ ] pm-tools-templates repository connected
- [ ] Smart commits enabled
- [ ] Test commit appears in Jira issue
- [ ] Branch shows up in Development panel
- [ ] Webhook deliveries working (check in GitHub repo settings)

## URLs for Quick Access

- **Jira Instance**: https://flow-foundry.atlassian.net/
- **Jira Apps**: https://flow-foundry.atlassian.net/plugins/servlet/upm
- **GitHub Integration**: https://flow-foundry.atlassian.net/plugins/servlet/github/setup
- **Repository**: https://github.com/mirichard/pm-tools-templates
- **Repository Settings**: https://github.com/mirichard/pm-tools-templates/settings

## Troubleshooting

If the integration doesn't work:

1. **Check permissions**: Ensure you have admin access to both Jira and GitHub repo
2. **Verify webhook**: Go to GitHub repo → Settings → Webhooks
3. **Check logs**: Review webhook delivery attempts in GitHub
4. **Re-authenticate**: Disconnect and reconnect GitHub account in Jira
