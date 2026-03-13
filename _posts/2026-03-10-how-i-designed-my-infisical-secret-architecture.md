---
date: 2026-03-18
datePublished: 2026-03-18T09:30:00+01:00
title: "How I Designed My Infisical Secret Architecture"
seoTitle: "How I Designed My Infisical Secret Architecture"
seoDescription: "A practical look at provider-based secret ownership, imports, references, and why this Infisical design works better than mirroring old .env files."
slug: how-i-designed-my-infisical-secret-architecture
cover: /assets/images/blog/how-i-designed-my-infisical-secret-architecture/2026-03-10-how-i-designed-my-infisical-secret-architecture.cover.jpeg
tags: devops gitops homelab infisical secrets architecture llm
show_post_navigation: false
---

This is part 2 of a 3-part series.

- Previously: [Why I Finally Moved My HomeLab Secrets Out of `.env` Files](/blog/why-i-finally-moved-my-homelab-secrets-out-of-env-files)
- Coming next: `Infisical, Gitea Actions, and the Secret Zero Problem`

## Previously On

In the previous post, I explained why I finally stopped tolerating duplicated `.env` files and token-like values spread across the HomeLab. The short version was that the HomeLab had started behaving like a real platform, AI tooling kept surfacing weak boundaries, and I wanted a secret story that would still make sense when the internet was down.

This post picks up where that one stopped. Installing a secret manager is the easy part. The real work starts when I have to decide how [Infisical](https://infisical.com/) should represent the system.

## Context

The biggest design choice in the migration was also the one that mattered most later: I organized secrets by provider and product, not by consuming stack.

That may sound like a small preference at first, but it changes what the vault is actually describing.

If I keep thinking like the old env-file layout, I end up with a folder per stack and a lot of duplication that only looks tidy because it is hidden. `/traefik` gets Cloudflare values. `/compute-traefik` gets the same Cloudflare values again. `/gk-mailfence` gets mail-related values. `/gk-shield` quietly carries another copy. AI-related stacks each grow their own provider keys.

That structure feels self-contained. It is also dishonest. The self-containment comes from duplication.

## The Core Design Choice

I wanted the provider folders to carry the truth. In practice that meant folders such as `/cloudflare`, `/mailfence`, `/ai-providers`, and `/windscribe` owning the shared provider relationship. Consumer folders then import what they need.

That changes the operational picture more than the UI suggests, because Cloudflare, Mailfence, and the AI provider keys each have one clear owning place in the vault. A stack receives what it needs through imports and references instead of quietly becoming its own little copy shop.

Once I modeled the vault that way, the structure started matching the real system instead of the accidental shape of old `.env` files.

<!-- visual-slot: post2-provider-folders-tight
type: screenshot
source: infisical folder hierarchy
goal: keep the existing wide screenshot, but add a tighter provider-folder crop if the hierarchy reads too small in the article
see: docs/INFISICAL_VISUAL_STORYBOARD.md
-->

![Infisical folder hierarchy with provider folders and consumer paths](/assets/images/blog/how-i-designed-my-infisical-secret-architecture/infisical_folder_hierarchy.png)

The useful part in the screenshot above is how quickly the provider folders stop looking like stack folders. Once they sit in the same product, the hierarchy starts telling the truth about ownership.

```mermaid
flowchart TD
    CF["/cloudflare"]
    MF["/mailfence"]
    AI["/ai-providers"]

    T["/traefik"]
    CT["/compute-traefik"]
    GM["/gk-mailfence"]
    GS["/gk-shield"]
    IM["/immich"]
    LL["/litellm"]

    CF --> T
    CF --> CT
    MF --> GM
    MF --> GS
    AI --> LL
    AI --> GS
    AI --> IM
```

The diagram is deliberately simple. It is not there to list every stack. It is there to show the direction of truth. Provider-owned truth points outward toward consumers instead of being duplicated downward into every stack that happens to use it.

## Why Organize By Product?

A provider-based hierarchy answers the questions I actually have to answer when something changes.

It helps me answer the questions that matter under pressure: which stacks depend on Cloudflare, which services consume Mailfence, which AI workloads share provider keys, where I should rotate a value, who owns it, and which consumers I should expect to move when I touch it.

Those are the questions that matter during rotation, incident response, onboarding, and decommissioning. If the vault structure doesn't help me answer them, then the vault may be centralized, but it is not well designed.

That is why I prefer product and provider ownership as the starting point. It makes the system easier to read under pressure.

## Imports Instead Of Copy-Paste

One of the reasons this architecture works well in Infisical is that I can use imports to model the system honestly.

<!-- visual-slot: post2-import-ui
type: screenshot
source: infisical import or reference view
goal: show one consumer path linked to one provider path so imports feel real, not only described
see: docs/INFISICAL_VISUAL_STORYBOARD.md
-->

![The `/traefik` path importing provider-owned Cloudflare values instead of carrying its own private copy](/assets/images/blog/how-i-designed-my-infisical-secret-architecture/infisical-traefik-import-view.png)

This was the screenshot I was missing earlier. It proves the idea in the product itself: the `traefik` consumer path can stay small because the shared Cloudflare truth comes in through an import instead of being copied again under a new folder.

Cloudflare is the easiest example. Both `traefik` and `compute-traefik` need Cloudflare credentials for DNS automation. The lazy structure would copy the same values into both folders. The product-based structure is simpler once I stop thinking in terms of files:

- `/cloudflare` owns the credentials
- `/traefik` imports from `/cloudflare`
- `/compute-traefik` imports from `/cloudflare`

That reduces duplication, but the more important gain is clarity. There is one answer to where the key lives. The importing folders tell me who consumes it. I no longer have to reverse-engineer ownership from whichever stack happened to duplicate the value first.

The same pattern applies to Mailfence and AI provider keys. Once I stopped treating every stack as if it needed its own local copy of the world, the vault got simpler and more honest at the same time.

## AI Providers Are Especially Good At Creating Secret Sprawl

This part mattered to me because AI experimentation is very good at creating bad secret habits quickly.

It starts with `OPENAI_API_KEY`. Then another provider shows up. Then a third. Then a side project appears that needs "just one more key." Before long, every AI-related service, script, or experiment has its own local variation of the same provider relationship.

That is how secret sprawl wins.

Putting those values under `/ai-providers` acknowledges a more stable truth. The stable thing is not whichever side project I happen to be running this week. The stable thing is the provider relationship itself. Once that becomes the owning layer, I can add and remove consumers without recreating the same messy secret surface every time.

It is a DRY choice, but it is also a context-hygiene choice. It reduces how many places ordinary tooling, including LLM tooling, sees secret-adjacent meaning.

## What Still Belongs In A Stack Folder?

Not everything should be pulled upward into provider folders.

Stack folders still matter for stack-specific application secrets, one-off database credentials, signing keys that genuinely belong to one service, and feature flags that are secret in nature and not shared.

The rule I ended up using is simple. If a value is shared provider truth used by multiple consumers, I want it in the provider folder. If a value belongs to one consumer, I keep it local to that stack path.

I like that rule because it is easy to explain and easy to defend. It is also specific enough to prevent the two common failure modes: copying everything everywhere, or abstracting so aggressively that the vault turns into a puzzle.

## Why Flattening Everything Would Have Been A Trap

The most tempting alternative would have been the fastest one: mirror the old `.env` layout into Infisical, folder for folder, and call the migration done.

That would have centralized storage, but it would not have improved the architecture. I still would have ended up with duplicate values, weak ownership, repeated rotations, and noisy secret-adjacent context. The only thing that would have changed is the storage backend.

That is the quiet failure mode in a lot of secret migrations. The values are technically "in the vault" now, but the design is still lying about who owns what.

I wanted the result to be structurally better, not only more modern.

## Why References Matter

References matter for the same reason imports matter. They let me keep meaning at the right layer.

Without imports and references, people duplicate values because they are afraid indirection makes the runtime fragile. In practice, disciplined indirection makes the model cleaner. Rotation happens in the right place. Ownership stays visible. Consumers stay small. The runner side matters here as well, because a [Gitea runner](https://docs.gitea.com/usage/actions/act-runner) should be able to consume this structure without turning it back into duplication.

Once I combine that with a committed stack contract and guarded runtime injection, the runtime still gets concrete values at the edge while the vault keeps the better structure internally. That is exactly the balance I wanted: expressive architecture in the control plane, boring runtime behavior at the edge.

```mermaid
sequenceDiagram
    participant Admin as Me in Infisical
    participant Vault as Provider Folder
    participant Stack as Stack Folder
    participant Contract as stack.contract.json
    participant Runner as Gitea Runner
    participant Runtime as Guarded Docker

    Admin->>Vault: Store or rotate provider secret once
    Stack->>Vault: Import shared path
    Contract-->>Runner: Discover Infisical path and environment
    Runner->>Runtime: docker compose up -d
    Runtime->>Vault: infisical run for stack path
```

That is the flow I wanted from the start. Meaning stays in the vault. The contract makes the path explicit. The runtime edge stays boring without falling back to secret files in the repo.

## Why Legibility Matters Almost As Much As Encryption

When people talk about secret managers, they often jump straight to encryption. That matters, obviously. In day-to-day operations, legibility matters almost as much.

If future-me cannot explain why a secret lives where it does, who owns it, which consumers depend on it, and how I expect it to rotate, then the design is either too clever or too messy. Good secret architecture is not only about confidentiality. It is also about how fast I can regain orientation when I am tired, distracted, or debugging under pressure.

That is one of the reasons I like the product-based model. It is easier to explain after two coffees and one bad night than a flattened pile of values with a nice UI wrapped around it.

## Why This Helps When LLMs Touch More Of The Workflow

One reason I went deeper than a basic vault migration is that my engineering workflow is no longer only me and the code.

It increasingly includes Gemini for investigation and orchestration, Codex for repo work and patching, Copilot for smaller coding moments, and local models for privacy-sensitive or infra-heavy tasks. Once those tools become part of the workflow, architecture mistakes become more expensive. Not because the models are malicious, but because the context surface gets larger.

The more tools inspect repos, env files, deployment pipelines, Compose files, and scripts, the more valuable it becomes to have a clean line between code, config, and secrets. A provider-based vault model reduces semantic leakage. Shared provider truth appears in fewer places. Stack-specific truth stays local. Non-secret structure stays in Git. That is better for people, and it is better for AI-assisted workflows.

That gets easier to understand when I look at how the tools actually behave. Gemini is better when it can scan the architecture without dragging three local copies of the same provider key through the conversation. Codex is better when the repo-local artifacts are concrete but not polluted by duplicated secret meaning. A cleaner vault model doesn't make the tools wiser by magic. It makes the environment less noisy for them.

## What Dangerous AI-Assisted Infrastructure Work Looks Like

It is more useful to name the dangerous patterns than to say something vague like "AI in infra is risky."

For me, the obvious risks look like this:

1. an agent sees too much secret-adjacent context because the repo structure is messy
2. a model suggests a technically valid shortcut that weakens a trust boundary
3. I trust generated structure more than the real platform constraints
4. urgency turns "just this once" into a new normal

I have seen traces of all four during the migration work. The emotional tone is not the interesting part. The operational reflex underneath it is. Convenience always tries to win. Good structure is the thing that keeps convenience from quietly eroding the boundary.

That is another reason the provider model feels right to me. A better architecture removes some of the temptation before the tool even starts reasoning.

## Why The Vault Model Was Not The Whole Boundary

This was the next thing I had to learn the hard way: a better vault model is necessary, but it is not enough.

Provider folders, imports, and cleaner ownership reduce semantic leakage. They do not stop a tired human, an eager LLM, or a Compose UI from reaching for `docker compose up -d`, generating a secret-bearing `.env`, or recreating the old habit under a nicer control plane.

That is where the meaning of the architecture changed for me. Infisical became the place that defines ownership, but not the only thing that enforces behavior. The runtime edge needed its own hard boundary.

In practice that boundary became a committed `stack.contract.json` beside the Compose file and a guarded Docker execution path underneath both the shell and the UI. The contract tells the runtime where the truth lives in Infisical. The guarded Docker path makes sure the stack cannot quietly slide back to secret files on disk just because that would be convenient.

That sounds like a runtime concern, and it is, but it starts here in the architecture. If the vault model does not describe ownership clearly, then the execution layer has nothing honest to enforce later.

```mermaid
flowchart LR
    V["Provider-owned paths in Infisical"]
    C["stack.contract.json"]
    G["guarded docker boundary"]
    R["runtime container process"]

    V --> C
    C --> G
    G --> R
```

The diagram is simple on purpose. The useful part is the handoff. The vault owns meaning. The contract makes that meaning discoverable. The guarded runtime edge turns that meaning into actual behavior.

## A More Concrete Walkthrough

This migration is easy to misunderstand if it stays at the level of principle only, because it really shows up in concrete folders and concrete flows.

### Case Study: `traefik` And `compute-traefik`

This is the cleanest example. Both stacks need Cloudflare credentials for DNS-related automation. In the old model I would likely have copied the same values into both folders and moved on.

That only works until the day I rotate something. Then I have to remember every copy, every local name, and every consumer that may still depend on an older value.

The provider model is much more direct:

- `/cloudflare` owns the provider credentials
- `/traefik` imports from `/cloudflare`
- `/compute-traefik` imports from `/cloudflare`

That removes duplication, but more importantly it makes the operational answers boring, which is exactly what I want. Rotation happens in `/cloudflare`, the importing folders show the consumers directly, and ownership has much less room to drift.

### Case Study: `gk-mailfence` And `gk-shield`

Mailfence is useful because it shows that not every shared relationship is as obvious as a reverse proxy and a DNS provider.

<!-- visual-slot: post2-secret-detail-mask
type: screenshot
source: infisical secret detail view
goal: show one masked provider-owned secret with name visible and value partially masked
see: docs/INFISICAL_VISUAL_STORYBOARD.md
-->

![A provider-owned Cloudflare secret shown in Infisical with the value masked but the ownership context still visible](/assets/images/blog/how-i-designed-my-infisical-secret-architecture/infisical-cloudflare-secret-detail.png)

This second proof shot matters for a different reason. The import view shows where the consumer points. The secret detail view shows that the provider-owned value is still treated as one piece of truth with a real path and a real owner.

The application context feels different between `gk-mailfence` and `gk-shield`, so it would have been easy to let each stack pretend it owned its own mail-related truth. That still creates duplication if the underlying provider relationship is shared.

The more honest model is the same one as before: shared Mailfence truth in `/mailfence`, stack-specific values in the consuming folders, and imports wherever shared provider credentials are needed.

That gives me a clean split between provider-owned truth and service-owned truth. That split is what makes rotation, explanation, and auditing easier later.

Here is the kind of masked snapshot that makes the model easier to explain:

```dotenv
CLOUDFLARE_API_TOKEN=cf_v1_abcd***
CLOUDFLARE_ZONE_ID=1f6d2c***
MAIL_FROM_ADDRESS=alerts@itkriebbels.be
OPENAI_API_KEY=sk-proj-abcd***
```

The literal values are not the point. Each of them should have one honest owner and a limited set of consumers.

### Case Study: `/ai-providers`

This is the part I care about most because it sits at the intersection of infrastructure work and AI experimentation.

If I let every AI-related service own copies of `OPENAI_API_KEY`, `GROQ_API_KEY`, `MISTRAL_API_KEY`, and whatever comes next, the HomeLab becomes a secret copier very quickly.

That is especially bad in an environment where I experiment a lot, try new tools, and increasingly care about privacy and context cleanliness. Centralizing those values under `/ai-providers` is therefore not only a DRY decision. It is a way to keep the provider relationship stable while the experiments around it change.

## What I Would Have Done Wrong A Year Ago

If I had done this earlier, I probably would have made one of four mistakes:

1. mirrored the old `.env` layout into Infisical and called it architecture
2. moved too many non-secret values into the vault just because I finally had a vault
3. optimized for migration speed instead of ownership clarity
4. kept too much stack-local duplication because seeing everything in one folder felt safer

All four would have produced something that looked better while staying operationally messy. That is why I keep coming back to the difference between centralization and design. Centralization changes where the values live. Design changes what the system means.

That is also why I keep resisting the lazy definition of success. A vault migration can fail quietly. The values are technically in a nicer product, but the mental model is still the same messy one from the old `.env` era. I wanted the meaning of the system to change, not only the storage location.

## The Cost Of The Better Design

The provider-based model is not free. It costs more thought up front.

I had to decide what counted as provider truth, what counted as stack truth, what should be imported, what should stay local, and where naming needed to become consistent. That is more work than copying values into folders that happen to match repository names.

I still think it is the right trade. I would rather pay the design cost once than keep paying for operational confusion every time I rotate, explain, or expand the setup.

## A Safe Snapshot From The Migration Process

The migration notes capture the center of gravity quite well:

> "Deep Dive into Architecture: Explain the 'Product-Based' (DRY) strategy where secrets are stored in provider-specific folders (`/cloudflare`, `/mailfence`, etc.) and imported into stack folders."

That was exactly the direction I kept pushing.

There is also a practical GitOps example in the local artifacts that shows how the design reaches a real deployment without falling back to secret env files:

```yaml
- name: Deploy through the guarded runtime boundary
  env:
    INFISICAL_CLIENT_ID: ${{ secrets.INFISICAL_CLIENT_ID }}
    INFISICAL_CLIENT_SECRET: ${{ secrets.INFISICAL_CLIENT_SECRET }}
  run: |
    export INFISICAL_TOKEN=$(infisical login --method=universal-auth \
      --client-id="$INFISICAL_CLIENT_ID" \
      --client-secret="$INFISICAL_CLIENT_SECRET" \
      --plain --silent \
      --domain="http://192.168.5.90:8081")

    docker compose up -d
```

That example only works because the compose directory also contains the metadata that the runtime edge needs:

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

This is what I mean when I say the runtime should stay boring. The repo keeps non-secret structure and contract metadata. Infisical keeps the secret truth. The deployment path stays short, but it no longer has to manufacture a secret-bearing file on disk just to make Compose happy.

## Why This Architecture Is Also A Teaching Tool

Part of why I blog at all is that writing helps me understand what I am doing. That is still true here. I also spend time sharing what I learn with colleagues, especially where LLMs meet delivery work and platform thinking meets application work.

This architecture is useful to explain because it gives me a concrete answer to a recurring question: how do I modernize secret handling without replacing one mess with a more fashionable one?

My answer is simple enough to teach:

- model ownership honestly
- keep shared provider truth shared
- keep stack truth local
- let imports and references do real work
- keep non-secret structure in Git

That is not vendor hype. It is an operating pattern.

## How This Post Was Written

This post also comes from the real migration work. The folder structure, imports, screenshots, and examples come from the setup itself.

I did use the same writing and review loop as in Part 1: ChatGPT, Codex, Gemini, QuillBot, GPTZero, and Transkriptor all helped at different stages. I use them to compare drafts, pressure-test the prose, check whether a screenshot adds anything, and feed read-aloud comments back into the post. They help me improve the article. They do not replace the work behind it.

## Sources

- [Infisical secret imports](https://infisical.com/docs/documentation/platform/secret-imports)  
  The feature that made the provider-based structure practical instead of theoretical.

- [Infisical secret referencing](https://infisical.com/docs/documentation/platform/secret-referencing)  
  Reference behavior and the way shared values can stay shared instead of copied.

- [Infisical CLI usage](https://infisical.com/docs/cli/usage)  
  The CLI side that turns the architecture into a real deploy-time flow.

- [ChatGPT](https://chatgpt.com/)  
  Used to compare prose versions and refine a few diagrams and visual explanations.

- [OpenAI Codex](https://openai.com/codex/)  
  Used to patch the post, update assets, and validate the Jekyll output in the repo itself.

- [Gemini](https://gemini.google.com/)  
  Used as a second opinion on the visual choices and on sections that stayed too tidy after a first pass.

- [QuillBot](https://quillbot.com/)  
  Used as a comparison tool for sentence rhythm, not as the source of truth.

- [GPTZero](https://gptzero.me/)  
  Used as a pressure test when the prose became too composite or too polished.

- [Transkriptor](https://transkriptor.com/)  
  Used to turn spoken read-through comments into editing notes.

## What’s Next

The final post turns this architecture into a deployment story. That means machine identities, Universal Auth, the Secret Zero problem, `infisical run`, `infisical export --expand`, the Macvlan paradox, and the naming and routing details that made the setup work in practice.

- Part 3: [Infisical, Gitea Actions, and the Secret Zero Problem](/blog/infisical-gitea-actions-and-the-secret-zero-problem)
