#!/usr/bin/env bash
#
# validate-secrets.sh
#
# Validates that required Gitea Actions secrets and Infisical paths are configured.
# This script should run early in CI pipelines to fail fast when secrets are missing.
#
# Usage:
#   SECRETS_REQUIRED="GITHUBTOKEN_PUBLISH INFISICAL_CLIENT_ID" ./validate-secrets.sh
#   LOG_FORMAT=text ./validate-secrets.sh  # Human-readable output
#
# Environment variables:
#   SECRETS_REQUIRED      - Space-separated list of required secret names
#   INFISICAL_PATH        - (Optional) Infisical path to validate
#   INFISICAL_ENVIRONMENT - (Optional) Infisical environment (default: prod)
#   SKIP_INFISICAL        - (Optional) Set to "true" to skip Infisical validation
#   LOG_LEVEL             - debug, info, warn, error (default: info)
#   LOG_FORMAT            - json or text (default: json)
#

set -euo pipefail

# Load structured logging library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/logging.sh
source "$SCRIPT_DIR/lib/logging.sh"

# Initialize logging
LOG_COMPONENT="validate-secrets"
init_logging

# Counters
ERRORS=0
WARNINGS=0

#
# Validate Gitea Secrets
#
validate_gitea_secrets() {
    local required_secrets="${SECRETS_REQUIRED:-}"
    
    if [ -z "$required_secrets" ]; then
        log_info "No Gitea secrets validation requested (SECRETS_REQUIRED not set)"
        return 0
    fi
    
    log_info "Validating required Gitea secrets"
    
    for secret_name in $required_secrets; do
        # Check if the environment variable is set and non-empty
        local secret_value
        secret_value="${!secret_name:-}"
        
        if [ -z "$secret_value" ]; then
            log_with_data "error" "Gitea secret not set or empty" "secret=$secret_name"
            log_info "  -> Add '$secret_name' to Gitea Repository Settings > Actions > Secrets"
            ((ERRORS++)) || true
        else
            # Mask the value for logging (show only first 3 chars if length > 5)
            local masked_value="***"
            if [ ${#secret_value} -gt 5 ]; then
                masked_value="${secret_value:0:3}...[REDACTED]"
            fi
            log_with_data "info" "Gitea secret is configured" "secret=$secret_name" "value=$masked_value"
        fi
    done
}

#
# Validate Infisical connectivity and path access
#
validate_infisical() {
    local skip_infisical="${SKIP_INFISICAL:-false}"
    local infisical_path="${INFISICAL_PATH:-}"
    local infisical_env="${INFISICAL_ENVIRONMENT:-prod}"
    
    if [ "$skip_infisical" = "true" ]; then
        log_info "Infisical validation skipped (SKIP_INFISICAL=true)"
        return 0
    fi
    
    # Check if infisical CLI is available
    if ! command -v infisical &> /dev/null; then
        log_warn "Infisical CLI not found in PATH - skipping Infisical validation"
        return 0
    fi
    
    log_info "Validating Infisical connectivity"
    
    # Test basic connectivity with a no-op command
    # This validates INFISICAL_CLIENT_ID and INFISICAL_CLIENT_SECRET are valid
    if ! infisical whoami &> /dev/null 2>&1; then
        log_error "Infisical authentication failed"
        log_info "  -> Ensure INFISICAL_CLIENT_ID and INFISICAL_CLIENT_SECRET are set in Gitea secrets"
        return 1
    fi
    
    log_info "Infisical authentication successful"
    
    # Validate specific path if provided
    if [ -n "$infisical_path" ]; then
        log_with_data "info" "Validating Infisical path" "path=$infisical_path" "environment=$infisical_env"
        
        # Try to export secrets from the path (dry-run, don't output values)
        # Using --expand to resolve imports and references
        if ! infisical export --expand \
            --path="$infisical_path" \
            --environment="$infisical_env" \
            --format=json \
            > /dev/null 2>&1; then
            log_with_data "error" "Cannot access Infisical path" "path=$infisical_path" "environment=$infisical_env"
            log_info "  -> Check that the machine identity has Read access to this path"
            return 1
        fi
        
        log_info "Path '$infisical_path' is accessible"
    fi
}

#
# Main
#
main() {
    log_info "Starting secrets validation"
    
    # Validate Gitea secrets
    validate_gitea_secrets
    
    # Validate Infisical
    validate_infisical
    
    # Summary
    log_with_data "info" "Validation summary" "errors=$ERRORS" "warnings=$WARNINGS"
    
    if [ $ERRORS -gt 0 ]; then
        log_with_data "error" "Validation failed" "errors=$ERRORS" "warnings=$WARNINGS"
        exit 1
    elif [ $WARNINGS -gt 0 ]; then
        log_warn "Validation completed with warnings"
        exit 0
    else
        log_info "Validation passed - all secrets configured correctly"
        exit 0
    fi
}

main "$@"
