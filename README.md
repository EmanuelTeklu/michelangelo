# Michelangelo

Personal aesthetic agent. Learns taste through observation and dialogue, executes aesthetic decisions, and evolves its own methods over time. Sub-agent under Jane.

## What It Is

A self-improving aesthetic system that operates at two layers:

- **Object layer** — Iterates on designs: colors, typography, spacing, components
- **Meta layer** — Iterates on its own mechanisms for observing, analyzing, and proposing designs

Both layers evolve through the same validation method: rendered visual output at sufficient scale, judged by Emanuel. Not descriptions. Not text diffs. Real visuals.

## Core Principles

1. **Behavior is the primary signal.** What Emanuel produces matters more than what he declares. The system observes real outputs and detects patterns.
2. **Two-layer iteration.** Designs evolve. The system's methods for producing designs also evolve. Both require validation.
3. **Visual validation at scale.** All proposals are judged by rendered output at sufficient fidelity. Token changes show full pages. Component changes show neighborhoods. System changes show entire views.
4. **Iterative dialogue.** Works with Emanuel, not ahead of him. Component by component, decision by decision.
5. **Transparent self-modification.** Mechanism upgrades are shown as side-by-side rendered output — current system vs proposed system on the same input. Pick based on what you see.

## Architecture

### Taste Memory (Hybrid)

**Structured Profile** — Git-tracked YAML. Human-readable, directly editable.

```
taste-profile/
  principles.yaml      # High-level rules
  palette.yaml         # Color preferences, contrast, usage
  typography.yaml      # Fonts, scale, weight
  spacing.yaml         # Rhythm, density, breathing room
  anti-patterns.yaml   # Explicit rejections
```

**Reference Embeddings** — Visual examples in a vector store for pattern matching. Captures nuance that rules can't articulate.

```
references/
  approved/            # Designs Emanuel liked
  rejected/            # Things he said no to
  index.json           # Metadata + embedding refs
```

### Mechanism Registry

Every method Michelangelo uses is a named, swappable, independently-runnable module.

Mechanism types:
- **Observation** — How it watches outputs (git diffs, screenshots, density scans)
- **Analysis** — How it interprets observations against taste profile
- **Proposal** — How it generates design suggestions
- **Rendering** — How it produces visual previews

Each mechanism can run in isolation, produces standardized output, and executes non-destructively.

### Mechanism Evolution

When Michelangelo develops a potentially better approach:

1. Run **current mechanism** against target input → rendered visual
2. Run **proposed mechanism** against same input → rendered visual
3. Present both side by side at sufficient scale
4. Emanuel picks based on what he sees
5. Winner replaces the current mechanism if promoted

### Session Flow

1. **Analyze** — Read target project's styles (Tailwind, CSS, components)
2. **Compare** — Diff current state against taste profile + embeddings
3. **Prioritize** — Rank gaps by aesthetic impact
4. **Walk** — Present changes one at a time with before/after renders
5. **Capture** — Record accept/reject/modify, update taste memory
6. **Apply** — Execute approved changes as code
7. **Reflect** — Surface patterns that suggest profile updates or mechanism improvements

### Feedback Loop

```
Emanuel produces work
       ↓
Michelangelo observes
       ↓
Detects patterns / gaps
       ↓
Surfaces proposals (rendered visual output)
       ↓
Emanuel validates
  ├── Accept → apply + update profile
  ├── Reject → update anti-patterns
  └── Modify → refine + capture nuance
```

Operates at both layers. Object: "this badge should be sharp-cornered." Meta: "screenshot comparison catches more than CSS diffing."

### Output Adapters

- Tailwind config patches
- CSS variable updates
- Component code patches
- Figma token export
- Visual preview renders

## V1 Scope

**First job:** Style IronWatch Dashboard through iterative dialogue.

**V1 capabilities:**
- Read and analyze React/Tailwind project aesthetic state
- Maintain structured taste profile (YAML)
- Walk components iteratively with before/after visual previews
- Accept/reject/modify feedback loop
- Apply approved changes as code

**V1 deferred:**
- Vector embeddings (start with structured profile only)
- Autonomous output observation (start with explicit sessions)
- Full mechanism A/B testing (start with fixed set, evolve manually)
- Non-UI aesthetic domains

## Integration with Jane

Jane delegates aesthetic decisions to Michelangelo. Michelangelo returns approved design changes, taste profile updates, or mechanism upgrade proposals. Jane does not override Michelangelo's aesthetic domain. Michelangelo does not make non-aesthetic decisions.
