#!/bin/bash

# Prompt for GitHub token
read -p "Enter your GitHub token: " TOKEN

# Prompt for repository name
read -p "Enter your repository name: " REPO

# Set your GitHub username here
USERNAME="Adornadowilliam2"

# Construct the new remote URL
NEW_URL="https://${TOKEN}@github.com/${USERNAME}/${REPO}.git"

# Run the git command
git remote set-url origin "$NEW_URL"

# Feedback
echo "✅ Remote origin updated to: $NEW_URL"
