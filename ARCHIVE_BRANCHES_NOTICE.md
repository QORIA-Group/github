# ARCHIVE_BRANCHES_NOTICE.md

# Legacy Claude Branches Archive Notice

## Purpose

This document records the audit decision for legacy Claude-generated branches in the public `qorway_technology` repository.

It exists to prevent old exploratory branches from being mistaken for canonical QORWAY architecture or merge-ready product work.

## Canonical branch

```txt
main
```

`main` is the only canonical branch for the public `qorway_technology` repository.

This repository is the public documentation and trust layer for QORWAY Technology.

It should contain public-safe doctrine, public-safe architecture descriptions, standards, examples and high-level system documentation.

It must not contain private runtime implementation, production schemas, private prompts, PolicyCore implementation rules, PulseFlow production contracts, GreenCore routing logic, private Domain Pack internals, tenant data or proprietary execution logic.

## Legacy branches audited

The following branches are classified as legacy explorations:

```txt
claude/provider-consumer-routing-9z5kF
claude/setup-qoria-backend-9IO4n
```

## Decision

These branches must not be merged into `main`.

They must not be used as canonical QORWAY architecture.

They must not be used as the base for public product implementation.

They must not be used to define current QORWAY naming, repo boundaries, runtime architecture or product roadmap.

## Why these branches are legacy

The branches were generated during an earlier exploratory phase.

They contain implementation attempts and architectural drafts that predate the current repository separation and QORWAY doctrine.

They may include old or unstable concepts such as:

```txt
QORIA naming
Kyra
Ascend / Ascendia
Nexus
provider / consumer routing
frontend dashboard implementation
backend runtime services
NestJS implementation drafts
Prisma / Neo4j implementation drafts
Atlas service drafts
PulseFlow gateway drafts
tenant isolation experiments
RBAC experiments
```

Some of these ideas may still be useful.

However, the branches themselves are not canonical.

## Current repository separation

The current QORWAY / ODC ecosystem separation is:

```txt
qorway_technology
= public documentation, trust layer, public-safe architecture, public examples

qorway-core-private
= protected IP, internal specifications, private architecture, core standards, proprietary doctrine

qorway-platform
= future runtime implementation for Atlas, PolicyCore, PulseFlow, GreenCore and related services

odc-agentic-decision-center
= ODC dogfooding cockpit, operating decision layer, agents, tasks, decisions, validation and execution loops
```

## Runtime boundary

Runtime implementation does not belong in the public `qorway_technology` repository.

Any executable runtime work related to:

```txt
Atlas
PolicyCore
PulseFlow
GreenCore
Knowledge Graph services
Domain Pack execution
multi-tenant runtime
RBAC / tenant isolation
production APIs
frontend product dashboards
```

belongs in a private or platform repository after architectural review.

## Extraction rule

Ideas may be extracted from legacy branches only after review.

Before extracting anything, ask:

```txt
Does this asset belong in public documentation, private core IP, future platform runtime, or ODC dogfooding?
```

Then route it correctly:

```txt
Public-safe concept → qorway_technology
Protected specification → qorway-core-private
Executable runtime → qorway-platform
ODC operating cockpit logic → odc-agentic-decision-center
```

## Do not merge rule

```txt
Do not merge claude/provider-consumer-routing-9z5kF into main.
Do not merge claude/setup-qoria-backend-9IO4n into main.
```

## Do not use as canonical architecture

The legacy branches must not be treated as:

- canonical QORWAY architecture
- current product roadmap
- current runtime design
- current Atlas implementation
- current PulseFlow implementation
- current backend structure
- current frontend structure
- current tenant isolation strategy
- current public documentation source

## Recommended cleanup

After this notice is merged, the legacy branches may be deleted to keep GitHub clean.

If deletion is not immediate, keep this notice as the audit record explaining why the branches must remain unmerged.

## Final decision

```txt
main = canonical public QORWAY documentation branch
legacy Claude branches = archived explorations only
runtime implementation = private/platform repositories only
```
