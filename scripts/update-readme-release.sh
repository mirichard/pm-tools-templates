#!/bin/bash

# Update README with Latest Release Information
# This script automatically updates the latest release section in README.md

set -e

echo "🔄 Updating README with latest release information..."

# Get latest release info from GitHub API
LATEST_RELEASE=$(gh release list --limit 1 --json tagName,name,url --jq '.[0]')
TAG_NAME=$(echo "$LATEST_RELEASE" | jq -r '.tagName')
RELEASE_NAME=$(echo "$LATEST_RELEASE" | jq -r '.name')
RELEASE_URL=$(echo "$LATEST_RELEASE" | jq -r '.url')

echo "📋 Latest release: $TAG_NAME - $RELEASE_NAME"

# Get release notes excerpt (first few bullet points)
RELEASE_NOTES=$(gh release view "$TAG_NAME" --json body --jq '.body' | head -20)

# Update the download link in README
sed -i '' "s|archive/refs/tags/v[0-9]*\.[0-9]*\.[0-9]*\.zip|archive/refs/tags/${TAG_NAME}.zip|g" README.md

echo "✅ README updated with latest release information"
echo "🔗 Release URL: $RELEASE_URL"
echo "📦 Download: https://github.com/mirichard/pm-tools-templates/archive/refs/tags/${TAG_NAME}.zip"

# Optional: commit the changes
read -p "🤔 Commit changes to README? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add README.md
    git commit -m "docs: update README with latest release $TAG_NAME"
    echo "✅ Changes committed"
else
    echo "ℹ️  Changes not committed - review and commit manually"
fi