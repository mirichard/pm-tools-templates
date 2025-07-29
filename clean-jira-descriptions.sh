#!/bin/bash

# Clean SCRUM Ticket Descriptions
# This script removes stray \n characters and improves readability

set -e

# Configuration
JIRA_URL="https://flow-foundry.atlassian.net"
PROJECT_KEY="SCRUM"
BATCH_SIZE=5
DELAY_BETWEEN_REQUESTS=2

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if required environment variables are set
if [[ -z "$JIRA_EMAIL" || -z "$JIRA_API_TOKEN" ]]; then
    error "Required environment variables JIRA_EMAIL and JIRA_API_TOKEN are not set"
    echo "Please set them with:"
    echo "export JIRA_EMAIL='your-email@domain.com'"
    echo "export JIRA_API_TOKEN='your-api-token'"
    exit 1
fi

# Function to clean text content
clean_text() {
    local raw_text="$1"
    
    # Remove stray \n characters and clean up formatting using Python
    cleaned_text=$(python3 -c "
import sys
text = sys.stdin.read()
# Replace escaped newlines with actual newlines
text = text.replace('\\\\n', '\\n')
text = text.replace('\\n', '\\n')
# Fix escaped quotes
text = text.replace('\\\"', '\"')
# Fix escaped slashes
text = text.replace('\\\/', '/')
print(text, end='')
" <<< "$raw_text")
    
    echo "$cleaned_text"
}

# Function to extract clean text from Jira description JSON
extract_clean_description() {
    local description_json="$1"
    
    # Extract text content from the nested JSON structure
    local raw_text=$(echo "$description_json" | jq -r '.content[0].content[0].text // empty')
    
    if [[ -n "$raw_text" ]]; then
        clean_text "$raw_text"
    else
        echo "No content found"
    fi
}

# Function to update ticket description
update_ticket_description() {
    local issue_key="$1"
    local clean_description="$2"
    
    # Create JSON payload with cleaned description in ADF format
    local json_payload=$(jq -n --arg desc "$clean_description" '{
        fields: {
            description: {
                type: "doc",
                version: 1,
                content: [
                    {
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: $desc
                            }
                        ]
                    }
                ]
            }
        }
    }')
    
    local response=$(curl -s -w "%{http_code}" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
        -X PUT \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -d "$json_payload" \
        "${JIRA_URL}/rest/api/3/issue/${issue_key}")
    
    local http_code="${response: -3}"
    local response_body="${response%???}"
    
    if [[ "$http_code" == "204" ]]; then
        success "Updated description for $issue_key"
        return 0
    else
        error "Failed to update $issue_key (HTTP $http_code): $response_body"
        return 1
    fi
}

# Main execution
main() {
    log "Starting SCRUM ticket description cleanup process"
    
    # Get all Backlog tickets
    log "Fetching SCRUM tickets in Backlog status..."
    
    local jql="project%3D${PROJECT_KEY}%20AND%20status%3D%22Backlog%22"
    local tickets_response=$(curl -s -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
        -H "Accept: application/json" \
        "${JIRA_URL}/rest/api/3/search?jql=${jql}&fields=key,summary,description&maxResults=1000")
    
    local total_tickets=$(echo "$tickets_response" | jq -r '.total')
    
    if [[ "$total_tickets" == "0" ]]; then
        warning "No tickets found in Backlog status"
        exit 0
    fi
    
    log "Found $total_tickets tickets to process"
    echo
    
    # Process tickets
    local count=0
    local success_count=0
    local error_count=0
    local skip_count=0
    
    echo "$tickets_response" | jq -c '.issues[]' | while read -r ticket; do
        ((count++))
        
        local issue_key=$(echo "$ticket" | jq -r '.key')
        local summary=$(echo "$ticket" | jq -r '.fields.summary')
        local description=$(echo "$ticket" | jq -r '.fields.description')
        
        log "Processing ticket $count/$total_tickets: $issue_key - $summary"
        
        # Check if description needs cleaning (contains \\n patterns)
        if [[ "$description" == *"\\\\n"* ]] || [[ "$description" == *"\\n"* ]] || [[ "$description" == *"\\\""* ]]; then
            # Extract and clean the description
            local clean_description=$(extract_clean_description "$description")
            
            if [[ -n "$clean_description" && "$clean_description" != "No content found" ]]; then
                # Update the ticket
                if update_ticket_description "$issue_key" "$clean_description"; then
                    ((success_count++))
                else
                    ((error_count++))
                fi
            else
                warning "Could not extract content from $issue_key - skipping"
                ((skip_count++))
            fi
        else
            log "Description for $issue_key already clean - skipping"
            ((skip_count++))
        fi
        
        # Rate limiting
        if (( count % BATCH_SIZE == 0 )); then
            log "Processed batch of $BATCH_SIZE tickets, pausing for ${DELAY_BETWEEN_REQUESTS}s..."
            sleep $DELAY_BETWEEN_REQUESTS
        fi
        
        # Small delay between each request
        sleep 1
    done
    
    echo
    log "Description cleanup completed!"
    success "Successfully updated: $success_count tickets"
    if [[ $error_count -gt 0 ]]; then
        error "Failed to update: $error_count tickets"
    fi
    if [[ $skip_count -gt 0 ]]; then
        warning "Skipped (already clean or no content): $skip_count tickets"
    fi
}

# Run the script
main "$@"
