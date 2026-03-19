# Infisical Stack Env Rules

This stack follows the same secret-handling rules as the rest of the infrastructure.

## Rules

- `stack.env` is never the place for secrets.
- `stack.env.template` may be committed and may contain only non-sensitive defaults.
- `.env` may exist only as a generated, ephemeral deploy/runtime artifact and must never be committed.
- If a tool insists on `stack.env`, use a temporary symlink or generated file that points at the ephemeral `.env`.
- Secrets come from Infisical only.

## Standard runner / operator flow

1. Check out the repo.
2. Copy `stack.env.template` to `.env` when a template exists.
3. Inject secrets from Infisical with `infisical export --expand ... >> .env` or run the stack with `infisical run -- ...`.
4. Create `stack.env -> .env` only if a tool absolutely requires it.
5. Run `docker compose up -d`.
6. Remove temporary artifacts if the workflow leaves them behind.

## What this means in practice

- No Cloudflare keys, API tokens, passwords, or secret-like values in `stack.env`.
- No manual long-lived secret files in the repo.
- If a repo still uses secret-bearing `stack.env` or committed `.env`, that is drift and should be migrated to Infisical.
