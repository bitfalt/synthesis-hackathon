# Aegis Treasury Guardrails

Private treasury policy reasoning for crypto teams.

Aegis helps protocol teams, foundations, and treasury operators evaluate sensitive treasury actions without exposing confidential internal constraints. The product takes a proposed action, checks it against private policy guardrails, and returns a bounded recommendation: ALLOW, WARN, or BLOCK, together with a private rationale, a public-safe explanation, and a structured receipt.

## Problem

Treasury decisions are often shaped by information teams cannot safely expose to public tooling:
- runway requirements
- concentration limits
- reserve floors
- blocked counterparties or categories
- escalation thresholds
- internal budget rules

Today those decisions are often fragmented across spreadsheets, chats, and ad hoc manual reviews.

Aegis exists to answer:

"Given our private treasury policy and the current request, should this action be allowed, flagged, or blocked?"

## Core MVP

Aegis is intentionally narrow.

It is:
- a private treasury policy and risk copilot
- a decision support flow for one treasury action at a time
- a service-style product that produces trustworthy, reviewable outputs

It is not:
- a trading bot
- an autonomous execution engine
- a full treasury management suite

### Inputs
- Treasury policy
- Current treasury state
- Proposed action request

### Outputs
- Decision: ALLOW / WARN / BLOCK
- Confidence band
- Private rationale
- Public-safe summary
- Structured guardrail receipt

## Tracks we are participating in

### 1. Agents With Receipts — ERC-8004
Why it fits:
- Aegis is built around trusted agent behavior, receipts, manifests, and verifiable logs.
- The product needs an explicit trust layer, not just a nice dashboard.

### 2. Private Agents, Trusted Actions — Venice
Why it fits:
- Venice is the private cognition layer for treasury reasoning over sensitive constraints.
- The product only works if private reasoning is truly load-bearing.

### 3. Agent Services on Base
Why it fits:
- Aegis is being framed as a callable treasury decision service.
- The product should feel discoverable, usable, and monetizable as a real service.

### Stretch / optional tracks
We may evaluate additional track fit later only if the integration is genuinely load-bearing and does not distort the core product.

## Product architecture

### Private cognition
Venice powers confidential reasoning over treasury policy and internal state.

### Trusted identity and receipts
ERC-8004 gives Aegis an agent identity, a manifest, and verifiable receipt/log primitives that make decisions auditable.

### Service layer
Base gives the product its service and distribution framing.

## Frontend setup

This repository uses:
- React
- TanStack Start
- Tailwind CSS
- Bun

### Local development

```bash
bun install
bun dev
```

### Production build

```bash
bun build
```

## Stitch integration

The frontend direction is based on the Stitch project:
- Project: Aegis Treasury Guardrails
- Stitch Project ID: 13407833628408608308

This repo includes:
- `public/stitch/html/` — raw standalone Stitch HTML exports
- `public/stitch/screenshots/` — downloaded screenshots for each exported screen
- `docs/stitch/design-system-spec.md` — preserved design system reference
- `/screens` — a TanStack Start route that indexes the imported Stitch references

### Design system note
The requested Design System asset from Stitch was exposed as a `DESIGN_SYSTEM_INSTANCE` stub rather than a normal downloadable screen. The screen API did not return a standalone export for that asset ID, so the project-level design system specification was preserved in `docs/stitch/design-system-spec.md`.

## Current implementation surfaces
- `/` — product overview and hackathon framing
- `/screens` — Stitch reference gallery

## Operating principle
We only have a few days left, so this repo optimizes for:
- one coherent product
- one convincing demo flow
- strict scope control
- fast iteration
- judge-readable artifacts

## Judge-facing evidence this repo should make obvious
- clear problem statement
- clear product wedge
- visible human-agent collaboration discipline
- visible trust/privacy architecture
- visible shipping velocity and scope control
- an understandable open repository structure

## Repository guidance
See `AGENTS.MD` for the repository operating rules used by agents and collaborators.
