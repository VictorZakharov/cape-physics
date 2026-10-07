# Exact body candidate-list investigation

Baseline: merged PR #31, `d4530db`. The zero-context trial patch (apply with `git apply --unidiff-zero` against that baseline) lives in [candidate-lists.patch](body-neighbor-evidence/candidate-lists.patch); production solver code is unchanged. A priori displacement bounds are unnecessary: actual displacement tracking makes a one-step neighbour list conservative. This corrects the limitation described in the previous investigation.

## Premise and exact skip rules

Worker endpoint and anchor updates happen before `CapeSimulation.step`, never between its projection or reconciliation calls. The audit snapshots all endpoint coordinates, radii, clearance, face sample spacing and the back vector at `beginStep`, then compares them at every body call. The first full 50-cape, 600-step replay observed 361,863 body calls with zero changes, including the repeated heavy-contact window. Prepared vertex colliders and triangle sample centres therefore remain fixed within the step. The same CPU implementation handles the player; GPU simulation is separate.

Vertex inclusion uses the unchanged narrowphase's necessary vertical and XZ capsule bounds, expanded by skin. A rejected pair cannot produce a correction while the reference displacement is strictly below skin. This covers anisotropic and one-sided responses, including front contacts; it does not substitute a symmetric ellipsoid test. Check displacement before each body sweep and immediately after every applied correction. If a correction exhausts skin inside a sweep, rebuild and resume at the next collider, retaining original order.

Triangle inclusion uses the existing triangle/sample AABB overlap, expanded by skin and a conservative 1e-7 rounding cushion. All three reference vertices are recorded. If their maximum displacement remains below skin, each coordinate extremum moves by less than skin; an omitted fixed sample's bounds still cannot overlap the current triangle. Therefore the original narrowphase would return before its one-sided response, barycentric denominator or friction handling. This is sufficient even though the one-sided condition is not a pure symmetric distance threshold. Original whole-cape and row rejection remain in their original order. Corrections mark every incident triangle dirty, so the next pair checks displacement and rebuilds before skipping. Collider/sample/row/column/triangle order is unchanged.

Fixed typed arrays store vertex collider masks (32 slots) and triangle sample masks (128 slots), reference positions, validity and dirty state. Overflow uses the original full test for the element for the remaining step. Lists reset each step; no new list allocation occurs during a step. Assertions run the unchanged full test for every omitted pair and throw if it could apply a correction.

## Measurements and decision

Paired Chromium 149 dedicated-worker runs use five capes, fixed authored world and bot paths, 90 warm-up plus 600 measured steps at 1/30 s, ABBA ordering. Phase clocks are coarse, outside particle loops. Vertex time is total body time minus the separately timed triangle phase, so the split sums exactly. These are worker-batch costs, not per-cape costs. Initial timing runs that overlapped the trajectory replay were discarded; the files below are the uncontended runs after hoisting triangle bounds outside its sample build loop.

| Skin | Body before / trial (ms) | Vertex before / trial | Triangle before / trial | Worker compute before / trial | Body speedup |
| --- | ---: | ---: | ---: | ---: | ---: |
| 0.026 | 8.209 / 8.094 | 2.435 / 0.817 | 5.774 / 7.277 | 17.298 / 17.471 | 1.014x |
| 0.052 | 9.291 / 9.763 | 2.691 / 1.085 | 6.600 / 8.679 | 19.708 / 20.238 | 0.952x |
| 0.104 | 9.213 / 10.313 | 2.781 / 1.297 | 6.432 / 9.015 | 19.597 / 20.842 | 0.893x |

Skin 0.026 was selected for the final trial, regression and native reports. Vertex lists remove most work, but triangle lists make the dominant phase slower. The triangle path runs roughly five times per step, rather than the roughly twelve vertex sweeps. Building lists checks all 50 fixed samples against each rebuilt triangle; the original repeated sweeps already have cheap whole-cape/row rejection. Reference validation, list building and membership lookup outweigh the removed narrowphase calls. Increasing skin reduces rebuilds but retains more samples, worsening triangle time. The measured combined gain is below the required 1.5x: the trial was archived, with no production candidate lists, solver or adaptive-step changes retained. No performance improvement is claimed.

| Skin | Vertex tests/particle before / trial | Triangle incident tests/particle before / trial | Vertex builds/particle/step | Triangle builds/triangle/step | Vertex candidate mean / worst | Triangle candidate mean / worst | Overflow |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0.026 | 170.08 / 10.33 | 264.58 / 102.44 | 1.504 | 1.426 | 0.990 / 4 | 4.010 / 19 | 0 |
| 0.052 | 170.08 / 14.60 | 264.58 / 130.52 | 1.183 | 1.234 | 1.324 / 5 | 5.617 / 23 | 0 |
| 0.104 | 170.08 / 24.27 | 264.58 / 172.55 | 1.019 | 1.105 | 2.141 / 6 | 9.051 / 31 | 0 |

Build counts include the initial list creation; means are over list builds and include empty lists. Test counts are sampled every fourth batch, normalized by all 234 delivered particles; triangle incidence is three particles per triangle/sample call. Counts include the unchanged narrowphase bounds checks and exclude candidate-list build comparisons, whose cost is included in body time. Worst per-element builds within a step were 33/37, 30/32 and 25/23 (vertex/triangle) respectively. A later exact-source replay records actual rebuild counts separately from initial creation.

## Verification and native reports

Normal and assertion replays each compared all **21,060,000 Float64 coordinates** across 50 capes and 600 steps, with maximum deviation zero, bit-identical. Both include PR #31's repeated 0.22-unit body-contact pushes during steps 181-240. The assertion replay checked 1,125,995,276 omitted vertex pairs and 394,460,838 omitted triangle pairs, with no correcting pair skipped. Both checked collider constancy in all 361,863 body calls, with zero changes. The production path remains the baseline because performance rejected the patch, rather than because correctness failed.

Over the complete 50-cape heavy-contact replay, actual rebuilds excluding first creation averaged 0.638 per delivered particle per step and 0.452 per triangle per step. Candidate means were 1.084 vertex colliders and 4.045 triangle samples; worst counts were 5 and 43. Worst per-element builds were 35 and 46 (including first creation). There were zero storage overflows. This wider workload is distinct from the five-cape timing sample above.

A separate overflow fixture uses 45 duplicated body shapes and 150 samples, exceeding both fixed capacities. Five steps compared all 3,510 coordinates bit for bit; 2,713 element-step overflow fallbacks occurred with zero deviation. This constructed fixture tests fallback, not normal performance.

The **1e-6 skin** assertion replay also compared all 21,060,000 coordinates bit for bit. It performed 65,894,775 vertex rebuilds and 45,193,089 triangle rebuilds excluding initial creation; worst per-element builds were 49/49. Assertions checked 1,150,386,904 omitted vertex pairs and 471,646,000 omitted triangle pairs with zero corrections or storage overflow. This exercises rebuilds inside passes as well as between passes; no tolerance was relaxed.

Evidence: [normal replay](body-neighbor-evidence/neighbor-regression-0.026.json), [assertion replay](body-neighbor-evidence/neighbor-regression-assert-0.026.json), [tiny-skin assertion replay](body-neighbor-evidence/neighbor-regression-assert-0.000001.json), [overflow fallback](body-neighbor-evidence/neighbor-overflow.json).

An uncontended replay through the archived-patch driver confirms the decision using the exact final source:

| Skin | Body before / trial | Vertex before / trial | Triangle before / trial | Compute before / trial | Body speedup |
| --- | ---: | ---: | ---: | ---: | ---: |
| 0.026 | 9.377 / 9.386 ms | 2.756 / 0.983 | 6.621 / 8.403 | 19.063 / 19.195 | 0.999x |
| 0.052 | 8.357 / 9.016 ms | 2.387 / 1.011 | 5.970 / 8.005 | 18.054 / 18.658 | 0.927x |
| 0.104 | 8.553 / 9.642 ms | 2.456 / 1.180 | 6.097 / 8.462 | 18.316 / 19.366 | 0.887x |

Raw paired evidence: [initial 0.026](body-neighbor-evidence/initial-skin-0.026.json), [0.052](body-neighbor-evidence/initial-skin-0.052.json), [0.104](body-neighbor-evidence/initial-skin-0.104.json); final archived-source [0.026](body-neighbor-evidence/final-skin-0.026.json), [0.052](body-neighbor-evidence/final-skin-0.052.json), [0.104](body-neighbor-evidence/final-skin-0.104.json).

The final 0.026 paired run records actual rebuilds of **0.559/particle/step** and **0.448/triangle/step**, excluding first creation, with unchanged candidate means/worst and zero overflow. Vertex correcting counts were exactly 104,153 before and after; triangle correcting counts exactly 150,977. Their shares rise from 0.349% to 5.746% and 0.975% to 2.519% respectively because no-op tests disappear, not because contact changed.

## Native copied reports

Same RTX 4070 Ti / 24-logical-thread machine, Chromium 149, WebGL 2, default cloth settings, authored world, 50 bots and three-second warm-up. These are actual copied reports from the native animation loop, with 15-second windows, not reconstructed benchmark summaries. The trial applies to both player and worker CPU paths. The existing Timing caveat is present in all four reports.

| Worker budget | Body before / trial | Compute before / trial | Busy before / trial | Delivered bot Hz before / trial | DT before / trial | Tests/particle before / trial |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Automatic (10) | 10.39 / 9.51 ms | 24.35 / 21.82 ms | 65.2 / 68.4% | 26.86 / 31.40 | 27.92 / 28.01 ms | 432.11 / 103.32 |
| Override (3) | 30.69 / 33.71 ms | 68.80 / 73.72 ms | 89.7 / 90.9% | 13.04 / 12.32 | 33.33 / 33.33 ms | 441.99 / 106.88 |

The automatic run has a higher delivered rate, while the three-worker trial has a lower rate and higher body cost. These moving-scene snapshots have different elapsed simulated times and bot poses (automatic 14.17/16.32 s; three workers 18.06/18.11 s), and cannot establish an isolated speedup. The fixed-state ABBA worker benchmark is the decision evidence. There is no consistent new headroom to claim; adaptive logic and step caps were never changed. The three-worker report explicitly says the URL override imitates worker budget only, not slower CPU speed. The trial BODY line correctly falls sharply because it counts narrowphase calls, but its phase time includes the extra neighbour-list work: fewer calls did not mean a faster combined phase.

Copied reports: automatic [before](body-neighbor-evidence/neighbors-before-webgl.txt) / [trial](body-neighbor-evidence/neighbors-after-webgl.txt); three workers [before](body-neighbor-evidence/neighbors-before-3workers-webgl.txt) / [trial](body-neighbor-evidence/neighbors-after-3workers-webgl.txt). Matching JSON files preserve diagnostics and layout checks. All trials used the same requested settings, renderer and worker budgets. Production remains identical to the baseline, so these trial reports do not describe a shipped optimization.

## Validation and unexpected findings

Strict normal, heavy-contact, assertions, tiny-skin and overflow checks all pass bit for bit. The shared player CPU path receives the same trial; no separate player implementation was left untreated. Types pass for the patched audit source. Production checks pass: 267 tests, six pre-existing skips, source budgets and Pages asset checks. Archived-patch timing, overflow and native report modes were exercised successfully; new temporary workspaces/profiles were cleaned on G:. The first native-report attempt failed because its disposable copy resolved Vite under a nonexistent local node_modules; resolving the installed package through Node's normal ancestor lookup fixed it, and that failed workspace was removed. Exploratory timing runs that overlapped correctness work were discarded, not used to support the decision.

The unexpected result is that exactness succeeds but body performance does not: vertex contact is much cheaper, while dominant triangle contact gets more expensive. Both conservative skip derivations are valid; the result is not a reason to reintroduce an a-priori displacement-bound requirement. The candidate mask version still follows legacy sample-major row traversal and performs list membership lookups there, rather than reordering triangle solves. Combined with dense list-build sweeps, this overhead outweighs its removed cheap bounds calls. Per the 1.5x stop rule, the complete patch is archived and no solver, panel, report or adaptive quality changes remain in production.

## Reproduction

Set `CAPE_BROWSER_PATH` to Chromium. Run `node scripts/audit-body-neighbors.mjs timing`, `regression`, `overflow`, or `reports`. The driver extracts the complete frozen `d4530db` simulation sources and fixture inputs under `artifacts/.tmp/` on G:, applies the archived patch, runs the audit and preserves output under `artifacts/body-neighbor-audit/`. Every temporary directory and browser profile is removed in `finally`; cleanup failures fail the audit. Timing mode tries all three skins. Regression mode compares every Float64 coordinate for 50 capes and 600 steps, including PR #31's steps 181-240 heavy-contact trajectory, with normal lists, assertions, and a 1e-6 skin assertion run. Reports mode captures actual copied 15-second native-loop reports at automatic and three-worker budgets on the same machine. Three workers imitate only that worker budget, not a slower CPU.
