const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const app = document.getElementById("app");
const strokeList = document.getElementById("strokeList");
const emptyState = document.getElementById("emptyState");
const statusText = document.getElementById("status");
const activeCount = document.getElementById("activeCount");
const colorPicker = document.getElementById("colorPicker");
const widthButton = document.getElementById("widthButton");
const widthPanel = document.getElementById("widthPanel");
const widthPicker = document.getElementById("widthPicker");
const widthValue = document.getElementById("widthValue");
const gradientButton = document.getElementById("gradientButton");
const gradientControls = document.getElementById("gradientControls");
const gradientStops = document.getElementById("gradientStops");
const addGradientColor = document.getElementById("addGradientColor");
const undoButton = document.getElementById("undoButton");
const clearButton = document.getElementById("clearButton");
const saveButton = document.getElementById("saveButton");
const restoreButton = document.getElementById("restoreButton");
const exportButton = document.getElementById("exportButton");
const saveStatus = document.getElementById("saveStatus");
const playAllButton = document.getElementById("playAllButton");
const backAllButton = document.getElementById("backAllButton");
const loopAllButton = document.getElementById("loopAllButton");
const speedAllButton = document.getElementById("speedAllButton");
const sequenceAllButton = document.getElementById("sequenceAllButton");
const globalSpeedPanel = document.getElementById("globalSpeedPanel");
const globalSpeedInput = document.getElementById("globalSpeedInput");
const globalSpeedValue = document.getElementById("globalSpeedValue");
const globalSpeedLabel = document.getElementById("globalSpeedLabel");
const extendButton = document.getElementById("extendButton");

let strokes = [];
let currentStroke = null;
let nextId = 1;
let lastFrame = performance.now();
let gradientEnabled = false;
let gradientColors = ["#ff4d4d", "#2563eb"];
let globalSpeed = 1;
let globalLoop = false;
let saveStatusTimer = 0;
let timelinePlaying = false;
let timelineTime = 0;
let selectedStrokeId = null;
let draggedStrokeId = null;
let pointerSorting = false;

const STORAGE_KEY = "stroke-replay-project-v1";

const ICONS = {
  play: '<svg class="svgIcon fillIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7-11-7Z"></path></svg>',
  pause: '<svg class="svgIcon fillIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"></path></svg>',
  reverse: '<svg class="svgIcon fillIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5v14L5 12l11-7Z"></path></svg>',
  loop: '<svg class="svgIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3l4 4-4 4"></path><path d="M3 11V9a2 2 0 0 1 2-2h16"></path><path d="M7 21l-4-4 4-4"></path><path d="M21 13v2a2 2 0 0 1-2 2H3"></path></svg>',
  hide: '<svg class="svgIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"></path><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"></path><path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 9 5 10 8a14.3 14.3 0 0 1-2.1 3.5"></path><path d="M6.4 6.4A14.7 14.7 0 0 0 2 12c1 3 5 8 10 8 1.4 0 2.8-.4 4-1"></path></svg>',
  show: '<svg class="svgIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
  speed: '<svg class="svgIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13a8 8 0 1 1 16 0"></path><path d="M12 13l4-4"></path><path d="M5 20h14"></path></svg>',
  trash: '<svg class="svgIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M10 11v6M14 11v6"></path><path d="M6 7l1 14h10l1-14"></path><path d="M9 7V4h6v3"></path></svg>',
  download: '<svg class="svgIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path></svg>',
  sequence: '<svg class="svgIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h5"></path><path d="M4 12h9"></path><path d="M4 18h5"></path><path d="M16 7v10"></path><path d="m13 14 3 3 3-3"></path></svg>'
};

function setIconButton(button, icon, label) {
  button.innerHTML = ICONS[icon] || `<span aria-hidden="true">${icon}</span>`;
  button.title = label;
  button.setAttribute("aria-label", label);
}

function updateBrushControls() {
  const width = Number(widthPicker.value);
  const colorIcon = document.querySelector(".colorIcon");
  if (colorIcon) colorIcon.style.background = colorPicker.value;
  widthValue.textContent = String(width);
  widthButton.title = `Width ${width}`;
  widthButton.setAttribute("aria-label", `Width ${width}`);
  widthButton.style.setProperty("--brush-width", `${Math.max(2, Math.min(10, width))}px`);
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawScene();
}

function pointerPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    time: performance.now()
  };
}

function normalizeTime(points) {
  if (!points.length) return points;
  const start = points[0].time;
  return points.map((point) => ({ ...point, time: point.time - start }));
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    if (max === g) h = (b - r) / d + 2;
    if (max === b) h = (r - g) / d + 4;
    h *= 60;
  }

  return { h, s, l };
}

function hslToRgb({ h, s, l }) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255
  };
}

function mixColor(startHex, endHex, amount) {
  const start = rgbToHsl(hexToRgb(startHex));
  const end = rgbToHsl(hexToRgb(endHex));
  let hueDelta = end.h - start.h;
  if (hueDelta > 180) hueDelta -= 360;
  if (hueDelta < -180) hueDelta += 360;

  return rgbToHex(hslToRgb({
    h: (start.h + hueDelta * amount + 360) % 360,
    s: start.s + (end.s - start.s) * amount,
    l: start.l + (end.l - start.l) * amount
  }));
}

function gradientColorAt(colors, progress) {
  if (!colors || colors.length === 0) return colorPicker.value;
  if (colors.length === 1) return colors[0];

  const clamped = Math.max(0, Math.min(1, progress));
  const scaled = clamped * (colors.length - 1);
  const index = Math.min(colors.length - 2, Math.floor(scaled));
  const amount = scaled - index;
  return mixColor(colors[index], colors[index + 1], amount);
}

function hueOf(hex) {
  return rgbToHsl(hexToRgb(hex)).h;
}

function strokeGradientColors(colors) {
  const sorted = colors.slice().sort((a, b) => hueOf(a) - hueOf(b));
  const offset = Math.floor(Math.random() * sorted.length);
  const rotated = sorted.slice(offset).concat(sorted.slice(0, offset));
  if (Math.random() < 0.5) rotated.reverse();
  return rotated;
}

function drawStroke(stroke, progress = 1, targetCtx = ctx) {
  if (!stroke.visible || stroke.points.length < 2 || progress <= 0) return;

  const points = stroke.points;
  const clamped = Math.max(0, Math.min(1, progress));
  const segments = [];
  let totalLength = 0;

  for (let i = 1; i < points.length; i += 1) {
    const start = points[i - 1];
    const end = points[i];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    if (length <= 0) continue;
    segments.push({ start, end, length, from: totalLength });
    totalLength += length;
  }

  if (!segments.length) return;

  const targetLength = totalLength * clamped;
  targetCtx.lineCap = "round";
  targetCtx.lineJoin = "round";
  targetCtx.lineWidth = stroke.width;

  for (const segment of segments) {
    if (targetLength <= segment.from) break;
    const amount = Math.min(1, (targetLength - segment.from) / segment.length);
    const x = segment.start.x + (segment.end.x - segment.start.x) * amount;
    const y = segment.start.y + (segment.end.y - segment.start.y) * amount;
    targetCtx.strokeStyle = stroke.gradient
      ? gradientColorAt(stroke.colors, segment.from / totalLength)
      : stroke.color;
    targetCtx.beginPath();
    targetCtx.moveTo(segment.start.x, segment.start.y);
    targetCtx.lineTo(x, y);
    targetCtx.stroke();
  }
}

function distanceToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) return Math.hypot(point.x - start.x, point.y - start.y);

  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
  const x = start.x + t * dx;
  const y = start.y + t * dy;
  return Math.hypot(point.x - x, point.y - y);
}

function findStrokeAtPoint(point) {
  for (let i = strokes.length - 1; i >= 0; i -= 1) {
    const stroke = strokes[i];
    if (!stroke.visible || stroke.points.length < 2) continue;
    const hitDistance = Math.max(12, stroke.width / 2 + 8);
    for (let j = 1; j < stroke.points.length; j += 1) {
      if (distanceToSegment(point, stroke.points[j - 1], stroke.points[j]) <= hitDistance) {
        return stroke;
      }
    }
  }
  return null;
}

function selectStroke(strokeId, scrollIntoView = true) {
  selectedStrokeId = strokeId;
  drawScene();
  renderStrokeList();

  if (scrollIntoView) {
    const item = strokeList.querySelector(`[data-stroke-id="${strokeId}"]`);
    if (item) item.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

function drawStrokeHighlight(stroke, progress = 1, targetCtx = ctx) {
  if (!stroke.visible || stroke.points.length < 2 || progress <= 0) return;

  const points = stroke.points;
  const clamped = Math.max(0, Math.min(1, progress));
  const segments = [];
  let totalLength = 0;

  for (let i = 1; i < points.length; i += 1) {
    const start = points[i - 1];
    const end = points[i];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    if (length <= 0) continue;
    segments.push({ start, end, length, from: totalLength });
    totalLength += length;
  }

  if (!segments.length) return;

  const targetLength = totalLength * clamped;
  targetCtx.save();
  targetCtx.lineCap = "round";
  targetCtx.lineJoin = "round";
  targetCtx.lineWidth = stroke.width + 12;
  targetCtx.strokeStyle = "rgba(23, 22, 17, 0.14)";

  for (const segment of segments) {
    if (targetLength <= segment.from) break;
    const amount = Math.min(1, (targetLength - segment.from) / segment.length);
    const x = segment.start.x + (segment.end.x - segment.start.x) * amount;
    const y = segment.start.y + (segment.end.y - segment.start.y) * amount;
    targetCtx.beginPath();
    targetCtx.moveTo(segment.start.x, segment.start.y);
    targetCtx.lineTo(x, y);
    targetCtx.stroke();
  }

  targetCtx.restore();
}

function drawScene() {
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);

  for (const stroke of strokes) {
    drawStroke(stroke, stroke.progress);
  }

  const selectedStroke = strokes.find((stroke) => stroke.id === selectedStrokeId);
  if (selectedStroke) {
    drawStrokeHighlight(selectedStroke, selectedStroke.progress);
    drawStroke(selectedStroke, selectedStroke.progress);
  }

  if (currentStroke) {
    drawStroke(currentStroke, 1);
  }
}

function strokeDuration(stroke) {
  if (Number.isFinite(stroke.duration) && stroke.duration > 0) {
    return stroke.duration;
  }
  const lastPoint = stroke.points[stroke.points.length - 1];
  return Math.max(350, lastPoint ? lastPoint.time : 350);
}

function stopStroke(stroke, endProgress) {
  stroke.playing = false;
  stroke.progress = endProgress;
  stroke.delayRemaining = 0;
}

function updatePlayback(delta) {
  if (timelinePlaying) {
    updateTimeline(delta);
    return;
  }

  let changed = false;
  let needsRender = false;

  for (const stroke of strokes) {
    if (!stroke.playing) continue;

    if (stroke.delayRemaining > 0) {
      stroke.delayRemaining = Math.max(0, stroke.delayRemaining - delta);
      changed = true;
      continue;
    }

    const step = (delta / strokeDuration(stroke)) * stroke.speed;
    stroke.progress += stroke.direction * step;

    if (stroke.direction === 1 && stroke.progress >= 1) {
      if (stroke.loop) {
        stroke.progress = 1;
        stroke.direction = -1;
        needsRender = true;
      } else {
        stopStroke(stroke, 1);
        needsRender = true;
      }
    }

    if (stroke.direction === -1 && stroke.progress <= 0) {
      if (stroke.loop) {
        stroke.progress = 0;
        stroke.direction = 1;
        needsRender = true;
      } else {
        stopStroke(stroke, 0);
        needsRender = true;
      }
    }

    changed = true;
  }

  if (changed) {
    drawScene();
    needsRender ? renderStrokeList() : updateProgressBars();
  }
}

function animationLoop(now) {
  updatePlayback(now - lastFrame);
  lastFrame = now;
  requestAnimationFrame(animationLoop);
}

function timelineSchedule() {
  let cursor = 0;
  return strokes.map((stroke) => {
    const delay = Math.max(0, Number(stroke.delay) || 0);
    const duration = strokeDuration(stroke);
    const start = cursor + delay;
    const end = start + duration;
    cursor = end;
    return { stroke, start, end, duration };
  });
}

function updateTimeline(delta) {
  const schedule = timelineSchedule();
  if (!schedule.length) {
    timelinePlaying = false;
    updateGlobalControls();
    return;
  }

  timelineTime += delta * globalSpeed;
  let needsRender = false;
  const total = schedule[schedule.length - 1].end;

  for (const { stroke, start, end, duration } of schedule) {
    const wasPlaying = stroke.playing;
    if (timelineTime < start) {
      stroke.progress = 0;
      stroke.playing = false;
      stroke.delayRemaining = 0;
    } else if (timelineTime >= end) {
      stroke.progress = 1;
      stroke.playing = false;
      stroke.delayRemaining = 0;
    } else {
      stroke.progress = Math.max(0, Math.min(1, (timelineTime - start) / duration));
      stroke.playing = true;
      stroke.delayRemaining = 0;
      stroke.direction = 1;
    }
    if (wasPlaying !== stroke.playing) needsRender = true;
  }

  if (timelineTime >= total) {
    timelinePlaying = false;
    for (const stroke of strokes) {
      stroke.playing = false;
      stroke.delayRemaining = 0;
    }
    needsRender = true;
  }

  drawScene();
  needsRender ? renderStrokeList() : updateProgressBars();
}

function renderStrokeList() {
  strokeList.innerHTML = "";
  emptyState.hidden = strokes.length > 0;
  statusText.textContent = `${strokes.length} stroke${strokes.length === 1 ? "" : "s"}`;
  activeCount.textContent = `${strokes.filter((stroke) => stroke.visible).length} visible`;
  undoButton.disabled = strokes.length === 0;
  clearButton.disabled = strokes.length === 0;
  restoreButton.disabled = !localStorage.getItem(STORAGE_KEY);
  updateGlobalControls();

  for (const [index, stroke] of strokes.entries()) {
    const item = document.createElement("section");
    item.className = `strokeItem${stroke.visible ? "" : " hiddenStroke"}${stroke.playing ? " playingStroke" : ""}${stroke.id === selectedStrokeId ? " selectedStrokeItem" : ""}${stroke.id === draggedStrokeId ? " draggingStroke" : ""}`;
    item.dataset.strokeId = String(stroke.id);
    item.draggable = true;
    item.setAttribute("aria-selected", String(stroke.id === selectedStrokeId));

    const title = document.createElement("div");
    title.className = "strokeTitle";
    title.innerHTML = `
      <span class="dragHandle" title="Drag to reorder" aria-label="Playback order ${orderLabel(index + 1)}">
        <span>${orderLabel(index + 1)}</span>
      </span>
      <div class="strokeName">
        <span class="swatch" style="background:${stroke.gradient ? gradientPreview(stroke.colors) : stroke.color}"></span>
        <span>Stroke ${stroke.id}</span>
      </div>
      <span class="strokeMeta">${stroke.points.length} pts</span>
    `;

    const controls = document.createElement("div");
    controls.className = "strokeControls";

    controls.append(
      controlButton(stroke.playing && stroke.direction === 1 ? "Pause stroke" : "Play stroke", stroke.playing && stroke.direction === 1 ? "pause" : "play", () => playStroke(stroke, 1), stroke.playing && stroke.direction === 1),
      controlButton(stroke.playing && stroke.direction === -1 ? "Pause stroke" : "Reverse stroke", stroke.playing && stroke.direction === -1 ? "pause" : "reverse", () => playStroke(stroke, -1), stroke.playing && stroke.direction === -1),
      controlButton(stroke.loop ? "Loop on" : "Loop stroke", "loop", () => toggleLoop(stroke), stroke.loop),
      controlButton(stroke.visible ? "Hide stroke" : "Show stroke", stroke.visible ? "hide" : "show", () => toggleVisible(stroke), false),
      controlButton("Delete stroke", "trash", () => deleteStroke(stroke), false, "danger")
    );

    const progressTrack = document.createElement("div");
    progressTrack.className = "progressTrack";
    progressTrack.innerHTML = `<div class="progressFill" data-stroke-id="${stroke.id}" style="transform:scaleX(${stroke.progress})"></div>`;

    item.append(title, controls);
    item.append(timingPanel(stroke));
    item.append(progressTrack);
    const dragHandle = title.querySelector(".dragHandle");
    dragHandle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      pointerSorting = true;
      draggedStrokeId = stroke.id;
      selectedStrokeId = stroke.id;
      drawScene();
      item.classList.add("draggingStroke");
    });

    item.addEventListener("click", (event) => {
      if (event.target.closest("button, input, label")) return;
      selectStroke(stroke.id, false);
    });
    item.addEventListener("dragstart", (event) => {
      draggedStrokeId = stroke.id;
      selectedStrokeId = stroke.id;
      drawScene();
      item.classList.add("draggingStroke");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(stroke.id));
    });
    item.addEventListener("dragend", () => {
      if (!pointerSorting) draggedStrokeId = null;
      renderStrokeList();
    });
    item.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (!draggedStrokeId || draggedStrokeId === stroke.id) return;
      const rect = item.getBoundingClientRect();
      reorderStroke(draggedStrokeId, stroke.id, event.clientY > rect.top + rect.height / 2);
    });
    item.addEventListener("drop", (event) => {
      event.preventDefault();
      draggedStrokeId = null;
      renderStrokeList();
    });
    strokeList.append(item);
  }
}

function updateGlobalControls() {
  const disabled = strokes.length === 0;
  playAllButton.disabled = disabled;
  backAllButton.disabled = disabled;
  loopAllButton.disabled = disabled;
  speedAllButton.disabled = disabled;
  sequenceAllButton.disabled = disabled;

  const allPlayingForward = strokes.length > 0 && strokes.every((stroke) => stroke.playing && stroke.direction === 1);
  const allPlayingBackward = strokes.length > 0 && strokes.every((stroke) => stroke.playing && stroke.direction === -1);
  setIconButton(playAllButton, allPlayingForward && !timelinePlaying ? "pause" : "play", allPlayingForward && !timelinePlaying ? "Pause all strokes" : "Play all strokes");
  setIconButton(backAllButton, allPlayingBackward ? "pause" : "reverse", allPlayingBackward ? "Pause all strokes" : "Reverse all strokes");
  setIconButton(loopAllButton, "loop", globalLoop ? "Loop all strokes on" : "Loop all strokes");
  setIconButton(sequenceAllButton, timelinePlaying ? "pause" : "sequence", timelinePlaying ? "Pause sequence" : "Play sequence");
  loopAllButton.classList.toggle("primary", globalLoop);
  sequenceAllButton.classList.toggle("primary", timelinePlaying);
  setIconButton(speedAllButton, `${formatSpeed(globalSpeed)}x`, `Speed ${formatSpeed(globalSpeed)}x`);
  globalSpeedLabel.textContent = `${formatSpeed(globalSpeed)}x`;
  globalSpeedValue.textContent = `${formatSpeed(globalSpeed)}x`;
}

function updateProgressBars() {
  for (const stroke of strokes) {
    const fill = strokeList.querySelector(`[data-stroke-id="${stroke.id}"]`);
    if (fill) {
      fill.style.transform = `scaleX(${Math.max(0, Math.min(1, stroke.progress))})`;
    }
  }
}

function gradientPreview(colors) {
  return `linear-gradient(90deg, ${colors.join(", ")})`;
}

function formatSpeed(speed) {
  return Number.isInteger(speed) ? String(speed) : speed.toFixed(2).replace(/0$/, "");
}

function formatSeconds(ms) {
  const seconds = ms / 1000;
  return `${Number.isInteger(seconds) ? seconds : seconds.toFixed(2).replace(/0$/, "")}s`;
}

function orderLabel(order) {
  return String(order).padStart(2, "0");
}

function timingPanel(stroke) {
  const panel = document.createElement("div");
  panel.className = "timingPanel";
  panel.innerHTML = `
    <label>
      <span>Delay</span>
      <input type="range" min="0" max="5" step="0.1" value="${(stroke.delay || 0) / 1000}" aria-label="Delay for Stroke ${stroke.id}">
      <em>${formatSeconds(stroke.delay || 0)}</em>
    </label>
    <label>
      <span>Draw time</span>
      <input type="range" min="0.25" max="10" step="0.25" value="${strokeDuration(stroke) / 1000}" aria-label="Draw time for Stroke ${stroke.id}">
      <em>${formatSeconds(strokeDuration(stroke))}</em>
    </label>
  `;

  const [delayInput, durationInput] = panel.querySelectorAll("input");
  const [delayValue, durationValue] = panel.querySelectorAll("em");

  delayInput.addEventListener("input", () => {
    stroke.delay = Number(delayInput.value) * 1000;
    delayValue.textContent = formatSeconds(stroke.delay);
  });
  durationInput.addEventListener("input", () => {
    stroke.duration = Number(durationInput.value) * 1000;
    durationValue.textContent = formatSeconds(stroke.duration);
  });

  return panel;
}

function controlButton(label, icon, onClick, primary, extraClass) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "iconButton";
  button.innerHTML = ICONS[icon] || `<span aria-hidden="true">${icon}</span>`;
  button.title = label;
  button.setAttribute("aria-label", label);
  if (primary) button.classList.add("primary");
  if (extraClass) button.classList.add(extraClass);
  button.addEventListener("click", onClick);
  return button;
}

function playStroke(stroke, direction) {
  stopTimeline();
  if (stroke.playing && stroke.direction === direction) {
    stroke.playing = false;
    stroke.delayRemaining = 0;
  } else {
    stroke.direction = direction;
    stroke.playing = true;
    if (direction === 1 && stroke.progress >= 1) stroke.progress = 0;
    if (direction === -1 && stroke.progress <= 0) stroke.progress = 1;
    const startsAtBoundary = (direction === 1 && stroke.progress <= 0) || (direction === -1 && stroke.progress >= 1);
    stroke.delayRemaining = startsAtBoundary ? Math.max(0, Number(stroke.delay) || 0) : 0;
  }

  renderStrokeList();
}

function toggleLoop(stroke) {
  stroke.loop = !stroke.loop;
  if (!stroke.loop && stroke.progress <= 0) {
    stopStroke(stroke, 0);
  }
  if (!stroke.loop && stroke.progress >= 1) {
    stopStroke(stroke, 1);
  }
  renderStrokeList();
}

function deleteStroke(stroke) {
  stopTimeline();
  strokes = strokes.filter((item) => item !== stroke);
  if (selectedStrokeId === stroke.id) selectedStrokeId = null;
  drawScene();
  renderStrokeList();
}

function showSaveStatus(message) {
  saveStatus.textContent = message;
  clearTimeout(saveStatusTimer);
  saveStatusTimer = setTimeout(() => {
    saveStatus.textContent = "";
  }, 1800);
}

function projectSnapshot() {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    nextId,
    brush: {
      color: colorPicker.value,
      width: Number(widthPicker.value),
      gradientEnabled,
      gradientColors: gradientColors.slice()
    },
    global: {
      speed: globalSpeed,
      loop: globalLoop
    },
    strokes: strokes.map((stroke) => ({
      id: stroke.id,
      points: stroke.points,
      color: stroke.color,
      gradient: stroke.gradient,
      colors: stroke.colors,
      width: stroke.width,
      visible: stroke.visible,
      direction: stroke.direction,
      loop: stroke.loop,
      speed: stroke.speed,
      delay: stroke.delay,
      duration: stroke.duration,
      progress: stroke.progress
    }))
  };
}

function saveProject() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projectSnapshot()));
  restoreButton.disabled = false;
  showSaveStatus("Saved");
}

function exportPNG() {
  const rect = canvas.getBoundingClientRect();
  const scale = 2;
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = Math.max(1, Math.floor(rect.width * scale));
  exportCanvas.height = Math.max(1, Math.floor(rect.height * scale));

  const exportCtx = exportCanvas.getContext("2d");
  exportCtx.setTransform(scale, 0, 0, scale, 0, 0);
  exportCtx.fillStyle = "#fff8ea";
  exportCtx.fillRect(0, 0, rect.width, rect.height);

  for (const stroke of strokes) {
    drawStroke(stroke, stroke.progress, exportCtx);
  }

  if (currentStroke) {
    drawStroke(currentStroke, 1, exportCtx);
  }

  const link = document.createElement("a");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.download = `stroke-replay-${stamp}.png`;
  link.href = exportCanvas.toDataURL("image/png");
  link.click();
  showSaveStatus("Exported");
}

function normalizeSavedStroke(stroke) {
  return {
    id: stroke.id,
    points: Array.isArray(stroke.points) ? stroke.points : [],
    color: stroke.color || "#161616",
    gradient: Boolean(stroke.gradient),
    colors: Array.isArray(stroke.colors) && stroke.colors.length ? stroke.colors : [stroke.color || "#161616"],
    width: Number(stroke.width) || 5,
    visible: stroke.visible !== false,
    playing: false,
    direction: stroke.direction === -1 ? -1 : 1,
    loop: Boolean(stroke.loop),
    speed: Number(stroke.speed) || 1,
    delay: Math.max(0, Number(stroke.delay) || 0),
    delayRemaining: 0,
    duration: Number(stroke.duration) > 0 ? Number(stroke.duration) : undefined,
    progress: Math.max(0, Math.min(1, Number.isFinite(stroke.progress) ? stroke.progress : 1))
  };
}

function restoreProject(silent = false) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    if (!silent) showSaveStatus("No save");
    return false;
  }

  try {
    const project = JSON.parse(raw);
    const brush = project.brush || {};
    const global = project.global || {};

    strokes = Array.isArray(project.strokes) ? project.strokes.map(normalizeSavedStroke) : [];
    nextId = Number(project.nextId) || strokes.reduce((max, stroke) => Math.max(max, stroke.id), 0) + 1;
    currentStroke = null;
    selectedStrokeId = null;
    colorPicker.value = brush.color || "#161616";
    widthPicker.value = String(brush.width || 5);
    gradientColors = Array.isArray(brush.gradientColors) && brush.gradientColors.length >= 2
      ? brush.gradientColors
      : ["#ff4d4d", "#2563eb"];
    globalSpeed = Number(global.speed) || 1;
    globalLoop = Boolean(global.loop);
    globalSpeedInput.value = String(globalSpeed);
    updateBrushControls();

    renderGradientStops();
    setGradientEnabled(Boolean(brush.gradientEnabled));
    drawScene();
    renderStrokeList();
    if (!silent) showSaveStatus("Restored");
    return true;
  } catch (error) {
    if (!silent) showSaveStatus("Restore failed");
    return false;
  }
}

function playAll(direction) {
  stopTimeline();
  const allPlayingDirection = strokes.length > 0 && strokes.every((stroke) => stroke.playing && stroke.direction === direction);

  for (const stroke of strokes) {
    if (allPlayingDirection) {
      stroke.playing = false;
      stroke.delayRemaining = 0;
    } else {
      stroke.direction = direction;
      stroke.playing = true;
      if (direction === 1 && stroke.progress >= 1) stroke.progress = 0;
      if (direction === -1 && stroke.progress <= 0) stroke.progress = 1;
      const startsAtBoundary = (direction === 1 && stroke.progress <= 0) || (direction === -1 && stroke.progress >= 1);
      stroke.delayRemaining = startsAtBoundary ? Math.max(0, Number(stroke.delay) || 0) : 0;
    }
  }

  renderStrokeList();
}

function reorderStroke(draggedId, targetId, insertAfter = false) {
  const fromIndex = strokes.findIndex((stroke) => stroke.id === draggedId);
  const targetIndex = strokes.findIndex((stroke) => stroke.id === targetId);
  if (fromIndex < 0 || targetIndex < 0 || fromIndex === targetIndex) return;

  const [moved] = strokes.splice(fromIndex, 1);
  let insertIndex = strokes.findIndex((stroke) => stroke.id === targetId);
  if (insertAfter) insertIndex += 1;
  strokes.splice(insertIndex, 0, moved);
  renderStrokeList();
}

function handlePointerSortMove(event) {
  if (!pointerSorting || !draggedStrokeId) return;
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".strokeItem");
  if (!target || !strokeList.contains(target)) return;

  const targetId = Number(target.dataset.strokeId);
  if (!targetId || targetId === draggedStrokeId) return;

  const rect = target.getBoundingClientRect();
  reorderStroke(draggedStrokeId, targetId, event.clientY > rect.top + rect.height / 2);
}

function stopPointerSort() {
  if (!pointerSorting) return;
  pointerSorting = false;
  draggedStrokeId = null;
  renderStrokeList();
}

function toggleLoopAll() {
  stopTimeline();
  globalLoop = !globalLoop;
  for (const stroke of strokes) {
    stroke.loop = globalLoop;
    if (!stroke.loop && stroke.progress <= 0) stopStroke(stroke, 0);
    if (!stroke.loop && stroke.progress >= 1) stopStroke(stroke, 1);
  }
  renderStrokeList();
}

function stopTimeline() {
  if (!timelinePlaying) return;
  timelinePlaying = false;
  for (const stroke of strokes) {
    stroke.playing = false;
    stroke.delayRemaining = 0;
  }
}

function toggleSequencePlayback() {
  if (timelinePlaying) {
    stopTimeline();
    renderStrokeList();
    return;
  }

  timelineTime = 0;
  for (const stroke of strokes) {
    stroke.progress = 0;
    stroke.playing = false;
    stroke.delayRemaining = 0;
    stroke.direction = 1;
  }
  timelinePlaying = true;
  drawScene();
  renderStrokeList();
}

function setGlobalSpeed(speed) {
  globalSpeed = speed;
  for (const stroke of strokes) {
    stroke.speed = speed;
  }
  updateGlobalControls();
}

function renderGradientStops() {
  gradientStops.innerHTML = "";

  gradientColors.forEach((color, index) => {
    const stop = document.createElement("div");
    stop.className = "gradientStop";
    stop.innerHTML = `
      <input type="color" value="${color}" aria-label="Gradient color ${index + 1}">
      <button type="button" aria-label="Remove gradient color ${index + 1}" ${gradientColors.length <= 2 ? "disabled" : ""}>x</button>
    `;

    const input = stop.querySelector("input");
    const remove = stop.querySelector("button");
    input.addEventListener("input", () => {
      gradientColors[index] = input.value;
    });
    remove.addEventListener("click", () => {
      gradientColors.splice(index, 1);
      renderGradientStops();
    });
    gradientStops.append(stop);
  });
}

function setGradientEnabled(enabled) {
  gradientEnabled = enabled;
  gradientControls.hidden = !enabled;
  gradientButton.title = enabled ? "Gradient On" : "Gradient Off";
  gradientButton.setAttribute("aria-label", enabled ? "Gradient On" : "Gradient Off");
  gradientButton.classList.toggle("primary", enabled);
  gradientButton.setAttribute("aria-pressed", String(enabled));
}

function toggleVisible(stroke) {
  stroke.visible = !stroke.visible;
  drawScene();
  renderStrokeList();
}

function beginStroke(event) {
  const point = pointerPoint(event);
  const hitStroke = findStrokeAtPoint(point);
  if (hitStroke) {
    selectStroke(hitStroke.id, true);
    return;
  }

  selectedStrokeId = null;
  canvas.setPointerCapture(event.pointerId);
  currentStroke = {
    id: nextId,
    points: [point],
    color: colorPicker.value,
    gradient: gradientEnabled,
    colors: gradientEnabled ? strokeGradientColors(gradientColors) : [colorPicker.value],
    width: Number(widthPicker.value),
    visible: true,
    playing: false,
    direction: 1,
    loop: globalLoop,
    speed: globalSpeed,
    delay: 0,
    delayRemaining: 0,
    duration: undefined,
    progress: 1
  };
}

function extendStroke(event) {
  if (!currentStroke) return;
  currentStroke.points.push(pointerPoint(event));
  drawScene();
}

function endStroke(event) {
  if (!currentStroke) return;

  if (currentStroke.points.length > 1) {
    currentStroke.points = normalizeTime(currentStroke.points);
    currentStroke.duration = strokeDuration(currentStroke);
    strokes.push(currentStroke);
    selectedStrokeId = currentStroke.id;
    nextId += 1;
  }

  currentStroke = null;
  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
  drawScene();
  renderStrokeList();
}

canvas.addEventListener("pointerdown", beginStroke);
canvas.addEventListener("pointermove", extendStroke);
canvas.addEventListener("pointerup", endStroke);
canvas.addEventListener("pointercancel", endStroke);
document.addEventListener("pointermove", handlePointerSortMove);
document.addEventListener("pointerup", stopPointerSort);
document.addEventListener("pointercancel", stopPointerSort);

undoButton.addEventListener("click", () => {
  stopTimeline();
  const removed = strokes.pop();
  if (removed && selectedStrokeId === removed.id) selectedStrokeId = strokes.length ? strokes[strokes.length - 1].id : null;
  drawScene();
  renderStrokeList();
});

clearButton.addEventListener("click", () => {
  stopTimeline();
  strokes = [];
  currentStroke = null;
  selectedStrokeId = null;
  drawScene();
  renderStrokeList();
});

gradientButton.addEventListener("click", () => {
  setGradientEnabled(!gradientEnabled);
});

widthButton.addEventListener("click", () => {
  widthPanel.hidden = !widthPanel.hidden;
});

widthPicker.addEventListener("input", updateBrushControls);
widthPicker.addEventListener("change", () => {
  widthPanel.hidden = true;
  updateBrushControls();
});

colorPicker.addEventListener("input", updateBrushControls);

addGradientColor.addEventListener("click", () => {
  gradientColors.push(colorPicker.value);
  renderGradientStops();
});

playAllButton.addEventListener("click", () => playAll(1));
backAllButton.addEventListener("click", () => playAll(-1));
loopAllButton.addEventListener("click", toggleLoopAll);
sequenceAllButton.addEventListener("click", toggleSequencePlayback);
speedAllButton.addEventListener("click", () => {
  globalSpeedPanel.hidden = !globalSpeedPanel.hidden;
});
globalSpeedInput.addEventListener("input", () => {
  setGlobalSpeed(Number(globalSpeedInput.value));
});
globalSpeedInput.addEventListener("change", () => {
  globalSpeedPanel.hidden = true;
  renderStrokeList();
});

saveButton.addEventListener("click", saveProject);
restoreButton.addEventListener("click", () => restoreProject());
exportButton.addEventListener("click", exportPNG);

extendButton.addEventListener("click", () => {
  const expanded = app.classList.toggle("expanded");
  extendButton.setAttribute("aria-pressed", String(expanded));
  extendButton.setAttribute("aria-label", expanded ? "Restore drawing board" : "Expand drawing board");
  window.setTimeout(resizeCanvas, 440);
});

window.addEventListener("resize", resizeCanvas);

renderGradientStops();
setGradientEnabled(false);
updateBrushControls();
resizeCanvas();
restoreProject(true);
renderStrokeList();
requestAnimationFrame(animationLoop);
