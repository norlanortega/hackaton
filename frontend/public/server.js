/**
 * Servidor estatico para el SPA en Azure App Service (Linux).
 * Sin dependencias: solo modulos nativos de Node, asi no requiere npm install en Azure.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8'
};

// No exponer los archivos del propio servidor
const BLOCKED = new Set(['/server.js', '/package.json']);

function send(res, status, body, headers) {
  res.writeHead(status, headers || {});
  res.end(body);
}

function serveFile(res, filePath, isImmutable) {
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 500, 'Internal Server Error');
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      // assets llevan hash en el nombre -> cache larga; index.html nunca se cachea
      'Cache-Control': isImmutable
        ? 'public, max-age=31536000, immutable'
        : 'no-cache, no-store, must-revalidate',
      'X-Content-Type-Options': 'nosniff'
    });
  });
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    // WHATWG URL API: url.parse() esta deprecado y tiene implicaciones de seguridad
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (e) {
    return send(res, 400, 'Bad Request');
  }

  if (BLOCKED.has(pathname)) return send(res, 404, 'Not Found');

  // Health check para el probe de App Service
  if (pathname === '/healthz') {
    return send(res, 200, 'ok', { 'Content-Type': 'text/plain' });
  }

  // Configuracion de runtime para el navegador: el bundle no puede leer process.env
  if (pathname === '/config.json') {
    const body = JSON.stringify({
      appInsightsConnectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || ''
    });
    return send(res, 200, body, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
  }

  const indexPath = path.join(ROOT, 'index.html');

  if (pathname === '/') return serveFile(res, indexPath, false);

  // path.join + verificacion de prefijo evita path traversal (../../etc/passwd)
  const requested = path.join(ROOT, pathname);
  if (!requested.startsWith(ROOT + path.sep)) {
    return send(res, 403, 'Forbidden');
  }

  fs.stat(requested, (err, stats) => {
    if (!err && stats.isFile()) {
      const isImmutable = pathname.startsWith('/assets/');
      return serveFile(res, requested, isImmutable);
    }
    // SPA fallback: /flights, /health y demas rutas de react-router las resuelve el cliente
    serveFile(res, indexPath, false);
  });
});

server.listen(PORT, () => {
  console.log('SPA server escuchando en el puerto ' + PORT);
});
