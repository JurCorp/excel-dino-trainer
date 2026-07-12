#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8000;

// MIME типы для разных файлов
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head><title>404 - Not Found</title></head>
            <body>
              <h1>404 - Файл не найден</h1>
              <p>Запрашиваемый файл: ${filePath}</p>
              <p><a href="/">← Вернуться на главную</a></p>
            </body>
          </html>
        `, 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Ошибка сервера: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log('🚀 Jurassic Excel сервер запущен!');
  console.log(`📁 Папка: ${process.cwd()}`);
  console.log(`🌐 Адрес: http://localhost:${port}`);
  console.log('⏹️  Для остановки нажми Ctrl+C');
  console.log('========================================');
});

// Обработка ошибок
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Порт ${port} уже используется!`);
    console.log('💡 Попробуй другой порт или останови другой сервер');
  } else {
    console.log(`❌ Ошибка сервера: ${err.message}`);
  }
});
