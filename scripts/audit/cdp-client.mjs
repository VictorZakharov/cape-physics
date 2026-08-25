import { createServer } from 'node:http';

export const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

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
