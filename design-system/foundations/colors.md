# Colors

QORWAY uses a restrained sovereign palette built around authority, technical sophistication, and constraint visibility.

## Primary palette

| Token | Hex | Role |
|---|---:|---|
| Carbon Black | `#0E0E0D` | Main authority background |
| Void Black | `#050505` | Deep runtime background |
| Graphite | `#151513` | Dark panels and cards |
| System Ivory | `#F3F0E6` | Primary light surface and dark-mode text |
| Warm Sand | `#E6DCC8` | Secondary light surface |
| Sovereign Olive | `#2E3428` | Infrastructure, governance, stability |
| Copper Earth | `#9A4F36` | PolicyCore only: constraints, rules, modifications, violations |

## PolicyCore color rule

Copper / Terracotta is reserved for PolicyCore and constraint-sensitive states.

Use Copper Earth for:

- PolicyCore module identity
- constraint warnings
- modified decisions
- rule editor borders
- execution locks
- required human approval

Do not use Copper Earth for generic CTAs, marketing accents, decorative charts, or non-policy highlights.

## Semantic colors

Semantic states must never rely on color alone. Always pair them with text labels.

```text
APPROVED = success + label
MODIFIED = copper + label
REJECTED = danger + label
PENDING = neutral + label
LOCKED = copper + label
```

## Accessibility

- Body text must meet WCAG AA contrast.
- Mono labels must not be smaller than 11px in public documentation or 12px in production logs.
- Critical states require explicit labels, not color-only indication.
