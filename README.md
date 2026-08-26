# Cape Physics

[![CI](https://github.com/VictorZakharov/cape-physics/actions/workflows/ci.yml/badge.svg)](https://github.com/VictorZakharov/cape-physics/actions/workflows/ci.yml)
[![Deploy GitHub Pages](https://github.com/VictorZakharov/cape-physics/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/VictorZakharov/cape-physics/actions/workflows/deploy-pages.yml)

A cinematic, all-procedural Three.js and TypeScript tech demo. Guide an armored traveller through a torchlit cave while a position-based cape wraps around the animated body, collides with solid cave geometry, and responds to walking, running, jumping, gravity, and airflow. Clear shallow pools react independently to footsteps, jump landings, and naturally falling ceiling drops.

[Launch the live demo](https://victorzakharov.github.io/cape-physics/)

No downloaded models or textures are used. The cave, character, cloth, water, minerals, particles, and material maps are generated at runtime.

## Run locally

```powershell
bun install
bun run dev
```

Open the printed local URL. A current WebGL 2 browser with hardware acceleration is recommended.

### Controls

- `W A S D` - camera-relative movement
- Hold `Shift` while moving - run with a faster, slightly stronger gait
- `Space` - jump; the player capsule remains constrained by the terrain, cave shell, and solid formations
- Left- or right-mouse drag - orbit the third-person camera
- Drag upward - look upward (reversed vertical orbit)
- Mouse wheel - zoom
- Click the FPS graph - copy a rolling 15-second performance report
- `Esc` - release pointer interaction

The renderer is uncapped for displays up to 144 Hz and beyond. Physics runs at a fixed 120 Hz so cloth behavior is independent of render rate, while adaptive resolution protects GPU frame pacing.

## Highlights

- Position-based cape with structural, shear, short-range bending, long-range anti-fold constraints, and inertial jump response
- Fixed-step jump arc with procedural arm, leg, and foot posing; terrain landing; height-aware cave-wall bounds; solid-formation separation; and ceiling contact
- Body-clear curved neckline attachment concealed beneath a batched procedural shoulder yoke, gathered fabric seam, paired ties, gorget, and clasps
- Allocation-free spatial-hash self-collision with explicit cloth thickness
- Dynamic shoulder, torso, hip/belt, arm, thigh, knee, lower-leg, and boot colliders fitted to the animated silhouette
- One-sided body projection that lets cloth wrap around armor without selecting the character's front surface
- Swept vertex contact plus barycentrically weighted sphere-to-cloth-triangle contact, closing the gap where a narrow object can pierce a face while all three vertices remain clear
- Geometry-derived sphere chains that conservatively enclose curved/elliptical stalactites, stalagmites, elongated rotated rocks, torch hardware, and mineral crystals
- 2,260 deterministic solid-object proxies plus analytic floor, bank, wall, and ceiling contact
- Cloth-motion-aware damping and deterministic sleep/wake behavior that cannot freeze a suspended panel and does not slow gravity-driven settling
- Terrain-aware player grounding that climbs the cave shell and walkable rocks instead of clipping through slopes
- Measured procedural character proportions with a 1.8-head shoulder span, a 1.35-head tapered torso, a visible neck-to-shoulder transition, slimmer limbs, an exposed face, a fitted helmet shell with flush brow trim, restrained walk/run bob, and rate-limited eased turning
- Wide third-person pitch range, collision-shortened camera boom, ground-safe close orbit, and a smooth 12% near-camera fade composited from a depth-resolved character/cape layer
- Five walkable, optically clear procedural pools seated in shared height-field basins with submerged interiors, dry containing rims, continuous normals, and antialiased edges
- Thirteen deterministic ceiling-drip emitters, splash particles, independent footstep ripples, and one-shot impact-scaled landing ripples
- Procedural rock color, height, normal, and roughness maps
- Closed, outward-facing wet speleothem shells with curved centerlines, deposition bands, capped attachment ends, and instanced flowstone collars
- A six-rock, mixed-size cape-contact course through the middle passage, batched into the existing scatter draw: large boulders are solid with a measured route around them, while small stones are walkable
- Flickering torches, emissive mineral veins, bloom, fog, dust, AgX tone mapping, PBR materials, and soft shadows
- Fixed-size nearest-light pools, fixed-allocation physics paths, and a two-stage anchor-radius/swept-cloth collision broad phase that avoid traversal-time shader compilation, unnecessary proxy scans, and garbage-collection stalls
- Pixel-budgeted post-processing and rate-limited adaptive-resolution reallocations
- Compact live FPS, frame-time, average, one-percent-low, and sparkline HUD; click it to copy renderer, quality, scene, canvas, runtime, and rolling 15-second frame diagnostics

## Quality gates

```powershell
bun run check          # strict TypeScript plus renderer-free unit tests
bun run harness        # deterministic systems traversal plus a local-only physics timing budget
bun run audit:visual   # render audit plus a local-only 144 Hz wall-clock profile
bun run verify         # check, production build, and systems harness
```

The renderer-free harness constructs the complete scene graph and dynamically advances cloth, character animation, a moving jump and water landing, center-path rock contact, water drops, footsteps, torches, and mineral systems. It checks finite state, structural error, vertex and cloth-face penetration, pinned-neckline/body clearance, continuous belt-to-boot coverage, jump apex, airborne limb pose, cape follow-through, coupled body/rock contact, landing-ripple emission, self-separation, downward settling, basin depth and rim containment, ripple activity, geometry validity, triangle/draw-call budgets, and stable light counts. It always reports average physics-step cost, but that wall-clock measurement is enforced only by the local command and is telemetry-only in CI. Focused tests verify outward-facing, capped speleothem shells; a player-width lane beside every mixed-size contact rock; the rendered yoke's overlap with both simulation anchors; torso, shoulder, head, and neck proportions; cloth-face collision when every vertex is clear; suspended-panel wake-up after a 148-degree reversal; distinct walking and running drape; grounded hem and bank traversal; airborne terrain, ceiling, and formation contact; fitted helmet proportions; browser-free clipboard report formatting; eased turning, Shift running, and gait bob; and opaque depth-writing inputs with clamped close-camera fade.

The visual audit launches an installed Edge or Chrome directly through the DevTools protocol; it does not depend on a browser-testing framework. It verifies that the camera projection matches the viewport on the first frame and after high-density resizes, then drives the deterministic in-app harness through 25 rendered studies, including:

- rear, side, true front, neckline, high-oblique attachment, aggressive reversal, running, and fully settled cape views;
- a real FPS-panel click with intercepted clipboard output and visible success-feedback assertions;
- real LMB and RMB reversed-drag input;
- sharp look-up and strongly faded close-camera views with camera/ground clearance assertions;
- real Space-key moving/turning ascent and in-water landing views with procedural limb-pose, lower-body cape-contact, terrain-clearance, and one-shot ripple assertions;
- dynamic uphill traversal with player/terrain contact checks;
- a complete pass through the mixed-size center rock course plus close large- and small-rock cape-contact views;
- both sides of observed cape contact against a generated stalagmite;
- footstep and ceiling-drop ripple evolution, a low clear-water close-up, and a side-on view proving the water is below its dry rim; and
- a 1,728-frame, 144 Hz running traversal across torch and mineral light boundaries.

The audit fails on browser errors, movement regressions, body/cave/self/cloth-face penetration, idle trembling, inverted resting cloth, missing dynamic contacts or ripples, shader-program growth, oversized render targets, or nondeterministic paused frames. Its saved images make silhouette, clipping, water clarity, and faceting regressions directly reviewable. Images and a diagnostics manifest are written to `artifacts/visual-audit/` and intentionally ignored by Git.

The local command retains the strict 12-second, 1,728-frame D3D11 timing profile above. CI skips that hardware-dependent profile and gates only deterministic state, geometry, collision, rendering, and image invariants. Likewise, the renderer-free CI harness records physics timings without accepting or rejecting a change based on runner speed. Set `CAPE_AUDIT_PERFORMANCE_PROFILE=false` to skip the wall-clock render profile, or `CAPE_ENFORCE_PERFORMANCE_BUDGET=false` to make physics timing telemetry-only.

## Architecture

The implementation is divided by responsibility under `src/`:

- `physics` owns cloth integration, constraints, body/world contact, triangle contact, rest state, and self-collision;
- `world` owns procedural geometry, geometry-derived collision proxies, terrain resolution, water, lights, and atmosphere;
- `player` and `camera` own movement, running, jumping, animation, interaction, orbit safety, and close fade;
- `core` owns fixed timing, rendering, performance telemetry, and adaptive quality; and
- `testing` owns the renderer-independent integration harness.

The cloth solver follows the real-time position-based dynamics approach described by M&uuml;ller et al. Its contact path combines projected resting constraints, swept vertex fail-safe collision, and triangle closest-point constraints, following the robust cloth-collision principle described by Bridson, Fedkiw, and Anderson. Water shading adapts the multi-scale animated slopes, Fresnel response, normal-variance roughness, and GGX highlights proven in the sibling `beautiful-water` project, specialized for bounded reactive cave pools.

Useful implementation references:

- [Position Based Dynamics - M&uuml;ller et al.](https://www.cs.toronto.edu/~jacobson/seminar/mueller-et-al-2007.pdf)
- [Robust Treatment of Collisions, Contact and Friction for Cloth Animation - Bridson, Fedkiw, and Anderson](https://physbam.stanford.edu/~fedkiw/papers/stanford2002-01.pdf)
- [Three.js `Triangle`](https://threejs.org/docs/pages/Triangle.html)
- [Three.js `ShaderMaterial`](https://threejs.org/docs/pages/ShaderMaterial.html)
- [Three.js shadow performance guidance](https://threejs.org/manual/en/shadows.html)
- [Vite static deployment guidance](https://vite.dev/guide/static-deploy.html)
- [GitHub Pages custom Actions workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Deployment

Every push and pull request runs strict TypeScript, renderer-free unit tests, the deterministic full-scene harness, production and Pages builds, and asset-path validation. Pull requests additionally run the 22-angle dynamic Windows render audit and upload its PNG/JSON evidence. PR history is checked for merge commits so branches stay reviewable and linear.

Same-repository pull requests receive a sticky preview link at:

```text
https://victorzakharov.github.io/cape-physics/pr-preview/pr-<number>/
```

The preview and production workflows share the same serialized Pages publisher and aggregate `gh-pages` artifact, preserving open previews during production releases and removing a preview when its pull request closes. Pushing `main` publishes the production subpath and smoke-tests the deployed HTML and assets.

`main` is protected: changes require a pull request, current required checks, resolved review conversations, and administrator enforcement. Repository merge settings allow merge commits only. The linear-history CI gate applies to commits introduced by each PR, preventing merge bubbles inside feature branches without conflicting with the required merge commit on `main`.

## License

MIT
