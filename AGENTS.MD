# AGENTS.MD

This repository is for the Synthesis hackathon project: Aegis Treasury Guardrails.

This file is intended for:
- AI coding agents working in the repository
- human collaborators
- judges/reviewers who want to understand how the repo is being operated

## Important note about Synthesis guidance

We reviewed the current public Synthesis hackathon docs (`skill.md` and `submission/skill.md`) and did not find an explicit official requirement that every project repository must contain an `AGENTS.MD` file.

However, the hackathon clearly values:
- honest process documentation
- human-agent collaboration visibility
- truthful submission metadata
- repository clarity for judges

So this file exists as a practical reviewer/operator guide.

## Project identity

Project: Aegis Treasury Guardrails
Primary goal: evaluate proposed treasury actions against confidential policy guardrails and return a bounded recommendation with receipts.

Primary track alignment:
- ERC-8004 — Agents With Receipts
- Venice — Private Agents, Trusted Actions
- Base — Agent Services on Base

## Non-negotiable commit rules

1. Commits MUST ALWAYS be written in English.
2. Commits MUST ALWAYS be atomic.
3. Commits MUST ALWAYS follow Conventional Commits.
4. Do not bundle unrelated changes into one commit.
5. Do not create vague commits like `update`, `fix stuff`, or `misc`.

### Required commit style
Examples:
- `docs: add initial project README and repository guide`
- `feat: scaffold TanStack Start app with Bun`
- `feat: import Stitch screen exports into public assets`
- `fix: align dashboard route names with Stitch screens`
- `chore: configure Bun scripts for local development`

## Scope rules

This project is time-constrained.

Always optimize for:
- one coherent MVP
- one convincing demo flow
- one real product story
- minimal unnecessary complexity

Avoid:
- speculative infrastructure
- broad platformization
- disconnected side quests
- polishing low-value details before the main flow works

## Frontend rules

Preferred stack:
- React
- TanStack Start
- Tailwind CSS
- Bun

When using Stitch outputs:
- preserve raw exports as references
- keep downloaded assets organized and named consistently
- prefer incremental integration over wholesale rewrites
- do not lose the original screen artifacts

## Documentation rules

If you materially change the product direction, also update:
- `README.md`
- any route/screen inventory docs
- any implementation planning docs

If you discover a judge-relevant decision, document it clearly instead of keeping it only in chat.

## Judge/reviewer guidance

If you are reviewing this repository quickly, start with:
1. `README.md`
2. this file (`AGENTS.MD`)
3. the app entrypoint and route structure
4. any exported Stitch references

What you should expect to see in the repo:
- a clear problem statement
- a coherent track strategy
- visible shipping discipline
- evidence that AI assistance was structured, not random
- fast-moving but reviewable implementation

## Decision-making rule for agents

When uncertain between:
- a more impressive but riskier option, and
- a simpler option that ships cleanly,

choose the simpler option that ships cleanly unless the user explicitly asks otherwise.

## Collaboration rule

If you touch multiple areas, separate the work into logical commits.
Do not hide large changes inside one mega-commit.

## Truthfulness rule

Do not exaggerate:
- features
- integrations
- track fit
- what is already working
- what was actually used in the build

Hackathon submission artifacts must stay aligned with reality.
