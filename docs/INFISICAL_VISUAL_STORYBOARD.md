# Infisical Series Visual Storyboard

This document is the visual plan for the three-post Infisical series.

The goal is simple: the posts should not only explain the system. They should show it.

That means:

- real product screenshots where proof matters
- short code samples where the runtime edge matters
- diagrams where sequence or ownership would otherwise stay abstract
- macro imagery only where atmosphere helps frame the post

## Current Image Audit

The current inline visuals are a good start, but they are too sparse for the density of the series.

### Post 1

Current visuals:

- cover image
- Infisical project overview screenshot
- one before-versus-after Mermaid diagram

What is missing:

- a closer UI moment that proves the vault became operational, not just installed
- one masked code taste showing the old `.env` shape versus the cleaner split
- one visual bridge between "LLMs complained" and "the architecture changed"

### Post 2

Current visuals:

- cover image
- folder hierarchy screenshot
- one import graph
- one sequence diagram
- code examples

What is missing:

- a real secret detail view
- a real import or reference view
- a stronger side-by-side between provider truth and consumer runtime output
- one screenshot that makes Infisical feel like a product, not only a concept
- one small diagram that shows the handoff from vault ownership to runtime enforcement

### Post 3

Current visuals:

- cover image
- machine identities screenshot
- multiple Mermaid diagrams
- CLI and workflow snippets

What is missing:

- one clearer runtime/deployment screenshot
- one browser-facing Infisical access screenshot through Traefik
- one Gitea workflow or log view
- one visual that makes the Macvlan paradox feel concrete instead of purely explained
- one code taste block for `stack.contract.json`
- one diagram for runner or Dockge -> guarded Docker -> Infisical -> Docker Engine

## Capture Rules

Use real screenshots for:

- Infisical UI
- machine identities
- access control
- secret detail views
- import/reference views
- Gitea workflow steps
- browser-facing routed application views

Use Mermaid for:

- trust boundaries
- sequence explanations
- ownership direction
- network path differences

Use short code only when the reader needs to see the contract between systems.

Do not use generated AI images for:

- product proof
- UI detail
- CLI proof

Use generated images only for:

- header framing
- macro atmosphere
- topic-setting visuals

## Post 1: Why I Finally Moved My HomeLab Secrets Out of `.env` Files

### Injection point 1

Section:

- `## The Intake`

Type:

- screenshot

Asset goal:

- a tighter Infisical home or project view showing that the control plane exists and is populated

Capture target:

- Infisical authenticated overview page, cropped around the project and top-level structure

Caption goal:

- show the moment where the problem stopped being philosophical and became operational

### Injection point 2

Section:

- `## Show And Tell: The Intake In My Own Words`

Type:

- code taste

Asset goal:

- a small masked example showing the old shape of mixed env values

Example shape:

```dotenv
COMPOSE_PROJECT_NAME=traefik
TRAEFIK_EMAIL=admin@itkriebbels.be
CLOUDFLARE_API_TOKEN=cf_v1_abcd***
```

Caption goal:

- show why not every env value is a secret, while still making the secret boundary problem obvious

### Injection point 3

Section:

- `## Why Not Bitwarden?`

Type:

- comparison diagram

Asset goal:

- a small two-lane Mermaid comparison between Bitwarden Secrets Manager and local-first Infisical requirements

Message:

- same product class, different operating model

### Injection point 4

Section:

- `## What Changed`

Type:

- screenshot or diagram

Asset goal:

- one high-level stack map showing the eleven migrated stacks grouped by NAS and VM

Recommended format:

- Mermaid graph first, screenshot only if a real management view is available and readable

## Post 2: How I Designed My Infisical Secret Architecture

### Injection point 1

Section:

- `## The Core Design Choice`

Type:

- screenshot

Asset goal:

- keep the existing folder hierarchy screenshot, but add a second tighter crop if needed so provider folders are unmistakable

Caption goal:

- show that the hierarchy itself teaches ownership

### Injection point 2

Section:

- `## Imports Instead Of Copy-Paste`

Type:

- screenshot

Asset goal:

- Infisical import/reference UI showing one consumer path linked to one provider path

Capture target:

- authenticated Infisical folder import view

Caption goal:

- show that imports are not just a theory in the article

### Injection point 3

Section:

- `### Case Study: \`gk-mailfence\` And \`gk-shield\``

Type:

- secret detail screenshot

Asset goal:

- one masked secret detail view with the name visible and the value hidden or partially masked

Masking rule:

- keep prefix plus `***`

Caption goal:

- show what "owned once" means in the product

### Injection point 4

Section:

- `## A Safe Snapshot From The Migration Process`

Type:

- code taste

Asset goal:

- show the runtime edge as contract metadata plus one guarded deploy command:

```json
{
  "stack": "traefik",
  "infisical": {
    "domain": "http://192.168.5.90:8081",
    "project_id": "replace-me",
    "environment": "prod",
    "path": "/traefik"
  }
}
```

```bash
docker compose up -d
```

Caption goal:

- show how expressive vault structure turns into boring runtime behavior without secret env files

### Injection point 5

Section:

- `## Why The Vault Model Was Not The Whole Boundary`

Type:

- diagram

Asset goal:

- one compact handoff diagram showing provider folders -> `stack.contract.json` -> guarded Docker -> runtime process

Caption goal:

- prove that the vault defines ownership but the runtime boundary enforces behavior

## Post 3: Infisical, Gitea Actions, and the Secret Zero Problem

### Injection point 1

Section:

- `## Why Machine Identities Matter`

Type:

- screenshot

Asset goal:

- keep the current machine identities screenshot and add one tighter crop or second screenshot showing role/scope detail if readable

Caption goal:

- show that the runner is a real principal with real permissions

### Injection point 2

Section:

- `## The Macvlan Paradox`

Type:

- diagram or annotated screenshot

Asset goal:

- one network sketch that shows:
  - browser path through Traefik Macvlan IP
  - runner path direct to `192.168.5.90:8081`

Caption goal:

- make the paradox visible in one glance

### Injection point 3

Section:

- `## The First Runtime Edge`

Type:

- screenshot

Asset goal:

- Gitea Actions run view with the Infisical login and guarded deploy step visible

Capture target:

- Gitea workflow run details, masked as needed

Caption goal:

- show where the control plane meets the pipeline

### Injection point 4

Section:

- `## \`infisical run\` And Why I Like It`

Type:

- code taste

Asset goal:

- one short local-dev command pair:

```bash
infisical run -- dotnet run --project ...
infisical run -- docker compose up
```

Caption goal:

- show the difference between exported env files and direct runtime injection

### Injection point 5

Section:

- `## Docker Turned Out To Be The Real Boundary`

Type:

- diagram

Asset goal:

- one sequence diagram showing runner or Dockge -> guarded Docker boundary -> Infisical -> Docker Engine

Caption goal:

- prove that the policy now sits below both the LLM and the UI

### Injection point 6

Section:

- `## Why \`stack.contract.json\` Matters More Than \`stack.env.template\``

Type:

- code taste

Asset goal:

- one short masked `stack.contract.json` example that shows path and environment metadata without revealing any secrets

Caption goal:

- show that the committed metadata is discoverable and non-secret

### Injection point 7

Section:

- `## Why The Future Local LLM Lab Matters`

Type:

- macro diagram

Asset goal:

- one simple split diagram:
  - local models for token-adjacent and infra-heavy work
  - cloud models for synthesis and harder reasoning once context is clean

Caption goal:

- tie the secret architecture back to the AI workflow without turning the post into AI marketing

## MCP Capture Targets

Use `browser_execute` with explicit sessions.

Anonymous discovery:

```text
browser_execute(action="navigate", session="anon", url="http://127.0.0.1:4001/blog/how-i-designed-my-infisical-secret-architecture")
browser_execute(action="snapshot", session="anon")
```

Authenticated Infisical/QuillBot-style browser state:

```text
browser_execute(action="navigate", session="auth", url="https://quillbot.com/paraphrasing-tool", target="quillbot")
browser_execute(action="snapshot", session="auth", target="quillbot")
```

For Infisical-specific authenticated capture, use the auth session/profile that actually owns the Infisical login state once prepared. Do not fake UI with generated images when the point is product proof.
