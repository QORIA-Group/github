# Typography

QORWAY typography separates strategic readability from system traceability.

## Type roles

| Role | Typeface | Usage |
|---|---|---|
| Display | Space Grotesk | Strategic titles, module names, executive surfaces |
| Body | Inter | Product copy, explanations, decision descriptions |
| Mono | IBM Plex Mono | Logs, IDs, traces, timestamps, runtime states, policy labels |

## Hierarchy

```text
Display: 64px / 0.95 / -0.04em / 700
H1:      48px / 1.00 / -0.035em / 700
H2:      32px / 1.10 / -0.025em / 600
Body:    15px / 1.55 / 0 / 400
Label:   11px / 1.20 / 0.08em / uppercase / mono
Data:    13px / 1.45 / mono
```

## Rules

- Use Display typography sparingly.
- Use Mono for evidence, not decoration.
- Use uppercase mono labels for infrastructure states.
- Do not use playful or rounded typefaces.
- Never render audit logs in decorative typography.

## Interface examples

```text
ATLAS · Causal Intelligence Engine
PolicyCore · Constraint Validation Layer
TRACE-EU-2026-04A9
TENANT-SCOPED · EU-WEST · APPROVED
```
