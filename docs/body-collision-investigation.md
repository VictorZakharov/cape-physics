# Body collision culling investigation

Baseline: merged commit `2432d53`, measured before solver edits. Fixed authored world and 50 bot paths, 90 warm-up steps followed by 60 measured steps at 1/30 s. Counters and coarse clocks use separate deterministic replays under Bun 1.3.11; these are per-cape costs, not the live five-cape Chrome worker values.

| Work | Tests per particle per step (average / worst) | Corrections | Time per cape step |
| --- | ---: | ---: | ---: |
| Vertex capsule contact | 172.04 / 240 | 0.295% of pair tests | 0.693 ms |
| Triangle capsule-sample contact | 271.35 / 1,242 incident triangle tests | 0.761% of triangle tests | 1.501 ms |
| Collider preparation | 15 colliders | n/a | 0.00276 ms |
| Worker input updates, including anchor rebase/copy and endpoint copy | n/a | n/a | 0.01849 ms |
| Character collider access/transforms | 15 colliders | n/a | 0.00379 ms |

Body runs 12.144 times/cape/step on average, including final reconciliation; triangle contact runs 5.144 times. There are 21,165 triangle/sample candidate calls per cape step. The 15 shapes are eight capsule segments and seven degenerate capsules (sphere endpoints), with anisotropic lateral/depth radii on some shapes. All use the same capsule vertex test and sampled triangle contact, rather than separate sphere/box kernels. Existing culling consists of vertex vertical/XZ bounds and triangle whole-cape, row and triangle AABB rejection. Triangle contact dominates; updates do not justify stopping at the transfer path.

The culling experiment used current particle positions. A useful whole-step movement bound has not been established: the prediction speed limit does not bound displacement from constraint, body, cave and world projections. Therefore a frozen per-step active collider list or pair list cannot safely use that limit. Remaining tests must preserve order, and triangle bounds must expand when body corrections move any of their vertices.

## Culling experiment and decision

The trial added a level-2 squared-distance sphere rejection before vertex narrowphase (no square root or allocation), with spheres enclosing the old vertex AABBs. Tilted back vectors retained all pairs. For the dominant triangle path, it cached Float64 triangle AABBs for a face pass and expanded every incident triangle when a body correction moved a vertex. Remaining collider/sample/triangle order was retained. The zero-context [rejected patch](body-collision-evidence/rejected-culling.patch) records the trial against `2432d53`, including the accompanying counters; use `git apply --unidiff-zero` on that baseline to reproduce it.

| Paired five-cape benchmark | Body before / trial | Compute before / trial | Body speedup |
| --- | ---: | ---: | ---: |
| Bun, 300 measured steps | 7.424 / 7.401 ms | 15.514 / 15.602 ms | 1.003x |
| Chromium 149 worker, 600 measured steps | 6.484 / 6.509 ms | 14.225 / 14.172 ms | 0.996x |

Both use matched initial states and deterministic paths with ABBA ordering. These are single-worker fixed-1/30 benchmarks, not the native-loop adaptive delivery reports. Existing bounds already reject most candidates cheaply; refreshing and expanding tighter triangle bounds offsets the saved triangle calls. This is below the ticket's 1.3x threshold, so the experiment stopped and **all new culling was removed from production**. No performance improvement is claimed. Level 1 and level 3 were not enabled: a useful rigorous displacement bound across intervening projections was not established. The velocity cap alone is not that bound. Solver parameters and collision behaviour are unchanged.

The rejected trial was stopped on performance before the full correctness/assertion run; no correctness claim is made for that patch. No new culled pairs remain in the shipped code, so a new culling assertion mode is not applicable. The retained measurement changes have their own bit-for-bit regression below.

## Retained reporting and correctness

The BODY row adds tests per particle per delivered cape step. The copied report separates vertex/capsule calls from triangle/sample calls, gives each correction percentage, and defines triangle incidence as three particle incidences per triangle candidate. Counts include existing narrowphase bounds checks, rather than implying every candidate executes the expensive closest-point test. The denominator includes sleeping cape steps. Counters are sampled with the existing every-fourth-batch phase sampling, require the same confidence threshold, and are not rescaled when sampled phase shares are apportioned to all-step compute. Counter storage is reused; there are no new hot-loop clocks. The shared CPU code also applies to the player cape; GPU simulation is untouched.

The baseline and final measurement-only implementation compared all 21,060,000 Float64 coordinates across 50 capes and 600 steps: **maximum deviation zero, bit-identical**. During steps 181-240, every cape was driven 0.22 scene units into the body every five steps. This produced 383.64 vertex corrections/cape/step versus 127.16 outside the stress window (3.02x), and 343.76 triangle corrections versus 183.53 (1.87x). Thus the test includes measured heavy body contact rather than only free-hanging cloth. [Regression evidence](body-collision-evidence/trajectory-regression.json).

A separate primed, ABBA-ordered microbenchmark with equal interior and actual hem points measured seven degenerate spheres at 40.02 ns/call and eight capsule segments at 42.87 ns/call (50% correcting in each constructed dataset). These numbers describe the isolated mixed-input test, not the live contact distribution. Endpoint copying measured 0.000203 ms/cape and endpoint packing 0.000284 ms/cape for 360 bytes; these exclude message delivery and do not dominate the body phase. [Type/input measurements](body-collision-evidence/type-and-input-cost.json). All sample-triangle tests share the same triangle kernel; capsules increase the number of centre samples rather than choosing a different triangle kernel.

The first Chromium trial audit had an invalid duplicated-module clock (zero after body time) and a shutdown race. Those invalid timings were discarded; its temporary directory was removed on the checked cleanup retry. The corrected browser trial recorded both clocks and cleaned successfully.

## Reproduction

- `bun scripts/audit-body-collision.ts`: historical baseline candidate counters and separate coarse replay; `CAPE_BODY_MICRO_ONLY=1` runs only type/input microbenchmarks.
- `bun scripts/verify-body-trajectories.ts`: current reporting code versus historical baseline, 600 steps including heavy contact, strict bit equality.
- `bun scripts/measure-body-culling.ts` and `node scripts/measure-body-browser.mjs`: paired historical/current CPU measurements. Archived trial figures were measured with the rejected patch applied to the historical baseline; rerunning on this final PR measures reporting overhead instead.
- `node scripts/capture-body-comparison.mjs`: original merged baseline versus final reporting-only native-loop copied reports at automatic and three-worker budgets, plus final WebGPU rendering. Set `CAPE_BROWSER_PATH` to a GPU-capable Chromium executable. All task temporary builds and profiles use `artifacts/.tmp/` and are cleaned in finally; cleanup failures are surfaced.

## Native copied reports and final validation

Same RTX 4070 Ti / 24 logical threads, Chromium 149, 1582 x 748 CSS pixels, DPR 1, 50 bots and the same authored settings. Each native-loop run excludes three seconds then observes sixteen seconds. These runs are not fixed-step, matched-state solver benchmarks: delivered rates change simulation trajectories, collision contact, draw cost and OS scheduling. The original baseline had no body candidate counters; its fixed-step baseline counts are measured in the Part 1 table rather than fabricated for the old native report.

| Report | Body ms/worker step | Compute ms/worker step | Busy | Bot steps/s/cape | DT ms | Tests/particle/step | Correcting vertex / triangle tests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| [Before, 10 workers](body-collision-evidence/body-before-webgl.txt) | 15.25 | 35.40 | 67.7% | 19.42 | 30.63 | unavailable in old report | unavailable |
| [After, 10 workers](body-collision-evidence/body-after-webgl.txt) | 16.76 | 38.41 | 71.0% | 18.75 | 31.84 | 438.46 | 0.296% / 0.826% |
| [Before, 3 workers](body-collision-evidence/body-before-3workers-webgl.txt) | 34.78 | 80.45 | 88.1% | 10.96 | 33.33 | unavailable in old report | unavailable |
| [After, 3 workers](body-collision-evidence/body-after-3workers-webgl.txt) | 44.04 | 100.23 | 88.7% | 8.87 | 33.33 | 444.64 | 0.359% / 0.858% |
| [3 workers, separator-layout check](body-collision-evidence/body-final-3workers-webgl.txt) | 33.33 | 76.21 | 87.5% | 11.50 | 33.33 | 442.75 | 0.344% / 0.839% |
| [3 workers, final layout check](body-collision-evidence/body-layout-3workers-webgl.txt) | 30.46 | 68.94 | 89.8% | 13.07 | 33.33 | 443.38 | 0.344% / 0.844% |

The initial after runs are worse and are retained verbatim. Later runs changed only BODY text spacing and layout probes, and varied substantially; none is presented as a culling speedup. Three workers remain near saturation. The override changes worker budget, not processor speed. There is no new culling headroom or adaptive stepping change to report.

A separate final fixed-state Chromium worker comparison isolates the counter changes: original geometry/collision code 16.913 ms/worker step versus reporting code 16.781 ms (apparent -0.78%, no resolvable positive overhead in this trial). Sampled body phase time increased from 7.687 to 7.979 ms; counter overhead and phase-share sampling are included in reported timings. This single comparison does not establish a speedup or a universal overhead bound. [Paired reporting-overhead evidence](body-collision-evidence/reporting-overhead-browser.json).

The native [WebGPU report](body-collision-evidence/body-after-webgpu.txt) uses WebGPU without fallback, resolution 1.0 and measured timestamps (3.19 ms total GPU execution). It exercises packed GPU simulation, which this ticket does not modify. Its first startup attempt exceeded the audit's 90 s wait while compiling shaders; a bounded 180 s observation with loading-stage logging completed and cleaned successfully. WebGL captures also cleaned successfully. No unresolved temporary directory was left by this ticket.

The final BODY line and a stress string (`199.99MS/99.9%/2999 TESTS/PTCL`) fit the 212 px content width of the narrow 240 px panel. Number colors retain the existing brighter bold style, and the worker rows retain 56 px height. [Layout measurements](body-collision-evidence/body-layout-3workers-webgl.json). Eight focused reporting tests pass; the full run passed the other 266 tests, and a new test's initial fixture error was corrected and passed on rerun. TypeScript, source budgets, production/Pages builds and Pages asset-path checks pass. CI rechecks the full suite on the PR.
