# Stitch Export Notes

This directory contains Stitch-related reference material for the Aegis Treasury Guardrails frontend.

## Sources
- Stitch project title: Aegis Treasury Guardrails
- Stitch project ID: 13407833628408608308

## Export strategy
The repository stores two kinds of Stitch artifacts:
- screen screenshots under `public/stitch/screenshots/`
- raw standalone HTML exports under `public/stitch/html/`

These are intended as implementation accelerators and visual references, not as the final app architecture.

## Design system asset note
The requested Design System item was exposed by Stitch as a `DESIGN_SYSTEM_INSTANCE` asset stub rather than a normal screen. The Stitch screen API did not return a standalone downloadable screen export for that asset ID.

To avoid losing the design intent, the project-level design system specification was saved to:
- `docs/stitch/design-system-spec.md`

## Screen inventory
- landing-page
- evaluation-dashboard
- evaluation-history
- settings
- policy-management
- help-center
- support-access
- request-service
- add-security-policy-modal
- decision-result
