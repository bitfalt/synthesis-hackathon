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

Canonical design-system implementation files:
- `src/design-system/README.md`
- `src/design-system/theme.ts`
- `src/styles/app.css`

When using Stitch outputs:
- preserve raw exports as references
- keep downloaded assets organized and named consistently
- prefer incremental integration over wholesale rewrites
- do not lose the original screen artifacts
- do not treat raw HTML exports as production-ready route code
- extract shared primitives, layout patterns, and repeated styling into reusable TSX components and shared design-system rules first

## Documentation rules

If you materially change the product direction, also update:
- `README.md`
- any route/screen inventory docs
- any implementation planning docs

If you discover a judge-relevant decision, document it clearly instead of keeping it only in chat.

## Conversation log rules

`AGENTS.MD` is a living operational document. Agents may patch it when repository instructions drift from the workflow actually being used, but edits must stay narrow, truthful, and should not remove constraints without a concrete reason.

Personal Synthesis conversation logs live at:
- `docs/conversation-logs/<identity>.md`

Resolve `<identity>` in this exact order so multiple collaborators in the same repo do not write into the wrong log:
1. active `gh auth status` account login
2. `git config user.email`
3. `git config user.name`

Agents must read the current user's existing log before starting meaningful work. Do that immediately after reading `AGENTS.MD`. If the log file does not exist yet, continue and create it when you append the first entry.

Agents must append a new structured log entry after meaningful work. Meaningful work includes:
- any repository file change
- any issue, PR, or backlog triage that changes execution decisions
- any test, build, or debugging pass that produces information used for decisions
- any documentation or planning update that affects collaborators
- any `AGENTS.MD` change

Purely read-only help, orientation, or one-off answers with no durable repo impact do not require a log entry.

Append entries sequentially as `Session 1`, `Session 2`, and so on, using this exact format:

```md
Session N
- Time:
- Participants:
- Goal:
- Human input:
- Agent work:
- Decisions made:
- Blockers:
- Pivot or breakthrough:
- Artifacts created:
- Next step:
```

Any change to `AGENTS.MD` must be mentioned in the relevant conversation log entry.

## Design system rules for agents

This project follows the "Sovereign Vault" design language.

Key rules:
- Use tonal layering instead of hard divider-heavy layouts.
- Prefer dark surface stacks: foundation -> shell -> panel -> elevated -> glass overlay.
- Use teal for trust, primary action, and positive system emphasis.
- Use amber for warning/review states.
- Use icy blue for informational or secondary system signals.
- Use Manrope for authority-heavy headings and Inter for body/UI density.
- Avoid degen/neon trading aesthetics.
- Avoid random one-off Tailwind piles when a shared recipe or component should exist.
- If the same structure appears twice, strongly consider extracting a component.

Before creating new route UI, check whether the styling should live in:
- shared component props
- shared utility class recipes
- `src/styles/app.css`
- `src/design-system/theme.ts`

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
