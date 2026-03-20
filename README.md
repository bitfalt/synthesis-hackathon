# Aegis Treasury Guardrails

Private treasury policy reasoning for crypto teams.

Aegis helps protocol teams, foundations, and treasury operators evaluate sensitive treasury actions without exposing confidential internal constraints. The product takes a proposed action, checks it against private policy guardrails, and returns a bounded recommendation: ALLOW, WARN, or BLOCK, along with a private rationale, a public-safe explanation, and a structured receipt.

## Why this exists

Treasury decisions are often made with sensitive context that teams cannot safely dump into public tools:
- runway constraints
- reserve policies
- concentration limits
- vendor/payment thresholds
- blocked counterparties or categories
- emergency escalation rules

Aegis is the privacy-preserving decision layer between internal treasury policy and public-facing action.

## Core MVP

The MVP is intentionally narrow.

Aegis is:
- a private treasury policy and risk copilot
- a decision support interface for one treasury action at a time
- a service-style product that produces trustworthy, reviewable outputs

Aegis is not:
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
- The product needs an explicit trust layer, not just a UI.

### 2. Private Agents, Trusted Actions — Venice
Why it fits:
- Venice is the private cognition layer for treasury reasoning over sensitive constraints.
- The product story depends on privacy-preserving analysis being truly load-bearing.

### 3. Agent Services on Base
Why it fits:
- Aegis is being framed as a callable treasury decision service.
- The product should feel discoverable, usable, and monetizable as a real service.

### Stretch / optional tracks
We may evaluate additional track fit later only if the integration is genuinely load-bearing and does not distort the core product.

## Product architecture

### Private cognition
Venice powers confidential reasoning over sensitive treasury rules and internal state.

### Trusted identity and receipts
ERC-8004 gives Aegis an agent identity, a manifest, and verifiable receipt/log primitives that make decisions auditable.

### Service layer
Base gives the product its distribution and service framing.

## Stitch source project
The frontend direction is based on the Stitch project:
- Project: Aegis Treasury Guardrails
- Stitch Project ID: 13407833628408608308

The repo will include downloaded Stitch screen exports and a TanStack Start app scaffold so we can move fast under hackathon time pressure.

## Tech stack
- React
- TanStack Start
- Tailwind CSS
- Bun

## Operating principle
We only have a few days left, so this repo optimizes for:
- one coherent product
- one convincing demo flow
- fast iteration
- strict scope control
- reviewable artifacts for hackathon judges

## Immediate build targets
- Landing page
- Evaluation dashboard
- Request service flow
- Decision result view
- Policy management
- Evaluation history
- Settings / help / support utility views
- Stitch asset ingestion for fast frontend iteration

## Judge-facing evidence we want this repo to make obvious
- clear problem statement
- clear product wedge
- visible human-agent collaboration discipline
- visible trust/privacy architecture
- clear shipping velocity and scope discipline
- open repository with understandable structure

## Repository status
This repo starts as the main build surface for the Synthesis hackathon project.
The implementation scaffold and Stitch exports are set up in subsequent commits.
