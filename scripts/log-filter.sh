#!/usr/bin/env bash
#
# scripts/log-filter.sh
#
# Filter and query structured logs (JSON Lines format)
#
# Usage:
#   ./log-filter.sh --level error logs.jsonl
#   ./log-filter.sh --component health-check logs.jsonl
#   ./log-filter.sh --since "2026-03-18T10:00:00Z" logs.jsonl
#   ./log-filter.sh --search "HTTP" logs.jsonl
#   cat logs.jsonl | ./log-filter.sh --level error
#
# Options:
#   --level LEVEL      Filter by minimum level (debug, info, warn, error)
#   --component NAME   Filter by component name
#   --since TIMESTAMP  Show logs since timestamp (ISO 8601)
#   --until TIMESTAMP  Show logs until timestamp (ISO 8601)
#   --search PATTERN   Search in message field (grep-style regex)
#   --format FORMAT    Output format: json, text, table (default: json)
#   --count            Show count of matching logs
#   --fields LIST      Comma-separated fields to display (default: all)
#   --help             Show help
#

set -euo pipefail

# Defaults
FILTER_LEVEL=""
FILTER_COMPONENT=""
FILTER_SINCE=""
FILTER_UNTIL=""
FILTER_SEARCH=""
OUTPUT_FORMAT="json"
SHOW_COUNT=false
FIELDS=""

# Log levels for filtering
declare -A LOG_LEVELS=(
    ["debug"]=0
    ["info"]=1
    ["warn"]=2
    ["error"]=3
)

show_help() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS] [LOG_FILE]

Filter and query structured logs (JSON Lines format).

Options:
  --level LEVEL      Filter by minimum log level (debug, info, warn, error)
  --component NAME   Filter by component name (exact match)
  --since TIMESTAMP  Show logs since timestamp (ISO 8601)
  --until TIMESTAMP  Show logs until timestamp (ISO 8601)
  --search PATTERN   Search in message field (grep-style regex)
  --format FORMAT    Output format: json, text, table (default: json)
  --count            Show count of matching logs only
  --fields LIST      Comma-separated fields to display (default: all)
  --help             Show this help message

Examples:
  # Show only errors
  $(basename "$0") --level error app.jsonl

  # Search for HTTP-related messages
  $(basename "$0") --search "HTTP" app.jsonl

  # Show logs from specific component since timestamp
  $(basename "$0") --component health-check --since "2026-03-18T10:00:00Z" app.jsonl

  # Pipe from stdin
  cat app.jsonl | $(basename "$0") --level warn

  # Show count of errors
  $(basename "$0") --level error --count app.jsonl

  # Table format with specific fields
  $(basename "$0") --format table --fields "timestamp,level,message" app.jsonl
EOF
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --level)
            FILTER_LEVEL="$2"
            shift 2
            ;;
        --component)
            FILTER_COMPONENT="$2"
            shift 2
            ;;
        --since)
            FILTER_SINCE="$2"
            shift 2
            ;;
        --until)
            FILTER_UNTIL="$2"
            shift 2
            ;;
        --search)
            FILTER_SEARCH="$2"
            shift 2
            ;;
        --format)
            OUTPUT_FORMAT="$2"
            shift 2
            ;;
        --count)
            SHOW_COUNT=true
            shift
            ;;
        --fields)
            FIELDS="$2"
            shift 2
            ;;
        --help)
            show_help
            exit 0
            ;;
        -*)
            echo "Unknown option: $1" >&2
            echo "Use --help for usage information" >&2
            exit 1
            ;;
        *)
            # Positional argument (log file)
            if [ -z "${LOG_FILE:-}" ]; then
                LOG_FILE="$1"
            else
                echo "Multiple log files not supported yet" >&2
                exit 1
            fi
            shift
            ;;
    esac
done

# Validate level filter
if [ -n "$FILTER_LEVEL" ]; then
    if [[ ! " ${!LOG_LEVELS[@]} " =~ " ${FILTER_LEVEL} " ]]; then
        echo "Invalid level: $FILTER_LEVEL. Must be one of: debug, info, warn, error" >&2
        exit 1
    fi
fi

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed" >&2
    echo "Install with: sudo apt-get install jq" >&2
    exit 1
fi

# Build jq filter
build_jq_filter() {
    local filters=()
    
    # Level filter
    if [ -n "$FILTER_LEVEL" ]; then
        local level_num="${LOG_LEVELS[$FILTER_LEVEL]}"
        filters+=("select((.level | {\"debug\": 0, \"info\": 1, \"warn\": 2, \"error\": 3}[.]) >= $level_num)")
    fi
    
    # Component filter
    if [ -n "$FILTER_COMPONENT" ]; then
        filters+=("select(.component == \"$FILTER_COMPONENT\")")
    fi
    
    # Since filter
    if [ -n "$FILTER_SINCE" ]; then
        filters+=("select(.timestamp >= \"$FILTER_SINCE\")")
    fi
    
    # Until filter
    if [ -n "$FILTER_UNTIL" ]; then
        filters+=("select(.timestamp <= \"$FILTER_UNTIL\")")
    fi
    
    # Search filter
    if [ -n "$FILTER_SEARCH" ]; then
        filters+=("select(.message | test(\"$FILTER_SEARCH\"; \"i\"))")
    fi
    
    # Fields filter
    if [ -n "$FIELDS" ]; then
        local field_expr=""
        IFS=',' read -ra FIELD_ARRAY <<< "$FIELDS"
        for i in "${!FIELD_ARRAY[@]}"; do
            local field="${FIELD_ARRAY[$i]}"
            if [ $i -gt 0 ]; then
                field_expr="$field_expr, "
            fi
            field_expr="$field_expr\"$field\": .[$field]"
        done
        filters+=("{$field_expr}")
    fi
    
    # Combine filters
    if [ ${#filters[@]} -gt 0 ]; then
        echo "${filters[*]}" | sed 's/ / | /g'
    else
        echo "."
    fi
}

# Main processing
main() {
    local jq_filter
    jq_filter=$(build_jq_filter)
    
    # Determine input source
    local input_cmd
    if [ -n "${LOG_FILE:-}" ]; then
        if [ ! -f "$LOG_FILE" ]; then
            echo "Error: Log file not found: $LOG_FILE" >&2
            exit 1
        fi
        input_cmd="cat '$LOG_FILE'"
    else
        # Read from stdin
        input_cmd="cat"
    fi
    
    # Process logs
    local count=0
    
    if [ "$SHOW_COUNT" = true ]; then
        # Just count matching logs
        count=$(eval "$input_cmd" | jq -r "$jq_filter" 2>/dev/null | jq -s 'length')
        echo "$count"
    else
        # Output filtered logs
        case "$OUTPUT_FORMAT" in
            json)
                eval "$input_cmd" | while IFS= read -r line; do
                    echo "$line" | jq -r "$jq_filter" 2>/dev/null || true
                done
                ;;
            text)
                eval "$input_cmd" | while IFS= read -r line; do
                    local result
                    result=$(echo "$line" | jq -r "$jq_filter" 2>/dev/null) || continue
                    if [ -n "$result" ] && [ "$result" != "null" ]; then
                        local timestamp level component message
                        timestamp=$(echo "$result" | jq -r '.timestamp // "N/A"')
                        level=$(echo "$result" | jq -r '.level // "INFO"')
                        component=$(echo "$result" | jq -r '.component // "app"')
                        message=$(echo "$result" | jq -r '.message // ""')
                        echo "[$timestamp] [$level] [$component] $message"
                    fi
                done
                ;;
            table)
                # Header
                if [ -n "$FIELDS" ]; then
                    echo "$FIELDS" | tr ',' '\t'
                else
                    echo -e "TIMESTAMP\tLEVEL\tCOMPONENT\tMESSAGE"
                fi
                
                # Rows
                eval "$input_cmd" | while IFS= read -r line; do
                    local result
                    result=$(echo "$line" | jq -r "$jq_filter" 2>/dev/null) || continue
                    if [ -n "$result" ] && [ "$result" != "null" ]; then
                        local timestamp level component message
                        timestamp=$(echo "$result" | jq -r '.timestamp // "N/A"')
                        level=$(echo "$result" | jq -r '.level // "INFO"')
                        component=$(echo "$result" | jq -r '.component // "app"')
                        message=$(echo "$result" | jq -r '.message // ""')
                        
                        # Truncate long messages
                        if [ ${#message} -gt 80 ]; then
                            message="${message:0:77}..."
                        fi
                        
                        echo -e "$timestamp\t$level\t$component\t$message"
                    fi
                done
                ;;
            *)
                echo "Invalid format: $OUTPUT_FORMAT. Must be: json, text, table" >&2
                exit 1
                ;;
        esac
    fi
}

main
