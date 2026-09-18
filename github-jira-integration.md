# GitHub-Jira Integration Setup

## Repository Information
- **Repository**: https://github.com/mirichard/pm-tools-templates
- **Local Path**: /Users/michael/pm-tools-templates
- **Jira Instance**: https://flow-foundry.atlassian.net/
- **Jira Project Key**: SCRUM

## Integration Options

### 1. GitHub for Jira App (Recommended)

#### Prerequisites
- Jira Cloud or Server admin access
- GitHub repository admin access

#### Steps
1. **In Jira:**
   - Go to Apps → Find new apps
   - Search "GitHub for Jira"
   - Install the official Atlassian app

2. **Connect Repository:**
   - In Jira, go to Apps → GitHub integration
   - Add organization: `mirichard`
   - Select repository: `pm-tools-templates`

3. **Configure Settings:**
   - Enable issue transitions
   - Set up smart commits
   - Configure branch/PR linking

### 2. Smart Commits Format

Once connected, use these formats in commit messages:

```
SCRUM-123 #comment Updated project templates
SCRUM-456 #resolve Fixed template generation issue
SCRUM-789 #time 2h #comment Added new PMBOK templates
```

### 3. Webhook Configuration (Manual)

If using custom webhooks:

**Webhook URL**: `https://flow-foundry.atlassian.net/rest/github/1.0/webhook`

**Events to Subscribe**:
- Push
- Pull requests
- Issues
- Issue comments

### 4. Branch Naming Convention

Use Jira issue keys in branch names:
```bash
git checkout -b SCRUM-123-add-agile-templates
git checkout -b SCRUM-456-fix-pmbok-structure
```

## Testing the Integration

1. Create a test commit with Jira issue key
2. Check if the commit appears in Jira issue
3. Verify webhook deliveries in GitHub settings

## Troubleshooting

- Check webhook delivery logs in GitHub
- Verify Jira app permissions
- Ensure issue keys match your Jira project

