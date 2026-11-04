// Import wbudowanych modułów Node.js
import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';

// requestListener to główna funkcja uruchamiana za każdym razem, 
// gdy przeglądarka wysyła żądanie (req) do naszego serwera.
// req (request) = co klient od nas chce, res (response) = czym odpowiadamy.
async function requestListener(req: IncomingMessage, res: ServerResponse) {
  const parsedUrl = url.parse(req.url || '')
  let data = ''
  let statusCode = 200
  try {
    let pathName = parsedUrl.pathname
    if (pathName === '/') {
      pathName = '/index.html'
    } else {
      pathName = `${pathName}.html`
    }
    const filePath = path.join(__dirname, `static${pathName}`);
    data = await fs.promises.readFile(filePath, 'utf-8');
  } catch {
    data = await fs.promises.readFile(path.join(__dirname, 'static/404.html'), 'utf-8');
    statusCode = 404
  } 
  
  // 3. res.writeHead wysyła nagłówki HTTP (instrukcje dla przeglądarki):
  // - 200: kod oznaczający sukces ("wszystko w porządku, plik istnieje"),
  // - 'Content-Type': informuje przeglądarkę, że przesyłamy dokument HTML,
  // - 'Content-Length': podaje dokładny rozmiar pliku w bajtach (data.length).
  res.writeHead(statusCode, {
    'Content-Type' : 'text/html',
    'Content-Length' : data.length
  });
  // Przekazujemy zawartość pliku do odpowiedzi i zamykamy połączenie
  res.write(data);
  res.end();
}

// Tworzymy serwer HTTP oparty na naszej funkcji i uruchamiamy go na porcie 3000
http.createServer(requestListener).listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
  