//http – stawia serwer i obsługuje ruch sieciowy
import http, { IncomingMessage, ServerResponse } from 'http';
//fs (File System) – pozwala Node'owi czytać pliki z dysku twardego.
import fs from 'fs';
//path – bezpiecznie łączy ścieżki do folderów i plików (dba o odpowiednie ukośniki / lub \ w zależności od tego, czy kod działa na macOS, czy na Windowsie).
import path from 'path';
//url – pomaga rozbić adres wpisany przez użytkownika (np. http://localhost:3000/about?user=marta) na czyste części składowe, takie jak sama ścieżka (/about).
import url from 'url';

//interface Joke { id: string; joke: string; status: number; } – kontrakt dla TypeScriptu. Dane przychodzące z internetu są dla kompilatora niewiadomą, więc ten interfejs mówi mu wprost: „obiekt JSON, który pobierzemy z API, będzie miał dokładnie te trzy pola o takich typach”. Dzięki temu poniżej, gdy wpiszesz joke., edytor sam podpowie Ci właściwość joke.joke.
interface Joke {
  id: string;
  joke: string;
  status: number;
}


//Słowo kluczowe async przed funkcją pozwala używać wewnątrz await – dzięki temu serwer podczas czytania pliku z dysku nie zawiesza całego programu, tylko czeka na wczytanie danych w tle.
//const parsedUrl = url.parse(req.url || '') – wyciąga adres URL z zapytania przeglądarki. Konstrukcja || '' (lub pusty ciąg znaków) to zabezpieczenie dla TypeScriptu: gdyby z jakiegoś powodu req.url było puste (undefined), funkcja url.parse nie wyrzuci błędu.
//let data = '' oraz let statusCode = 200 – przygotowujemy zmienne na treść pliku HTML oraz kod odpowiedzi HTTP (domyślnie zakładamy optymistycznie sukces, czyli 200 OK).
// requestListener to główna funkcja uruchamiana za każdym razem, 
// gdy przeglądarka wysyła żądanie (req) do naszego serwera.
// req (request) = co klient od nas chce, res (response) = czym odpowiadamy.
async function requestListener(req: IncomingMessage, res: ServerResponse) {
  const parsedUrl = url.parse(req.url || '')
  let data = ''
  let statusCode = 200
//Blok try – próba odnalezienia i wczytania pliku (linie 14–22)
//if (pathName === '/') – jeśli użytkownik wszedł na stronę główną (localhost:3000/), zamieniamy sam ukośnik na /index.html.
//else { pathName = ${pathName}.html } – to bardzo sprytny zabieg (tzw. clean URLs). Jeśli wpiszesz w przeglądarce localhost:3000/contact, serwer sam doklei końcówkę .html i poszuka pliku /contact.html.
//const filePath = path.join(__dirname, static${pathName}) – zmienna __dirname oznacza ścieżkę do folderu, w którym aktualnie znajduje się Twój kod (czyli src). Funkcja path.join skleja ją z podfolderem static i nazwą pliku, tworząc pełną ścieżkę na Twoim Macu (np. /Users/martaloskot/.../src/static/index.html).
//data = await fs.promises.readFile(filePath, 'utf-8') – serwer asynchronicznie otwiera plik i wczytuje jego tekst (w kodowaniu utf-8) do zmiennej data.
  try {
    let pathName = parsedUrl.pathname
    if (pathName === '/') {
      pathName = '/index.html'
    } else {
      pathName = `${pathName}.html`
    }
    const filePath = path.join(__dirname, `static${pathName}`);
    data = await fs.promises.readFile(filePath, 'utf-8');
//. Blok catch – koło ratunkowe, czyli obsługa błędu 404 (linie 23–26)
//Jeśli użytkownik wpisze w przeglądarce adres, dla którego nie masz pliku (np. localhost:3000/nie-ma-takiej-strony), funkcja readFile z bloku try rzuci błąd (bo plik nie-ma-takiej-strony.html nie istnieje).
//Wtedy wykonanie kodu natychmiast przeskakuje do bloku catch: zamiast wyłożyć cały serwer, kod wczytuje przygotowany wcześniej plik static/404.html i zmienia statusCode na 404 (Not Found).
  } catch {
    data = await fs.promises.readFile(path.join(__dirname, 'static/404.html'), 'utf-8');
    statusCode = 404
  } 
//const response = await fetch('[https://icanhazdadjoke.com/](https://icanhazdadjoke.com/)', { headers: ... }) – Twój serwer wysyła w tle zapytanie HTTP GET do zewnętrznego API. Nagłówki są tu kluczowe:
//'Accept': 'application/json' – domyślnie to API zwraca całą stronę HTML. Ten nagłówek mówi serwerowi z żartami: „nie jestem przeglądarką, poproszę same surowe dane w formacie JSON”.
//'user-agent': 'Node.js Server' – twórcy icanhazdadjoke wymagają przedstawienia się w zapytaniu (dobra praktyka przy publicznych API, żeby nie zostać zablokowanym jako anonimowy bot).
//const joke: Joke = await response.json() – rozpakowuje odpowiedź z formatu JSON do zwykłego obiektu JavaScript i przypisuje mu nasz typ Joke.
//data = data.replace(/{{joke}}/gm, JSON.stringify(joke.joke)) – serwer przeszukuje wczytany wcześniej tekst pliku HTML (data), znajduje w nim znacznik {{joke}} (wyrażenie regularne z flagami gm oznacza: szukaj globalnie i w wielu liniach) i podmienia go na prawdziwy tekst żartu pobrany z API. (Wskazówka: jeśli wstawisz tam samo joke.joke zamiast JSON.stringify(joke.joke), żart wyświetli się na stronie czysto, bez dodatkowych cudzysłowów na początku i na końcu).
  if (parsedUrl.pathname === '/dad-joke') {
    const response = await fetch('https://icanhazdadjoke.com/', {
      headers: {
        'Accept': 'application/json',
        'user-agent': 'Node.js Server'
      }
    });
    const joke: Joke = await response.json();
    data = data.replace(/{{joke}}/gm, JSON.stringify(joke.joke));
  }

  // 3. res.writeHead wysyła nagłówki HTTP (instrukcje dla przeglądarki):
  // - 200: kod oznaczający sukces ("wszystko w porządku, plik istnieje"),
  // - 'Content-Type': informuje przeglądarkę, że przesyłamy dokument HTML,
  // - 'Content-Length': podaje dokładny rozmiar pliku w bajtach (data.length).
  res.writeHead(statusCode, {
    'Content-Type' : 'text/html',
    'Content-Length' : Buffer.byteLength(data, 'utf-8')
  });
//Wysłanie odpowiedzi do przeglądarki:
//res.writeHead(...) – wysyła nagłówki z odpowiednim statusem (200 lub 404), informacją, że to dokument HTML, oraz rozmiarem treści.
//res.write(data) i res.end() – przesyłają wczytany kod HTML do przeglądarki i zamykają połączenie.
  res.write(data);
  res.end();
}

// Tworzymy serwer HTTP oparty na naszej funkcji i uruchamiamy go na porcie 3000
http.createServer(requestListener).listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
  