# Infisical Execution Boundary Raw Dump

This is the raw design dump behind the second and third Infisical posts.

It is deliberately rough. The point is to preserve the actual pressure, topology, and design choices before the story gets cleaned up for publication.

## Pressure That Forced The Change

- Part 1 already explains why duplicated `.env` files had become intolerable.
- Part 2 already explains why provider-owned paths in Infisical are a better model than stack-owned copies.
- The missing piece was execution.

Once LLMs, Dockge, and MCP tooling all touched Docker, the old compromise stopped being honest. It was not enough to move secrets into Infisical if the runtime edge still recreated secret-bearing `.env` files or relied on ad hoc `docker compose` calls.

The deeper problem was this:

- LLMs already know `docker run` and `docker compose up`.
- Dockge also reaches for Docker and Compose.
- frontdoor and the Docker MCP bridges expose the same operational surface in another form.

That means the policy boundary has to sit below the model and below the UI.

## Physical And Operational Topology

- NAS host: `192.168.5.90`
- Synology Traefik macvlan IP: `192.168.5.100`
- Compute VM: `192.168.5.63`
- Local laptop Docker bridge: `127.0.0.1:18000`
- Shared control plane for agents: `tool-frontdoor`
- Dockge stacks:
  - compute repo: `/home/kristof/git/compute-dockge`
  - NAS repo: `/home/kristof/git/dockge`
- Docker MCP bridge repos:
  - `/home/kristof/git/compute-docker-proxy`
  - `/home/kristof/git/nas-docker-proxy`
  - `/home/kristof/git/docker-unified/bridges/local-docker-mcp`

## Four Layers

### 1. Policy layer

New steady-state rules:

- no secret `.env`
- no secret `stack.env`
- no `--env-file` for secret injection
- no inline `-e NAME=value` secret injection
- each managed stack carries `stack.contract.json`

The contract is metadata only. It tells the execution boundary which Infisical project folder to use and which env names may be passed through for `docker run`.

### 2. Execution boundary

The hardening point is the `docker` execution surface itself.

The wrapper logic now:

- allows read-only inspection
- guards mutating `docker compose`
- guards `docker run` and `docker create`
- refuses secret-bearing `.env`, `stack.env`, and `--env-file`
- resolves machine identity auth through:
  - `INFISICAL_TOKEN`, or
  - `INFISICAL_CLIENT_ID` plus `INFISICAL_CLIENT_SECRET`
- runs the real Docker command under `infisical run`
- fails closed when Infisical auth is unavailable

### 3. Dockge layer

Dockge is not a special exception anymore.

Both Dockge repos now build a custom image that:

- starts from the official Dockge image
- installs the Infisical CLI and `jq`
- places the guarded wrapper at `/usr/local/bin/docker`
- keeps the real binary at `/usr/bin/docker`

That matters because it means the UI reaches the same policy boundary as shell and MCP tooling.

### 4. Frontdoor and MCP layer

`docker_execute` was too container-centric for this problem, so the frontdoor now exposes:

- `stack_search`
- `stack_execute`

The Docker bridges gained:

- `list_stacks`
- `stack_action`

This splits the model cleanly:

- container inspection is one concern
- guarded stack mutation is another

## Failure Model

If Infisical is down:

- read-only inspection may continue
- mutating stack actions must fail
- agents should not improvise a plain `docker compose up -d`
- Dockge should not bypass the wrapper

That is the important line. The system should become boring, not inventive, under secret-control-plane failure.

## Why A Docker Plugin Was Not The Answer

Docker has plugins, but not the kind of universal pre-run policy hook I wanted for every mutating `docker run` or `docker compose` call.

That is why the design moved toward wrappers and execution-boundary interception instead of hoping for a neat plugin slot that does not really exist for this use case.

## Blog Upgrades To Make

### Part 2

Show that provider-based vault ownership is necessary but not sufficient.

The vault reduces semantic leakage, but it does not enforce runtime behavior by itself. The article should introduce the idea that execution policy has to sit below the model.

### Part 3

Shift the article away from generated secret `.env` files and toward:

- `stack.contract.json`
- guarded `docker`
- `infisical run`
- Dockge as another caller of the same execution boundary
- fail-closed behavior when Infisical is down

## Proof Assets Still Missing

- one `stack.contract.json` code taste block
- one diagram showing runner -> docker wrapper -> Infisical -> Docker Engine
- one Dockge screenshot that proves the UI is part of the same flow
- one screenshot or log slice from a guarded stack action

## Core Line For The Series

The vault defines ownership.

The execution boundary enforces behavior.

That is the line the final blog version should keep visible.
