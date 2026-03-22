# Aegis MVP AI Agent Handoff

## Current MVP loop

1. open `/evaluation-dashboard`
2. provide treasury policy, treasury state, and proposed action
3. submit to `POST /api/evaluate/demo`
4. receive deterministic decision plus reasoning payload
5. route to `/decision-result`
6. inspect receipt metadata and artifact links
7. review completed runs in `/evaluation-history`

## Implemented behavior

- the dashboard keeps draft inputs in component state only
- completed evaluations are saved to browser `sessionStorage`
- stored history contains response data and receipt metadata, not raw draft inputs
- decision result separates private rationale from the public-safe summary
- receipt artifacts are exposed as hosted JSON links for the demo flow
- the app publishes `/.well-known/agent.json` plus hosted receipt/log endpoints
- the service layer exposes `/api/evaluate/service` and `/api/x402/discovery`

## Backend notes

- deterministic checks cover runway, transfer threshold, concentration, and counterparty category
- Venice integration is wired behind `VENICE_API_KEY` and `VENICE_MODEL`
- Venice defaults to `qwen3-5-9b` when a model override is not supplied
- when Venice is not configured, the backend falls back to deterministic explanation templates so the MVP still runs locally

## Important follow-up work

- replace data URL artifacts with hosted receipt and log endpoints
- swap the Venice fallback path for a verified production prompt and schema
- connect ERC-8004 identity and manifest publication
- add x402 only after the core evaluation loop is stable
