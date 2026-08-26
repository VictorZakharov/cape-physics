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
- Close-fitting fabric collar joined continuously through a four-rail shoulder-and-upper-back yoke to the body-clear pinned neckline; the shortened ties, gathered seam, gorget, and clasps conceal the physical mount without a side-view gap
- Allocation-free spatial-hash self-collision with explicit cloth thickness
- Dynamic shoulder, torso, hip/belt, arm, thigh, knee, lower-leg, and fitted toe-to-heel boot colliders that enclose the animated silhouette
- One-sided body projection that lets cloth wrap around armor without selecting the character's front surface
- Swept vertex contact plus barycentrically weighted sphere-to-cloth-triangle contact, closing the gap where a narrow object can pierce a face while all three vertices remain clear; a final coupled stone/body projection prevents rocks from pressing cloth back through animated feet
- Exact transformed convex surfaces for every floor and contact-course rock: fixed cross-platform topology, first-impact vertex sweeps, planar side-impact escape below walkable shoulders, and allocation-free edge/triangle tests replace oversized proxy spheres. Face-only response activates on a real crossing—not a near miss—and restores the affected cell to its last verified safe state, preventing changing facet normals from pumping a graze into a long spike; bounded final reconciliation keeps the rendered frame clear after cave and body constraints
- Geometry-derived sphere chains conservatively enclose curved/elliptical stalactites, stalagmites, torch hardware, and mineral crystals, while 2,062 deterministic colliders combine with the exact displaced floor, bank, wall, and ceiling shell
- Allocation-free swept-AABB and exact-box rejection keeps triangle work restricted to cloth motion that can genuinely reach a rock
- Cloth-motion-aware damping and deterministic sleep/wake behavior that cannot freeze a suspended panel and does not slow gravity-driven settling
- Terrain-aware player grounding that climbs the cave shell and smoothly approaches exact walkable-rock support across a broad shoulder instead of clipping through slopes or launching from a one-frame height step
- Measured procedural character proportions with a 1.8-head shoulder span, a 1.35-head tapered torso, a visible neck-to-shoulder transition, slimmer limbs, an exposed face, a fitted helmet shell with flush brow trim, restrained walk/run bob, and rate-limited eased turning
- Wide third-person pitch range, collision-shortened camera boom, and ground-safe close orbit; opaque character/cape geometry shares the world's MSAA depth pass for exact silhouette coverage, while the smooth 12% near-camera fade uses an isolated depth-resolved layer without removing either mesh from shadow-map traversal
- Five walkable, optically clear procedural pools seated in shared height-field basins with submerged interiors, dry containing rims, continuous normals, and antialiased edges
- Thirteen deterministic ceiling-drip emitters, splash particles, independent footstep ripples, and one-shot impact-scaled landing ripples
- Procedural rock color, height, normal, and roughness maps; low-profile irregular floor rocks use deterministic closed meshes, broad planar bases, restrained tilt, and physical ground embed instead of balancing on spherical undersides
- Closed, outward-facing wet speleothem shells with curved centerlines, deposition bands, capped attachment ends, and instanced flowstone collars; ceiling formations retain their silhouettes but use a darker, rough, near-nonmetallic response that blends with the cave
- A six-rock, mixed-size cape-contact course through the middle passage, batched into the existing scatter draw: large boulders are solid with a measured route around them, while small stones are walkable
- Flickering torches, emissive mineral veins, bloom, fog, dust, AgX tone mapping, PBR materials, and soft shadows
- Fixed-size nearest-light pools, fixed-allocation physics paths, and anchor-radius, exact-box, and swept-cloth broad phases that avoid traversal-time shader compilation, unnecessary surface scans, and garbage-collection stalls
- Pixel-budgeted post-processing and rate-limited adaptive-resolution reallocations
- Compact live FPS, frame-time, average, one-percent-low, and sparkline HUD; click it to copy renderer, quality, scene, canvas, runtime, and rolling 15-second frame diagnostics

## Quality gates

```powershell
bun run check          # strict TypeScript plus renderer-free unit tests
bun run harness        # deterministic systems traversal plus a local-only physics timing budget
bun run audit:visual   # render audit plus a local-only 144 Hz wall-clock profile
bun run verify         # check, production build, and systems harness
```

The renderer-free harness constructs the complete scene graph and dynamically advances cloth, character animation, a moving jump and water landing, center-path rock contact, water drops, footsteps, torches, and mineral systems. It checks finite state, structural error, local fold direction, vertex and cloth-face penetration, pinned-neckline/body clearance, continuous belt-to-boot coverage, jump apex, airborne limb pose, cape follow-through, coupled body/rock contact, landing-ripple emission, self-separation, downward settling, basin depth and rim containment, ripple activity, geometry validity, triangle/draw-call budgets, and stable light counts. It always reports average physics-step cost, but that wall-clock measurement is enforced only by the local command and is telemetry-only in CI. Focused tests verify outward-facing, capped speleothem shells; exact transformed rock faces and continuous swept bounds; broad load-bearing rock bases; a real small-rock graze with exact surface contact, below-jump vertical motion, bounded strain, and no crossed cloth rows; sustained walk-and-hold contact against all six authored rocks with bounded per-step motion, structural error, anchor distance, fold direction, and zero face crossing; genuine rock-edge/cloth-face piercing recovery; zero impulse for clearance-only near misses; a player-width lane beside every mixed-size contact rock; continuous collar-to-shoulder-to-pinned-seam-to-upper-back geometry plus exact rendered/simulated seam overlap; torso, shoulder, head, and neck proportions; complementary cloth-face collision when every vertex is clear; camera-independent shadow-caster layer membership; suspended-panel wake-up after a 148-degree reversal; distinct walking and running drape; grounded hem and bank traversal; airborne terrain, ceiling, and formation contact; fitted helmet proportions; browser-free clipboard report formatting; eased turning, Shift running, and gait bob; opaque depth-writing inputs with clamped close-camera fade; and nearest-depth ordering for the isolated character layer.

The visual audit launches an installed Edge or Chrome directly through the DevTools protocol; it does not depend on a browser-testing framework. It verifies that the camera projection matches the viewport on the first frame and after high-density resizes, then drives the deterministic in-app harness through 33 rendered studies, including:

- rear, side, true front, neckline, dedicated true-side neck mount, high-oblique attachment, aggressive reversal, running, and fully settled cape views;
- a real FPS-panel click with intercepted clipboard output and visible success-feedback assertions;
- real LMB and RMB reversed-drag input;
- sharp look-up and strongly faded close-camera views with camera/ground clearance assertions;
- real Space-key moving/turning ascent and in-water landing views with procedural limb-pose, lower-body cape-contact, terrain-clearance, and one-shot ripple assertions;
- dynamic uphill traversal with player/terrain contact checks;
- a complete pass through the mixed-size center rock course, target-identified large- and small-rock contact views with exact cloth/render-face gaps below 6 mm, a 110-frame at-speed small-stone graze that gates root/cape vertical motion, structural strain, local fold direction, penetration, and animated-boot contact, plus a 180-frame stationary stress contact and paired opposing views on the formerly unstable fifth boulder;
- both sides of observed cape contact against a generated stalagmite;
- controlled views from both sides of a real boulder plus a two-angle framebuffer probe that proves a visible character-layer signal becomes pixel-identical to the world-only frame when nearer world depth occludes it;
- paired camera views at one fixed player position that assert the selected shadow torch, world-space light/target, intensity, and map allocation remain identical, plus a GPU framebuffer probe requiring identical cast-shadow contrast across two camera angles and in direct versus close-camera isolated render modes;
- footstep and ceiling-drop ripple evolution, a low clear-water close-up, and a side-on view proving the water is below its dry rim; and
- a 1,728-frame, 144 Hz running traversal across torch and mineral light boundaries.

The audit fails on browser errors, movement regressions, view-dependent world/character depth ordering, body/cave/self/cloth-face penetration, idle trembling, inverted resting cloth, missing dynamic contacts or ripples, shader-program growth, oversized render targets, or nondeterministic paused frames. Its saved images make silhouette, clipping, water clarity, and faceting regressions directly reviewable. Images and a diagnostics manifest are written to `artifacts/visual-audit/` and intentionally ignored by Git.

The local command retains the strict 12-second, 1,728-frame D3D11 timing profile above. CI skips that hardware-dependent profile and gates only deterministic state, geometry, collision, rendering, and image invariants. Likewise, the renderer-free CI harness records physics timings without accepting or rejecting a change based on runner speed. Set `CAPE_AUDIT_PERFORMANCE_PROFILE=false` to skip the wall-clock render profile, or `CAPE_ENFORCE_PERFORMANCE_BUDGET=false` to make physics timing telemetry-only.

## Architecture

The implementation is divided by responsibility under `src/`:

- `physics` owns cloth integration, constraints, body/world contact, triangle contact, rest state, and self-collision;
- `world` owns procedural geometry, exact convex rock surfaces, geometry-derived formation proxies, terrain resolution, water, lights, and atmosphere;
- `player` and `camera` own movement, running, jumping, animation, interaction, orbit safety, and close fade;
- `core` owns fixed timing, rendering, performance telemetry, and adaptive quality; and
- `testing` owns the renderer-independent integration harness and deterministic GPU framebuffer probes.

The cloth solver follows the real-time position-based dynamics approach described by M&uuml;ller et al. Its contact path combines projected resting constraints, swept vertex fail-safe collision, exact segment/triangle crossing tests, and last-safe-state face recovery, following the robust cloth-collision principle described by Bridson, Fedkiw, and Anderson. Closest-point queries remain diagnostic-only, so proximity cannot inject solver energy. Water shading adapts the multi-scale animated slopes, Fresnel response, normal-variance roughness, and GGX highlights proven in the sibling `beautiful-water` project, specialized for bounded reactive cave pools.

Useful implementation references:

- [Position Based Dynamics - M&uuml;ller et al.](https://www.cs.toronto.edu/~jacobson/seminar/mueller-et-al-2007.pdf)
- [Robust Treatment of Collisions, Contact and Friction for Cloth Animation - Bridson, Fedkiw, and Anderson](https://physbam.stanford.edu/~fedkiw/papers/stanford2002-01.pdf)
- [Three.js `Triangle`](https://threejs.org/docs/pages/Triangle.html)
- [Three.js `ShaderMaterial`](https://threejs.org/docs/pages/ShaderMaterial.html)
- [Three.js shadow performance guidance](https://threejs.org/manual/en/shadows.html)
- [Vite static deployment guidance](https://vite.dev/guide/static-deploy.html)
- [GitHub Pages custom Actions workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Deployment

Every push and pull request runs strict TypeScript, renderer-free unit tests, the deterministic full-scene harness, production and Pages builds, and asset-path validation. Pull requests additionally run the 32-study dynamic Windows render audit and upload its PNG/JSON evidence. PR history is checked for merge commits so branches stay reviewable and linear.

Same-repository pull requests receive a sticky preview link at:

```text
https://victorzakharov.github.io/cape-physics/pr-preview/pr-<number>/
```

The preview and production workflows share the same serialized Pages publisher and aggregate `gh-pages` artifact, preserving open previews during production releases and removing a preview when its pull request closes. Pushing `main` publishes the production subpath and smoke-tests the deployed HTML and assets.

`main` is protected: changes require a pull request, current required checks, resolved review conversations, and administrator enforcement. Repository merge settings allow merge commits only. The linear-history CI gate applies to commits introduced by each PR, preventing merge bubbles inside feature branches without conflicting with the required merge commit on `main`.

## License

MIT
