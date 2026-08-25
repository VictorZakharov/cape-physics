import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, normalize, sep } from 'node:path';

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.woff2', 'font/woff2'],
]);

export function createStaticServer(rootDirectory) {
  const rootPrefix = normalize(rootDirectory + sep);
  return createServer((request, response) => {
    const requested = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    if (requested === '/favicon.ico') {
      response.writeHead(204).end();
      return;
    }
    const relativePath = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
    const filePath = normalize(rootDirectory + sep + relativePath);
    if (!filePath.startsWith(rootPrefix) || !existsSync(filePath) || !statSync(filePath).isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, {
      'content-type': contentTypes.get(extname(filePath)) ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    response.end(readFileSync(filePath));
  });
}

export function listen(server, port = 0) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server.address().port));
  });
}

export function close(server) {
  return new Promise((resolve) => server.close(resolve));
}
