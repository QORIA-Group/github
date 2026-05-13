# Atlas Visualizer

The Atlas Visualizer exposes causal decision paths in a public-safe way.

## Purpose

Atlas does not display hidden reasoning or internal chain-of-thought. It displays structured causal explanation and evidence paths.

## Public-safe causal path

```text
Source Signal
↓
Graph Activation
↓
Causal Chain
↓
Decision Candidate
↓
Expected Impact
```

## Required sections

```text
Activated signal
Graph context
Causal path
Decision candidate
Expected outcome
Required validation
Trace reference
```

## Example

```text
Signal:
Operational delay detected in tenant workflow.

Graph context:
Delay linked to dependency risk and delivery exposure.

Atlas reasoning:
Mitigation path required to reduce execution drift.

Decision candidate:
Prepare rerouting workflow with human oversight.

Validation:
PolicyCore required before execution.
```

## UX rules

- Never expose internal prompts.
- Never expose hidden reasoning traces.
- Never show Atlas as an autonomous executor.
- Always state when PolicyCore validation is required.
- Always distinguish reasoning from execution.

## Core statement

```text
Atlas reasons. PolicyCore validates. PulseFlow executes.
```
