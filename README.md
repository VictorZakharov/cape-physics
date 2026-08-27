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
- A WebGPU-first adaptive renderer with an in-game WebGL fallback and a clickable performance HUD

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
| `WEBGPU` / `WEBGL` | Reload with the selected renderer; the choice is remembered |
| `Esc` | Release pointer interaction |

## Rendering backends

The demo selects WebGPU when the browser supports it and otherwise uses WebGL 2. The `WEBGPU` / `WEBGL` switch in the lower-right corner reloads the selected backend and remembers the choice. Performance reports show both the requested and active backend, so a browser fallback is never mislabeled. If a WebGPU device is lost or startup stops responding, the page restarts with WebGL instead of remaining behind the loading screen.

WebGPU handles both rendering and cape simulation. WebGL keeps the same visual behavior through the CPU cloth solver, making it a compatibility path as well as a useful comparison. Three.js still describes `WebGPURenderer` as experimental, so results can vary by browser and driver; see the [Three.js WebGPU renderer guide](https://threejs.org/manual/en/webgpurenderer).

## How the cape simulation works

The cape is a 13 × 18 grid—234 particles—simulated with position-based dynamics (PBD) at a fixed 120 Hz. Its top row follows an animated arc around the neck, while structural, shear, bending, and anti-fold constraints shape the free rows.

```text
animated neckline
       ↓
predict inertia, gravity, and airflow
       ↓
project cloth and point-contact constraints (10 passes)
       ↓
resolve cloth-face contact in race-free triangle colors
       ↓
render positions and normals directly from GPU storage
```

The WebGPU path keeps current positions, previous positions, topology, anchors, and collider data in persistent storage buffers. Each fixed step batches 25 short dispatches into one compute pass and one queue submission; normal gameplay performs no particle readback. Shape projection ping-pongs between two position buffers, so every particle reads an immutable preceding pass without a copy dispatch. Body-face and rock-face constraints update three vertices at once, so the grid triangles are processed in eight non-overlapping colors with a storage barrier between colors. This preserves coherent corrections without float atomics or write races while avoiding one oversized driver-sensitive shader.

Collision is intentionally hybrid:

- Animated body parts use fitted elliptical capsules, including complementary capsule-point/cloth-face contact so a limb cannot pass through the middle of a coarse triangle.
- The cave floor, banks, walls, and ceiling use direct procedural surface queries.
- Contact rocks use exact convex triangle geometry, continuous particle sweeps, and last-known-safe triangle recovery for thin edge/face crossings.
- Self-contact, fold limits, bounded corrections, and coupled body/world reconciliation prevent tunnelling, spikes, and contact jitter.

This is not a global signed-distance-field simulation. Analytic moving-body queries are cheaper and fit the character more closely, while exact convex rock faces preserve the visible contact boundary. It is also not the Macklin “small steps” variant: motion is predicted once per 120 Hz step and the tuned shape is projected ten times. Changing that integration scheme would be a separate numerical and visual change, not a mechanical performance port.

The CPU fallback applies the same PBD and collision model sequentially, then uploads the updated mesh. The WebGPU implementation instead exposes its storage buffer directly to the cape material, including dynamically reconstructed normals.

The implementation builds on [Position Based Dynamics by Müller et al.](https://matthias-research.github.io/pages/publications/posBasedDyn.pdf) and the continuous-contact ideas in [Robust Treatment of Collisions, Contact and Friction for Cloth Animation](https://graphics.stanford.edu/papers/cloth-sig02/). GPU buffer ownership and compute/render handoff were cross-checked against [WebGPU Cloth](https://github.com/blazecus/WebGPU_Cloth), [Jack Blazes' WebGPU cloth port notes](https://jackblazes.net/posts/2024-10-09-clothsim_ported.html), and [Junyi Choi's WebGPU mass-spring project](https://junyic.blogspot.com/2024/05/06-webgpu-cloth-simulation-project-mass.html); the cape's solver and collision model remain project-specific.

## Performance

Reference measurements were captured on August 27, 2026 with Edge 151, Windows, an AMD Ryzen 9 5900X, and an NVIDIA GeForce RTX 4070 Ti. Each backend value is the median of three independent warmed runs at 1600 × 900, DPR 1, and `ADAPTIVE ULTRA`: 1,728 frames over the same 12-second running route, with backend completion amortized every 12 frames.

| Metric | WebGPU + GPU cape | WebGL 2 + CPU cape | Result |
| --- | ---: | ---: | ---: |
| Synchronized frame | **3.31 ms** average / 3.94 ms p95 / 4.29 ms max | 5.30 ms / 6.59 ms / 8.70 ms | **1.60× faster** average |
| Main-thread cape physics | **0.223 ms/frame** | 2.793 ms/frame | **12.5× less CPU time** |
| Ready time | **8.30 s** | 18.06 s | **2.18× faster** |
| GPU timestamp queries | render 0.304 ms + cape compute 0.975 ms = **1.278 ms average** / 1.573 ms p95 total | Not available | 144 samples/run |
| Shader stability | 94 → 94 programs | 85 → 85 programs | No warm-route growth |
| Scene complexity | 74 draw calls / 67,577 triangles | 74 / 67,577 | Matched |

Against the recorded WebGPU renderer baseline before GPU cape compute, synchronized frame time fell from 5.23 ms to 3.31 ms (**1.58× faster**) and main-thread cape physics fell from 3.085 ms to 0.223 ms (**13.8× less CPU time**). Rendering and browser submission now dominate the frame, so the whole application does not scale by the full physics-only factor.

These are throughput diagnostics, not display-refresh measurements or universal guarantees. GPU, browser, driver, thermal state, and scene visibility all matter. The in-game FPS graph is the best measurement on your hardware; click it to copy a rolling report with callback pacing, physics, scene, submission, renderer counters, and cape state.

Reproduce the local, non-gating profile with:

```powershell
$env:CAPE_PROFILE_RENDERER = "webgpu" # or "webgl"
bun run profile:render
```

Timing budgets are never CI merge gates. The visual audit and automated tests enforce deterministic correctness instead.

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
bun run audit:visual   # direct Edge/Chrome dynamic audit across 37 rendered views
bun run profile:render # local-only, non-gating synchronized renderer profile
bun run stress:rocks   # optional extended rock-contact stress matrix
bun run build:pages    # production GitHub Pages build
```

The renderer-free harness advances character movement, cloth, jumping, water landings, footsteps, ceiling drops, lights, and mineral effects without using a browser. The visual audit then drives the production build directly through Edge or Chrome and checks desktop and touch input, responsive controls, depth ordering, shadows, water motion, cape contact, and animation from 37 camera studies.

CI gates deterministic correctness, geometry, collision, rendering, and builds. It does **not** gate merges on millisecond or elapsed-time thresholds. Pull requests receive a temporary GitHub Pages preview, while merges to `main` deploy the production demo.

## Project structure

- `src/physics` — cloth integration, constraints, body/world contact, face contact, and self-collision
- `src/player` and `src/camera` — movement, animation, jumping, orbit controls, occlusion, and close fade
- `src/world` — procedural cave geometry, rocks, terrain, water, lights, and atmosphere
- `src/core` — fixed-step timing, rendering, adaptive quality, shadows, and performance telemetry
- `src/testing` and `scripts` — renderer-free integration harness and dynamic visual audit

## License

[MIT](LICENSE)
