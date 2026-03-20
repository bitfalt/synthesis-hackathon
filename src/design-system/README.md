# Aegis Design System

This file is the code-facing design guide for agents and collaborators.

## Creative north star
The design language is "The Sovereign Vault".
The UI should feel like a private treasury intelligence console: calm, high-trust, dark, editorial, and structured.

## Non-negotiable visual rules
- Prefer tonal layering over heavy line separation.
- Use teal only for trust, primary action, and strategic emphasis.
- Use amber for warnings and review thresholds.
- Use icy blue for supporting data and secondary interaction.
- Avoid retail-trading neon aesthetics.
- Avoid random rounded-full styling for major controls.
- Use Manrope for authority-heavy headings and Inter for dense UI/body content.

## Structural rules
- Layer 0: foundation background
- Layer 1: shell sections
- Layer 2: panels and cards
- Layer 3: glass overlays, modals, and highlighted intelligence surfaces

## Component guidance
- Buttons should come from shared UI primitives.
- Inputs should use recessed dark surfaces and subtle focus states.
- Metrics should use strong headline typography and compact supporting metadata.
- Lists should separate items with spacing and tonal shifts rather than heavy borders.

## Implementation rule
Do not copy-paste raw Stitch HTML into routes.
Always extract repeatable structures into reusable TSX components or shared style recipes first.
