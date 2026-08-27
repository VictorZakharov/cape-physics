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
- An adaptive-quality renderer and clickable performance HUD for displays up to 144 Hz and beyond

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
| `Esc` | Release pointer interaction |

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

Reference measurements below were captured on August 27, 2026 using Edge, Windows, an AMD Ryzen 9 5900X, and an NVIDIA GeForce RTX 4070 Ti. The render profile used a 1600 × 900 viewport at native scale on `ADAPTIVE ULTRA`; the character was running through the live cave with cloth, water, lights, shadows, and post-processing active.

| Benchmark | Result | Workload |
| --- | ---: | --- |
| 144 Hz production render profile | **4.03 ms average** (~248 FPS), 6.30 ms p95, 7.90 ms maximum | 1,728 consecutive frames over 12 seconds |
| Shader stability | **42 → 42 programs** | No runtime shader-program growth during the render profile |
| Renderer-free full-scene simulation | **2.21–2.28 ms per 120 Hz step**, down 52–53% from 4.703 ms | Two consecutive 1,440-step runs; 12 simulated seconds completed in 3.18–3.28 seconds (~3.66–3.78× real time) |
| Full-frame renderer counters | **93 draw calls, 105,690 triangles** while running | Accumulated across the scene and post-processing; the warm frame reported 138 calls and 174,006 triangles |
| Simulation integrity | **0 mm world penetration**, 0.014 mm maximum body penetration | Dynamic jump, landing, rock contact, water, and full-scene traversal |

These are reference-machine measurements, not universal guarantees. They show 144 Hz-class average frame pacing on the tested hardware; the renderer can reduce internal resolution on slower GPUs. Under sustained severe load it now estimates a proportional fill-rate reduction instead of stepping down only 10% at a time, while a 12-second resize cooldown and an 18-second recovery window prevent quality oscillation. Wall-clock figures are local telemetry and never CI acceptance criteria because shared-runner speed is not deterministic.

You can reproduce the render profile with `bun run audit:visual`. For a telemetry-only physics run, set `CAPE_ENFORCE_PERFORMANCE_BUDGET=false` before `bun run harness`; without that override, the command also applies the optional local timing budget. The in-demo FPS panel provides the most relevant result for your own hardware—click it to copy the full rolling report, including callback pacing, main-thread physics/scene/render-submission phases, truthful full-frame renderer counters, and a low-frequency cape-solver phase sample. Renderer submission is CPU time and is explicitly not presented as GPU completion time.

## Run locally

Install a current version of Bun, then:

```powershell
bun install
bun run dev
```

Open the printed URL in a WebGL 2 browser with hardware acceleration enabled.

## Verification

```powershell
bun run check          # strict TypeScript and deterministic unit/integration tests
bun run harness        # renderer-free traversal plus the optional local timing budget
bun run audit:visual   # direct Edge/Chrome dynamic audit across 37 rendered views
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
