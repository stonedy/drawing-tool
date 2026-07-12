# Stroke Replay Project Context

## Current Version

The repository currently has Git tags `v1.0` and `v1.1`.

Use tags as immutable checkpoints. Do not overwrite old version tags; create new tags such as `v1.2`, `v1.3`, and so on.

## Project Goal

Stroke Replay is a browser-based experimental drawing tool where every drawn stroke remains alive after creation. Strokes can be replayed, reversed, looped, hidden, reordered, timed, saved, restored, and exported.

The product is for designers and artists who want a lightweight creative space for kinetic line work, not a full illustration suite or generic whiteboard.

## Product Direction

The intended feel is a refined, gallery-like studio for process-based drawing.

Core principles:

- Keep the stroke as the hero.
- Treat motion, replay, reverse, loop, timing, and gradients as core creative material.
- Keep controls precise, compact, and composed.
- Avoid generic whiteboard styling, toy-like paint UI, or Photoshop-level complexity.
- Preserve accessibility basics: contrast, focus states, keyboard-operable controls where practical, and reduced-motion support for non-essential UI motion.

## Tech Stack

This is a static frontend project:

- `index.html` defines the application shell and controls.
- `style.css` contains the full visual system, layout, responsive behavior, and expanded canvas mode.
- `app.js` contains drawing, stroke state, playback, saving/restoring, export, gradients, and stroke list behavior.
- `README.md`, `PRODUCT.md`, and `DESIGN.md` document the product and design direction.

There is no package manager, build step, backend, or framework at the moment.

## How To Run

Open `index.html` directly in a browser.

If a local server is preferred, run one from the project root, then open the served page:

```bash
python3 -m http.server 8000
```

## Main Features

- Canvas drawing with pointer input.
- Brush color and width controls.
- Optional gradient strokes with editable gradient colors.
- Per-stroke replay, reverse, loop, speed, hide/show, delete, and progress display.
- Global play, reverse, loop, speed, and sequence playback controls.
- Stroke selection from the canvas or stroke list.
- Stroke reordering in the index.
- Expandable canvas/workspace mode.
- Project save and restore through browser `localStorage` using key `stroke-replay-project-v1`.
- PNG export.

## Important Implementation Notes

- Stroke state lives in the `strokes` array in `app.js`.
- Each stroke stores point data, color/gradient settings, width, visibility, playback state, speed, and progress.
- Rendering is canvas-based and driven by `drawScene()`, `drawStroke()`, `updatePlayback()`, `updateTimeline()`, and `animationLoop()`.
- Saved projects are normalized by `normalizeSavedStroke()` before restore.
- The current UI uses hard-edged panels, warm neutral surfaces, and kinetic teal as the primary active/action color.

## Design Files And Visual References

The repo contains several PNG/SVG visual references from prior UI exploration and checks. Keep them unless the user explicitly asks to clean them up; they document design iterations and verification states.

Key design documents:

- `PRODUCT.md`: product audience, purpose, brand personality, and design principles.
- `DESIGN.md`: design system, colors, typography, component rules, and anti-patterns.

## Versioning Rules

Use this checkpoint flow:

```bash
git status
git add -A
git commit -m "v1.2 checkpoint"
git tag -a v1.2 -m "v1.2 checkpoint"
git push origin HEAD
git push origin v1.2
```

Never force-move or delete old version tags unless the user explicitly requests it and understands the consequence.

