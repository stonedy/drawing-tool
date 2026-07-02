---
name: Stroke Replay
description: A refined experimental drawing tool where every stroke remains replayable, reversible, and alive.
colors:
  gallery-wash: "#efede6"
  studio-surface: "#fbfaf6"
  canvas-ground: "#fffefa"
  ink: "#161616"
  muted-ink: "#6d6a61"
  quiet-line: "#d8d1c4"
  kinetic-teal: "#0f766e"
  kinetic-teal-deep: "#0b5f59"
  removal-red: "#a13a2f"
  gradient-warm: "#ff4d4d"
  gradient-cool: "#2563eb"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0"
rounded:
  none: "0"
  circular-control: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "10px"
  lg: "14px"
  xl: "20px"
components:
  button-neutral:
    backgroundColor: "{colors.studio-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "38px"
    padding: "0 12px"
  button-primary:
    backgroundColor: "{colors.kinetic-teal}"
    textColor: "{colors.canvas-ground}"
    rounded: "{rounded.none}"
    height: "38px"
    padding: "0 12px"
  button-danger:
    backgroundColor: "{colors.studio-surface}"
    textColor: "{colors.removal-red}"
    rounded: "{rounded.none}"
    height: "38px"
    padding: "0 12px"
  stroke-card:
    backgroundColor: "{colors.canvas-ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px"
---

# Design System: Stroke Replay

## 1. Overview

**Creative North Star: "The Kinetic Gallery Desk"**

Stroke Replay is a product UI for artists and designers, not a marketing surface. It should feel like a quiet gallery workbench where line, rhythm, and playback are treated as material. The interface stays restrained so the drawn stroke remains the hero, but the composition must not collapse into ordinary whiteboard blandness.

The system uses familiar product controls with deliberate art-direction: warm studio surfaces, hard-edged panels, compact controls, and a single kinetic accent for action and state. The reference mood is the composed restraint of Units, translated into an actual tool: refined spacing, confident hierarchy, and no decorative excess.

It explicitly rejects a generic whiteboard, a basic paint demo, and any dull utility panel that lacks design or artistic presence.

**Key Characteristics:**
- Restrained product density with gallery-like calm.
- A single kinetic accent for action, motion, and selected state.
- Canvas-first layout: controls frame the work, never compete with it.
- Hard-edged UI surfaces that feel precise rather than playful.
- Progressive disclosure for advanced controls like speed and gradient stops.

## 2. Colors

The palette is a warm neutral studio system with one deep teal action color and deliberately vivid gradient brush seeds.

### Primary
- **Kinetic Teal**: The primary action and active-state color. Use it for selected controls, play states, loop states, range accents, and progress indicators.
- **Deep Kinetic Teal**: The hover and stronger-action state for primary controls.

### Secondary
- **Gradient Warm** and **Gradient Cool**: Default generative brush colors. They belong to artwork and brush configuration, not ordinary chrome.

### Neutral
- **Gallery Wash**: The application background. It should feel like a quiet studio wall, not parchment decoration.
- **Studio Surface**: Toolbar, sidebar, and lightweight control surfaces.
- **Canvas Ground**: The drawing field and stroke-card body surface.
- **Ink**: Primary text and structural UI text.
- **Muted Ink**: Metadata, counters, helper text, and secondary labels.
- **Quiet Line**: Dividers, borders, range tracks, and panel separation.
- **Removal Red**: Destructive actions only.

### Named Rules
**The Stroke-Owns-Color Rule.** Saturated color belongs primarily to the artwork and active states. Do not turn the interface into a rainbow because gradient brushes exist.

**The Teal Means Motion Rule.** Kinetic Teal is reserved for actions and playback state. If everything is teal, nothing is active.

## 3. Typography

**Display Font:** Inter / system sans stack  
**Body Font:** Inter / system sans stack  
**Label/Mono Font:** Same family; no separate mono or display face exists yet.

**Character:** The type system is intentionally product-native: clear, compact, and quiet. Artistic identity comes from composition and motion, not from decorative label typography.

### Hierarchy
- **Display** (700, 24px, 1.1): Application title only.
- **Headline** (700, 18px, 1.2): Sidebar group titles and global control headings.
- **Title** (650, inherited compact size): Stroke names and compact panel headers.
- **Body** (400, 14px, 1.4): General interface text and control content.
- **Label** (500, 13px, 1.2): Metadata, counters, status text, and secondary labels.

### Named Rules
**The Product Sans Rule.** Use one well-tuned sans family across the tool. Do not introduce display fonts into buttons, labels, counters, or stroke controls.

## 4. Elevation

Depth is mostly structural: borders, tonal surfaces, and layout hierarchy do the work. A single broad canvas shadow is allowed to separate the drawing field from the studio surface, but cards and buttons should stay flat by default.

### Shadow Vocabulary
- **Canvas Lift** (`0 18px 50px rgba(22, 22, 22, 0.12)`): Use only on the drawing canvas or a future primary artboard. It is an ambient studio lift, not a generic card shadow.

### Named Rules
**The Flat Controls Rule.** Buttons, stroke cards, panels, and global controls are flat at rest. Use borders and state color before adding shadows.

## 5. Components

### Buttons
- **Shape:** Rectangular, precise, no radius (`0`).
- **Primary:** Kinetic Teal background with Canvas Ground text; used for active playback or selected mode.
- **Hover / Focus:** Hover shifts border or deepens primary color. Focus must remain visible and should use a clear outline or border treatment.
- **Danger:** Same neutral structure as ordinary buttons, with Removal Red text. Destructive actions should not become large red blocks.

### Chips
- **Style:** No separate chip system exists yet. If filter or mode chips are added, they should follow the button vocabulary rather than inventing a new shape.

### Cards / Containers
- **Corner Style:** Hard-edged rectangles (`0`).
- **Background:** Canvas Ground for stroke cards, Studio Surface for tool panels.
- **Shadow Strategy:** No card shadows. The canvas gets the only ambient lift.
- **Border:** Quiet Line borders define containment.
- **Internal Padding:** Compact but breathable: 10-14px in control panels, 20px in primary workspace padding.

### Inputs / Fields
- **Style:** Native color and range inputs are framed by the same neutral panel vocabulary.
- **Focus:** Must be visible and compatible with keyboard use.
- **Disabled:** Lower opacity is acceptable, but text must remain readable enough to identify the disabled command.

### Navigation
- **Style:** There is no navigation system yet. The app is a single tool surface with a top toolbar and side/bottom stroke panel. Future navigation should remain secondary to the canvas.

### Stroke Control Card
Each stroke card is the signature component. It pairs an artwork swatch, stroke metadata, six direct controls, optional speed disclosure, and a progress track. The card should remain compact, scannable, and mechanically consistent across many strokes.

## 6. Do's and Don'ts

### Do:
- **Do** keep the canvas visually dominant; the interface frames the work.
- **Do** use Kinetic Teal for playback, active mode, progress, and selected controls.
- **Do** keep controls dense but grouped, so the tool feels professional rather than sparse.
- **Do** reveal advanced controls progressively, as with speed sliders and gradient stops.
- **Do** preserve baseline accessibility: readable contrast, visible focus, reduced-motion respect, and non-color cues for critical state.

### Don't:
- **Don't** make it feel like a generic whiteboard.
- **Don't** make it feel like a basic browser paint demo.
- **Don't** make it dull, office-like, or without artistic presence.
- **Don't** turn gradient brush color into decorative interface color.
- **Don't** add Photoshop-level complexity or dense professional-suite chrome before the core stroke workflow earns it.
