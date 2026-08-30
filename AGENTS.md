# Repository agent rules

## Temporary storage

- Never create temporary files, browser profiles, audit directories, caches, or profiling workspaces on the `C:` drive or in the operating system temp directory.
- Put all repository-task temporary data under the repository-local `artifacts/.tmp/` directory on `G:`.
- Do not use `os.tmpdir()`, `%TEMP%`, or `%TMP%` in repository scripts.
- Every temporary directory must be removed in a `finally` block. Treat a cleanup failure as an error that must be surfaced; never silently accumulate abandoned directories.
