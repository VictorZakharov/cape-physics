# Vertex-only body lists and main-thread measurement

Baseline: merged PR #32 (`15f268a`). Measurements use this Windows desktop, RTX 4070 Ti and 24 logical threads, with Chromium 149. The reported MacBook Air is unavailable. No Mac timing, core-performance or thermal result is claimed; worker-budget tests here do not emulate its CPU.

## Change and scope

Keep the vertex/capsule neighbour lists from the previous exactness trial, without its slower triangle/sample lists. A single skin constant is 0.026 scene units. Reference positions and collider masks use preallocated typed arrays; validity resets each cape step. The unchanged vertex narrowphase's necessary vertical and XZ bounds, expanded by skin, define conservative candidates. Displacement strictly below skin preserves rejection; rebuild before reuse when exceeded, and after each correcting contact so a correction inside a sweep cannot introduce an omitted later collider. Surviving tests retain collider order. More than 32 colliders falls back to the original full sweep. Assertions are off by default and test every omitted pair with the original narrowphase.

Body colliders remain constant throughout projection and reconciliation, measured in every body run by the regression audit. The shared CPU player path gets the same optimization. Triangle/sample, world, cave, self/fold collision, constraints, margins, iterations, adaptive stepping, worker selection and visuals are unchanged. WebGPU simulation is separate and receives no solver optimization.

The copied report adds a main-thread simulation breakdown: player CPU solve; player/bot controllers and landing handling; bot input preparation/submission and worker flush; result reconciliation/arrival processing including completed-cape normals; geometry/presentation; and the remaining population/clock/scheduling work. Coarse disjoint clocks sample every fourth callback, after the same three-second warm-up and resets as the existing statistics. Fixed rings retain up to the last 15 seconds; at least 30 samples are required. Phase sums equal the raw sampled simulation mean, explicitly distinct from the existing all-frame mean. The HUD layout and numerical styling are unchanged. Vertex list-build comparisons are excluded from narrowphase test counts but included in execution time, as the report states.

## Paired worker measurements

Dedicated Chromium worker, same authored world and deterministic paths, fixed 1/30 s steps, 90 warm-up plus 600 measured steps, ABBA ordering. These runs were uncontended by other audits. Batch sizes approximate five capes/default ten workers, eight-nine capes/six workers and sixteen-seventeen capes/three workers. Phase clocks are coarse; triangle time is measured separately and vertex time is body minus triangle. All costs are per worker batch, not per cape.

| Capes/batch | Compute before / after | Compute reduction | Body before / after | Vertex before / after | Triangle before / after |
| --- | ---: | ---: | ---: | ---: | ---: |
| 5 | 13.720 / 12.572 ms | 8.4% | 6.257 / 5.282 | 1.779 / 0.705 | 4.477 / 4.577 |
| 9 | 33.979 / 30.977 ms | 8.8% | 15.660 / 12.617 | 4.562 / 1.593 | 11.098 / 11.024 |
| 17 | 64.495 / 59.511 ms | 7.7% | 29.013 / 23.267 | 8.539 / 2.880 | 20.474 / 20.387 |

Vertex time is 2.5-3.0x faster; total body cost falls 15.6-19.8%. All vertex correction counts, triangle test counts and triangle correction counts match exactly before/after in every batch. For five capes, vertex calls fall from 170.08 to 10.33 per delivered particle per step. The unchanged triangle incidence remains 264.58; total narrowphase counts fall from 434.66 to 274.91. Candidate-build work is included in the measured cost.

This is a smaller incremental improvement than the previous combined-list ticket's 1.5x body target. That ticket archived the complete slower trial; this follow-up retains only the consistently beneficial vertex path under the new improvement request. It makes no claim of a severalfold combined-body speedup.

Evidence: [five capes](vertex-only-evidence/paired-5capes-default.json), [nine](vertex-only-evidence/paired-9capes-default.json), [seventeen](vertex-only-evidence/paired-17capes-default.json).

## Strict regression

Normal and assertion runs each match all 21,060,000 Float64 coordinates bit for bit across 50 capes and 600 steps. PR #31's heavy-contact pushes during steps 181-240 are retained. Collider state was unchanged in all 361,863 body calls over 30,000 cape steps. Assertions checked 1,125,995,276 skipped vertex pairs with zero correcting pair skipped. Candidate means are 1.084 colliders/build; maximum five, with 0.638 actual rebuilds per delivered particle per step, worst 35 builds including initial creation, and zero overflow. No per-particle clocks occur in production; detailed candidate counters are audit-only.

The 1e-6 skin rebuild-stress run also matches all 21,060,000 coordinates exactly. It performed 65,894,775 rebuilds excluding initial creation, worst 49 builds per element/step, and checked 1,150,386,904 omitted pairs with no correcting pair skipped. Normal, assertion and tiny-skin runs all observed zero storage overflow. A separate 45-collider, five-step fixture exercised 1,105 vertex overflow fallbacks and matched all 3,510 coordinates exactly. The overflow audit's skipped-pair counter was reset and rerun separately so it does not inherit the preceding assertion count.

Raw evidence: [normal](vertex-only-evidence/vertex-regression-0.026.json), [assertions](vertex-only-evidence/vertex-regression-assert-0.026.json), [tiny skin](vertex-only-evidence/vertex-regression-assert-0.000001.json), [overflow](vertex-only-evidence/vertex-overflow.json).

## Native reports and limitations

Same desktop, 50 bots, moving player, three-second warm-up followed by 15-second reports. These sequential captures are useful integration evidence, not matched-pose causal benchmarks: JIT, rendering and scene/contact variation can change their timing. All outcomes, including the slower automatic-budget after capture, are retained. Six workers approximates the normal budget on eight logical threads, but does not emulate Mac CPU speed or thermal behavior.

| Workers | Worker compute before / after | Body before / after | Busy before / after | Bot delivery before / after | Main physics before / after |
| --- | ---: | ---: | ---: | ---: | ---: |
| Automatic 10 | 22.47 / 28.19 ms | 9.70 / 10.66 ms | 66.3 / 66.1% | 29.53 / 23.56 Hz | 14.40 / 16.91 ms |
| Override 6 | 41.38 / 40.75 ms | 18.06 / 15.78 ms | 78.9 / 79.1% | 19.07 / 19.42 Hz | 15.26 / 14.46 ms |
| Override 3 | 88.71 / 72.55 ms | 38.40 / 28.72 ms | 88.5 / 88.3% | 10.02 / 12.17 Hz | 13.90 / 11.96 ms |

The isolated ABBA worker runs above establish the repeatable compute saving; these native captures do not establish an overall FPS gain. Vertex tests fall to roughly 9-10 per particle/step here while unchanged triangle incidence remains 260-274. Total BODY test figures include both kinds.

The new report identifies CPU player solving as about half the sampled main-thread simulation cost on this desktop. At six workers its 175 samples show player 6.97 ms, controllers 2.81, worker input preparation 2.23, results 1.79, presentation 0.37 and other 0.02: sampled total 14.18 ms. This is a diagnosis here, not a measurement of the unavailable Mac. The Mac's large body cost also includes triangle/sample collision, which this patch deliberately leaves unchanged.

Raw WebGL reports: [automatic before](vertex-only-evidence/vertex-before-webgl.txt), [after](vertex-only-evidence/vertex-after-webgl.txt); [six before](vertex-only-evidence/vertex-before-6workers-webgl.txt), [after](vertex-only-evidence/vertex-after-6workers-webgl.txt); [three before](vertex-only-evidence/vertex-before-3workers-webgl.txt), [after](vertex-only-evidence/vertex-after-3workers-webgl.txt). Matching JSON files include full diagnostic details.

The [WebGPU capture](vertex-only-evidence/vertex-after-webgpu.txt) confirms requested/active WebGPU with no fallback and timestamp-query timing. Its separate GPU solver is unchanged. CPU player/input/result clocks correctly show zero; controllers and remaining CPU command preparation are measured, not GPU completion. The existing Timing caveat is retained on both backends.

## Observer overhead

A separate paired ABBA Chromium CPU fixture runs identical paths, 51 controllers, one CPU player cape, 50 packed inputs and two 120-Hz steps per callback. Ninety callbacks warm up and 600 are measured, every fourth callback profiled, snapshots every 15 callbacks. Positions and input checksums match. Mean callback cost is 9.7832 ms without the observer versus 9.7893 with it: +0.0062 ms, +0.063%. This is an isolated desktop estimate, excludes asynchronous result processing and rendering, and is not a Mac overhead bound. [Raw result](vertex-only-evidence/main-clock-overhead.json).

A separate [native disabled-profile report](vertex-only-evidence/vertex-profile-off-webgl.txt) prints the explicit disabled label. It was faster than the enabled automatic capture (14.69 versus 16.91 ms main physics), but the moving-scene snapshots are not a controlled observer-cost comparison; do not attribute that difference to the clocks.

## Reproduction

Set `CAPE_BROWSER_PATH` to Chromium. `node scripts/measure-vertex-browser.mjs` runs the paired five-cape benchmark; set `CAPE_VERTEX_CAPES=9` or `17` for the larger batches. `bun scripts/verify-vertex-trajectories.ts` runs the 50-cape normal/assertion/tiny-skin regressions and an overflow fixture. `node scripts/capture-vertex-comparison.mjs` captures native before/after reports at automatic, six and three workers, an instrument-disabled desktop run and the WebGPU backend. Capture profiles and all audit temporary data live under repository-local `artifacts/.tmp/` on G: and are removed in finally; cleanup failures fail the audit. Worker URL overrides preserve actual hardware identity and CPU speed.

`node scripts/measure-main-clock-overhead.mjs` runs the isolated paired observer-cost fixture.
