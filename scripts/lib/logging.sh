#!/usr/bin/env bash
#
# lib/logging.sh
#
# Structured logging library for bash scripts.
# Outputs JSON Lines (JSONL) format for easy parsing and searching.
#
# Usage:
#   source ./scripts/lib/logging.sh
#   log_info "message"
#   log_error "message"
#   log_debug "message"  # Only shown if LOG_LEVEL=debug
#
# Environment variables:
#   LOG_LEVEL      - Minimum log level: debug, info, warn, error (default: info)
#   LOG_FORMAT     - json or text (default: json)
#   LOG_TIMESTAMP  - true or false (default: true)
#   LOG_COMPONENT  - Component name for logs (default: script name)
#

# Log levels (numeric for comparison)
declare -A LOG_LEVELS=(
    ["debug"]=0
    ["info"]=1
    ["warn"]=2
    ["error"]=3
)

# Defaults
LOG_LEVEL="${LOG_LEVEL:-info}"
LOG_FORMAT="${LOG_FORMAT:-json}"
LOG_TIMESTAMP="${LOG_TIMESTAMP:-true}"
LOG_COMPONENT="${LOG_COMPONENT:-$(basename "$0")}"

# Colors for text format (only used when LOG_FORMAT=text)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

#
# Get current timestamp in ISO 8601 format
#
get_timestamp() {
    date -u +"%Y-%m-%dT%H:%M:%S.%3NZ"
}

#
# Escape string for JSON (handle special characters)
#
json_escape() {
    local str="$1"
    # Escape backslashes, quotes, and control characters
    str="${str//\\/\\\\}"
    str="${str//\"/\\\"}"
    str="${str//$'\n'/\\n}"
    str="${str//$'\r'/\\r}"
    str="${str//$'\t'/\\t}"
    # Remove null bytes and other control characters
    str=$(echo "$str" | tr -d '\0' | tr -cd '[:print:]')
    echo "$str"
}

#
# Internal log function
#
_log() {
    local level="$1"
    local message="$2"
    local extra_json="${3:-}"
    
    # Check if level should be logged
    local current_level_num="${LOG_LEVELS[$LOG_LEVEL]:-1}"
    local msg_level_num="${LOG_LEVELS[$level]:-1}"
    
    if [ "$msg_level_num" -lt "$current_level_num" ]; then
        return 0
    fi
    
    local timestamp
    local component_escaped
    local message_escaped
    
    if [ "$LOG_TIMESTAMP" = "true" ]; then
        timestamp=$(get_timestamp)
    else
        timestamp=""
    fi
    
    component_escaped=$(json_escape "$LOG_COMPONENT")
    message_escaped=$(json_escape "$message")
    
    if [ "$LOG_FORMAT" = "json" ]; then
        # JSON Lines format
        local json="{\"level\":\"$level\",\"component\":\"$component_escaped\",\"message\":\"$message_escaped\""
        
        if [ -n "$timestamp" ]; then
            json="$json,\"timestamp\":\"$timestamp\""
        fi
        
        # Add extra fields if provided
        if [ -n "$extra_json" ]; then
            json="$json,$extra_json"
        fi
        
        json="$json}"
        echo "$json"
    else
        # Human-readable text format
        local color=""
        local level_pad="$level"
        
        case "$level" in
            debug) color="$BLUE" ;;
            info)  color="$GREEN" ;;
            warn)  color="$YELLOW" ;;
            error) color="$RED" ;;
        esac
        
        # Pad level to 5 characters
        while [ ${#level_pad} -lt 5 ]; do
            level_pad="$level_pad "
        done
        
        if [ -n "$timestamp" ]; then
            echo -e "${color}[$timestamp]${NC} ${color}[$level_pad]${NC} [$component_escaped] $message"
        else
            echo -e "${color}[$level_pad]${NC} [$component_escaped] $message"
        fi
    fi
}

#
# Public logging functions
#
log_debug() {
    _log "debug" "$1" "${2:-}"
}

log_info() {
    _log "info" "$1" "${2:-}"
}

log_warn() {
    _log "warn" "$1" "${2:-}"
}

log_error() {
    _log "error" "$1" "${2:-}"
}

#
# Log with additional structured data
#
log_with_data() {
    local level="$1"
    local message="$2"
    shift 2
    
    # Build extra JSON from key=value pairs
    local extra_fields=""
    local first=true
    
    while [ $# -gt 0 ]; do
        local key="${1%%=*}"
        local value="${1#*=}"
        value=$(json_escape "$value")
        
        if [ "$first" = true ]; then
            extra_fields="\"$key\":\"$value\""
            first=false
        else
            extra_fields="$extra_fields,\"$key\":\"$value\""
        fi
        shift
    done
    
    _log "$level" "$message" "$extra_fields"
}

#
# Log start/end of operation with duration
#
log_operation() {
    local operation="$1"
    shift
    
    local start_time
    start_time=$(date +%s.%N)
    
    log_info "Starting: $operation"
    
    # Run the command (passed as remaining arguments)
    if [ $# -gt 0 ]; then
        "$@"
        local exit_code=$?
    else
        # If no command, just return success
        local exit_code=0
    fi
    
    local end_time
    end_time=$(date +%s.%N)
    local duration
    duration=$(echo "$end_time - $start_time" | bc)
    
    if [ $exit_code -eq 0 ]; then
        log_with_data "info" "Completed: $operation" "duration_sec=$duration" "exit_code=$exit_code"
    else
        log_with_data "error" "Failed: $operation" "duration_sec=$duration" "exit_code=$exit_code"
    fi
    
    return $exit_code
}

#
# Initialize logging (call at script start)
#
init_logging() {
    # Validate LOG_LEVEL
    if [[ ! " ${!LOG_LEVELS[@]} " =~ " ${LOG_LEVEL} " ]]; then
        echo "Invalid LOG_LEVEL: $LOG_LEVEL. Must be one of: debug, info, warn, error" >&2
        LOG_LEVEL="info"
    fi
    
    # Validate LOG_FORMAT
    if [ "$LOG_FORMAT" != "json" ] && [ "$LOG_FORMAT" != "text" ]; then
        echo "Invalid LOG_FORMAT: $LOG_FORMAT. Must be: json or text" >&2
        LOG_FORMAT="json"
    fi
    
    # Log initialization (only in text mode to avoid bootstrap loop)
    if [ "$LOG_FORMAT" = "text" ]; then
        echo "Logging initialized: level=$LOG_LEVEL format=$LOG_FORMAT component=$LOG_COMPONENT" >&2
    fi
}
