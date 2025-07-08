#!/bin/bash

# Setup branch protection rules for GitHub repository
# Usage: ./scripts/setup-branch-protection.sh

set -e

REPO="mirichard/pm-tools-templates"
GITHUB_TOKEN=${GITHUB_TOKEN:-}

if [[ -z "$GITHUB_TOKEN" ]]; then
    echo "❌ GITHUB_TOKEN environment variable is required"
    echo "Please set it with: export GITHUB_TOKEN='your_token_here'"
    exit 1
fi

echo "🔒 Setting up branch protection rules for $REPO..."

# Function to set branch protection
set_branch_protection() {
    local branch=$1
    local required_reviewers=$2
    local dismiss_stale_reviews=$3
    local require_code_owner_reviews=$4
    local required_status_checks=$5
    
    echo "Setting protection for branch: $branch"
    
    curl -X PUT \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$REPO/branches/$branch/protection" \
        -d "{
            \"required_status_checks\": {
                \"strict\": true,
                \"contexts\": $required_status_checks
            },
            \"enforce_admins\": false,
            \"required_pull_request_reviews\": {
                \"required_approving_review_count\": $required_reviewers,
                \"dismiss_stale_reviews\": $dismiss_stale_reviews,
                \"require_code_owner_reviews\": $require_code_owner_reviews,
                \"require_last_push_approval\": false
            },
            \"restrictions\": null,
            \"allow_force_pushes\": false,
            \"allow_deletions\": false,
            \"block_creations\": false,
            \"required_conversation_resolution\": true
        }"
}

# Main branch protection (Production)
echo "🔒 Setting up main branch protection..."
set_branch_protection "main" 2 true true '["test", "build", "security-scan"]'

# Develop branch protection
echo "🔒 Setting up develop branch protection..."
set_branch_protection "develop" 1 true false '["test", "build"]'

# Staging branch protection
echo "🔒 Setting up staging branch protection..."
set_branch_protection "staging" 1 true false '["test", "build", "security-scan"]'

echo "✅ Branch protection rules have been set up successfully!"
echo ""
echo "📋 Summary:"
echo "  - main: Requires 2 reviewers, dismisses stale reviews, requires code owner reviews"
echo "  - develop: Requires 1 reviewer, dismisses stale reviews"
echo "  - staging: Requires 1 reviewer, dismisses stale reviews, requires security scan"
echo ""
echo "🔗 View protection rules: https://github.com/$REPO/settings/branches"
