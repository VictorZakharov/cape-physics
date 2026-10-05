# Cape Physics

[![CI](https://github.com/VictorZakharov/cape-physics/actions/workflows/ci.yml/badge.svg)](https://github.com/VictorZakharov/cape-physics/actions/workflows/ci.yml)
[![Deploy GitHub Pages](https://github.com/VictorZakharov/cape-physics/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/VictorZakharov/cape-physics/actions/workflows/deploy-pages.yml)

A real-time, all-procedural Three.js and TypeScript tech demo about one deceptively difficult problem: making a cape look and feel attached to a moving character.

**[Play the live demo](https://victorzakharov.github.io/cape-physics/)**

Walk, run, and jump through a torchlit cave while the cape settles onto the character, wraps around the animated body, clears rocks and cave formations, and reacts to acceleration, gravity, and airflow. Shallow pools respond to footsteps, jump landings, and falling ceiling drops.

Everything is generated at runtime. There are no downloaded models, textures, or animation clips.

## What is in the demo

- A neck-mounted cape that drapes over the shoulders and upper back instead of hanging from two disconnected points
- Desktop and touch movement controls, running, jumping, gait animation, and terrain-aware character movement
- Cloth contact with the character, fitted waist strap, boots, floor, banks, rocks, stalagmites, and stalactites
- A procedural cave with wet rock materials, torch shadows, glowing mineral veins, fog, dust, and bloom
- Clear walkable pools with footstep, landing, and ceiling-drop ripples
- A collision-aware third-person camera with a close-range character fade
- A responsive cape-and-scene panel for live dimensions, cloth response, lights, shadows, and reflections
- A native WebGL renderer by default, an opt-in experimental WebGPU compute path, and a clickable performance HUD

## Controls

| Input | Action |
| --- | --- |
| `W A S D` | Move relative to the camera |
| Hold `Shift` | Run |
| `Space` | Jump |
| Left- or right-mouse drag | Orbit the camera |
| Drag upward | Look upward |
| Mouse wheel | Zoom |
| Touch joystick | Move relative to the camera |
| Hold `RUN` | Run on touch devices |
| Tap `JUMP` | Jump on touch devices |
| One-finger swipe | Orbit the camera on touch devices |
| Two-finger pinch | Zoom on touch devices |
| Click the FPS graph | Copy a rolling 15-second performance report |
| `CAPE & SCENE` panel | Tune cape physics, add up to 50 performance bots, or toggle lights, shadows, and reflections; reload or Reset Defaults restores the defaults |
| `WEBGPU EXP` / `WEBGL` | Reload once with the selected renderer; the next ordinary reload returns to WebGL |
| `Esc` | Release pointer interaction |

## Rendering backends

The demo defaults to native WebGL 2 on every device and every ordinary reload. The renderer row in the customization panel exposes WebGPU as a one-time experimental option without persisting the choice. WebGPU renderer, TSL material, and compute-solver chunks are loaded only after that option is selected, so they do not inflate the normal WebGL download.

WebGPU handles both rendering and cape simulation. WebGL uses the mature `WebGLRenderer` pipeline and the CPU cloth solver. Performance reports show both the requested and active backend, and a lost or stalled WebGPU device restarts with WebGL instead of leaving the loading screen stuck.

Three.js describes `WebGPURenderer` as experimental, and measurements in this project vary materially by browser, driver, and device. See the [Three.js WebGPU renderer guide](https://threejs.org/manual/en/webgpurenderer).

## How the cape simulation works

The cape is a 13 x 18 grid—234 particles—simulated with position-based dynamics (PBD) at a fixed 120 Hz. Its pinned top row follows an animated arc around the neck. Free particles remain in world space and use damped Verlet prediction; constraints transmit the neckline's motion through the cloth rather than translating the whole cape with the character. Structural links resist stretching, diagonal links resist shear, and longer distance links approximate bending. Anti-fold, row-span, and row-curl guards preserve the cape's tuned drape.

```text
animated neckline
       ↓
predict inertia, gravity, and airflow
       ↓
project shape, self-contact, fold, and contact constraints
       (10 iterations with staged contact solves)
       ↓
reconcile body/world contact and implicit velocity
       ↓
update the rendered cape
```

Collision is deliberately hybrid:

- Animated body parts use fitted elliptical capsules plus complementary point/cloth-face contact, preventing limbs from crossing the middle of a coarse cloth triangle.
- The cave floor, banks, walls, and ceiling use direct queries against the same procedural surfaces that are rendered.
- Contact rocks use exact convex triangle geometry, continuous particle sweeps, and last-known-safe recovery for thin edge and face crossings.
- Self-contact, fold limits, bounded corrections, and coupled body/world reconciliation prevent tunnelling, spikes, and contact jitter.

The default CPU solver applies distance constraints in a sequential, row-major Gauss–Seidel sweep: each constraint sees the corrections made by the preceding constraints. It interleaves shape and collision solves across ten iterations, reconciles contact velocity, and uploads the updated mesh. The player's cape stays on the main thread; performance-bot capes use a bounded Web Worker pool when available, with completed particle snapshots transferred back for rendering. The animation loop consumes available worker results without waiting for completion. The CPU solver can sleep once motion, drape, and body-clearance checks confirm that the cape has settled.

The experimental WebGPU solver keeps particle state in storage buffers, uploads anchors and collider inputs, and renders positions and normals directly from GPU particle storage without animation-loop readback. Distance constraints use edge-colored Gauss–Seidel: links within a color share no particles and solve in parallel, with a storage barrier before the next color. Cloth triangles use eight non-overlapping colors for race-free face corrections. Contact projection uses separate source and destination buffers.

One preallocated compute graph handles the player and up to ten bot capes. With the default ten solver iterations, it batches 46 dispatches using 20 unique kernels into one compute submission per fixed step; adding capes does not add dispatches or compile another graph. Full contact projection runs in the first and final three iterations, while the six middle iterations retain shape solves and copy the ping-pong state. Final face, particle, and velocity reconciliation stages finish in the render position buffer. WebGPU keeps solving rather than adding a readback fence to evaluate the CPU's sleep checks. See the [solver architecture](docs/cape-solver-architecture.md) and the [tested dispatch schedule](tests/gpu-cape-dispatch-schedule.test.ts).

Analytic body queries fit the moving character closely, while exact rock faces preserve the visible contact boundary. Motion is predicted once per 120 Hz step, followed by ten main solver iterations and final contact reconciliation, including a targeted GPU stretch-repair pass. These are projection iterations within a step, rather than the repeated motion predictions used by the Macklin “small steps” variant.

The implementation builds on [Position Based Dynamics by Müller et al.](https://matthias-research.github.io/pages/publications/posBasedDyn.pdf) and [Robust Treatment of Collisions, Contact and Friction for Cloth Animation](https://graphics.stanford.edu/papers/cloth-sig02/). GPU ownership and compute/render handoff were cross-checked against [WebGPU Cloth](https://github.com/blazecus/WebGPU_Cloth), [Jack Blazes' WebGPU cloth port notes](https://jackblazes.net/posts/2024-10-09-clothsim_ported.html), and [Junyi Choi's WebGPU mass-spring project](https://junyic.blogspot.com/2024/05/06/webgpu-cloth-simulation-project-mass.html); the solver and collision model remain project-specific.

## Performance

The following historical reference measurements were captured on August 27, 2026, before the current packed multi-cape and edge-colored GPU solver changes. They have not been remeasured for the current implementation. The desktop setup used Edge 151, Windows, an AMD Ryzen 9 5900X, and an NVIDIA GeForce RTX 4070 Ti. Each timing is the median of three independent warmed runs at 1600 x 900, DPR 1, and `ADAPTIVE ULTRA`: 1,728 frames over the same 12-second running route, with backend completion amortized every 12 frames.

| Metric | WebGL 2 + CPU cape (default) | WebGPU + GPU cape (experimental) | Observation |
| --- | ---: | ---: | --- |
| Synchronized frame | **2.96 ms** avg / 4.25 ms p95 / 6.19 ms max | 3.21 ms / **4.00 ms** / **4.57 ms** | WebGL is 8.3% faster on average; WebGPU has a steadier local tail |
| Main-thread cape physics | 1.970 ms/frame | **0.236 ms/frame** | WebGPU reduces main-thread cape work by 8.4x; this is not GPU execution time |
| Scene + submission | **0.989 ms/frame** | 2.795 ms/frame | WebGPU renderer overhead offsets the compute gain |
| Ready time | **4.80 s** | 7.25 s | WebGL becomes interactive 2.45 s sooner |
| JavaScript loaded | **0.77 MB** | 1.48 MB | WebGL loads 48% less JavaScript |
| Warm shader programs | **41 → 41** | 94 → 94 | Neither route grows after warm-up |

Historical real-device testing informed the decision to keep WebGL as the default. On an Adreno 830 phone at DPR 3.75, WebGL held 59.93 FPS average with a 59.52 FPS 1% low and 16.8 ms p99. WebGPU measured 55.07 FPS average, a 28.99 FPS 1% low, 34.5 ms p99, and a 650.8 ms worst frame. On a 144 Hz NVIDIA desktop both backends reached the display callback ceiling, so displayed FPS could not distinguish them.

These measurements compare the complete rendering and simulation backends, so they do not isolate CPU versus GPU solver execution. Lower main-thread physics cost can be offset by rendering and submission overhead. GPU, browser, driver, thermal state, scene activity, cape count, and display refresh all matter. Click the in-game FPS graph to copy a rolling report with callback pacing, physics, scene, submission, renderer counters, and cape state.

Measure the current implementation with the local, non-gating Chrome profile:

```powershell
$env:CAPE_PROFILE_RENDERER = "webgl" # or "webgpu"
$env:CAPE_PROFILE_BOTS = "0"        # 0 to 10; use the same count for both backends
bun run profile:render
```

Timing budgets are never CI merge gates. CI uses deterministic, renderer-free checks; the full 37-view browser audit remains available locally with `bun run audit:visual`.

## Run locally

Install a current version of Bun, then:

```powershell
bun install
bun run dev
```

Open the printed URL in a WebGPU or WebGL 2 browser with hardware acceleration enabled.

## Verification

```powershell
bun run check          # strict TypeScript and deterministic unit/integration tests
bun run harness        # renderer-free traversal plus the optional local timing budget
bun run audit:visual   # local-only Chrome dynamic audit across 37 rendered views
bun run probe:webgpu   # local-only bounded WebGPU lifecycle/workload diagnostic
bun run profile:render # local-only, non-gating synchronized renderer profile
bun run stress:rocks   # optional extended rock-contact stress matrix
bun run build:pages    # production GitHub Pages build
```

The renderer-free harness advances character movement, cloth, jumping, water landings, footsteps, ceiling drops, lights, and mineral effects without using a browser. The visual audit then drives the production build directly through Chrome and checks desktop and touch input, responsive controls, depth ordering, shadows, water motion, cape contact, and animation from 37 camera studies.

CI gates source-size budgets, strict types, deterministic correctness, geometry, collision, the renderer-free scene harness, production and Pages builds, and Pages-safe asset paths. Pull requests also require linear history. The required check named `Dynamic multi-angle render audit` now runs renderer-free trajectory validation and worker architecture tests; actual browser/GPU audits, isolation probes, and profiles remain local opt-in checks. CI does **not** gate merges on millisecond or elapsed-time thresholds. Pull requests receive a temporary GitHub Pages preview, while merges to `main` deploy the production demo.

### Permanent WebGPU isolation probes

The repository retains three click-to-start, one-shot WebGPU diagnostics for device-specific failures:

- `?webgpuProbe=1` — minimal adapter, device, renderer, cube, queue, and teardown boundary.
- `?webgpuProbe=1&probeWorkload=three-cloth` — adds one compute and render step adapted from the official Three.js r185 `webgpu_compute_cloth` example.
- `?webgpuProbe=1&probeWorkload=app-cape` — adds the production one-cape GPU graph in a simple scene without the character, cave, colliders, PMREM, post-processing, bots, or frame loop.

No probe requests a GPU before its button is clicked. Each stage has a deadline, reports device loss and uncaptured errors, never reloads or falls back to WebGL, and explicitly disposes the renderer and externally owned device. The Chrome harness treats every console warning, error, exception, and WebGPU validation error as a failed probe. The application-cape report also records generated WGSL character count, node-build time, and asynchronous pipeline-compile time for every kernel, including the last shader built when native pipeline creation hangs. Keep these pages, their report format, the CPU-only architecture tests, and `scripts/run-webgpu-isolation-probe.mjs`; they are reusable field diagnostics rather than temporary incident scaffolding.

The local CDP harness defaults to the application-cape boundary. Select another workload with `CAPE_PROBE_WORKLOAD`. Browser harnesses use Chrome only because Edge profiles can retain Windows-protected database locks after exit; there is no Edge fallback. Set `CAPE_BROWSER_PATH` to choose a specific Chrome executable. Browser profiles and temporary data live under repository-local `artifacts/.tmp/` and are removed in `finally`.

The pinned Three 0.185.1 synchronously creates compute pipelines on the first dispatch. `WebGpuComputeWarmup` backports the upstream `compileComputeAsync()` behavior for the production cape: its 20 unique kernels are built with `createComputePipelineAsync()`, one at a time, with an animation-frame yield and real loading progress between kernels. The first physics step therefore submits already-compiled pipelines instead of placing seconds of cold compilation behind the first queue fence.

The normal loading screen keeps an on-screen, timestamped startup history from HTML shell entry through renderer construction, low-level backend stages, WebGPU kernel compilation, fallback, and failure. Its bounded history survives the one-time WebGPU-to-WebGL recovery reload in session storage and is included in copied crash diagnostics; a completed run is discarded when the next navigation begins.

## Project structure

- `src/physics` — cloth integration, constraints, body/world contact, face contact, and self-collision
- `src/player` and `src/camera` — movement, animation, jumping, orbit controls, occlusion, and close fade
- `src/world` — procedural cave geometry, rocks, terrain, water, lights, and atmosphere
- `src/core` — fixed-step timing, rendering, adaptive quality, shadows, and performance telemetry
- `src/testing` and `scripts` — renderer-free integration harness and dynamic visual audit

## License

[MIT](LICENSE)
