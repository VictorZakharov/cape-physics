import { spawn } from 'node:child_process';
import { createServer } from 'node:http';

export const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForChildExit(child, timeoutMilliseconds) {
  if (child.exitCode !== null) return true;
  return await new Promise((resolve) => {
    const onExit = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    const timeout = setTimeout(() => {
      child.off('exit', onExit);
      resolve(false);
    }, timeoutMilliseconds);
    child.once('exit', onExit);
    if (child.exitCode !== null) {
      child.off('exit', onExit);
      clearTimeout(timeout);
      resolve(true);
    }
  });
}

async function terminateWindowsProcessTree(child) {
  if (child.exitCode !== null || child.pid === undefined) return;
  await new Promise((resolve, reject) => {
    const taskkill = spawn('taskkill.exe', [
      '/PID',
      String(child.pid),
      '/T',
      '/F',
    ], {
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stderr = '';
    taskkill.stderr.on('data', (chunk) => { stderr += chunk; });
    taskkill.once('error', reject);
    taskkill.once('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`taskkill exited ${code}: ${stderr.trim()}`));
    });
  });
}

export async function runCleanupSteps(steps) {
  const errors = [];
  for (const [label, cleanup] of steps) {
    try {
      await cleanup();
    } catch (error) {
      errors.push(new Error(`${label}: ${error.message}`, { cause: error }));
    }
  }
  if (errors.length > 0) throw new AggregateError(errors, 'Audit cleanup failed.');
}

export async function closeBrowserProcess(browser, debuggerConnection) {
  await runCleanupSteps([
    ['request browser shutdown', async () => {
      // Browser.close can let the root process exit before its WebGPU child
      // processes. Once that PID disappears, taskkill can no longer discover
      // the descendants and their profile locks survive the harness. Kill the
      // complete, dedicated harness tree while its root PID is still valid.
      if (process.platform === 'win32') return;
      if (!debuggerConnection) return;
      await Promise.race([
        debuggerConnection.command('Browser.close').catch(() => undefined),
        delay(1_500),
      ]);
    }],
    ['close debugger socket', async () => {
      debuggerConnection?.socket.close();
    }],
    ['terminate browser process', async () => {
      if (process.platform === 'win32') {
        await terminateWindowsProcessTree(browser);
        if (!await waitForChildExit(browser, 5_000)) {
          throw new Error(`Browser process ${browser.pid ?? 'unknown'} did not exit.`);
        }
        return;
      }
      if (await waitForChildExit(browser, 2_000)) return;
      if (!browser.kill() && browser.exitCode === null) {
        throw new Error('Browser process rejected termination.');
      }
      if (!await waitForChildExit(browser, 5_000)) {
        throw new Error(`Browser process ${browser.pid ?? 'unknown'} did not exit.`);
      }
    }],
  ]);
}

export async function reservePort() {
  const server = createServer();
  const port = await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
  await new Promise((resolve) => server.close(resolve));
  return port;
}

export async function fetchJsonWithRetry(url, timeoutMilliseconds = 30_000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeoutMilliseconds) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) return await response.json();
      lastError = new Error(`${url} returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError?.message ?? 'no response'}`);
}

export function connectDebugger(webSocketUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl);
    const pending = new Map();
    const events = [];
    let nextId = 1;
    socket.addEventListener('error', reject, { once: true });
    socket.addEventListener('open', () => {
      const command = (method, params = {}) => new Promise((resolveCommand, rejectCommand) => {
        const id = nextId;
        nextId += 1;
        pending.set(id, { resolveCommand, rejectCommand });
        socket.send(JSON.stringify({ id, method, params }));
      });
      socket.addEventListener('message', ({ data }) => {
        const message = JSON.parse(data);
        if (!message.id) {
          events.push(message);
          return;
        }
        const handler = pending.get(message.id);
        pending.delete(message.id);
        if (!handler) return;
        if (message.error) handler.rejectCommand(new Error(message.error.message));
        else handler.resolveCommand(message.result);
      });
      resolve({ socket, command, events });
    }, { once: true });
  });
}

export async function evaluate(command, expression) {
  const result = await command('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  }
  return result.result?.value;
}

export async function waitForExpression(command, expression, timeoutMilliseconds = 45_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMilliseconds) {
    if (await evaluate(command, expression)) return;
    await delay(120);
  }
  throw new Error(`Timed out waiting for expression: ${expression}`);
}
