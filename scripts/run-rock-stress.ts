const child = Bun.spawn({
  cmd: [
    Bun.which('bun') ?? 'bun',
    'test',
    'tests/rock-contact-stability.test.ts',
  ],
  env: {
    ...Bun.env,
    CAPE_RUN_EXTENDED_ROCK_STRESS: 'true',
  },
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
});

process.exitCode = await child.exited;
