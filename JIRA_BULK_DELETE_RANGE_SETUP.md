# Jira Bulk Delete by Range Setup Guide

This guide explains how to use the script to bulk delete SCRUM tickets in a specified number range.

## Prerequisites
- **jq**: JSON parser (install with `brew install jq` on macOS)
- **curl**: HTTP client (usually pre-installed)
- **Jira API Token**: Personal access token for your Jira account

## Configuration

### Using Environment Variables
Instead of editing the script, you can configure it using environment variables:
```bash
export JIRA_URL="https://your-domain.atlassian.net"
export JIRA_EMAIL="your-email@example.com"
export JIRA_API_TOKEN="your-api-token"
export PROJECT_KEY="SCRUM"
export START_NUMBER=90  # Starting ticket number
export END_NUMBER=196   # Ending ticket number
```

### Edit in Script
Edit `bulk-delete-jira-range.sh` and update these variables:
```bash
JIRA_URL="https://your-domain.atlassian.net"  # Your Jira instance URL
JIRA_EMAIL="your-email@example.com"           # Your Jira email address
JIRA_API_TOKEN="your-api-token"               # Your API token from Jira
PROJECT_KEY="SCRUM"                          # Project key (usually SCRUM)
```

## Usage

### 1. Dry Run (Check Ticket Existence)
```bash
./bulk-delete-jira-range.sh --dry-run
```
This shows tickets that would be deleted without actually performing the delete.

### 2. Actual Deletion
```bash
./bulk-delete-jira-range.sh --delete
```
This deletes the tickets after confirmation.

### 3. Help
```bash
./bulk-delete-jira-range.sh --help
```

## What Gets Deleted
The script targets SCRUM tickets in the specified range:
- **Example**: SCRUM-90 through SCRUM-196

## Safety Features
- **Dry Run Mode**: Allows viewing the list of tickets that would be deleted.
- **Confirmation Prompt**: Requires typing 'DELETE_TICKETS' to proceed with deletion.
- **Progress Tracking**: Displays ongoing process and outcomes.
- **Rate Limiting**: 0.5s delay between operations to prevent API throttling.

## Security Notes
- **Keep your API token secure**: Never commit it to version control.
- **Use dry run first** to verify the action scope.
- **Follow best practices**: Review permissions and access control in Jira prior to executing bulk operations.
