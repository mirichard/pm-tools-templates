#!/bin/bash

# AI Agent Session State Management
# Helps maintain context and track interaction patterns

set -euo pipefail

STATE_FILE=".warp-session-state.json"
PATTERNS_FILE=".warp-patterns-learned.json"

# Initialize session state
init_session() {
    echo "🚀 Initializing AI agent session..."
    
    cat > "$STATE_FILE" << EOF
{
  "session_id": "$(date +%Y%m%d-%H%M%S)",
  "started_at": "$(date -Iseconds)",
  "context": {
    "current_directory": "$(pwd)",
    "git_branch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'none')",
    "last_commit": "$(git log --oneline -1 2>/dev/null || echo 'none')",
    "active_tasks": [],
    "user_preferences": {
      "verbosity": "medium",
      "technical_depth": "high",
      "communication_style": "professional"
    }
  },
  "interaction_count": 0,
  "successful_patterns": [],
  "failed_patterns": []
}
EOF
    
    echo "✅ Session state initialized: $STATE_FILE"
}

# Update session context
update_context() {
    local key="$1"
    local value="$2"
    
    if [ ! -f "$STATE_FILE" ]; then
        init_session
    fi
    
    # Update the context using jq
    jq --arg key "$key" --arg value "$value" \
       '.context[$key] = $value | .interaction_count += 1' \
       "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    
    echo "📝 Updated context: $key = $value"
}

# Record successful pattern
record_success() {
    local pattern="$1"
    local description="$2"
    
    if [ ! -f "$STATE_FILE" ]; then
        init_session
    fi
    
    jq --arg pattern "$pattern" --arg desc "$description" --arg timestamp "$(date -Iseconds)" \
       '.successful_patterns += [{"pattern": $pattern, "description": $desc, "timestamp": $timestamp}]' \
       "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    
    echo "✅ Recorded successful pattern: $pattern"
}

# Record failed pattern
record_failure() {
    local pattern="$1"
    local reason="$2"
    
    if [ ! -f "$STATE_FILE" ]; then
        init_session
    fi
    
    jq --arg pattern "$pattern" --arg reason "$reason" --arg timestamp "$(date -Iseconds)" \
       '.failed_patterns += [{"pattern": $pattern, "reason": $reason, "timestamp": $timestamp}]' \
       "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    
    echo "❌ Recorded failed pattern: $pattern - $reason"
}

# Show current session state
show_state() {
    if [ ! -f "$STATE_FILE" ]; then
        echo "🔍 No active session state found"
        return 1
    fi
    
    echo "📊 Current Session State:"
    echo "========================"
    
    # Parse and display key information
    SESSION_ID=$(jq -r '.session_id' "$STATE_FILE")
    STARTED_AT=$(jq -r '.started_at' "$STATE_FILE")
    INTERACTIONS=$(jq -r '.interaction_count' "$STATE_FILE")
    CURRENT_DIR=$(jq -r '.context.current_directory' "$STATE_FILE")
    GIT_BRANCH=$(jq -r '.context.git_branch' "$STATE_FILE")
    
    echo "Session ID: $SESSION_ID"
    echo "Started: $STARTED_AT"
    echo "Interactions: $INTERACTIONS"
    echo "Directory: $CURRENT_DIR"
    echo "Git Branch: $GIT_BRANCH"
    
    echo ""
    echo "🎯 Active Tasks:"
    jq -r '.context.active_tasks[]' "$STATE_FILE" 2>/dev/null || echo "  None"
    
    echo ""
    echo "✅ Recent Successful Patterns:"
    jq -r '.successful_patterns[-3:][] | "  - " + .pattern + " (" + .timestamp + ")"' "$STATE_FILE" 2>/dev/null || echo "  None"
    
    echo ""
    echo "❌ Recent Failed Patterns:"
    jq -r '.failed_patterns[-3:][] | "  - " + .pattern + ": " + .reason + " (" + .timestamp + ")"' "$STATE_FILE" 2>/dev/null || echo "  None"
}

# Add active task
add_task() {
    local task="$1"
    
    if [ ! -f "$STATE_FILE" ]; then
        init_session
    fi
    
    jq --arg task "$task" '.context.active_tasks += [$task]' \
       "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    
    echo "📋 Added active task: $task"
}

# Complete task
complete_task() {
    local task="$1"
    
    if [ ! -f "$STATE_FILE" ]; then
        echo "❌ No session state found"
        return 1
    fi
    
    jq --arg task "$task" '.context.active_tasks = (.context.active_tasks - [$task])' \
       "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    
    echo "✅ Completed task: $task"
}

# Generate session summary
summarize_session() {
    if [ ! -f "$STATE_FILE" ]; then
        echo "❌ No session state found"
        return 1
    fi
    
    echo "📊 Session Summary"
    echo "=================="
    
    local total_interactions=$(jq -r '.interaction_count' "$STATE_FILE")
    local successful_patterns=$(jq -r '.successful_patterns | length' "$STATE_FILE")
    local failed_patterns=$(jq -r '.failed_patterns | length' "$STATE_FILE")
    local active_tasks=$(jq -r '.context.active_tasks | length' "$STATE_FILE")
    
    echo "Total Interactions: $total_interactions"
    echo "Successful Patterns: $successful_patterns"
    echo "Failed Patterns: $failed_patterns"  
    echo "Active Tasks: $active_tasks"
    
    if [ "$successful_patterns" -gt 0 ] && [ "$failed_patterns" -gt 0 ]; then
        local success_rate=$(echo "scale=1; $successful_patterns * 100 / ($successful_patterns + $failed_patterns)" | bc -l 2>/dev/null || echo "N/A")
        echo "Success Rate: ${success_rate}%"
    fi
    
    echo ""
    echo "📈 Most Successful Patterns:"
    jq -r '.successful_patterns | group_by(.pattern) | map({pattern: .[0].pattern, count: length}) | sort_by(.count) | reverse | .[0:3][] | "  " + .pattern + " (" + (.count|tostring) + " times)"' "$STATE_FILE" 2>/dev/null || echo "  None"
    
    echo ""
    echo "🔍 Common Failure Modes:"
    jq -r '.failed_patterns | group_by(.reason) | map({reason: .[0].reason, count: length}) | sort_by(.count) | reverse | .[0:3][] | "  " + .reason + " (" + (.count|tostring) + " times)"' "$STATE_FILE" 2>/dev/null || echo "  None"
}

# Main script logic
main() {
    case "${1:-help}" in
        "init")
            init_session
            ;;
        "update")
            if [ $# -lt 3 ]; then
                echo "Usage: $0 update <key> <value>"
                exit 1
            fi
            update_context "$2" "$3"
            ;;
        "success")
            if [ $# -lt 3 ]; then
                echo "Usage: $0 success <pattern> <description>"
                exit 1
            fi
            record_success "$2" "$3"
            ;;
        "failure")
            if [ $# -lt 3 ]; then
                echo "Usage: $0 failure <pattern> <reason>"
                exit 1
            fi
            record_failure "$2" "$3"
            ;;
        "show"|"status")
            show_state
            ;;
        "add-task")
            if [ $# -lt 2 ]; then
                echo "Usage: $0 add-task <task_description>"
                exit 1
            fi
            add_task "$2"
            ;;
        "complete-task")
            if [ $# -lt 2 ]; then
                echo "Usage: $0 complete-task <task_description>"
                exit 1
            fi
            complete_task "$2"
            ;;
        "summary")
            summarize_session
            ;;
        "help"|*)
            echo "AI Agent Session State Manager"
            echo "Usage: $0 <command> [arguments]"
            echo ""
            echo "Commands:"
            echo "  init                           Initialize new session"
            echo "  update <key> <value>          Update context value"  
            echo "  success <pattern> <desc>      Record successful pattern"
            echo "  failure <pattern> <reason>    Record failed pattern"
            echo "  show                          Show current state"
            echo "  add-task <task>               Add active task"
            echo "  complete-task <task>          Complete active task"
            echo "  summary                       Generate session summary"
            echo "  help                          Show this help message"
            ;;
    esac
}

main "$@"
