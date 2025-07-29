# Jira Bulk Delete Setup Guide

This guide explains how to set up and use the bulk delete script for removing SCRUM tickets with alert titles.

## Prerequisites

1. **jq**: JSON parser (install with `brew install jq` on macOS)
2. **curl**: HTTP client (usually pre-installed)
3. **Jira API Token**: Personal access token for your Jira account

## Getting Your Jira API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a label (e.g., "Bulk Delete Script")
4. Copy the generated token (you won't see it again!)

## Configuration

Edit the `bulk-delete-jira-alerts.sh` script and update these variables:

```bash
JIRA_URL="https://your-domain.atlassian.net"        # Your Jira instance URL
JIRA_EMAIL="your-email@example.com"                 # Your Jira email address
JIRA_API_TOKEN="your-api-token"                     # Your API token from above
PROJECT_KEY="SCRUM"                                  # Project key (usually SCRUM)
```

## Usage

### 1. Dry Run (Recommended first step)
```bash
./bulk-delete-jira-alerts.sh --dry-run
```
This will show you what tickets would be deleted without actually deleting them.

### 2. Actual Deletion
```bash
./bulk-delete-jira-alerts.sh --delete
```
This will delete the tickets after showing them and asking for confirmation.

### 3. Help
```bash
./bulk-delete-jira-alerts.sh --help
```

## What Gets Deleted

The script finds and deletes SCRUM tickets where the title contains:
- "Workflow Health Alert:" 
- "CRITICAL ALERT:"

Examples of tickets that would be deleted:
- `SCRUM-213: 🚨 Workflow Health Alert: critical (Score: 45/100)`
- `SCRUM-156: CRITICAL ALERT: System Down`
- `SCRUM-987: 🔴 Workflow Health Alert: warning (Score: 62/100)`

## Safety Features

- **Dry run mode**: See what would be deleted before actual deletion
- **Confirmation prompt**: Requires typing "yes" to proceed with deletion
- **Error handling**: Stops on configuration errors or API failures
- **Rate limiting**: 0.5 second delay between deletions to avoid API limits
- **Detailed logging**: Shows success/failure for each deletion

## Example Output

```
[INFO] Starting Jira Alert Tickets Bulk Delete Script
=================================================
[INFO] Checking dependencies...
[SUCCESS] All dependencies are available
[INFO] Validating configuration...
[SUCCESS] Configuration validated
[INFO] Testing Jira API connection...
[SUCCESS] Connected to Jira as: John Doe
[INFO] Searching for SCRUM tickets with alert titles...
[WARNING] Found 5 alert tickets to delete:
  - SCRUM-213: 🚨 Workflow Health Alert: critical (Score: 45/100)
  - SCRUM-214: 🚨 Workflow Health Alert: warning (Score: 62/100)
  - SCRUM-215: CRITICAL ALERT: System Performance Degraded
  - SCRUM-216: 🔴 Workflow Health Alert: critical (Score: 38/100)
  - SCRUM-217: 🟡 Workflow Health Alert: notice (Score: 82/100)

WARNING: This will permanently delete 5 tickets!
WARNING: This action cannot be undone!

Are you sure you want to delete these tickets? (type 'yes' to confirm): yes
[INFO] Starting bulk deletion process...
[INFO] Deleting 5 tickets...
[SUCCESS] Deleted: SCRUM-213
[SUCCESS] Deleted: SCRUM-214
[SUCCESS] Deleted: SCRUM-215
[SUCCESS] Deleted: SCRUM-216
[SUCCESS] Deleted: SCRUM-217
[SUCCESS] Deletion complete: 5 deleted, 0 failed
```

## Troubleshooting

### Authentication Errors
- Verify your email and API token are correct  
- Make sure your Jira URL is correct (include https://)
- Check that your API token hasn't expired

### Permission Errors
- Ensure you have "Delete Issues" permission in the SCRUM project
- Contact your Jira administrator if you need additional permissions

### No Tickets Found
- The script will exit gracefully if no matching tickets are found
- Verify the search criteria matches your ticket titles

### Rate Limiting
- The script includes a 0.5-second delay between deletions
- If you hit rate limits, the failed deletions will be reported

## Security Notes

- **Never commit your API token** to version control
- **Use environment variables** for sensitive data in production
- **Test with dry run first** to avoid accidental deletions
- **Keep backups** of important tickets before running bulk operations

## Alternative: Environment Variables

Instead of editing the script, you can set environment variables:

```bash
export JIRA_URL="https://your-domain.atlassian.net"
export JIRA_EMAIL="your-email@example.com" 
export JIRA_API_TOKEN="your-api-token"
export PROJECT_KEY="SCRUM"

./bulk-delete-jira-alerts.sh --delete
```
