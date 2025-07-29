#!/bin/bash

# Bulk Update SCRUM Tickets to Backlog Status
# This script changes all SCRUM tickets from "In Progress" to "Backlog"

set -e

# Configuration
JIRA_URL="https://flow-foundry.atlassian.net"
PROJECT_KEY="SCRUM"
FROM_STATUS="In Progress"
TO_STATUS="Backlog"
BATCH_SIZE=10
DELAY_BETWEEN_REQUESTS=1

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

# Function to get transition ID for moving to Backlog
get_backlog_transition_id() {
    local issue_key=$1
    
    # Get available transitions for the issue
    local transitions=$(curl -s -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
        -H "Accept: application/json" \
        "${JIRA_URL}/rest/api/3/issue/${issue_key}/transitions")
    
    # Find the transition ID for "Backlog" or similar
    local transition_id=$(echo "$transitions" | jq -r '.transitions[] | select(.to.name == "Backlog" or .to.name == "To Do" or .to.name == "Open") | .id' | head -1)
    
    echo "$transition_id"
}

# Function to update ticket status
update_ticket_status() {
    local issue_key=$1
    local transition_id=$2
    
    local response=$(curl -s -w "%{http_code}" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
        -X POST \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -d "{\"transition\":{\"id\":\"${transition_id}\"}}" \
        "${JIRA_URL}/rest/api/3/issue/${issue_key}/transitions")
    
    local http_code="${response: -3}"
    local response_body="${response%???}"
    
    if [[ "$http_code" == "204" ]]; then
        success "Updated $issue_key to Backlog"
        return 0
    else
        error "Failed to update $issue_key (HTTP $http_code): $response_body"
        return 1
    fi
}

# Main execution
main() {
    log "Starting bulk status update for SCRUM project tickets"
    log "Changing tickets from '$FROM_STATUS' to '$TO_STATUS'"
    
    # Get all tickets that are "In Progress"
    log "Fetching tickets in '$FROM_STATUS' status..."
    
    local jql="project%3D${PROJECT_KEY}%20AND%20status%3D%22In%20Progress%22"
    local tickets=$(curl -s -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
        -H "Accept: application/json" \
        "${JIRA_URL}/rest/api/3/search?jql=${jql}&fields=key,status&maxResults=1000")
    
    local ticket_keys=$(echo "$tickets" | jq -r '.issues[].key')
    local total_tickets=$(echo "$tickets" | jq -r '.total')
    
    if [[ -z "$ticket_keys" || "$total_tickets" == "0" ]]; then
        warning "No tickets found with status '$FROM_STATUS'"
        exit 0
    fi
    
    log "Found $total_tickets tickets to update"
    echo
    
    # Process tickets in batches
    local count=0
    local success_count=0
    local error_count=0
    
    for ticket_key in $ticket_keys; do
        ((count++))
        
        log "Processing ticket $count/$total_tickets: $ticket_key"
        
        # Get the transition ID for this ticket
        local transition_id=$(get_backlog_transition_id "$ticket_key")
        
        if [[ -z "$transition_id" || "$transition_id" == "null" ]]; then
            error "Could not find transition to Backlog for $ticket_key"
            ((error_count++))
        else
            # Update the ticket
            if update_ticket_status "$ticket_key" "$transition_id"; then
                ((success_count++))
            else
                ((error_count++))
            fi
        fi
        
        # Rate limiting
        if (( count % BATCH_SIZE == 0 )); then
            log "Processed batch of $BATCH_SIZE tickets, pausing for ${DELAY_BETWEEN_REQUESTS}s..."
            sleep $DELAY_BETWEEN_REQUESTS
        fi
        
        # Small delay between each request
        sleep 0.5
    done
    
    echo
    log "Bulk update completed!"
    success "Successfully updated: $success_count tickets"
    if [[ $error_count -gt 0 ]]; then
        error "Failed to update: $error_count tickets"
    fi
    
    # Show final status
    echo
    log "Final status verification..."
    curl -s -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
        -H "Accept: application/json" \
        "${JIRA_URL}/rest/api/3/search?jql=project=${PROJECT_KEY}&fields=key,status&maxResults=1000" \
        | jq -r '.issues[] | .fields.status.name' | sort | uniq -c
}

# Run the script
main "$@"
