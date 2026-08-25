# Cape Physics

[![CI](https://github.com/VictorZakharov/cape-physics/actions/workflows/ci.yml/badge.svg)](https://github.com/VictorZakharov/cape-physics/actions/workflows/ci.yml)
[![Deploy GitHub Pages](https://github.com/VictorZakharov/cape-physics/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/VictorZakharov/cape-physics/actions/workflows/deploy-pages.yml)

A cinematic, all-procedural Three.js and TypeScript tech demo. Guide an armored traveller through a torchlit cave while a position-based cape wraps around the animated body, collides with solid cave geometry, and responds to walking, running, gravity, and airflow. Clear shallow pools react independently to footsteps and naturally falling ceiling drops.

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
- Left- or right-mouse drag - orbit the third-person camera
- Drag upward - look upward (reversed vertical orbit)
- Mouse wheel - zoom
- `Esc` - release pointer interaction

The renderer is uncapped for displays up to 144 Hz and beyond. Physics runs at a fixed 120 Hz so cloth behavior is independent of render rate, while adaptive resolution protects GPU frame pacing.

## Highlights

- Position-based cape with structural, shear, short-range bending, and long-range anti-fold constraints
- Body-clear curved neckline attachment across both shoulders, backed by a procedural gorget and paired cape clasps
- Allocation-free spatial-hash self-collision with explicit cloth thickness
- Dynamic shoulder, torso, hip/belt, and arm capsules sized to the narrower rendered silhouette
- One-sided body projection that lets cloth wrap around armor without selecting the character's front surface
- Swept vertex contact plus barycentrically weighted sphere-to-cloth-triangle contact, closing the gap where a narrow object can pierce a face while all three vertices remain clear
- Geometry-derived sphere chains that conservatively enclose curved/elliptical stalactites, stalagmites, elongated rotated rocks, torch hardware, and mineral crystals
- 2,260 deterministic solid-object proxies plus analytic floor, bank, wall, and ceiling contact
- Cloth-motion-aware damping and deterministic sleep/wake behavior that cannot freeze a suspended panel and does not slow gravity-driven settling
- Terrain-aware player grounding that climbs the cave shell and walkable rocks instead of clipping through slopes
- Human-scale procedural armor proportions, tapered torso and limbs, fitted helmet ridge, restrained walk/run bob, and rate-limited eased turning
- Wide third-person pitch range, collision-shortened camera boom, ground-safe close orbit, and a smooth 12% near-camera fade composited from a depth-resolved character/cape layer
- Five walkable, optically clear procedural pools seated in shared height-field basins with submerged interiors, dry containing rims, continuous normals, and antialiased edges
- Thirteen deterministic ceiling-drip emitters, splash particles, and independent footstep ripples
- Procedural rock color, height, normal, and roughness maps
- Organic wet speleothem profiles with curved centerlines, deposition bands, and instanced flowstone collars
- Flickering torches, emissive mineral veins, bloom, fog, dust, AgX tone mapping, PBR materials, and soft shadows
- Fixed-size nearest-light pools and fixed-allocation physics paths that avoid traversal-time shader compilation and garbage-collection stalls
- Pixel-budgeted post-processing and rate-limited adaptive-resolution reallocations
- Compact live FPS, frame-time, average, one-percent-low, and sparkline HUD

## Quality gates

```powershell
bun run check          # strict TypeScript plus renderer-free unit tests
bun run harness        # deterministic 12-second full-scene systems traversal, no browser or GPU
bun run audit:visual   # production build plus repository-owned Edge/Chrome CDP render audit
bun run verify         # check, production build, and systems harness
```

The renderer-free harness constructs the complete scene graph and dynamically advances cloth, character animation, water drops, footsteps, torches, and mineral systems. It checks finite state, structural error, vertex and cloth-face penetration, pinned-neckline/body clearance, self-separation, downward settling, basin depth and rim containment, ripple activity, geometry validity, triangle/draw-call budgets, stable light counts, and average physics-step cost. Focused tests also reproduce a narrow collider piercing the center of a cloth triangle while every vertex is clear, force a 148-degree cape rotation to prove that a suspended panel cannot sleep, verify transformed procedural geometry is enclosed by its proxies, prove eased turning plus Shift running and gait bob, and validate the opaque depth-writing inputs plus clamped opacity of the close-fade compositor.

The visual audit launches an installed Edge or Chrome directly through the DevTools protocol; it does not depend on a browser-testing framework. It drives the deterministic in-app harness through 19 rendered studies, including:

- rear, side, true front, neckline, aggressive reversal, running, and fully settled cape views;
- real LMB and RMB reversed-drag input;
- sharp look-up and strongly faded close-camera views with camera/ground clearance assertions;
- dynamic uphill traversal with player/terrain contact checks;
- both sides of observed cape contact against a generated stalagmite;
- footstep and ceiling-drop ripple evolution, a low clear-water close-up, and a side-on view proving the water is below its dry rim; and
- a 1,728-frame, 144 Hz running traversal across torch and mineral light boundaries.

The audit fails on browser errors, movement regressions, body/cave/self/cloth-face penetration, idle trembling, inverted resting cloth, missing dynamic contacts or ripples, shader-program growth, oversized render targets, severe long frames, or nondeterministic paused frames. Its saved images make silhouette, clipping, water clarity, and faceting regressions directly reviewable. Images and a diagnostics manifest are written to `artifacts/visual-audit/` and intentionally ignored by Git.

## Architecture

The implementation is divided by responsibility under `src/`:

- `physics` owns cloth integration, constraints, body/world contact, triangle contact, rest state, and self-collision;
- `world` owns procedural geometry, geometry-derived collision proxies, terrain resolution, water, lights, and atmosphere;
- `player` and `camera` own movement, running, animation, interaction, orbit safety, and close fade;
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

Every push and pull request runs strict TypeScript, renderer-free unit tests, the deterministic full-scene harness, production and Pages builds, and asset-path validation. Pull requests additionally run the 19-angle dynamic Windows render audit and upload its PNG/JSON evidence. PR history is checked for merge commits so branches stay reviewable and linear.

Same-repository pull requests receive a sticky preview link at:

```text
https://victorzakharov.github.io/cape-physics/pr-preview/pr-<number>/
```

The preview and production workflows share the same serialized Pages publisher and aggregate `gh-pages` artifact, preserving open previews during production releases and removing a preview when its pull request closes. Pushing `main` publishes the production subpath and smoke-tests the deployed HTML and assets.

## License

MIT
