# Stroke Replay Handoff

## Snapshot

Project: Stroke Replay drawing tool  
Current branch observed: `main` tracking `origin/main`  
Known tags observed: `v1.0`, `v1.1`  
Runtime model: static browser app, opened through `index.html`

## What This Project Is

Stroke Replay is an experimental drawing app for kinetic line work. Users draw strokes on a canvas, then control each stroke as an object: replay, reverse, loop, hide, reorder, adjust speed, save/restore, and export.

The product direction is intentionally refined and gallery-like. It should not become a generic whiteboard, toy paint app, or large professional-suite clone.

## Important Files

- `index.html`: application structure, toolbar, canvas shell, stroke sidebar, and control buttons.
- `style.css`: visual system, layout, responsive breakpoints, expanded mode, stroke cards, toolbar, and reduced-motion handling.
- `app.js`: drawing engine, stroke state, playback, gradients, persistence, export, stroke selection, and list reordering.
- `README.md`: short run description.
- `PRODUCT.md`: target users, product purpose, brand personality, and principles.
- `DESIGN.md`: design tokens, component rules, and visual constraints.
- `PROJECT_CONTEXT.md`: long-lived project summary for future Codex sessions.
- `AGENTS.md`: instructions future Codex sessions should follow.

## Current Capabilities

- Draw strokes with pointer input.
- Select brush color and width.
- Enable gradient strokes and edit gradient stops.
- Replay, reverse, loop, hide, delete, and speed-control individual strokes.
- Use global playback controls for all strokes.
- Play strokes as a sequence.
- Reorder strokes in the stroke index.
- Select strokes from canvas hit testing or the list.
- Save/restore projects through browser `localStorage`.
- Export the canvas as PNG.
- Expand the canvas workspace.

## Key Implementation Details

- The app is framework-free JavaScript.
- Canvas rendering is handled in `app.js`.
- `strokes` is the central in-memory model.
- `STORAGE_KEY` is `stroke-replay-project-v1`.
- Playback is driven by animation frame timing and per-stroke progress values.
- Gradient colors are converted/mixed in HSL for smoother interpolation.
- Responsive styling is handled in `style.css`, with important breakpoints around `1100px` and `640px`.

## How To Continue On Another Machine

1. Clone the GitHub repository on the new machine.
2. Open the project folder in Codex.
3. Ask Codex to read `PROJECT_CONTEXT.md`, `AGENTS.md`, `README.md`, `PRODUCT.md`, and `DESIGN.md` before editing.
4. Open `index.html` in a browser to run the app.

Suggested prompt for a new Codex session:

```text
Please read PROJECT_CONTEXT.md, AGENTS.md, README.md, PRODUCT.md, DESIGN.md, and the current git status before continuing this project.
```

## Versioning And Recovery

Use Git tags as checkpoints:

- `v1.0`
- `v1.1`
- future versions such as `v1.2`

To inspect an old checkpoint:

```bash
git checkout v1.0
```

To develop from an old checkpoint without changing the tag:

```bash
git checkout -b restore-v1.0 v1.0
```

Do not overwrite existing tags. Create a new tag for each checkpoint.

## Suggested Next Tasks

- Confirm the latest UI state on desktop and mobile widths.
- Add any missing manual test notes after a full browser pass.
- If the data model changes, add explicit compatibility notes for saved projects.
- Consider moving older UI exploration screenshots into a clearly named `references/` folder only if the user wants repository cleanup.

