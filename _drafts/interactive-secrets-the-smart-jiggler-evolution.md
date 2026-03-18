---
title: "Interactive Secrets: The Smart Jiggler Evolution"
author: "Kristof Riebbels"
tags: security gitops infisical homelab automation
---

Keeping a remote work laptop awake while you're busy on your main workstation is a classic homelab challenge. But doing it without fighting your own physical mouse movements—and doing it securely—is where it gets interesting.

This is the story of how a simple "mouse jiggler" script evolved into a containerized GitOps service, and how it helped define a new security standard for my entire workspace: **The Interactive Secret Rule**.

## The Problem: The Dumb Jiggler

Most hardware mouse jigglers are "dumb." They blindly pulse movements into the host machine. If you're actually trying to use that machine, the jiggler fights your hand. Even worse, if you run a simple script locally, you often end up with plaintext credentials in `.env` files or hardcoded in scripts—a major security liability when working with AI agents.

## The Solution: The Smart Jiggler

The "Smart Jiggler" logic is simple:
1. **Network Aware:** It only triggers when you're on your home network.
2. **Stealthy:** It sends a 1-pixel "twitch" that keeps the OS awake without being visible to the eye.
3. **Independent:** It runs as a server-side container on a compute host, ensuring it works even if your local machine is off.

## The Security Breakthrough: The Interactive Secret Rule

During the development of this jiggler, we hit a critical security realization. When working with LLM agents, you cannot trust them with your passwords in a way they can access silently.

This led to the **Interactive Secret Rule**:
- **No Plaintext Secrets:** Secrets are never stored in `.env`, `stack.env`, or hardcoded.
- **Infisical for Production:** All server-side secrets are injected at runtime via Infisical.
- **KWallet for Local Interaction:** Any local operation requiring a password must use `kwallet-query` or `gsudo`.

This creates a "GUI Air-Gap." Because the LLM agent cannot see or interact with your physical KDE desktop, it cannot bypass the password prompt. You remain the physical gatekeeper of your credentials.

## The Architecture

The final setup looks like this:
- **Gitea:** Hosts the code and handles automated deployments via Gitea Actions.
- **Infisical:** Manages the GLKVM credentials securely.
- **Docker:** Runs the jiggler script on the `vm-docker-01` compute host.
- **GLKVM API:** Receives the stealth HID events over the network.

## Conclusion

What started as a way to keep a screen from going black ended as a foundational security upgrade. By enforcing interactive authentication and productizing secret management, I've created a workspace where automation and security live in balance.

Stay tuned for the next post where I'll dive deeper into the Infisical integration for the rest of my stack!
