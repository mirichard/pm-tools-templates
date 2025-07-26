#!/bin/bash

# GitHub Setup Test (works without Jira integration)
# This tests your GitHub repository setup and prepares for Jira integration

echo "🔧 GitHub Repository Setup Test"
echo "==============================="

# Check if we're in the right repository
if [[ ! -d ".git" ]]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Get the current repository URL
REPO_URL=$(git remote get-url origin 2>/dev/null)
echo "📁 Repository: $REPO_URL"

# Check if this is the right repository
if [[ "$REPO_URL" != *"pm-tools-templates"* ]]; then
    echo "⚠️  Warning: This doesn't appear to be the pm-tools-templates repository"
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
echo "🌿 Current branch: $CURRENT_BRANCH"

# Check if we have uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Warning: You have uncommitted changes"
    git status --porcelain
fi

# Create a sample issue key for testing
ISSUE_KEY="SCRUM-999"
BRANCH_NAME="${ISSUE_KEY}-setup-test"

echo ""
echo "🧪 Creating test commit (before Jira integration)..."
echo "This will create a commit with Jira-style formatting."
echo "Once you set up the integration, commits like this will link to Jira."

# Create test branch
echo "🌿 Creating test branch: $BRANCH_NAME"

# Check if branch already exists
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    echo "⚠️  Branch $BRANCH_NAME already exists. Switching to it..."
    git checkout $BRANCH_NAME
else
    git checkout -b $BRANCH_NAME
fi

# Create test file
TEST_FILE="github-setup-test-$(date +%s).txt"
echo "📝 Creating test file: $TEST_FILE"
cat > $TEST_FILE << EOF
# GitHub Setup Verification

This file was created to verify GitHub repository setup before Jira integration.

## Repository Information
- Repository: $REPO_URL
- Branch: $BRANCH_NAME  
- Timestamp: $(date)

## Next Steps
1. Complete Jira integration setup
2. Create real Jira issues
3. Use real issue keys in commits

## Test Commit Format
This commit uses the format: "$ISSUE_KEY #comment message"
Once Jira integration is active, this will link to the actual issue.
EOF

# Add and commit with smart commit message format
git add $TEST_FILE
COMMIT_MSG="$ISSUE_KEY #comment GitHub setup test - preparing for Jira integration"
echo "💾 Committing with message: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# Push to remote
echo "🚀 Pushing to remote repository..."
git push origin $BRANCH_NAME

echo ""
echo "✅ GitHub setup test completed!"
echo ""
echo "📋 Repository is ready for Jira integration:"
echo "✓ Git repository working"
echo "✓ Remote connection established"  
echo "✓ Can create branches and commits"
echo "✓ Can push to GitHub"
echo ""
echo "🔗 Next steps for Jira integration:"
echo "1. Go to: https://flow-foundry.atlassian.net/"
echo "2. Install 'GitHub for Jira' app"
echo "3. Connect this repository: $REPO_URL"
echo "4. Create a real Jira issue in SCRUM project"
echo "5. Run: ./test-jira-integration.sh"
echo ""
echo "📚 Documentation available:"
echo "- JIRA-SETUP-QUICKSTART.md (quick steps)"
echo "- jira-setup-steps.md (detailed guide)"
echo ""
echo "🗑️  To clean up this test:"
echo "   git checkout main"
echo "   git branch -D $BRANCH_NAME"
echo "   git push origin --delete $BRANCH_NAME"
echo "   rm $TEST_FILE"
