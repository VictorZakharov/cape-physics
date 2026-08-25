# Cape Physics

A cinematic, all-procedural Three.js and TypeScript tech demo: guide an armored traveller through a torchlit cave while a position-based cape reacts to locomotion, airflow, walls, and the character body. Shallow pools respond independently to boots and naturally falling ceiling drops.

No downloaded models or textures are used. The cave, character, cape fabric, water, minerals, particles, and material maps are generated at runtime.

## Run locally

```powershell
bun install
bun run dev
```

Open the printed local URL. A current WebGL 2 browser and hardware acceleration are recommended.

### Controls

- `W A S D` — camera-relative movement
- Left- or right-mouse drag — orbit the third-person camera
- Mouse wheel — zoom
- `Esc` — release pointer interaction

The renderer is uncapped and supports displays up to 144 Hz and beyond. A fixed 120 Hz physics step keeps the cape stable independently of render rate; adaptive resolution protects frame pacing when the GPU is under load.

## Highlights

- Position-based cape with structural, shear, and bending constraints
- Aerodynamic pressure, relative-velocity drag, gusts, floor collision, and body collision spheres
- Five walkable procedural puddles with localized shader ripples
- Thirteen deterministic ceiling-drip emitters, splash particles, and separate footstep events
- Procedural rock color, height, normal, and roughness maps
- Three organic wet speleothem profiles with curved deposition bands and instanced flowstone collars
- Instanced cave formations and crystals; merged mineral branches for a low draw-call budget
- Flickering torch meshes, emissive flames, bloom, fog, dust, and glowing mineral veins
- AgX tone mapping, physically based materials, soft shadows, and a single nearest-torch shadow proxy
- Fixed-size nearest-light pools that prevent traversal-time PBR shader recompilation
- Pixel-budgeted post-processing and rate-limited adaptive-resolution reallocations
- Compact live FPS, frame-time, average, one-percent-low, and sparkline HUD
- Keyboard accessibility, reduced-motion support, responsive UI, and loading feedback

## Quality gates

```powershell
bun run check          # strict TypeScript plus unit tests
bun run harness        # renderer-free, deterministic 12-second systems traversal
bun run audit:visual   # production build plus eight-angle Edge/Chrome CDP render audit
bun run verify         # check, production build, and systems harness
```

The systems harness constructs the complete scene graph without a browser or GPU and checks finite cloth state, constraint error, drip/step activity, geometry validity, triangle and draw-call budgets, shadow-light count, and average physics-step cost.

The visual audit is repository-owned rather than test-framework-dependent. It launches installed Edge or Chrome headlessly through the DevTools protocol, drives the deterministic in-app harness, renders rear/side/front, reversal-wrap, puddle, dynamic-water, and mineral close-ups, and fails on:

- browser exceptions or console errors;
- broken movement or camera traversal;
- missing natural or footstep ripple emissions;
- unstable cape constraints;
- any cape penetration during an aggressive reversal;
- shader-program growth during a 1,728-frame, 144 Hz traversal across light boundaries;
- oversized high-density post-processing targets or severe synchronized long frames;
- unchanged water across simulated time; or
- a changing frame while simulation time is paused.

Frames and a diagnostics manifest are written to `artifacts/visual-audit/` and intentionally ignored by Git.

## Architecture

The implementation is split by responsibility under `src/`: `physics` owns the cape solver, `world` owns cave systems, `player` and `camera` own interaction, `core` owns timing/render quality, and `testing` exposes renderer-independent integration checks. Each runtime system has a narrow update surface and deterministic seeded inputs.

The cloth solver follows the real-time position-based dynamics approach described by Müller et al. Water shading borrows the proven ideas from the sibling `beautiful-water` project—multi-scale animated slopes, Schlick Fresnel, normal-variance roughness, and GGX highlights—but specializes them for bounded, reactive cave pools.

Useful implementation references:

- [Position Based Dynamics (Müller et al.)](https://www.cs.toronto.edu/~jacobson/seminar/mueller-et-al-2007.pdf)
- [Three.js physically based materials](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)
- [Three.js shadow performance guidance](https://threejs.org/manual/en/shadows.html)
- [Three.js post-processing and bloom example](https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html)
- [Vite static deployment guidance](https://vite.dev/guide/static-deploy.html)
- [GitHub Pages custom Actions workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Deployment

Pushing `main` runs only the deployment workflow in `.github/workflows/deploy-pages.yml`; there is no CI workflow. It builds for `/cape-physics/`, verifies asset paths, deploys the Pages artifact, then smoke-tests the published HTML and assets.

The GitHub repository can remain private, but GitHub Pages availability for private repositories depends on the account plan, and the published Pages site itself is public. See [GitHub Pages visibility](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#about-visibility-of-your-site).

## License

MIT
