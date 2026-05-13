# Layout

QORWAY layout must feel controlled, infrastructural, and audit-ready.

## Grid

Executive interfaces use a 12-column grid.

```text
Max width: 1440px
Outer margin: 32px
Gutter: 24px
```

Developer interfaces use a 16-column grid.

```text
Left navigation: 280px
Right inspector: 360px
Main canvas: flexible
```

## Surface levels

```text
Level 0: application background
Level 1: navigation shell
Level 2: workspace surfaces
Level 3: cards and panels
Level 4: inspectors and overlays
Level 5: critical decision modals
```

## Runtime layout rule

The interface should follow the decision runtime sequence:

```text
Data → Graph → Atlas → Domain Packs → PolicyCore → PulseFlow → GreenCore → Execution → Feedback
```

This sequence should drive navigation, timelines, trace pages, and validation flows.

## Main screen families

### Executive Command Center

```text
Top Bar: tenant, region, runtime status, audit status
Left Rail: command center, decision portfolio, sovereignty monitor, PolicyCore, execution, audit
Main Area: KPIs, causal map, critical decisions, execution stream
Right Inspector: selected decision, causal explanation, policy status, audit metadata
```

### Developer Console

```text
Top Bar: runtime, environment, tenant, API status
Left Rail: events, graph, decision objects, policies, domain packs, logs, audit
Main Area: code / event / rule / graph workspace
Right Inspector: schema summary, validation result, trace metadata
```
