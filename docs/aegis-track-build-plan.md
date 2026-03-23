# Aegis Track Build Plan

## Primary goal

Ship one convincing MVP loop:

1. collect treasury policy, treasury state, and proposed action
2. evaluate the request with deterministic guardrails
3. generate private and public-safe reasoning
4. attach receipt-style trust artifacts
5. make the completed run reviewable in history

## P0 routes

- `/evaluation-dashboard` - canonical entry point for the demo
- `/decision-result` - live decision and privacy split
- `/evaluation-history` - real completed evaluations from the durable local store

## Backend contract

- `POST /api/evaluate/demo`
- request body:
  - `treasuryPolicy`
  - `treasuryState`
  - `proposedAction`
- response body:
  - `decision`
  - `confidence`
  - `triggeredChecks`
  - `privateRationale`
  - `publicSummary`
  - `receipt`

## Product truths to preserve

- deterministic guardrails decide ALLOW / WARN / BLOCK first
- Venice is the reasoning layer for private and public-safe wording when configured
- public artifacts must not expose verbatim private policy text
- the product should feel like a callable service, not a generic dashboard
- autonomous treasury execution is out of scope for the MVP

## Delivery order

### Phase 1

- stabilize `POST /api/evaluate/demo`
- wire `/evaluation-dashboard` to submit live input
- route successful evaluations to `/decision-result`

### Phase 2

- attach receipt-style artifact links to completed evaluations
- store completed results in session history without persisting raw drafts to localStorage
- expose completed runs in `/evaluation-history`
- publish hosted JSON receipt and log endpoints plus a minimal agent manifest

### Phase 3

- connect explicit ERC-8004 identity signing and stronger manifest surfaces
- wire live x402 verification and settlement for the Base service endpoint
- add paid service flow only after the demo loop is stable
