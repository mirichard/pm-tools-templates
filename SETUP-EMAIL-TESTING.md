# 📧 Setup Guide: Email Testing for Enhanced Clean Status Workflow (Issue #314)

## 🎯 Objective
Configure GitHub Actions to send actual test emails for Enhanced Clean Status Workflow verification.

## 🔐 Step 1: Configure Repository Secrets

Go to your GitHub repository settings and add these secrets:

### Required Email Secrets:
```
EMAIL_USERNAME = your-email@gmail.com (or your SMTP email)
EMAIL_PASSWORD = your-app-password (NOT your regular password)
```

### Optional Program Secrets:
```
PROGRAM_STAKEHOLDERS_EMAIL = your-test-email@gmail.com
PROGRAM_EMAIL_FROM = program-manager@company.com
PROGRAM_DASHBOARD_URL = https://your-dashboard-url.com
DETAILED_REPORTS_URL = https://your-reports-url.com
```

## 📝 Step 2: Gmail App Password Setup (if using Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings > Security > App Passwords
3. Generate an app password for "Mail"
4. Use this app password (not your regular password) for `EMAIL_PASSWORD`

## 🚀 Step 3: Run the Test

1. Go to your repository's **Actions** tab
2. Find "📊 Enhanced Clean Status Workflow - Issue #314"
3. Click **Run workflow**
4. Set parameters:
   - `test_mode`: `false` (to enable email sending)
   - `report_type`: `weekly`
   - `methodology`: `hybrid`
5. Click **Run workflow**

## 📧 Step 4: Verify Email Delivery

You should receive an email with:
- ✅ Executive-friendly formatting
- ✅ Program-level status metrics
- ✅ Mobile-responsive design
- ✅ Dashboard integration links
- ✅ Issue #314 reference

## 🔍 Step 5: User Verification Required

**THE TASK REMAINS INCOMPLETE UNTIL:**
- You receive the actual test email
- You verify it meets all Issue #314 requirements
- You confirm the email content is satisfactory

## 🛠️ Alternative SMTP Providers

If not using Gmail, configure these for your SMTP provider:

### Outlook/Hotmail:
- Server: `smtp-mail.outlook.com`
- Port: `587`

### Yahoo:
- Server: `smtp.mail.yahoo.com`
- Port: `587`

### Custom SMTP:
- Update `server_address` and `server_port` in the workflow

## ❌ Common Issues

1. **"Authentication failed"** - Use app password, not regular password
2. **"Connection refused"** - Check SMTP server and port
3. **"No email received"** - Check spam folder, verify recipient email

## 🎉 Success Criteria

Task is complete ONLY when:
1. ✅ GitHub Actions workflow runs successfully
2. ✅ User receives actual test email
3. ✅ User verifies email meets Issue #314 requirements
4. ✅ User confirms task completion

---

**Next Step:** Configure the secrets above, then run the workflow to receive your test email for verification.
