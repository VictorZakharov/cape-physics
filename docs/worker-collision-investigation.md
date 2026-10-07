# Worker collision cost and candidate search

At maximum population, 51 capes contain **11,934 particles** (51 x 234). Each of ten CPU workers normally owns five bot capes / 1,170 particles. Main-thread and asynchronous worker costs remain separate.

## Measured candidate search (Part 3)

The baseline probe restores candidate-search code from `e643183`. Fifty seeded capes follow authored, deterministic bot paths at fixed 1/30 s deliveries, including the production freshest-pose anchor rebase and serialized input updates. Ninety warm-up steps precede sixty measured steps (3,000 cape steps). Findings were recorded before production search changes; the final replay tightens the counter scope and uses the worker input path.

| Phase | Tests / particle / step, mean | Worst particle / step | Positive in-range tests / particle / step | Coarse ms / cape step, before / after | Baseline broadphase |
| --- | ---: | ---: | ---: | ---: | --- |
| body | 472.850 | 1,563 | 2.712 | 2.156 / 2.203 | Capsule Y/X/Z rejection; cape bounds, Y-row and triangle bounds for faces |
| self | 8.084 | 150 | 0.855 | 0.874 / 0.642 | 521-bucket spatial hash, 27 cells, exact-cell/topology rejection |
| fold | 18.889 | 20 | 0.063 | 0.066 / 0.070 | Fixed vertical neighbors plus row span/curl guards; no global candidate list |
| world | 91.110 | 2,737 | 0.065 | 0.913 / 0.980 | Anchor-distance prefilter, swept cape AABB, point/triangle bounds and CCD |
| cave | 45.598 | 140 | 0.167 | 0.902 / 0.983 | Cached analytic profiles, near-boundary face masks |

Tests include repeated projection and reconciliation passes. A face query counts once for each of its three vertex memberships; self pairs count both particle memberships. Positive range means overlap, penetration, swept contact, or a triggered guard inequality, counted per invocation rather than unique contacts. Fold's timing also includes span/curl guards. "Tests" includes early bounding rejection inside a tested primitive; it is not a count of expensive closest-point operations alone.

Phase times come from an independent fresh replay with only coarse method clocks and no candidate counters or their monkey patches, under Bun 1.3.11 on the same Windows machine. They are per **cape** step, not per five-cape worker step, and are not the browser report timings below. Counter-instrumented wall times are retained in raw evidence but must not be used as solver-performance figures.

Inventory: **2,062 static proxies** = 1,835 formations + 78 rocks + 77 torches + 72 minerals. Each cape also has **15 animated body capsules**. Analytic cave floor, ceiling and side profiles are separate from the proxy count. The baseline anchor-radius filter examines all 2,062 proxies and accepts **64.449 per cape step** as potentially within cloth reach; actual positive contact memberships are in the table. Self hash traversal visits **204.647 chain entries per particle step** for **8.084 actual pair-distance tests**. These scan/traversal excesses, and rejected body-face queries, justify conservative candidate-search changes.

Static world geometry is built once and serialized to each worker at initialization. Body capsule metadata is sent at cape registration; subsequent steps update reused capsule endpoints from a 90-float / **360-byte** array per cape, plus anchor and velocity data. The input/rebase/copy portion measures **0.01394 ms/cape step before** and **0.01418 ms after** in the separate CPU replay. Prepared-body records are reused and refreshed from animated endpoints. Main-thread packet creation and IPC/result packing are outside worker solve compute; no per-step static-world rebuilding or retransmission occurs.

## Candidate changes and regression (Part 4)

- Static world proxies get a uniform grid built once per worker. Query masks and index arrays are reused; candidates are emitted in original collider order, then tested by the unchanged anchor-radius predicate. Full scans fall **2,062 -> 381.447** candidates/cape step; accepted proxies remain exactly **64.449**. The new grid conservatively removes global scanning; existing world narrowphase tests remain unchanged.
- Self hash storage increases from 521 to 4,093 buckets. Hash-chain visits fall **204.647 -> 99.063** per particle step. Exact cells, topology rejection and valid pair order remain unchanged; actual pair and positive-contact counts match.
- Body-face row rejection adds X/Z bounds alongside existing Y bounds. Bounds expand after corrections so later faces cannot miss a newly reachable contact. Tested memberships fall **472.850 -> 443.394** per particle step (worst **1,563 -> 1,482**); positive memberships remain exactly **2.712**. Body cost did not improve in the isolated coarse replay; this is retained rather than presented as a speedup.

Fold uses fixed authored local neighbors, and cave uses a handful of direct analytic boundary checks with cached profiles and existing face masks. Their many negative scalar guards do not represent scanning a global collection. Neither phase's behavior or arithmetic was changed. Constraint solving, iterations, parameters, visuals, step caps and adaptive-step decisions are unchanged.

The deterministic regression records every particle coordinate, in Float64, for **all 50 capes over 600 steps** at fixed 1/30 s, including worker input rebasing. All **21,060,000 coordinates match exactly**: maximum deviation **0**, against unchanged **1e-5** tolerance. Conservative-grid inclusion and original index order are also checked against 150 randomized queries over 500 colliders.

## Reporting and profiling (Parts 1, 2 and 5)

The panel and copied report show world/body collider counts and worker-local constraints, body, self+fold, world+cave and other costs in ms/worker step and percentages. Other includes input updates, prediction, preparation and sleeping updates. Reconciliation collision calls belong to their collision phases. Compute is measured every batch; coarse phase shares are sampled every fourth batch and explicitly apportioned to the all-step mean compute, so the displayed phase sum equals compute. At least eight samples per worker and thirty pooled samples are required; otherwise phases say insufficient samples. Individual sample counts and sampling scope are printed in the report.

The profiler originally observed 5.64% overhead in an every-batch Bun comparison. Quarter-batch sampling measured 1.17% in a separate Bun trial. Separate browser trials still measured 2.71% with substantial scheduling/frequency drift; that failed result is retained. The final browser test primes both clock paths, then solves identical off/on states consecutively with alternating ABBA order, four matched 600-step pairs. Chromium 149 worker totals: **40,348.10 ms off / 40,373.10 ms on**, or **0.062% measured overhead**, below 2%. This is an isolated five-cape browser worker on the same machine, not an OS CPU-utilization measurement.

Particle throughput now includes all real player step calls plus delivered bot steps, with awake-player rate and bot particle-steps separately reported. Sleeping fast-path updates count as step calls and are explicitly labeled; this is not a claim that every call runs every projection pass. No nominal 120 Hz rate is substituted for the delivered player rate.

`?workers=3` overrides the CPU worker budget (bounded by available logical cores minus one and maximum ten). The report names the override and explicitly says **CPU speed unchanged**: this does not emulate a slower four-thread CPU. Existing automatic policy reserves two cores. `?workerProfile=0` disables phase clocks for comparisons without altering solve compute measurement. Numeric emphasis, fixed worker row heights, ANGLE identification, device-memory approximation, and the existing Timing caveat remain.

## Same-machine copied reports and limitations

Final captures used the same RTX 4070 Ti / 24-thread Windows machine, Chromium 149, 50 bots, walking player, default cloth settings, 1.0 scale, 1582 x 748 canvas, three seconds excluded warm-up and a fifteen-second steady-state window. Both native backends and all six captures completed with clean temporary-profile removal. Preliminary Chrome 154 WebGL reports measured 38.83 -> 37.21 ms/step at ten workers and 122.99 -> 121.48 ms/step at three workers. Body remained the largest phase. The three-worker after window recorded a **1,233.20 ms** frame and five frames >=50 ms; these genuine steady-window stalls were not excluded. This is not evidence of uniformly improved frame cadence.

Chrome 154 WebGPU scene startup timed out twice. Two dedicated audit profiles still fail cleanup with Windows access denied; failures were surfaced and a targeted cleanup retry recorded. The Chromium 149 worker overhead test cleaned successfully. Final backend evidence is kept separate by browser version; no cross-version speed comparison is made.

Validation: full source budgets, TypeScript, **266 tests passed / six existing stress tests skipped / zero failures**. The renderer comparison runner builds both fixtures from the same current instrumentation, restoring only baseline candidate search for "before." All task temporary data is under `artifacts/.tmp/` on G: and cleanup runs in finally; access-denied cleanup is treated as a failure.

### Final browser measurements

| CPU worker budget | Compute ms / worker step, before -> after | Solve-wall busy, before -> after | Delivered bot steps/s/cape, before -> after | Simulated DT ms, before -> after | Bot particle-steps/s, before -> after |
| --- | ---: | ---: | ---: | ---: | ---: |
| 10 automatic | 22.42 -> 18.27 | 67.4 -> 69.8% | 30.09 -> 38.26 | 27.04 -> 23.81 | 352045 -> 447649 |
| 3 override | 66.04 -> 70.46 | 89.5 -> 89.6% | 13.57 -> 12.73 | 33.33 -> 33.33 | 158771 -> 148907 |

Ten-worker compute fell **18.5%** in this captured window while bot delivery rose **27.2%**. Busy fraction rose slightly as more steps were delivered: **6,739.05 -> 6,983.06 worker solve-wall ms/s** in total. The new delivered rate and shorter DT use the unchanged adaptive logic; no cap was raised. The three-worker result regressed **6.7%** in compute time and remains near **90% busy**; bot delivery fell **6.2%**. Queue counts remain bounded at one pending batch per worker. This budget is still a saturated case, and no low-thread speedup is claimed. Separate coarse timing shows self-hash traversal savings, while body/cave/world costs do not uniformly improve; the live windows also differ in delivered simulation time and collision workload.

At ten workers after the change, the measured phase shares are constraints **11.5%**, body **41.9%**, self+fold **16.8%**, world+cave **25.5%**, other **4.4%**. Collision/shape work totals roughly **84%**. These cost labels now expose the cause directly on the panel.

WebGPU uses the packed GPU solver, so CPU-worker phase/budget lines are correctly absent. Before/after GPU frame time is **2.97 / 2.95 ms**, including compute **2.57 / 2.56 ms**; rendered averages **121.65 / 114.80 FPS** are preserved rather than attributed to the CPU search changes. Both WebGPU captures report native WebGPU with timestamp queries, no fallback and full resolution. The six primary comparison windows have no frames >=50 ms. The extra final three-worker UI capture recorded another **2,708.90 ms** steady-window frame (one frame >=50 ms), alongside the preliminary **1,233.20 ms** stall. Both reports are retained. Severe lows therefore cannot all be dismissed as startup warm-up; the exact cause of these sporadic stalls is not established by this candidate-search audit.

The final five-line worker block separates cape and particle assignments, including uneven 16/17-cape worker splits. Numeric transitions retain identical **56 px** row height; worker and phase text each measure **212 px scroll/client width** (no overflow). The panel is **240 x 426.44 px** in a 748 px viewport. Numeric phase values retain the brighter `rgba(220, 244, 237, 0.7)` style. The extra UI run and targeted seventeen-test check completed successfully with clean profile removal.

### Evidence and reproduction

- Copied WebGL reports: [ten workers before](worker-collision-evidence/before-webgl.txt) / [after](worker-collision-evidence/after-webgl.txt), [three workers before](worker-collision-evidence/before-3workers-webgl.txt) / [after](worker-collision-evidence/after-3workers-webgl.txt).
- Copied WebGPU reports: [before](worker-collision-evidence/before-webgpu.txt) / [after](worker-collision-evidence/after-webgpu.txt).
- Final layout / numeric-color proof: [UI diagnostics](worker-collision-evidence/ui-final-3workers-webgl.json), [UI copied report including the 2.709-second stall](worker-collision-evidence/ui-final-3workers-webgl.txt).
- Candidate counters plus independent coarse timings: [baseline](worker-collision-evidence/candidate-audit-before.json) / [optimized](worker-collision-evidence/candidate-audit-after.json).
- [Exact trajectory regression](worker-collision-evidence/trajectory-regression.json), [paired browser profiler overhead](worker-collision-evidence/profile-overhead-browser.json), [failed separate-trial measurement](worker-collision-evidence/profile-overhead-browser-separate-trials.json), [final capture errors: none](worker-collision-evidence/capture-errors-worker-final.json).
- [Preliminary Chrome 154 stall report](worker-collision-evidence/preliminary-chrome154-after-3workers-webgl.txt), [startup/cleanup failures](worker-collision-evidence/preliminary-capture-errors.json), [targeted cleanup retry failures](worker-collision-evidence/cleanup-retry.json).

Run `bun scripts/audit-collision-candidates.ts` for baseline counters and coarse timings, then set `CAPE_COLLISION_AUDIT_STAGE=after` for optimized search. Run `bun scripts/verify-worker-trajectories.ts` for all 600 steps. Run `node scripts/measure-worker-profile-browser.mjs` for the paired native worker comparison (`CAPE_BROWSER_PATH` can select an installed browser); `bun scripts/measure-worker-profile-overhead.ts` is the CPU-runtime version. Run `node scripts/capture-worker-comparison.mjs` for both backend reports and the three-worker comparison. Baseline fixtures require commit `e643183` locally. Browser/profile/TEMP/TMP data stays under repository-local temporary directories, removed in finally.

Large-cloth mode is outside this change.
