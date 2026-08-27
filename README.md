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

The demo uses Three.js's universal `WebGPURenderer` and TSL material graphs. It selects WebGPU on first launch when the browser exposes it, and otherwise uses the WebGL 2 backend. The switch in the lower-right corner lets you compare or override that choice at any time. Reports show both the requested and active backend, so a fallback cannot be mistaken for a WebGPU result.

WebGPU performance is browser- and GPU-dependent; Three.js also notes that its WebGPU renderer remains experimental and can be slower in some cases. The renderer choice therefore stays visible instead of assuming one backend is universally faster. See the [Three.js WebGPU renderer guide](https://threejs.org/manual/en/webgpurenderer).

This migration covers rendering and post-processing. The cape solver remains on the CPU because its current sequential constraints and collision recovery need a separate compute-oriented redesign rather than a mechanical shader port.

## How the cape simulation works

The cape uses **position-based dynamics (PBD)** at a fixed 120 Hz. PBD works well for interactive cloth because it corrects particle positions directly, keeping distance and collision constraints stable without an expensive general-purpose rigid-body solver.

The current cape is a 13 × 18 grid: 234 simulated particles connected by structural, shear, bending, and long-range anti-fold constraints. Its 13-particle top row is pinned to an animated arc around the neck. The remaining rows start from a tailored rest shape over the shoulders and are free to move.

```text
animated neckline
       ↓
predict motion from inertia, gravity, and airflow
       ↓
project cloth-shape constraints (10 solver passes)
       ↓
resolve self, body, rock, and cave contacts
       ↓
rebuild the render mesh and smooth normals
```

The collision system is deliberately hybrid:

- **Character:** shallow elliptical capsules and fitted analytic proxies follow the animated torso, shoulders, limbs, boots, neck armor, hips, and waist strap. One-sided back projection lets the cloth rest close to the body without being pushed toward the character's front.
- **Rocks:** authored contact rocks use their exact transformed triangle surfaces. Swept particle tests catch fast motion, while sphere-to-cloth-triangle checks catch thin geometry passing through the middle of a cloth face.
- **Cave:** the displaced floor, banks, walls, and ceiling are queried directly; compact geometry-derived proxies cover formations and fixtures.
- **Cape itself:** an allocation-free spatial hash enforces cloth thickness without comparing every particle with every other particle.
- **Recovery:** bounded corrections, coupled body/world passes, fold guards, damping, and last-known-safe contact states prevent tunnelling, explosive spikes, and perpetual jitter.

This is **not a global signed-distance-field simulation**. A static SDF can make broad environmental queries inexpensive, but it would not replace the tight moving-body fit or the exact edge and face contact needed for the irregular test rocks. The hybrid approach keeps common character contacts cheap while retaining precise geometry where visible errors matter most.

The current solver predicts motion once and then applies ten sequential Gauss-Seidel projection passes; it is not a “small steps” solver. Local phase profiling showed that repeated body and cave queries—not the shape projections—were the dominant CPU cost. The optimized path prepares animated body-collider coordinates once per physics step, culls cloth-face work by cape row, and reuses static cave samples away from contact while refreshing boundary particles every pass. This keeps the same ten-pass cloth behavior and exact final contacts with substantially less repeated work.

The solver follows the approach introduced in [Position Based Dynamics by Müller et al.](https://matthias-research.github.io/pages/publications/posBasedDyn.pdf). Its swept fail-safe and interference-recovery strategy is informed by [Robust Treatment of Collisions, Contact and Friction for Cloth Animation by Bridson, Fedkiw, and Anderson](https://graphics.stanford.edu/papers/cloth-sig02/).

## Performance

Reference measurements below were captured on August 27, 2026 using Edge 151, Windows, an AMD Ryzen 9 5900X, and an NVIDIA GeForce RTX 4070 Ti. Each renderer result is the median of three independent runs over the same warmed running route at 1600 × 900, DPR 1, and `ADAPTIVE ULTRA`. Every run rendered 1,728 frames and waited for backend completion after each frame; these are throughput diagnostics, not display-refresh measurements.

| Benchmark | Median result | Workload |
| --- | ---: | --- |
| Main baseline, legacy WebGL renderer | **3.07 ms average**, 4.60 ms p95, 8.30 ms maximum | Commit `572630f`, before the universal renderer migration |
| Migrated pipeline, forced WebGL 2 | **4.21 ms average**, 6.30 ms p95, 9.80 ms maximum | Same route through the universal renderer's WebGL backend |
| Migrated pipeline, native WebGPU | **12.06 ms average**, 18.10 ms p95, 30.10 ms maximum | Same route through WebGPU; no fallback was active |
| Shader stability | **110 → 110 programs** | No runtime shader-program growth in either migrated backend |
| Renderer-free full-scene simulation | **2.21–2.28 ms per 120 Hz step**, down 52–53% from 4.703 ms | Two consecutive 1,440-step runs; 12 simulated seconds completed in 3.18–3.28 seconds (~3.66–3.78× real time) |
| Full-frame renderer counters | **74 draw calls, 67,577 triangles** while running | Same scene complexity in WebGL and WebGPU |
| Simulation integrity | **0 mm world penetration**, 0.014 mm maximum body penetration | Dynamic jump, landing, rock contact, water, and full-scene traversal |

These are reference-machine measurements, not universal guarantees. On this host, WebGPU was slower than both WebGL paths, which is why the backend toggle and truthful backend telemetry are part of the demo. A browser's per-frame WebGPU queue completion also has different synchronization overhead from WebGL's `finish`; normal gameplay pipelines work across animation frames instead of deliberately waiting after every submission. Measure on the hardware you care about before drawing a platform-wide conclusion. The adaptive renderer can reduce internal resolution under sustained load and rate-limits target resizing to avoid quality oscillation.

Reproduce the focused render profile with `bun run profile:render`; set `CAPE_PROFILE_RENDERER` to `webgpu` or `webgl` first. The command only reports measurements and never enforces a performance threshold. For a telemetry-only physics run, set `CAPE_ENFORCE_PERFORMANCE_BUDGET=false` before `bun run harness`; without that override, the command also applies the optional local timing budget. The in-demo FPS panel provides the most relevant result for your own hardware—click it to copy the full rolling report, including callback pacing, main-thread physics/scene/render-submission phases, truthful full-frame renderer counters, and a low-frequency cape-solver phase sample. Renderer submission is CPU time and is explicitly not presented as GPU completion time.

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
