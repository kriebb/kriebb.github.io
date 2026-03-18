#!/usr/bin/env bash
#
# validate-secrets.sh
#
# Validates that required Gitea Actions secrets and Infisical paths are configured.
# This script should run early in CI pipelines to fail fast when secrets are missing.
#
# Usage:
#   SECRETS_REQUIRED="GITHUBTOKEN_PUBLISH INFISICAL_CLIENT_ID" ./validate-secrets.sh
#
# Environment variables:
#   SECRETS_REQUIRED      - Space-separated list of required secret names
#   INFISICAL_PATH        - (Optional) Infisical path to validate
#   INFISICAL_ENVIRONMENT - (Optional) Infisical environment (default: prod)
#   SKIP_INFISICAL        - (Optional) Set to "true" to skip Infisical validation
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
ERRORS=0
WARNINGS=0

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
    ((WARNINGS++)) || true
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    ((ERRORS++)) || true
}

#
# Validate Gitea Secrets
#
validate_gitea_secrets() {
    local required_secrets="${SECRETS_REQUIRED:-}"
    
    if [ -z "$required_secrets" ]; then
        log_info "No Gitea secrets validation requested (SECRETS_REQUIRED not set)"
        return 0
    fi
    
    log_info "Validating required Gitea secrets..."
    
    for secret_name in $required_secrets; do
        # Check if the environment variable is set and non-empty
        local secret_value
        secret_value="${!secret_name:-}"
        
        if [ -z "$secret_value" ]; then
            log_error "Gitea secret '$secret_name' is not set or empty"
            log_info "  -> Add '$secret_name' to Gitea Repository Settings > Actions > Secrets"
        else
            # Mask the value for logging (show only first 3 chars if length > 5)
            local masked_value="***"
            if [ ${#secret_value} -gt 5 ]; then
                masked_value="${secret_value:0:3}...[REDACTED]"
            fi
            log_info "  ✓ $secret_name is configured ($masked_value)"
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
    
    log_info "Validating Infisical connectivity..."
    
    # Test basic connectivity with a no-op command
    # This validates INFISICAL_CLIENT_ID and INFISICAL_CLIENT_SECRET are valid
    if ! infisical whoami &> /dev/null 2>&1; then
        log_error "Infisical authentication failed"
        log_info "  -> Ensure INFISICAL_CLIENT_ID and INFISICAL_CLIENT_SECRET are set in Gitea secrets"
        return 1
    fi
    
    log_info "  ✓ Infisical authentication successful"
    
    # Validate specific path if provided
    if [ -n "$infisical_path" ]; then
        log_info "Validating Infisical path: $infisical_path (environment: $infisical_env)"
        
        # Try to export secrets from the path (dry-run, don't output values)
        # Using --expand to resolve imports and references
        if ! infisical export --expand \
            --path="$infisical_path" \
            --environment="$infisical_env" \
            --format=json \
            > /dev/null 2>&1; then
            log_error "Cannot access Infisical path '$infisical_path' in environment '$infisical_env'"
            log_info "  -> Check that the machine identity has Read access to this path"
            return 1
        fi
        
        log_info "  ✓ Path '$infisical_path' is accessible"
    fi
}

#
# Main
#
main() {
    log_info "Starting secrets validation..."
    echo ""
    
    # Validate Gitea secrets
    validate_gitea_secrets
    echo ""
    
    # Validate Infisical
    validate_infisical
    echo ""
    
    # Summary
    echo "================================"
    if [ $ERRORS -gt 0 ]; then
        log_error "Validation failed with $ERRORS error(s) and $WARNINGS warning(s)"
        exit 1
    elif [ $WARNINGS -gt 0 ]; then
        log_warn "Validation completed with $WARNINGS warning(s)"
        exit 0
    else
        log_info "Validation passed - all secrets are configured correctly"
        exit 0
    fi
}

main "$@"
