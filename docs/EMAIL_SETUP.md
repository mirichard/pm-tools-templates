# 📧 Email Setup Guide

This guide explains how to configure SMTP email delivery for the weekly status reports.

## Quick Setup

### 1. Configure GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `EMAIL_USERNAME` | Your Gmail address | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Gmail App Password | `abcd efgh ijkl mnop` |
| `EMAIL_RECIPIENTS` | Comma-separated recipients | `team@company.com, manager@company.com` |
| `EMAIL_FROM` | Sender email (optional) | `pm-reports@company.com` |

### 2. Gmail App Password Setup

1. Go to https://myaccount.google.com/apppasswords
2. Sign in to your Google account
3. Click "Generate" and select "Mail"
4. Copy the 16-character app password
5. Use this as your `EMAIL_PASSWORD` secret

### 3. Test Email Delivery

Run the workflow manually to test:

```bash
gh workflow run status-reporting.yml --field test_mode=true --field report_type=weekly
```

## Supported Email Providers

### Gmail (Recommended)
- Server: `smtp.gmail.com`
- Port: `465` (SSL)
- Requires: App Password (not regular password)

### Outlook/Office 365
Update workflow with these settings:
```yaml
server_address: smtp-mail.outlook.com
server_port: 587
```

### Custom SMTP
Update workflow with your provider's settings:
```yaml
server_address: your-smtp-server.com
server_port: 587 # or 465 for SSL
```

## Security Notes

- ✅ Use App Passwords, not regular passwords
- ✅ GitHub secrets are encrypted and secure
- ✅ Only repository admins can view/edit secrets
- ❌ Never commit email credentials to code

## Troubleshooting

### Email not sending
1. Check that `EMAIL_USERNAME` secret is set
2. Verify Gmail App Password is correct
3. Check workflow logs for specific errors

### Gmail authentication errors
1. Enable 2-factor authentication on Gmail
2. Generate new App Password
3. Use the full Gmail address as username

### Recipients not receiving
1. Check spam/junk folders
2. Verify email addresses in `EMAIL_RECIPIENTS`
3. Test with a single recipient first

## Email Content

The automated emails include:

- 📊 **Executive Dashboard** - Color-coded metrics
- 🎯 **Active Milestones** - Progress bars and completion rates
- 🗓️ **High Priority Issues** - Detailed issue breakdown
- 📋 **Action Items** - Links to reports and next steps

## Sample Email Output

The emails are professionally formatted HTML with:
- Responsive design for mobile/desktop
- Color-coded status indicators (green/yellow/red)
- Progress bars for milestones
- Clickable links to GitHub issues and reports
- Professional styling suitable for stakeholders

## Manual Testing

To test email delivery without running the full workflow:

```bash
# 1. Ensure secrets are configured
# 2. Run workflow manually
gh workflow run status-reporting.yml

# 3. Check the workflow logs
gh run list --workflow="status-reporting.yml" --limit=1
gh run view <RUN_ID> --log
```

## Production Schedule

Once configured, emails are automatically sent:
- **Fridays 4 PM UTC**: Generate status reports
- **Mondays 7 AM UTC**: Send status emails

You can customize the schedule by editing the cron expressions in the workflow file.
