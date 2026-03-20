# Stitch Design System — Aegis Treasury Guardrails

Source:
- Stitch project: Aegis Treasury Guardrails
- Project ID: 13407833628408608308
- Captured from project-level `designMd`

Note:
The requested Design System entry was exposed by Stitch as a `DESIGN_SYSTEM_INSTANCE` asset stub rather than a normal screen export. The Stitch screen API did not return a downloadable standalone screen for that asset ID, so this design spec is stored as the canonical fallback reference for implementation.

---

# Design System Specification: Enterprise Treasury Excellence

## 1. Overview & Creative North Star: “The Sovereign Vault”

The Creative North Star for this design system is “The Sovereign Vault.” In the volatile world of crypto-native treasury management, the UI must act as a stabilizing force. We are moving away from the “neon-on-black” aesthetic of retail trading and toward a high-end editorial experience that evokes the quiet confidence of a private Swiss bank or a high-security physical vault.

### The Editorial Shift
To break the “standard dashboard” template, we utilize intentional asymmetry and tonal depth. Large, authoritative headlines in Manrope create a sense of permanence, while Inter provides technical precision for data. Elements do not merely sit on a grid; they are layered like sheets of obsidian and frosted glass, creating a sense of “Private Cognition”—a space where a treasurer can think deeply without visual noise.

## 2. Colors & Surface Philosophy

The palette is built on deep charcoal and graphite, using light not as a decoration, but as a functional tool to guide the eye toward “Trusted Actions.”

### The “No-Line” Rule
Do not use 1px solid borders for sectioning. Structural boundaries should be defined primarily through background color shifts or tonal transitions.

Core surface colors:
- Surface: `#131313`
- Surface Container Low: `#1C1B1B`
- Surface Container Highest: `#353534`

### Surface Hierarchy & Nesting
Treat the UI as physical layers.
- Layer 0: `surface`
- Layer 1: `surface_container_low`
- Layer 2: `surface_container` or `surface_container_high`
- Layer 3: `surface_bright` with backdrop blur

### The “Glass & Gradient” Rule
Primary CTAs and high-level treasury summaries should use subtle gradients. Floating elements should use semi-transparent dark surfaces with blur to preserve the premium glassmorphism aesthetic.

## 3. Typography: The Authority Scale

Dual-typeface strategy:
- Manrope for authority and editorial framing
- Inter for technical clarity and dense UI information

Suggested roles:
- Display Large: Manrope, 3.5rem
- Headline Small: Manrope, 1.5rem
- Title Medium: Inter, 1.125rem
- Body Medium: Inter, 0.875rem
- Label Small: Inter, 0.6875rem

## 4. Elevation & Depth: Tonal Layering

Traditional shadows should be minimized. Depth is created through:
- tonal stacking
- ambient light
- material layering

### Ambient Shadows
For floating effects:
- Blur: 40px
- Opacity: 6%
- Use tinted dark greys instead of pure black

### Ghost Border Fallback
If a boundary is needed for accessibility, use a low-opacity outline variant rather than a hard divider.

## 5. Component Guidelines

### Buttons
- Primary: `primary_container` background, no explicit border, slight glow on hover
- Secondary: transparent background with ghost border
- Tertiary: text-only action

### Input Fields
Avoid heavy boxed inputs. Prefer dark recessed fields with subtle bottom emphasis and a teal-focused state.

### Cards & Lists
Avoid divider lines. Use spacing and alternating tonal shifts instead.

### Critical Safety Chips
- Trust / Success: teal with light opacity background
- Warning: amber with light opacity background
- Information: icy blue with light opacity background

### Cognition Metric
A specialized metric card with large Manrope values and compact Inter metadata, designed to feel like a premium treasury intelligence panel.

## 6. Do’s and Don’ts

### Do
- Use negative space aggressively
- Use muted professional accents
- Keep shapes architectural and confident

### Don’t
- Use retail/degen-style neon palettes
- Overuse rounded-full primary controls
- Use full-white text against dark backgrounds

## 7. Spacing & Rhythm

Premium feel depends on consistent spacing.
- Container padding: generous
- Internal component gap: compact and consistent
- Section margin: large enough to create editorial “chapters” in the dashboard

## Theme tokens captured from Stitch

Primary accent:
- `#2DD4BF`

Secondary accent:
- `#60A5FA`

Tertiary accent:
- `#F59E0B`

Neutral foundation:
- `#121212`

Fonts:
- Headline: Manrope
- Body: Inter
- Labels: Inter
