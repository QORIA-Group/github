# CI/CD Standards

**QORWAY Decision Intelligence Infrastructure**

> QORWAY does not only release code. It releases decision infrastructure.

---

## 1. Purpose

This document defines the public CI/CD standard for QORWAY.

The goal is to ensure that every release preserves:

- tenant isolation
- causal traceability
- Domain Pack integrity
- PolicyCore validation
- PulseFlow execution reliability
- GreenCore optimization boundaries
- audit readiness
- security posture

QORWAY releases must protect decision integrity, not only software stability.

---

## 2. CI/CD Philosophy

Traditional CI/CD validates:

```text
code → build → deploy
```

QORWAY CI/CD must validate:

```text
code → graph → causal context → constraints → events → execution → feedback
```

A release is not valid if it breaks the Decision Intelligence Loop.

Core principle:

> A bug in QORWAY is not only a software defect. It can become a decision defect.

---

## 3. Release Surfaces

A QORWAY release may affect:

- application code
- system services
- Knowledge Graph structures
- Domain Packs
- causal context
- PolicyCore constraints
- PulseFlow event categories
- GreenCore execution policies
- agent boundaries
- feedback rules
- governance documentation

Each release must declare which system surface it affects.

---

## 4. Branching Model

QORWAY follows a controlled trunk-based development model.

Recommended branches:

```text
main
feat/<feature-name>
fix/<issue-name>
docs/<document-name>
chore/<maintenance-task>
```

Rules:

- `main` represents the stable public or production-ready state.
- all changes should go through pull requests.
- direct commits to `main` should be avoided for system-critical repositories.
- every pull request should include a clear description of system impact.

---

## 5. Pull Request Requirements

Every pull request should include:

- purpose of the change
- affected layer
- risk level
- testing performed
- security impact
- tenant isolation impact
- documentation impact
- rollback considerations

Example affected layers:

```text
Atlas
Domain Packs
PolicyCore
PulseFlow
GreenCore
Knowledge Graph
Security
Documentation
```

A pull request is incomplete if it does not explain how it affects the QORWAY system map.

---

## 6. Validation Gates

Every release should pass validation gates before merge or deployment.

### Gate 1 — Structure & Type Validation

Ensures the system structure remains coherent.

Checks may include:

- linting
- type checking
- schema validation
- documentation formatting
- repository structure validation
- broken link checks
- naming convention validation

A release fails if it breaks structural contracts.

### Gate 2 — Domain Pack Integrity

Ensures Domain Packs remain valid intelligence structures.

Checks should validate:

- clear domain identity
- valid structure
- no private tenant data in public or standard packs
- no orphaned critical concepts
- no decision path without validation context
- no action without execution context
- no measurable outcome without feedback pathway

Core rule:

> A Domain Pack cannot be released if it cannot support an audit-ready decision trace.

### Gate 3 — Causal Reasoning Validation

Ensures decision logic remains causal, explainable, and traceable.

Checks should validate:

- every decision can reference causal lineage
- causal context remains explainable
- impact simulations are linked to outcomes where applicable
- feedback pathways exist for measurable decisions

A release fails if it introduces untraceable reasoning.

### Gate 4 — PolicyCore Constraint Validation

Ensures no decision path bypasses governance.

Checks should validate:

- decisions requiring validation are routed through PolicyCore
- rejected decisions cannot move to execution
- modified decisions preserve modification trace
- human approval constraints are enforced where required
- tenant policies are respected

Core rule:

```text
No PolicyCore validation → no PulseFlow execution.
```

### Gate 5 — PulseFlow Event Validation

Ensures execution remains event-driven, traceable, and replayable.

Checks should validate:

- event structures remain coherent
- execution references decision context
- execution paths produce audit logs
- feedback events exist for measurable outcomes
- consumers are idempotent where required

A release fails if it creates execution without traceability.

### Gate 6 — GreenCore Routing Validation

Ensures execution optimization remains within approved boundaries.

Checks should validate:

- GreenCore cannot override PolicyCore
- sensitive workloads remain within approved execution zones
- routing decisions are logged
- carbon or compute traces are produced where required
- tenant execution policies are respected

Core rule:

> GreenCore optimizes approved execution paths only.

### Gate 7 — Security & Tenant Isolation

Ensures the release does not compromise sovereignty or security.

Checks should validate:

- no secrets committed
- no sensitive data included in public repositories
- no cross-tenant access path
- no private tenant data in standard assets
- access control rules remain intact
- logs avoid unnecessary sensitive data exposure

A release fails immediately if tenant isolation is weakened.

### Gate 8 — Feedback Loop Validation

Ensures execution outcomes can update the system safely.

Checks should validate:

- execution produces outcome signals where required
- feedback maps back to decisions
- feedback updates are tenant-scoped
- feedback cannot leak into shared structures without governance

A release fails if it breaks the learning loop.

---

## 7. Deployment Strategy

For production-grade systems, QORWAY should use controlled deployment strategies.

Recommended models include:

- blue / green deployment
- canary deployment
- staged rollout
- feature flags for critical logic
- rollback-ready migrations

Critical changes should never be deployed without rollback planning.

---

## 8. Migration Rules

Schema, graph, or Domain Pack changes require special care.

Rules:

- migrations must be versioned
- destructive migrations require approval
- graph changes should preserve historical traceability
- Domain Pack changes must declare version impact
- tenant graph migrations must preserve isolation
- rollback paths must be documented
- audit data must not be deleted silently

Core rule:

> Never break historical decision traceability.

---

## 9. Public Repository CI/CD

For public repositories, CI/CD should focus on:

- Markdown validation
- broken link checks
- file structure checks
- secret scanning
- no internal-only terms accidentally exposed
- no private Domain Pack content
- no prompts or proprietary implementation logic

Public repositories build trust.

They should never expose the moat.

---

## 10. Private Repository CI/CD

For private repositories, CI/CD should validate:

- source code
- schemas
- prompts
- Domain Packs
- causal rules
- constraints
- event contracts
- tests
- deployment artifacts
- security scans

Private repositories protect implementation and IP.

They may contain the real system logic.

---

## 11. AI-Assisted Development Rules

AI-generated code or documentation must be treated as untrusted until validated.

AI-assisted changes must pass the same gates as human-written changes.

AI must not:

- create unscoped tenant access
- introduce hidden execution paths
- bypass PolicyCore
- create events without audit metadata
- expose private prompts
- expose Domain Pack internals in public repositories
- weaken security or governance language
- invent unsupported system behavior

Core rule:

> AI can assist generation. It cannot approve architecture.

---

## 12. Rollback Conditions

A release should be rolled back if it causes:

- tenant isolation failure
- PolicyCore validation failure
- PulseFlow execution failure
- GreenCore routing violation
- missing audit trails
- broken decision lineage
- graph schema incompatibility
- security incident
- Domain Pack misclassification
- feedback loop corruption

---

## 13. Monitoring After Release

After release, the system should monitor:

- error rates
- execution failures
- PolicyCore rejections
- PulseFlow dead letter events
- GreenCore routing anomalies
- latency by layer
- tenant boundary violations
- missing feedback events
- audit trace completeness
- unexpected causal drift

Monitoring must include decision integrity signals, not only infrastructure health.

---

## 14. What QORWAY CI/CD Is Not

QORWAY CI/CD is not:

- deployment automation only
- a build pipeline only
- a software release checklist
- a DevOps afterthought
- a speed optimization tool

It is a decision integrity protection system.

---

## 15. Final Statement

QORWAY CI/CD protects the integrity of the full decision lifecycle:

```text
data → graph → reasoning → constraints → execution → feedback
```

> QORWAY releases must never break decision integrity.

---

© 2026 Nicole Valey. QORWAY Technology is a proprietary project created and owned by Nicole Valey. All rights reserved.
