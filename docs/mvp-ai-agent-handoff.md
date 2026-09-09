# Aegis MVP AI Agent Handoff

## Current MVP loop

1. open `/evaluation-dashboard`
2. use the seeded active policy set, provide treasury state, and provide a proposed action
3. submit to `POST /api/evaluate/demo`
4. receive a deterministic policy outcome plus Venice-or-fallback reasoning payload
5. route to `/decision-result`
6. inspect the receipt metadata plus the hosted receipt JSON and agent log JSON links
7. review completed runs in `/evaluation-history`

## Implemented behavior

- the dashboard loads real structured policy sets from the local policy store
- completed evaluations are saved in the local durable server store under `.data/aegis-evaluations.json`
- stored history contains the response payload, receipt metadata, policy snapshot, and request snapshots for historical correctness
- decision result separates private rationale from the public-safe summary
- receipt artifacts are exposed as hosted JSON links for the demo flow
- the app publishes `/.well-known/agent.json` plus hosted receipt/log endpoints
- the service layer exposes `/api/evaluate/service` and `/api/x402/discovery`
- policy create/edit/archive/activate flows are real, but they are supporting surfaces rather than the first judge path

## Route truth labels

### Live MVP

- `/evaluation-dashboard`
- `/decision-result`
- `/evaluation-history`

### Supporting surfaces

- `/`
- `/policy-management`
- `/settings`
- `/help-center`
- `/screens`
- `/add-security-policy-modal`

### Demo-grade artifact surfaces

- `/request-service`
- `/support-access`

## Backend notes

- deterministic checks cover runway, transfer threshold, concentration, and counterparty category
- Venice integration is wired behind `VENICE_API_KEY` and `VENICE_MODEL`
- Venice defaults to `qwen3-5-9b` when a model override is not supplied
- when Venice is not configured, the backend falls back to deterministic explanation templates so the MVP still runs locally
- policy sets seed automatically on first run, so the main flow works locally without setup beyond `bun install` and `bun dev`

## Important truth notes

- receipt and agent-log artifacts are hosted JSON, but they are still unsigned demo artifacts
- `/.well-known/agent.json` is published, but ERC-8004-grade signed identity proof is not complete yet
- `/api/evaluate/service` and x402 discovery are published, but full payment verification and settlement are not complete yet
- wallet auth is only required for policy mutation and operator attribution, not for the canonical judge demo path
