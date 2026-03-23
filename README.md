# Aegis Treasury Guardrails

Private treasury policy reasoning for crypto teams.

Aegis helps protocol teams, foundations, and treasury operators evaluate sensitive treasury actions without exposing confidential internal constraints. The product takes a proposed action, checks it against private policy guardrails, and returns a bounded recommendation: ALLOW, WARN, or BLOCK, together with a private rationale, a public-safe explanation, and a structured receipt.

## Judge quickstart

If you only have 2 minutes, test this exact flow first:

1. Open `/evaluation-dashboard`
2. Submit one evaluation
3. Confirm the result on `/decision-result`
4. Open `/evaluation-history`
5. Open the linked receipt JSON and agent log JSON from the result page

### Run locally

```bash
bun install
bun dev
```

Then open `http://localhost:3000/`.

Important local notes:
- no secret is required for the canonical MVP flow
- Venice is optional; without `VENICE_API_KEY`, the app uses deterministic fallback wording
- the app seeds a default structured policy set automatically, so judges can run the main evaluation flow immediately
- completed evaluations persist locally in `.data/aegis-evaluations.json`

### Route status at a glance

| Status | Routes | What to do |
| --- | --- | --- |
| Live MVP | `/evaluation-dashboard`, `/decision-result`, `/evaluation-history` | Test these first |
| Live supporting surface | `/`, `/policy-management`, `/settings`, `/help-center`, `/screens`, `/add-security-policy-modal` | Use for framing, policy inspection, route inventory, and runtime disclosures |
| Demo-grade artifact surface | `/request-service`, `/support-access` | Treat as labeled UI artifacts, not core product proof |

### Honesty notes

- `/.well-known/agent.json` is published, but ERC-8004-grade signed identity and signed receipts are not complete yet
- `/api/evaluate/service`, `/.well-known/x402`, and `/api/x402/discovery` are real discovery/service surfaces; they default to open-demo mode unless x402 is explicitly enabled via env, and full settlement verification is not complete yet
- receipt JSON and agent log JSON are hosted public-safe demo artifacts, not signed immutable proofs
- `/api/evaluations` and `/api/evaluations/:id` are public-safe history endpoints; raw treasury state, full policy snapshots, and private rationale are not exposed there

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
Venice is the intended confidential reasoning layer for treasury policy and internal state.

Current MVP reality:
- when `VENICE_API_KEY` is configured, the backend uses Venice for rationale and public-safe summary wording
- without Venice credentials, the core evaluation loop still works through deterministic fallback wording

### Trusted identity and receipts
ERC-8004 shapes the trust layer direction for Aegis.

Current MVP reality:
- the app publishes an agent manifest and hosted public-safe JSON artifacts
- those artifacts are still unsigned demo surfaces, not final ERC-8004-grade signed receipts

Current MVP trust surfaces:
- `/.well-known/agent.json` — published agent manifest
- `/api/auth/challenge` + `/api/auth/verify` — signed operator session handshake
- `/api/auth/session` + `/api/auth/logout` — cookie-backed operator session lifecycle
- `/api/receipts/:receiptId` — hosted receipt JSON for completed evaluations
- `/api/agent-logs/:receiptId` — hosted public-safe agent log JSON

### Service layer
Base gives the product its service and distribution framing.

Current MVP reality:
- the app publishes a service-style evaluation endpoint plus x402 discovery documents
- x402 defaults to open-demo mode unless explicitly enabled, and full payment verification and settlement are not complete yet

Current MVP service surfaces:
- `/api/evaluate/service` — callable evaluation endpoint for service-style access
- `/api/x402/discovery` — Base/x402 discovery document for the evaluation service

## Frontend setup

This repository uses:
- React
- TanStack Start
- Tailwind CSS
- Bun

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
- `/` — supporting surface for product framing and judge orientation
- `/evaluation-dashboard` — Live MVP entry point for submitting one treasury evaluation against a structured policy set
- `/decision-result` — Live MVP decision output with public-safe durable data plus a session-bound private lane for the submitting browser
- `/evaluation-history` — Live MVP review log for completed evaluations
- `/policy-management` — live supporting surface with real structured policy CRUD for judges who want to inspect or mutate policy sets
- `/settings` — supporting surface for runtime disclosures; many form controls remain non-persistent preview UI
- `/help-center` — supporting surface that links judges to the real trust and route inventory surfaces
- `/request-service` — demo-grade artifact surface only
- `/support-access` — demo-grade artifact surface only
- `/screens` — supporting route/status registry for the preserved Stitch references

Submission status notes:
- the single canonical judge flow is `/evaluation-dashboard` -> `/decision-result` -> `/evaluation-history`
- receipt JSON and agent log JSON are part of that canonical review flow
- wallet connection is only required for policy mutation and operator attribution, not for the main evaluation demo
- several additional routes are intentionally kept as labeled supporting or demo-grade surfaces rather than pretending to be complete features
- see `docs/submission-readiness-audit.md` for the route-by-route readiness table and current truth labels

## Demo API

- `POST /api/evaluate/demo`
- request fields:
  - `policySetId` (preferred structured-policy path)
  - `treasuryPolicy` (legacy inline-policy path)
  - `treasuryState`
  - `proposedAction`
- response fields:
  - `decision`
  - `confidence`
  - `policySet`
  - `triggeredChecks`
  - `publicSummary`
  - `receipt`
  - `privateAccessToken` (session-bound browser token for the private lane on freshly submitted runs)

When `VENICE_API_KEY` and `VENICE_MODEL` are configured, the backend uses Venice for rationale and public-safe explanation wording. Without them, the MVP falls back to deterministic template output so the local demo loop still works. Completed evaluations persist the resolved policy snapshot plus the request state/action snapshots in the local server store, attach operator wallet metadata when a signed session exists, and expose only public-safe history data through the public evaluation APIs.

## Operator identity flow

- Wallet connectors: injected wallets and Coinbase Wallet
- Required operator chain: Base mainnet (`8453`)
- Signed session flow:
  - connect wallet
  - switch to Base if needed
  - sign the challenge from `/api/auth/challenge`
  - server verifies the signature in `/api/auth/verify`
  - a secure cookie-backed session is restored through `/api/auth/session`
- Policy create/edit/archive/activate actions require the signed operator session
- Evaluation runs remain available for demo accessibility, but attach operator wallet metadata when a signed session exists

Current Venice default:
- model fallback: `qwen3-5-9b`
- base URL: `https://api.venice.ai/api/v1`

## Trust and service surfaces

- `/.well-known/agent.json` publishes the current demo agent manifest.
- `/.well-known/x402` publishes the x402 discovery pointer for agent-service clients.
- `/api/evaluate/service` exposes the evaluation flow as a callable service endpoint and defaults to open-demo mode unless x402 is explicitly enabled.
- `/api/x402/discovery` advertises the Base/x402 service surface and current runtime payment mode.
- `/api/evaluations` and `/api/evaluations/:id` expose the persisted evaluation log in a public-safe shape.
- `/api/receipts/:receiptId` and `/api/agent-logs/:receiptId` host public-safe JSON artifacts for completed evaluations.

The current MVP stores evaluations in a single-instance local JSON file under `.data/`, which keeps the dashboard -> result -> history loop durable across refreshes, tabs, and local restarts without adding deployment-heavy infrastructure.

Important: the current ERC-8004 and x402 layers are still demo-grade. Receipt artifacts are hosted JSON, but not signed. The x402 service surface can return a payment challenge only when explicitly configured to do so, and live settlement still requires additional payment configuration.

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
