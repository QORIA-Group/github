# Runtime Navigation

The runtime navigation is the primary mental model of the QORWAY interface.

```text
Data → Graph → Atlas → Domain Packs → PolicyCore → PulseFlow → GreenCore → Execution → Feedback
```

## Purpose

The navigation must show how a signal becomes a governed decision, how the decision becomes execution, and how execution becomes feedback.

## Required states

```text
inactive
active
completed
blocked
requires-validation
```

## PolicyCore rule

When PolicyCore is active, the navigation may use Copper Earth. Other modules must not use Copper Earth as a dominant accent.

## Public-safe example

```tsx
const runtimeSteps = [
  "Data",
  "Graph",
  "Atlas",
  "Domain Packs",
  "PolicyCore",
  "PulseFlow",
  "GreenCore",
  "Execution",
  "Feedback"
];

export function RuntimeNavigation({ active = "Atlas" }) {
  return (
    <nav aria-label="QORWAY runtime navigation">
      {runtimeSteps.map((step, index) => (
        <button data-active={step === active} key={step}>
          {String(index + 1).padStart(2, "0")} · {step}
        </button>
      ))}
    </nav>
  );
}
```

## UX rule

Users must always understand:

```text
Where the decision is now.
Which layer owns the current state.
What must happen before execution.
```
