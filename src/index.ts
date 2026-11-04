// Import wbudowanych modułów Node.js
import http from 'http';
import fs from 'fs';
import path from 'path';

// requestListener to główna funkcja uruchamiana za każdym razem, 
// gdy przeglądarka wysyła żądanie (req) do naszego serwera.
// req (request) = co klient od nas chce, res (response) = czym odpowiadamy.
async function requestListener(req: IncomingMessage, res: ServerResponse) {
  
  // 1. path.join bezpiecznie skleja ścieżkę do pliku na dysku.
  // __dirname to obecny folder (src), do którego dokładamy 'static' i 'index.html'.
  const filePath = path.join(__dirname, 'static', 'index.html');
  
  // 2. fs.promises.readFile asynchronicznie otwiera i czyta plik z dysku.
  // Słowo 'await' zatrzymuje ten krok na ułamek sekundy, aż plik w pełni wczyta się do zmiennej 'data'.
  const data = await fs.promises.readFile(filePath);
  
  // 3. res.writeHead wysyła nagłówki HTTP (instrukcje dla przeglądarki):
  // - 200: kod oznaczający sukces ("wszystko w porządku, plik istnieje"),
  // - 'Content-Type': informuje przeglądarkę, że przesyłamy dokument HTML,
  // - 'Content-Length': podaje dokładny rozmiar pliku w bajtach (data.length).
  res.writeHead(200, {
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
  