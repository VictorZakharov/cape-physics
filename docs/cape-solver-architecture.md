# Cape solver architecture

This note describes the behavior-preserving decomposition tracked by
[issue #21](https://github.com/VictorZakharov/cape-physics/issues/21). The public
facades remain `CapeSimulation` for the CPU/WebGL path and `GpuCapeSimulation`
for the WebGPU path. Callers should not depend on the extracted implementation
modules directly.

## Invariants

- Physics settings, numerical constants, constraint order, projection passes,
  collision order, dispatch order, and rendering behavior are shared with the
  pre-refactor implementation.
- CPU particles and WebGPU particles remain in world space. Only pinned
  neckline particles are driven directly by character anchors.
- `CapeSimulation` owns CPU particle state, rendering resources, the contact
  solver, and step orchestration.
- `GpuCapeSimulation` owns GPU resources, the precompiled compute graph,
  rendering resources, optional profiling/readback, and step orchestration.
- WebGPU state stays GPU-resident during normal animation. Readback and GPU
  fences are reserved for explicit diagnostic harnesses.
- The CPU/WebGL solver remains the behavioral reference. Extracted modules do
  not introduce a second set of tuning values or topology rules.

## Shared foundations

| Module | Responsibility |
| --- | --- |
| `CapeSolverTypes.ts` | Public solver contracts and packed diagnostic state. |
| `CapeSolverConstants.ts` | Cross-backend solver policy constants. |
| `CapeSettings.ts` | Public settings, defaults, and normalization. |
| `CapeInitialState.ts` | Shared particle initialization and anchor targets. |
| `CapeConstraintTopology.ts` | Ordered CPU constraint topology. |
| `GpuCapeTopology.ts` | GPU packing of the shared rest shape and ordered constraint stream. |

Shared modules must stay renderer-independent. Renderer imports belong in a
facade or a backend-specific module.

## CPU/WebGL path

`CapeSimulation` coordinates these focused components in the original step
order:

| Module | Responsibility |
| --- | --- |
| `CapeCpuPrediction.ts` | Verlet prediction, damping, gravity, and aerodynamic displacement. |
| `CapeCpuConstraints.ts` | Ordered distance-constraint projection. |
| `CapeContactSolver.ts` | Self, fold, body, cave, world, and rock contact orchestration. |
| `CapeCpuShapeGuards.ts` | Shape recovery and settled-cape guards. |
| `CapeCpuShapeDiagnostics.ts` | Shape and penetration observations used by tests and reports. |
| `CapeCpuMotionTracker.ts` | Step-start snapshots and settled-motion tracking. |

The facade owns the mutable `positions`, `previous`, inverse-mass, and predicted
vertical-displacement arrays. Extracted components receive those arrays by
reference; they do not copy state or reorder passes. Rendering geometry and
material lifecycle also remain in the facade because they are part of its
public mesh contract.

## WebGPU path

`GpuCapeSimulation` creates storage buffers and uniforms once, asks kernel
factories to build TSL nodes, and assembles the returned nodes with the exact
schedule from `GpuCapeDispatchSchedule.ts`.

| Module | Responsibility |
| --- | --- |
| `GpuCapeColliderPacking.ts` | Broadphase selection and fixed-stride body/world collider uploads. |
| `GpuCapeStepPreparation.ts` | Per-cape anchors, dynamics, and step uniform preparation. |
| `GpuCapePredictionKernels.ts` | World-space Verlet prediction and idle-drape recovery kernels. |
| `GpuCapeConstraintKernel.ts` | Ordered structural constraint projection. |
| `GpuCapeProjectionKernel.ts` | Self/fold, body, cave, sphere, and projection contact functions. |
| `GpuCapeVirtualBodyContactKernel.ts` | Character virtual-body triangle contact. |
| `GpuCapeRockFaceKernel.ts` | Convex rock-face and swept-face contact. |
| `GpuCapeReconciliationKernels.ts` | Contact flags and post-projection velocity reconciliation. |
| `GpuCapeDispatchSchedule.ts` | The immutable compute-node execution order. |

Kernel modules are factories: they receive buffer/uniform resources and return
TSL functions or compute nodes. They do not own renderer lifecycle, submit
work, resize active cape counts, or read buffers. This keeps shader math
reviewable independently from resource ownership and orchestration.

The facade intentionally retains:

- GPU buffer and uniform ownership;
- compute-graph construction and submission;
- the player mesh and bot instanced mesh;
- settings propagation and active-lane lifecycle;
- explicit profiling and diagnostic readback;
- disposal of resources it created.

## Mapping to Three.js `webgpu_compute_cloth`

The design reference is the official Three.js r185
[`webgpu_compute_cloth` source](https://github.com/mrdoob/three.js/blob/r185/examples/webgpu_compute_cloth.html).
The repository also retains `ThreeComputeClothProbe.ts`, a bounded diagnostic
adaptation used to distinguish Three.js/reference-workload failures from
application-cape failures. Production does not import or run the example.

| Three.js reference design | Production cape equivalent | Intentional difference |
| --- | --- | --- |
| `instancedArray` storage for particle positions, forces, spring lists, and spring data | Packed position, scratch, previous, topology, constraint, contact, and collider storage | Up to 11 cape lanes share one preallocated graph so bot-count changes do not compile new graphs. |
| Fixed vertices at the cloth edge | Pinned neckline particles derived from character anchors | Free particles remain in world space; anchor motion reaches them through constraints. |
| Spring-force pass followed by per-vertex force accumulation | Verlet prediction followed by ordered PBD constraint projection | The production solver preserves the CPU solver's row-major Gauss-Seidel constraint stream instead of accumulating independent spring forces. |
| Gravity, procedural wind, damping, and one sphere contact in the vertex pass | Prediction/aerodynamics plus staged body, virtual body, cave, sphere, rock, fold, and self contact | Collision stages and their order match the CPU/WebGL cape behavior. |
| Fixed-rate compute steps submitted through `WebGPURenderer.compute` | Fixed 120 Hz steps submitted as one precompiled compute sequence | The sequence contains multiple projection passes and reconciliation stages; its order is locked by a unit test. |
| Material `positionNode` reads particle storage and derives normals on the GPU | Cape node material reads packed particle storage and derives rendered positions/normals | Player and bot lanes share storage while preserving separate cape colors and instances. |
| Demo-only scene, sphere, controls, and wireframe helpers | Full character/cave scene remains outside the solver | Scene quality, renderer selection, startup recovery, and controls are not solver responsibilities. |

This mapping adopts the reference's GPU-resident storage and direct-rendering
pattern, not its simplified force model. Changes that attempt to make the
production graph resemble the example numerically would be physics changes and
belong in a separate issue.

## Tests and diagnostics

- Characterization tests lock the public facade exports and the CPU one-step
  state before and after extraction.
- Pure-boundary tests cover initial state, topology, packing, step preparation,
  CPU components, kernel factory boundaries, and dispatch order.
- CPU trajectories and collisions run in normal CI without widened tolerances.
- Source-level kernel boundary tests run in CI without requiring a GPU. Actual
  WebGPU execution stays in the local bounded probe and trajectory harnesses.
- `npm run verify` runs the source-size gate, TypeScript checks, unit tests,
  production build, and deterministic tech-demo harness.

## Source-size policy

`npm run check:size` enforces an 800-line default limit for TypeScript files
under `src/`. Explicit caps document pre-existing debt and prevent it from
growing. The command is part of `npm run check`, which is already required by
CI. A file over its budget must be split by responsibility, or its exception
must be deliberately revised in review; the check never updates budgets
automatically.
