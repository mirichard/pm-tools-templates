# 🚀 JIRA SETUP QUICKSTART

## 📋 Manual Steps (You Need to Do These)

### Step 1: Install App (5 minutes)
1. Go to: https://flow-foundry.atlassian.net/
2. Click gear icon (⚙️) → Apps → Find new apps
3. Search: "GitHub for Jira"
4. Install the official Atlassian app

### Step 2: Connect GitHub (3 minutes)
1. Apps → GitHub integration
2. Click "Connect GitHub account"
3. Authorize for `mirichard` organization

### Step 3: Connect Repository (2 minutes)
1. Click "Connect repository"
2. Select: `mirichard/pm-tools-templates`
3. Enable: Smart commits, Issue transitions

## 🧪 Test Integration (Automated)
After manual setup, run:
```bash
./test-jira-integration.sh
```

## ✅ Verification Checklist
- [ ] App installed in Jira
- [ ] GitHub account connected
- [ ] Repository linked
- [ ] Test script passes
- [ ] Commit appears in Jira issue

## 🆘 Quick Links
- **Jira**: https://flow-foundry.atlassian.net/
- **Apps**: https://flow-foundry.atlassian.net/plugins/servlet/upm
- **GitHub Integration**: https://flow-foundry.atlassian.net/plugins/servlet/github/setup
- **Repository**: https://github.com/mirichard/pm-tools-templates

## 📞 If Stuck
1. Check `jira-setup-steps.md` for detailed instructions
2. Verify admin permissions on both platforms
3. Try disconnecting/reconnecting GitHub account
