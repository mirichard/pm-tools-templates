#!/bin/bash

# GitHub-Jira Integration Test Script
# Run this AFTER you complete the manual setup in Jira

echo "🔧 GitHub-Jira Integration Test"
echo "================================"

# Check if we're in the right repository
if [[ ! -d ".git" ]]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Get the current repository URL
REPO_URL=$(git remote get-url origin 2>/dev/null)
echo "📁 Repository: $REPO_URL"

# Prompt for Jira issue key
echo ""
read -p "📝 Enter a test Jira issue key (e.g., SCRUM-101): " ISSUE_KEY

if [[ -z "$ISSUE_KEY" ]]; then
    echo "❌ Issue key required"
    exit 1
fi

# Validate issue key format (basic check)
if [[ ! "$ISSUE_KEY" =~ ^[A-Z]+-[0-9]+$ ]]; then
    echo "⚠️  Warning: Issue key format should be PROJECT-NUMBER (e.g., SCRUM-123)"
fi

# Create test branch
BRANCH_NAME="${ISSUE_KEY}-test-integration"
echo ""
echo "🌿 Creating test branch: $BRANCH_NAME"

# Check if branch already exists
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    echo "⚠️  Branch $BRANCH_NAME already exists. Switching to it..."
    git checkout $BRANCH_NAME
else
    git checkout -b $BRANCH_NAME
fi

# Create test file
TEST_FILE="jira-integration-test-$(date +%s).txt"
echo "🧪 Creating test file: $TEST_FILE"
cat > $TEST_FILE << EOF
# Jira Integration Test

This file was created to test the GitHub-Jira integration.

- Issue Key: $ISSUE_KEY
- Branch: $BRANCH_NAME
- Timestamp: $(date)
- Repository: $REPO_URL

If the integration is working, this commit should appear in the Jira issue.
EOF

# Add and commit with smart commit message
git add $TEST_FILE
COMMIT_MSG="$ISSUE_KEY #comment Testing GitHub-Jira integration with automated script"
echo "💾 Committing with message: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# Push to remote
echo "🚀 Pushing to remote repository..."
git push origin $BRANCH_NAME

echo ""
echo "✅ Test completed!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Jira issue: https://flow-foundry.atlassian.net/browse/$ISSUE_KEY"
echo "2. Check the 'Development' panel on the right side"
echo "3. You should see:"
echo "   - The commit linked to this issue"
echo "   - The branch $BRANCH_NAME"
echo "   - Link to this repository"
echo ""
echo "4. If you don't see the integration:"
echo "   - Verify the GitHub for Jira app is installed"
echo "   - Check that the repository is connected in Jira"
echo "   - Ensure the issue key $ISSUE_KEY exists in your SCRUM project"
echo ""
echo "🗑️  To clean up this test:"
echo "   git checkout main"
echo "   git branch -D $BRANCH_NAME"
echo "   git push origin --delete $BRANCH_NAME"
echo "   rm $TEST_FILE"
