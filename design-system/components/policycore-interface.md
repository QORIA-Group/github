# PolicyCore Interface

PolicyCore is the constraint validation layer of QORWAY.

## Purpose

PolicyCore determines whether a decision is allowed to move toward execution.

It may return:

```text
APPROVED
MODIFIED
REJECTED
```

## Visual rule

Copper Earth is reserved for PolicyCore.

Use Copper Earth for:

- rule editor borders
- execution locks
- modified decisions
- rejected decisions
- constraint warnings
- required approvals

## Interface anatomy

```text
Header:
- PolicyCore label
- validation state
- execution lock state

Left panel:
- rule library
- policy scope
- tenant boundary

Main panel:
- rule editor
- validation result
- constraint explanation

Right panel:
- decision candidate
- required approvals
- affected execution path
- audit metadata
```

## Critical UX rule

```text
No PolicyCore validation → no PulseFlow execution.
```

## Microcopy

```text
Execution locked.
PolicyCore validation is required before PulseFlow can orchestrate this decision.
```

## Public-safe rule example

```text
If a decision is high-impact, requires EU-scoped execution, or affects regulated outcomes, human oversight may be mandatory before execution release.
```

## Private boundary

Do not expose in public:

- production PolicyCore rules
- thresholds
- tenant policies
- exact compliance logic
- internal constraint scoring
- bypass prevention implementation
