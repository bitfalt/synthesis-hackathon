# Aegis Treasury Guardrails Product Vision

## Core vision

Aegis Treasury Guardrails is a private treasury decision service for crypto teams.

It evaluates one proposed treasury action against confidential internal policy and returns a bounded recommendation:

- `ALLOW`
- `WARN`
- `BLOCK`

The product must preserve a strict privacy boundary between internal reasoning and public-safe outputs while producing trust-bearing artifacts such as receipts, logs, and identity-linked metadata.

## Canonical MVP loop

1. Open `/evaluation-dashboard`
2. Provide treasury policy, treasury state, and proposed action
3. Submit to `POST /api/evaluate/demo`
4. Run deterministic guardrails first
5. Use Venice for private rationale, public-safe summary, and confidence wording when configured
6. Render the decision on `/decision-result`
7. Preserve the completed run in `/evaluation-history`

## Product rules

- this is not a trading bot
- this is not an autonomous execution engine
- this is not a broad treasury management suite
- deterministic guardrails decide the core policy outcome first
- Venice is the private cognition layer
- ERC-8004 is the trust and receipt layer
- Base is the service-layer framing, including x402-style agent service surfaces
- public artifacts must not leak private treasury policy text

## MVP output contract

- decision
- confidence
- triggered checks
- private rationale
- public-safe summary
- receipt metadata

## Scope discipline

The repo should optimize for one high-trust evaluation loop, not a wide platform. Route breadth is only useful if it supports the single evaluation flow.
