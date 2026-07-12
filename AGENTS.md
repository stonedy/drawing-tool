# AGENTS.md

## Project Instructions For Codex

Read `PROJECT_CONTEXT.md`, `README.md`, `PRODUCT.md`, and `DESIGN.md` before making substantial changes.

## Working Style

- Keep changes small, focused, and consistent with the existing static HTML/CSS/JS structure.
- Do not introduce a build system, framework, package manager, or dependency unless the user explicitly asks or the need is concrete.
- Preserve the existing product direction: refined, gallery-like, canvas-first, and motion-centered.
- Do not rewrite unrelated files or remove visual reference assets without explicit permission.
- Prefer plain browser APIs and small local helpers over new abstractions.

## UI Rules

- The canvas and strokes are the visual priority.
- Keep controls compact, grouped, and usable.
- Use the existing hard-edged visual language; avoid rounded card-heavy UI unless the design direction changes.
- Keep kinetic teal reserved for active states, playback, progress, and primary action.
- Avoid decorative visual noise and generic whiteboard aesthetics.
- Check responsive behavior after UI changes, especially around `1100px` and `640px` breakpoints.

## Code Rules

- Main app behavior lives in `app.js`.
- Main styling lives in `style.css`.
- Markup lives in `index.html`.
- Keep saved-project compatibility in mind when changing stroke data structures.
- If changing saved data, update `normalizeSavedStroke()` and document the migration behavior.
- Keep `localStorage` key `stroke-replay-project-v1` stable unless the user asks for a breaking storage change.

## Verification

For small documentation-only changes, no runtime test is needed.

For UI or behavior changes:

- Open `index.html` in a browser.
- Draw at least two strokes.
- Test per-stroke play, reverse, loop, hide/show, delete, speed, and reorder.
- Test global play, reverse, loop, speed, and sequence playback.
- Test save, restore, and PNG export.
- Check normal and expanded canvas modes.
- Check desktop and mobile-width layouts.

## Git And Versioning

- Keep old version tags immutable.
- Create new checkpoint tags for new versions, for example `v1.2`.
- Do not use `git push --force`, `git tag -f`, or tag deletion unless explicitly requested.

