# Sovereignty KPI Card

A Sovereignty KPI Card monitors the health, traceability, and sovereignty of a decision system.

## Purpose

This component is designed for executive command centers. It must not look like a generic SaaS analytics card.

## Anatomy

```text
Header:
- module label
- sovereignty status

Metric:
- main value
- delta

Causal note:
- why it changed

Trace:
- decision ID / event ID / tenant boundary

Footer:
- PolicyCore status
- execution region
```

## Required fields

```text
label
value
delta
causal explanation
trace ID
PolicyCore status
execution region
tenant scope
```

## Example copy

```text
Decision Trace Coverage
98.6%
+2.4% over last cycle
Coverage increased after PolicyCore enforced mandatory causal lineage on all high-impact decisions.
TRACE-EU-2026-04A9
APPROVED · EU-West
```

## UX rules

- Always include a causal note.
- Always include a trace reference.
- Always show tenant scope.
- Never show a metric without explaining why it changed.
- Use Copper Earth only when the card references PolicyCore modification, rejection, or execution lock.
