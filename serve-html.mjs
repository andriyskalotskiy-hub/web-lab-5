// Локальний сервер для ES-модулів та localStorage. Запуск: node serve-html.mjs
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { dirname, resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
}
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, 'http://localhost').pathname,
    )
    const path = resolve(
      root,
      '.' + (pathname === '/' ? '/index.html' : pathname),
    )
    if (!path.startsWith(root + sep) || pathname.includes('/node_modules/')) {
      response.writeHead(403).end('Forbidden')
      return
    }
    const data = await readFile(path)
    response.writeHead(200, {
      'Content-Type': types[extname(path)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    })
    response.end(data)
  } catch {
    response.writeHead(404).end('Not found')
  }
})
server.on('error', () =>
  console.error('Порт 5500 зайнятий. Зупиніть попередній сервер через Ctrl+C.'),
)
server.listen(5500, '127.0.0.1', () =>
  console.log('HTML-версія: http://localhost:5500/  |  Зупинка: Ctrl+C'),
)
