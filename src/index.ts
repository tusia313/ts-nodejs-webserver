// 1. IMPORTY WBUDOWANYCH MODUŁÓW NODE.JS
// http – pozwala stworzyć serwer i obsługiwać zapytania sieciowe.
// IncomingMessage i ServerResponse to typy TypeScriptu opisujące obiekty zapytania (req) i odpowiedzi (res).
import http, { IncomingMessage, ServerResponse } from 'http';
// fs (File System) – służy do odczytywania plików (HTML, CSS) z dysku twardego.
import fs from 'fs';
// path – bezpiecznie łączy ścieżki do folderów i plików (niezależnie od systemu operacyjnego).
import path from 'path';
// url – rozbija adres wpisany w przeglądarce na części składowe (np. wyciąga samą ścieżkę '/about').
import url from 'url';

// 2. KONTRAKT TYPESCRIPT (INTERFACE)
// Określa dokładny kształt obiektu JSON, który otrzymamy z zewnętrznego API icanhazdadjoke.
interface Joke {
  id: string;
  joke: string;
  status: number;
}

// 3. GŁÓWNA FUNKCJA OBSŁUGUJĄCA RUCH (REQUEST LISTENER)
// Uruchamia się automatycznie za każdym razem, gdy przeglądarka żąda strony lub pliku (np. style.css).
// Słowo 'async' pozwala na użycie 'await' wewnątrz funkcji (czytanie plików i pobieranie API bez blokowania serwera).
async function requestListener(req: IncomingMessage, res: ServerResponse) {
  // Rozbijamy adres URL zapytania. Konstrukcja (req.url || '') chroni przed wartością undefined.
  const parsedUrl = url.parse(req.url || '');
  
  // Przygotowujemy zmienne na zawartość pliku oraz domyślny kod sukcesu HTTP (200 OK).
  let data = '';
  let statusCode = 200;

  // 4. ROUTING I ODCZYT PLIKÓW Z DYSKU (BLOK TRY / CATCH)
  try {
    let pathName = parsedUrl.pathname || '/';

    // Jeśli użytkownik wchodzi na stronę główną ('/'), wskazujemy plik '/index.html'.
    if (pathName === '/') {
      pathName = '/index.html';
    } 
    // Jeśli w ścieżce nie ma kropki (czyli to np. '/about', a nie '/style.css'), 
    // automatycznie doklejamy końcówkę '.html' (tzw. Clean URLs).
    else if (!pathName.includes('.')) {
      pathName = `${pathName}.html`;
    }

    // Sklejamy pełną ścieżkę do pliku w folderze 'src/static/' i wczytujemy go jako tekst UTF-8.
    const filePath = path.join(__dirname, 'static', pathName);
    data = await fs.promises.readFile(filePath, 'utf-8');
  } catch {
    // KOŁO RATUNKOWE (BŁĄD 404): Jeśli szukany plik nie istnieje na dysku, 
    // przechwytujemy błąd, wczytujemy stronę 404.html i ustawiamy kod statusu na 404.
    data = await fs.promises.readFile(path.join(__dirname, 'static', '404.html'), 'utf-8');
    statusCode = 404;
  }

  // 5. INTEGRACJA Z ZEWNĘTRZNYM API (TYLKO DLA ŚCIEŻKI /dad-joke)
  if (parsedUrl.pathname === '/dad-joke') {
    // Wysyłamy zapytanie do API z nagłówkami wymuszającymi format JSON zamiast HTML.
    const response = await fetch('https://icanhazdadjoke.com/', {
      headers: {
        'Accept': 'application/json',
        'user-agent': 'Node.js Server'
      }
    });

    // Odczytujemy odpowiedź i przypisujemy jej nasz interfejs 'Joke'.
    const joke: Joke = await response.json();

    // Podmieniamy znacznik {{joke}} w kodzie HTML na prawdziwy żart pobrany z serwera.
    data = data.replace(/{{joke}}/gm, joke.joke);
  }

  // 6. ROZPOZNANIE TYPU PLIKU (MIME TYPE)
  // Domyślnie wysyłamy dokument HTML, ale jeśli przeglądarka prosiła o plik '.css',
  // zmieniamy nagłówek na 'text/css', aby przeglądarka poprawnie zaaplikowała style.
  let contentType = 'text/html';
  if (parsedUrl.pathname?.endsWith('.css')) {
    contentType = 'text/css';
  }

  // 7. WYSŁANIE ODPOWIEDZI DO PRZEGLĄDARKI
  // Ustawiamy kod statusu (200 lub 404), typ zawartości oraz dokładny rozmiar danych w bajtach.
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(data, 'utf-8')
  });

  // Przesyłamy gotową treść i zamykamy połączenie.
  res.write(data);
  res.end();
}

// 8. URUCHOMIENIE SERWERA NA PORCIE 3000
http.createServer(requestListener).listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
  