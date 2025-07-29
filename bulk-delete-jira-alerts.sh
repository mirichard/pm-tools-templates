#!/bin/bash

# Bulk Delete Jira Alert Tickets Script
# This script finds and deletes SCRUM tickets with "Workflow Health Alert:" or "CRITICAL ALERT:" in the title

set -e

# Configuration - Update these variables or set as environment variables
JIRA_URL="${JIRA_URL:-https://your-domain.atlassian.net}"
JIRA_EMAIL="${JIRA_EMAIL:-your-email@example.com}"
JIRA_API_TOKEN="${JIRA_API_TOKEN:-your-api-token}"
PROJECT_KEY="${PROJECT_KEY:-SCRUM}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v curl &> /dev/null; then
        print_error "curl is required but not installed."
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        print_error "jq is required but not installed. Please install it: brew install jq"
        exit 1
    fi
    
    print_success "All dependencies are available"
}

# Function to validate configuration
validate_config() {
    print_status "Validating configuration..."
    
    if [[ "$JIRA_URL" == "https://your-domain.atlassian.net" ]]; then
        print_error "Please update JIRA_URL in the script with your actual Jira domain"
        exit 1
    fi
    
    if [[ "$JIRA_EMAIL" == "your-email@example.com" ]]; then
        print_error "Please update JIRA_EMAIL in the script with your actual email"
        exit 1
    fi
    
    if [[ "$JIRA_API_TOKEN" == "your-api-token" ]]; then
        print_error "Please update JIRA_API_TOKEN in the script with your actual API token"
        exit 1
    fi
    
    print_success "Configuration validated"
}

# Function to test Jira API connection
test_connection() {
    print_status "Testing Jira API connection..."
    
    response=$(curl -s -w "%{http_code}" \
        -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
        -H "Accept: application/json" \
        "${JIRA_URL}/rest/api/3/myself" \
        -o /tmp/jira_test_response.json)
    
    if [[ "$response" == "200" ]]; then
        user_name=$(jq -r '.displayName' /tmp/jira_test_response.json)
        print_success "Connected to Jira as: $user_name"
    else
        print_error "Failed to connect to Jira API (HTTP $response)"
        if [[ -f /tmp/jira_test_response.json ]]; then
            print_error "Response: $(cat /tmp/jira_test_response.json)"
        fi
        exit 1
    fi
    
    rm -f /tmp/jira_test_response.json
}

# Function to search for tickets with alert titles
search_alert_tickets() {
    print_status "Searching for SCRUM tickets with alert titles..."
    
    # JQL query to find tickets with "Workflow Health Alert:" OR "CRITICAL ALERT:" in title
    jql_query="project = $PROJECT_KEY AND (summary ~ \"Workflow Health Alert:\" OR summary ~ \"CRITICAL ALERT:\")"
    
    # URL encode the JQL query
    encoded_jql=$(printf '%s\n' "$jql_query" | curl -Gso /dev/null -w %{url_effective} --data-urlencode @- "" | cut -c 3-)
    
    print_status "JQL Query: $jql_query"
    
    # Search for issues
    response=$(curl -s -w "%{http_code}" \
        -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
        -H "Accept: application/json" \
        "${JIRA_URL}/rest/api/3/search?jql=${encoded_jql}&fields=key,summary,created&maxResults=1000" \
        -o /tmp/jira_search_response.json)
    
    if [[ "$response" != "200" ]]; then
        print_error "Failed to search for tickets (HTTP $response)"
        if [[ -f /tmp/jira_search_response.json ]]; then
            print_error "Response: $(cat /tmp/jira_search_response.json)"
        fi
        exit 1
    fi
    
    # Parse the response
    total_tickets=$(jq -r '.total' /tmp/jira_search_response.json)
    
    if [[ "$total_tickets" == "0" ]]; then
        print_success "No alert tickets found to delete"
        exit 0
    fi
    
    print_warning "Found $total_tickets alert tickets to delete:"
    
    # Display tickets to be deleted
    jq -r '.issues[] | "\(.key): \(.fields.summary)"' /tmp/jira_search_response.json | while read -r line; do
        echo "  - $line"
    done
    
    rm -f /tmp/jira_search_response.json
    return $total_tickets
}

# Function to delete a single ticket
delete_ticket() {
    local ticket_key="$1"
    
    response=$(curl -s -w "%{http_code}" \
        -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
        -X DELETE \
        "${JIRA_URL}/rest/api/3/issue/${ticket_key}" \
        -o /tmp/jira_delete_response.json)
    
    if [[ "$response" == "204" ]]; then
        print_success "Deleted: $ticket_key"
        return 0
    else
        print_error "Failed to delete $ticket_key (HTTP $response)"
        if [[ -f /tmp/jira_delete_response.json ]]; then
            error_msg=$(jq -r '.errorMessages[]?' /tmp/jira_delete_response.json 2>/dev/null || echo "Unknown error")
            print_error "Error: $error_msg"
        fi
        return 1
    fi
}

# Function to perform bulk deletion
bulk_delete_tickets() {
    print_status "Starting bulk deletion process..."
    
    # Re-search to get current list of tickets
    jql_query="project = $PROJECT_KEY AND (summary ~ \"Workflow Health Alert:\" OR summary ~ \"CRITICAL ALERT:\")"
    encoded_jql=$(printf '%s\n' "$jql_query" | curl -Gso /dev/null -w %{url_effective} --data-urlencode @- "" | cut -c 3-)
    
    response=$(curl -s -w "%{http_code}" \
        -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
        -H "Accept: application/json" \
        "${JIRA_URL}/rest/api/3/search?jql=${encoded_jql}&fields=key,summary&maxResults=1000" \
        -o /tmp/jira_bulk_search.json)
    
    if [[ "$response" != "200" ]]; then
        print_error "Failed to search for tickets during bulk deletion (HTTP $response)"
        exit 1
    fi
    
    # Extract ticket keys
    ticket_keys=($(jq -r '.issues[].key' /tmp/jira_bulk_search.json))
    total_tickets=${#ticket_keys[@]}
    
    if [[ $total_tickets -eq 0 ]]; then
        print_success "No tickets found to delete"
        return 0
    fi
    
    print_status "Deleting $total_tickets tickets..."
    
    deleted_count=0
    failed_count=0
    
    for ticket_key in "${ticket_keys[@]}"; do
        if delete_ticket "$ticket_key"; then
            ((deleted_count++))
        else
            ((failed_count++))
        fi
        
        # Add a small delay to avoid rate limiting
        sleep 0.5
    done
    
    print_success "Deletion complete: $deleted_count deleted, $failed_count failed"
    
    rm -f /tmp/jira_bulk_search.json /tmp/jira_delete_response.json
}

# Function to show help
show_help() {
    echo "Bulk Delete Jira Alert Tickets Script"
    echo ""
    echo "This script deletes SCRUM tickets with 'Workflow Health Alert:' or 'CRITICAL ALERT:' in the title."
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -d, --dry-run  Show tickets that would be deleted without actually deleting them"
    echo "  --delete       Actually perform the deletion (requires confirmation)"
    echo ""
    echo "Configuration:"
    echo "  Update the following variables in the script:"
    echo "  - JIRA_URL: Your Jira instance URL"
    echo "  - JIRA_EMAIL: Your Jira email address"
    echo "  - JIRA_API_TOKEN: Your Jira API token"
    echo "  - PROJECT_KEY: Project key (default: SCRUM)"
    echo ""
    echo "Examples:"
    echo "  $0 -d                    # Dry run - show what would be deleted"
    echo "  $0 --delete              # Actually delete the tickets"
}

# Main execution
main() {
    local dry_run=false
    local perform_delete=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -d|--dry-run)
                dry_run=true
                shift
                ;;
            --delete)
                perform_delete=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # If no options provided, show help
    if [[ "$dry_run" == false && "$perform_delete" == false ]]; then
        show_help
        exit 0
    fi
    
    print_status "Starting Jira Alert Tickets Bulk Delete Script"
    echo "================================================="
    
    # Run checks
    check_dependencies
    validate_config
    test_connection
    
    # Search for tickets
    search_alert_tickets
    ticket_count=$?
    
    if [[ $ticket_count -eq 0 ]]; then
        exit 0
    fi
    
    if [[ "$dry_run" == true ]]; then
        print_warning "DRY RUN MODE: No tickets will be deleted"
        print_status "Found $ticket_count tickets that would be deleted"
        exit 0
    fi
    
    if [[ "$perform_delete" == true ]]; then
        echo ""
        print_warning "WARNING: This will permanently delete $ticket_count tickets!"
        print_warning "This action cannot be undone!"
        echo ""
        
        read -p "Are you sure you want to delete these tickets? (type 'yes' to confirm): " confirmation
        
        if [[ "$confirmation" == "yes" ]]; then
            bulk_delete_tickets
        else
            print_status "Deletion cancelled by user"
            exit 0
        fi
    fi
}

# Run the main function with all arguments
main "$@"
