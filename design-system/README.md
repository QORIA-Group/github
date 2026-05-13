# QORWAY Design System

**Sovereign Decision Intelligence Interface Standard**

QORWAY is not a SaaS dashboard, chatbot, CRM, or analytics interface. The interface language must express a governed decision infrastructure runtime for sovereign, causal, constrained, executable, and auditable intelligence.

## Core design principles

1. **Sovereignty by design**  
   The interface must make data control, tenant boundaries, EU execution scope, and infrastructure independence visible by default.

2. **Causality over correlation**  
   QORWAY surfaces why a decision exists, which signal activated it, which graph context matters, and which causal path led to the recommendation.

3. **Constraint by architecture**  
   No critical action should appear executable before PolicyCore validation. PolicyCore is the authority layer, not a secondary settings panel.

4. **Auditability by default**  
   Every critical screen must allow reconstruction of the decision trace: signal, graph, Atlas reasoning, Domain Pack context, PolicyCore validation, PulseFlow orchestration, GreenCore optimization, execution, feedback, and learning.

## Runtime navigation model

```text
Data → Graph → Atlas → Domain Packs → PolicyCore → PulseFlow → GreenCore → Execution → Feedback
```

This sequence is the interface backbone. Product navigation, screen hierarchy, decision states, and audit views must follow this runtime logic.

## Libraries

QORWAY supports two interface modes:

- **Light Library — Sovereign Minimal**: documentation, public-facing architecture, executive overviews.
- **Dark Library — Protected Intelligence**: runtime consoles, decision review, PolicyCore, audit, developer tooling.

## Public-safe scope

This public design system includes:

- foundations
- visual tokens
- public-safe component descriptions
- UX patterns
- non-sensitive interface language

It does not include:

- production frontend code
- private PolicyCore logic
- tenant-specific state machines
- internal scoring systems
- causal rule libraries
- private execution permissions
- real customer or tenant traces

## Folder structure

```text
design-system/
├── README.md
├── foundations/
│   ├── colors.md
│   ├── typography.md
│   ├── layout.md
│   ├── iconography.md
│   └── voice-and-microcopy.md
├── tokens/
│   ├── colors.json
│   ├── typography.json
│   ├── spacing.json
│   └── radius.json
└── components/
    ├── runtime-navigation.md
    ├── sovereignty-kpi-card.md
    ├── atlas-visualizer.md
    ├── policycore-interface.md
    └── audit-trail-viewer.md
```

## Final system rule

```text
No decision without trace.
No execution without PolicyCore.
No intelligence without sovereignty.
```
