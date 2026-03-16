# ADR-0004: Product-Oriented Secrets Management (DRY Principles)

## Status
Accepted (2026-03-16)

## Context
As the homelab infrastructure scales, multiple stacks often require access to the same credentials (e.g., both `nas-traefik` and `compute-traefik` require the exact same Cloudflare API credentials for ACME DNS challenges). 

Previously, deployment pipelines fetched secrets based on the *consumer* or *project* path (e.g., `INFISICAL_PATH: /compute-traefik`). This caused **secret drift** and violated the **DRY (Don't Repeat Yourself)** principle, as the same secret had to be duplicated across multiple paths. Rotating a secret (like an API key) became error-prone because it had to be updated in multiple places simultaneously.

## Decision
All secrets MUST be organized and retrieved based on the **Product or Domain**, not the consumer. 

1. **Path Naming:** Infisical paths should represent the origin or family of the secret (e.g., `/cloudflare`, `/litellm`, `/postgres-core`, `/smtp`).
2. **Access Control:** Deployment machine identities (e.g., `vm-deployer` or Gitea runners) must be granted `Read` access to the specific product paths they require, rather than having a single project-specific path.
3. **No Duplication:** A secret value must only exist in **one** place within Infisical. If multiple apps need it, they must point to the shared product path.

## Consequences
- **Single Source of Truth:** Rotating a secret (like a Cloudflare token) only needs to happen in one path (`/cloudflare`), and all consuming services instantly inherit it on their next restart.
- **Tighter Security:** Eliminates "secret drift" and forgotten duplicated passwords.
- **Complex Auth Mapping:** Requires slightly more upfront configuration in Infisical (mapping Machine Identities to multiple paths).
