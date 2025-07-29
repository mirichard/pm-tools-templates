#!/bin/bash

# Bulk Delete Jira Tickets by Range Script
# This script deletes SCRUM tickets in a specified number range (e.g., SCRUM-90 through SCRUM-196)

set -e

# Configuration - Update these variables or set as environment variables
JIRA_URL="${JIRA_URL:-https://your-domain.atlassian.net}"
JIRA_EMAIL="${JIRA_EMAIL:-your-email@example.com}"
JIRA_API_TOKEN="${JIRA_API_TOKEN:-your-api-token}"
PROJECT_KEY="${PROJECT_KEY:-SCRUM}"

# Default range (can be overridden with command line arguments)
START_NUMBER="${START_NUMBER:-90}"
END_NUMBER="${END_NUMBER:-196}"

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
    
    # Validate range
    if [[ ! "$START_NUMBER" =~ ^[0-9]+$ ]] || [[ ! "$END_NUMBER" =~ ^[0-9]+$ ]]; then
        print_error "START_NUMBER and END_NUMBER must be positive integers"
        exit 1
    fi
    
    if [[ $START_NUMBER -gt $END_NUMBER ]]; then
        print_error "START_NUMBER ($START_NUMBER) cannot be greater than END_NUMBER ($END_NUMBER)"
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

# Function to generate ticket list for the range
generate_ticket_list() {
    local start=$1
    local end=$2
    local tickets=()
    
    for ((i=start; i<=end; i++)); do
        tickets+=("${PROJECT_KEY}-${i}")
    done
    
    echo "${tickets[@]}"
}

# Function to check if a ticket exists
ticket_exists() {
    local ticket_key="$1"
    
    response=$(curl -s -w "%{http_code}" \
        -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
        -H "Accept: application/json" \
        "${JIRA_URL}/rest/api/3/issue/${ticket_key}?fields=key,summary" \
        -o /tmp/jira_check_response.json)
    
    if [[ "$response" == "200" ]]; then
        # Ticket exists, get its summary
        summary=$(jq -r '.fields.summary' /tmp/jira_check_response.json 2>/dev/null || echo "No summary")
        echo "$summary"
        rm -f /tmp/jira_check_response.json
        return 0
    else
        # Ticket doesn't exist or access denied
        rm -f /tmp/jira_check_response.json
        return 1
    fi
}

# Function to search for existing tickets in range
search_range_tickets() {
    print_status "Searching for existing tickets in range $PROJECT_KEY-$START_NUMBER to $PROJECT_KEY-$END_NUMBER..."
    
    # Generate list of all ticket keys in range
    ticket_list=($(generate_ticket_list $START_NUMBER $END_NUMBER))
    total_in_range=${#ticket_list[@]}
    
    print_status "Checking $total_in_range tickets for existence..."
    
    existing_tickets=()
    checked_count=0
    
    for ticket_key in "${ticket_list[@]}"; do
        ((checked_count++))
        
        # Show progress every 10 tickets
        if (( checked_count % 10 == 0 )) || (( checked_count == total_in_range )); then
            print_status "Progress: $checked_count/$total_in_range tickets checked"
        fi
        
        if summary=$(ticket_exists "$ticket_key"); then
            existing_tickets+=("$ticket_key")
            echo "  ✓ $ticket_key: $summary"
        fi
        
        # Small delay to avoid rate limiting
        sleep 0.1
    done
    
    total_existing=${#existing_tickets[@]}
    
    if [[ $total_existing -eq 0 ]]; then
        print_success "No existing tickets found in the specified range"
        exit 0
    fi
    
    print_warning "Found $total_existing existing tickets in range:"
    
    # Store existing tickets for later use
    printf '%s\n' "${existing_tickets[@]}" > /tmp/existing_tickets.txt
    
    return $total_existing
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
    
    if [[ ! -f /tmp/existing_tickets.txt ]]; then
        print_error "No existing tickets list found. Please run search first."
        exit 1
    fi
    
    # Read existing tickets from file
    mapfile -t existing_tickets < /tmp/existing_tickets.txt
    total_tickets=${#existing_tickets[@]}
    
    if [[ $total_tickets -eq 0 ]]; then
        print_success "No tickets found to delete"
        return 0
    fi
    
    print_status "Deleting $total_tickets tickets..."
    
    deleted_count=0
    failed_count=0
    
    for ticket_key in "${existing_tickets[@]}"; do
        if delete_ticket "$ticket_key"; then
            ((deleted_count++))
        else
            ((failed_count++))
        fi
        
        # Add a delay to avoid rate limiting
        sleep 0.5
    done
    
    print_success "Deletion complete: $deleted_count deleted, $failed_count failed"
    
    rm -f /tmp/existing_tickets.txt /tmp/jira_delete_response.json
}

# Function to show help
show_help() {
    echo "Bulk Delete Jira Tickets by Range Script"
    echo ""
    echo "This script deletes SCRUM tickets in a specified number range."
    echo ""
    echo "Usage: $0 [options] [start_number] [end_number]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -d, --dry-run  Show tickets that would be deleted without actually deleting them"
    echo "  --delete       Actually perform the deletion (requires confirmation)"
    echo ""
    echo "Arguments:"
    echo "  start_number   Starting ticket number (default: 90)"
    echo "  end_number     Ending ticket number (default: 196)"
    echo ""
    echo "Configuration:"
    echo "  Update the following variables in the script or set as environment variables:"
    echo "  - JIRA_URL: Your Jira instance URL"
    echo "  - JIRA_EMAIL: Your Jira email address"
    echo "  - JIRA_API_TOKEN: Your Jira API token"
    echo "  - PROJECT_KEY: Project key (default: SCRUM)"
    echo ""
    echo "Examples:"
    echo "  $0 -d                           # Dry run with default range (90-196)"
    echo "  $0 -d 100 150                   # Dry run for SCRUM-100 to SCRUM-150"
    echo "  $0 --delete 90 196              # Delete SCRUM-90 to SCRUM-196"
    echo ""
    echo "Environment Variables:"
    echo "  export JIRA_URL=\"https://your-domain.atlassian.net\""
    echo "  export JIRA_EMAIL=\"your-email@example.com\""
    echo "  export JIRA_API_TOKEN=\"your-api-token\""
    echo "  export PROJECT_KEY=\"SCRUM\""
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
            [0-9]*)
                # This is a number, treat as start or end number
                if [[ -z "${start_provided:-}" ]]; then
                    START_NUMBER="$1"
                    start_provided=true
                elif [[ -z "${end_provided:-}" ]]; then
                    END_NUMBER="$1"
                    end_provided=true
                else
                    print_error "Too many number arguments provided"
                    show_help
                    exit 1
                fi
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
    
    print_status "Starting Jira Tickets Bulk Delete by Range Script"
    echo "===================================================="
    print_status "Target Range: $PROJECT_KEY-$START_NUMBER to $PROJECT_KEY-$END_NUMBER"
    echo ""
    
    # Run checks
    check_dependencies
    validate_config
    test_connection
    
    # Search for existing tickets in range
    search_range_tickets
    ticket_count=$?
    
    if [[ $ticket_count -eq 0 ]]; then
        exit 0
    fi
    
    if [[ "$dry_run" == true ]]; then
        print_warning "DRY RUN MODE: No tickets will be deleted"
        print_status "Found $ticket_count existing tickets in range that would be deleted"
        exit 0
    fi
    
    if [[ "$perform_delete" == true ]]; then
        echo ""
        print_warning "WARNING: This will permanently delete $ticket_count tickets!"
        print_warning "Range: $PROJECT_KEY-$START_NUMBER to $PROJECT_KEY-$END_NUMBER"
        print_warning "This action cannot be undone!"
        echo ""
        
        read -p "Are you sure you want to delete these tickets? (type 'DELETE_TICKETS' to confirm): " confirmation
        
        if [[ "$confirmation" == "DELETE_TICKETS" ]]; then
            bulk_delete_tickets
        else
            print_status "Deletion cancelled by user"
            exit 0
        fi
    fi
}

# Run the main function with all arguments
main "$@"
