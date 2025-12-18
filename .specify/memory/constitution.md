<!--
=== SYNC IMPACT REPORT ===
Version Change: 0.0.0 → 1.0.0 (Initial constitution)
Modified Principles: N/A (new)
Added Sections:
  - Core Principles (3): Speed First, MVP Always, Embrace the Mess
  - Development Philosophy
  - Governance
Removed Sections: All template placeholders replaced
Templates Updated:
  - .specify/templates/plan-template.md ✅ (aligned - Constitution Check is generic)
  - .specify/templates/spec-template.md ✅ (aligned - prioritized user stories support MVP approach)
  - .specify/templates/tasks-template.md ✅ (aligned - MVP/incremental delivery matches constitution)
Follow-up TODOs: None
========================
-->

# Auto-Turkey Constitution

## Core Principles

### I. Speed First

Ship working code fast. Perfection is the enemy of done.

- Favor quick iteration over upfront design
- Working software NOW beats perfect software LATER
- If in doubt, build the simplest thing that could possibly work
- Refactoring is cheap; not shipping is expensive
- Skip ceremony that doesn't directly produce value

**Rationale**: This is a personal project with a single developer. The fastest feedback loop is seeing it run.

### II. MVP Always

Deliver the smallest slice of value as early as possible.

- Every feature starts as its most minimal viable form
- One working path beats three half-finished paths
- MUST be able to demo/use something after each work session
- Cut scope aggressively; add back later if needed
- "Later" is a valid answer for non-critical features

**Rationale**: Early value enables course correction. Shipping partial but working is better than complete but stuck.

### III. Embrace the Mess

Technical debt is a tool, not a sin.

- TODO comments are acceptable breadcrumbs
- Hardcoded values are fine until they're not
- Copy-paste now, abstract later (if ever)
- Tests are welcome but NOT mandatory gates
- Documentation follows code, never blocks it

**Rationale**: Solo projects die from over-engineering, not from messy code. Clean up when it hurts, not before.

## Development Philosophy

**Build → Demo → Learn → Repeat**

1. Start with the user-facing outcome you want
2. Build the fastest path to that outcome
3. Run it, see it work (or break)
4. Adjust based on what you learned
5. Repeat

**When Stuck**: If something takes more than 30 minutes of research, build a throwaway spike. Delete it and rebuild with knowledge.

**Breaking Changes**: Totally fine. This is pre-1.0 territory. Migrate when necessary, not preemptively.

## Governance

This constitution is a reminder of intent, not a legal document.

- Principles guide decisions but don't block shipping
- Amend freely when the project's needs change
- No approval process required—just update and note why
- If a principle causes friction, the principle is wrong

**Version**: 1.0.0 | **Ratified**: 2025-12-18 | **Last Amended**: 2025-12-18
