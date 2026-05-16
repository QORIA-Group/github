# Repository Boundary

**QORWAY Technology — Cross-Repository Responsibility Map**

> Each repository has a distinct role. Confusing those roles creates documentation drift, implementation ambiguity, and technical debt.

---

## 1. Purpose

This document defines the public-safe boundary between the main QORWAY repositories and related operating surfaces.

It exists to prevent duplicate source-of-truth documents, private architecture leakage into public materials, website claims unsupported by public documentation, ODC service logic being confused with QORWAY runtime architecture, and public documentation drifting away from the private core.

---

## 2. Repository Responsibility Matrix

| Surface | Role | Must contain | Must not contain |
|---|---|---|---|
| `qorway-core-private` | Private IP core and implementation-preparation source of truth | private specs, runtime-readiness material, Domain Pack internals, registries, ADRs, prompts, internal architecture | public marketing copy, website-only messaging, ODC sales logic |
| `qorway_technology` | Public architecture and trust layer | public-safe architecture, governance doctrine, system overviews, public examples, boundary docs | private implementation internals or tenant-specific material |
| `qorway-technology-website` | Public narrative and conversion surface | simplified public narrative, institutional positioning, trust-building pages, pilot contact flow | private architecture internals, unsupported claims, private repo extracts |
| ODC | Dogfooding cockpit and service-layer evidence | operating evidence, diagnostics, client-facing workflows, advisory delivery artifacts | QORWAY runtime internals, private Domain Pack logic, core infrastructure code |

---

## 3. Source-of-Truth Order

The correct alignment order is:

```text
Private Core → Public Architecture Repository → Public Website → Cross-Repo QA → ODC later
```

Meaning:

1. Private Core defines the deep architecture.
2. Public Repository translates it into public-safe doctrine.
3. Website communicates the public doctrine.
4. Cross-Repo QA checks consistency.
5. ODC is updated only after QORWAY architecture and public narrative are stable.

---

## 4. Public Repository Role

The public repository is not a lite copy of the private core.

It is the public trust layer.

It should explain what QORWAY is, how the architecture is organized, why the layers are separated, how decisions are governed, why tenant boundaries matter, why sovereign resilience matters, how Domain Packs work conceptually, and how public examples illustrate decision traces.

It should not try to be executable.

---

## 5. Website Role

The website must be downstream from this repository.

It may simplify, visualize, and position QORWAY for external audiences.

It must not create new technical doctrine that is absent from the public repository.

---

## 6. ODC Role

ODC is an operating evidence layer and dogfooding surface.

ODC can demonstrate how decision intelligence is used in service delivery.

ODC is not the QORWAY runtime.

ODC materials must not redefine QORWAY architecture.

---

## 7. Final Rule

```text
One architecture.
Four surfaces.
Clear boundaries.
No duplicated source of truth.
```
