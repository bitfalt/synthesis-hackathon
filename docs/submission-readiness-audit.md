# Submission Readiness Audit

Date: 2026-03-22

This audit is optimized for final Synthesis submission readiness under severe time pressure.

## Route audit

| Route / flow | Current state | User value | Implementation reality | Risk if left as-is | Recommendation | Est. effort |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Strong landing page and live route entry point | Explains the product and sends reviewers into the MVP | Partially real | Decorative stats and mislabeled CTAs can undermine trust | Keep it, but use only honest demo metrics and route labels | `~30m` |
| `/evaluation-dashboard` | Main evaluation form posts to the backend and navigates to result | Highest-value operator flow | Fully working for demo scope | Surrounding mock data can confuse judges about what is actually wired | Keep as the canonical live MVP route and label surrounding panels as illustrative | `~20m` |
| `/decision-result` | Reads real result data from the durable local store and shows hosted artifact links | Shows the privacy split and receipt story | Fully working for demo scope | Trust copy can overstate signatures or immutability | Keep, but explicitly label hosted artifacts as demo-grade and unsigned | `~30m` |
| `/evaluation-history` | Reads real completed runs from the durable local store | Makes the flow reviewable and repeatable | Fully working for persisted demo scope | Dead filter/export controls and over-strong audit language reduce credibility | Keep, show it as durable history, and disable non-functional controls | `~20m` |
| `/policy-management` | Polished policy registry plus modal route | Shows future authoring direction | Demo / preview | Looks like a working policy editor even though the evaluator ignores it | Keep as preview, add a banner saying dashboard policy text is the live source today | `~25m` |
| `/request-service` | Enterprise intake layout | Low immediate MVP value | Demo / preview | Fake concierge promises and live-looking submit CTA mislead reviewers | Keep only as preview, disable submit, and remove unsupported guarantees | `~20m` |
| `/settings` | Mixed runtime disclosures and static controls | Medium value if used for honest disclosures | Partially real | Fake save/update controls distract from the useful runtime truth cards | Keep the page, but frame it as runtime disclosures plus non-persistent settings preview | `~20m` |
| `/support-access` | High-fidelity concierge workspace mock | Very low MVP value today | Demo / preview | Live chat affordances imply functionality that does not exist | Keep as labeled preview or demo theater only; disable obvious controls | `~25m` |
| `/help-center` | Static docs/help shell | Can become useful quickly for judges | Partially real | Looks like a docs portal even though most content is not linked to real assets | Convert into a truthful review hub with links to live routes and trust surfaces | `~30m` |
| `/screens` | Stitch-to-route registry | High reviewer value | Fully working for reference scope | Minor risk of overstating route fidelity | Keep and describe it as a reference index, not a product feature | `~10m` |
| `/api/evaluate/demo` | Validated POST endpoint, deterministic guardrails, optional Venice reasoning | Core backend proof | Fully working for demo scope | Could be mistaken for production-grade policy infrastructure | Keep and describe as the demo evaluator contract | `~0m` |
| `/api/evaluate/service` | Service-shaped endpoint with x402 challenge behavior | Good service framing for Base | Partially real | Readers may assume paid settlement is complete | Keep, but label as x402 discovery/challenge scaffold | `~0m` |
| `/api/receipts/:receiptId` | Hosted receipt JSON | Helpful trust artifact | Partially real | Artifacts are now durable locally but still unsigned | Keep, but frame as hosted demo artifacts | `~0m` |
| `/api/agent-logs/:receiptId` | Hosted public-safe log JSON | Helpful trust artifact | Partially real | Artifacts are now durable locally but still unsigned | Keep, but frame as hosted demo artifacts | `~0m` |
| `/.well-known/agent.json` | Published manifest | Strong reviewer surface | Partially real but honest | Low risk; already caveated | Keep as-is and reference it from UI/docs | `~0m` |
| `/.well-known/x402` and `/api/x402/discovery` | Published discovery surfaces | Strong reviewer surface | Partially real but honest | Low risk if the UI does not overclaim settlement | Keep as-is and point reviewers to them directly | `~0m` |

## Prioritized action plan

### P0: must-fix for submission

- Make the canonical loop unmistakable: `/evaluation-dashboard` -> `/decision-result` -> `/evaluation-history`.
- Remove or disable dead-end controls that imply live wallet, analytics, filter/export, chat, or save flows.
- Add explicit `Demo preview`, `Submission preview`, or `Coming soon` treatment to non-MVP routes.
- Soften any copy that implies signed receipts, immutable proofs, live concierge staffing, or complete x402 settlement.
- Give judges one truthful review surface that links to the real manifest, x402 discovery, and screen registry.

### P1: should-fix if fast

- Convert `/help-center` from generic marketing copy into an honest review hub.
- Reframe `/settings` around runtime disclosures, keeping the static controls visibly non-persistent.
- Add route-level status badges so reviewers can tell live MVP screens from preview screens instantly.

### P2: only if nearly free

- Add more granular preview labels to subpanels inside policy management, service request, and support routes.
- Add a README pointer to this audit for judge-readability.

## Route status labels

### Fully working

- `/evaluation-dashboard`
- `/decision-result`
- `/evaluation-history`
- `/screens`
- `/api/evaluate/demo`

### Demo / preview

- `/`
- `/policy-management`
- `/add-security-policy-modal`
- `/request-service`
- `/settings`
- `/support-access`
- `/help-center`
- `/api/evaluate/service`
- `/api/receipts/:receiptId`
- `/api/agent-logs/:receiptId`
- `/.well-known/agent.json`
- `/.well-known/x402`
- `/api/x402/discovery`

### Coming soon / not yet available

- CSV export from history
- History filtering
- Policy activation and export
- Enterprise service intake submission
- Live concierge chat / ticket actions
- Persistent settings save flows
- Full x402 payment verification and settlement
- Signed ERC-8004-grade receipts
