# Cape Physics

A cinematic, all-procedural Three.js and TypeScript tech demo. Guide an armored traveller through a torchlit cave while a position-based cape wraps around the animated body, collides with cave geometry, and responds to movement and airflow. Shallow pools react independently to footsteps and naturally falling ceiling drops.

[Launch the live demo](https://victorzakharov.github.io/cape-physics/)

No downloaded models or textures are used. The cave, character, cloth, water, minerals, particles, and material maps are generated at runtime.

## Run locally

```powershell
bun install
bun run dev
```

Open the printed local URL. A current WebGL 2 browser with hardware acceleration is recommended.

### Controls

- `W A S D` — camera-relative movement
- Left- or right-mouse drag — orbit the third-person camera
- Drag upward — look upward (reversed vertical orbit)
- Mouse wheel — zoom
- `Esc` — release pointer interaction

The renderer is uncapped for displays up to 144 Hz and beyond. Physics runs at a fixed 120 Hz so cloth behavior is independent of render rate, while adaptive resolution protects GPU frame pacing.

## Highlights

- Position-based cape with structural, shear, short-range bending, and long-range anti-fold constraints
- Allocation-free spatial-hash self-collision with explicit cloth thickness
- Dynamic shoulder, torso, hip/belt, and arm capsules sized to the rendered character silhouette
- One-sided body projection that lets cloth wrap around armor without selecting the character's front surface
- Swept sphere contact for fast cape impacts against procedural formations, rocks, torches, and mineral crystals
- 657 deterministic cave-object collision proxies plus analytic floor, bank, wall, and ceiling contact
- Terrain-aware player grounding that climbs the cave shell and walkable rocks instead of clipping through slopes
- Wide third-person pitch range, collision-shortened camera boom, ground-safe close orbit, and 50% near-camera character/cape fade
- Five walkable procedural puddles with continuous height-field normals and antialiased edges
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

The renderer-free harness constructs the complete scene graph and dynamically advances cloth, animation, water drops, footsteps, torches, and mineral systems. It checks finite state, structural error, body and cave penetration, cloth self-separation, downward settling, ripple activity, geometry validity, triangle/draw-call budgets, stable light counts, and average physics-step cost.

The visual audit launches an installed Edge or Chrome directly through the DevTools protocol; it does not depend on a browser-testing framework. It drives the deterministic in-app harness through 15 rendered studies, including:

- rear, side, front, aggressive reversal, and fully settled cape views;
- real LMB and RMB reversed-drag input;
- sharp look-up and close-camera fade views with camera/ground clearance assertions;
- dynamic uphill traversal with player/terrain contact checks;
- observed cape contact against a generated stalagmite;
- footstep and ceiling-drop ripple evolution plus a low water close-up; and
- a 1,728-frame, 144 Hz traversal across torch and mineral light boundaries.

The audit fails on browser errors, movement regressions, body/cave/self penetration, inverted resting cloth, missing dynamic contacts or ripples, shader-program growth, oversized render targets, severe long frames, or nondeterministic paused frames. Its saved images make silhouette, clipping, and water-faceting regressions directly reviewable. Images and a diagnostics manifest are written to `artifacts/visual-audit/` and intentionally ignored by Git.

## Architecture

The implementation is divided by responsibility under `src/`:

- `physics` owns cloth integration, constraints, capsule/world contact, and self-collision;
- `world` owns procedural geometry, shared collision proxies, terrain resolution, water, lights, and atmosphere;
- `player` and `camera` own movement, animation, interaction, orbit safety, and close fade;
- `core` owns fixed timing, rendering, performance telemetry, and adaptive quality; and
- `testing` owns the renderer-independent integration harness.

The cloth solver follows the real-time position-based dynamics approach described by Müller et al. Its contact path combines projected resting constraints with swept fail-safe collision, following the robust cloth-collision principle described by Bridson, Fedkiw, and Anderson. Water shading adapts the multi-scale animated slopes, Fresnel response, normal-variance roughness, and GGX highlights proven in the sibling `beautiful-water` project, specialized for bounded reactive cave pools.

Useful implementation references:

- [Position Based Dynamics — Müller et al.](https://www.cs.toronto.edu/~jacobson/seminar/mueller-et-al-2007.pdf)
- [Robust Treatment of Collisions, Contact and Friction for Cloth Animation — Bridson, Fedkiw, and Anderson](https://physbam.stanford.edu/~fedkiw/papers/stanford2002-01.pdf)
- [Three.js `ShaderMaterial`](https://threejs.org/docs/pages/ShaderMaterial.html)
- [Three.js shadow performance guidance](https://threejs.org/manual/en/shadows.html)
- [Vite static deployment guidance](https://vite.dev/guide/static-deploy.html)
- [GitHub Pages custom Actions workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Deployment

There is intentionally no CI workflow. Pushing `main` runs only `.github/workflows/deploy-pages.yml`, which builds for `/cape-physics/`, verifies Pages-safe asset paths, deploys the static artifact, and smoke-tests the published HTML and assets.

The GitHub repository can remain private, but GitHub Pages availability for private repositories depends on the account plan, and the published Pages site itself is public. See [GitHub Pages visibility](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#about-visibility-of-your-site).

## License

MIT
