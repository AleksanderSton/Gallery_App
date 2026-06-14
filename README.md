# Dokumentacja Projektu: Aplikacja Galerii Zdjęć

Niniejsza dokumentacja zawiera opis konstrukcji, działania oraz instrukcję uruchomienia aplikacji internetowej służącej do zarządzania galeriami zdjęć. Aplikacja została zrealizowana w architekturze MVC (Model-View-Controller).

## 1. Wykorzystane technologie
Aplikacja została zbudowana w oparciu o stos technologiczny oparty na środowisku Node.js. 
* **Środowisko uruchomieniowe:** Node.js
* **Framework backendowy:** Express.js
* **Baza danych:** MongoDB (lokalna instancja)
* **Silnik szablonów (Widoki):** Pug
* **Dokumentacja API:** Swagger UI (OpenAPI 3.0.0)

## 2. Lista wykorzystanych pakietów
W projekcie wykorzystano następujące biblioteki (zdefiniowane w `package.json`):
* `express` - główny framework aplikacji do obsługi routingu i żądań HTTP.
* `mongoose` - biblioteka ODM (Object Data Modeling) do mapowania obiektów w kodzie na dokumenty w bazie MongoDB.
* `pug` - silnik renderowania widoków HTML po stronie serwera.
* `bcrypt` - narzędzie do bezpiecznego hashowania haseł użytkowników.
* `jsonwebtoken` (JWT) - obsługa tokenów do autoryzacji sesji użytkowników.
* `cookie-parser` - middleware do odczytywania ciasteczek (wykorzystywanych do przechowywania tokenu JWT).
* `formidable` - pakiet do obsługi formularzy typu `multipart/form-data` (upload plików graficznych).
* `express-validator` - middleware do walidacji danych wprowadzanych przez użytkowników w formularzach.
* `swagger-jsdoc` & `swagger-ui-express` - generowanie i serwowanie interaktywnej dokumentacji interfejsu API.
* `morgan` & `debug` - logowanie żądań i pomoc w debugowaniu aplikacji.
* `http-errors` - generowanie błędów HTTP.

## 3. Opis konstrukcji aplikacji
Aplikacja oparta jest na klasycznym wzorcu **MVC**:
* **Konfiguracja (app.js):** Główny plik serwera. Odpowiada za połączenie z bazą danych MongoDB na domyślnym porcie (`mongodb://localhost:27017/GalleryDB`), ustawienie silnika widoków Pug, konfigurację plików statycznych (katalogi `/public` oraz `/public/images` zamontowane pod `/galleries`) oraz rejestrację głównych routerów.
* **Modele (models/):** Definiują schematy danych w bazie.
* **Kontrolery (controllers/):** Zawierają logikę biznesową (np. dodawanie galerii, logowanie użytkownika, wgrywanie zdjęć).
* **Ścieżki (routes/):** Przekierowują żądania HTTP do odpowiednich funkcji w kontrolerach.
* **Widoki (views/):** Interfejs użytkownika wyrenderowany po stronie serwera w formacie Pug.
* **Middleware (middleware/authenticate.js):** Strażnik weryfikujący token JWT, zapewniający, że tylko zalogowani użytkownicy mogą modyfikować zasoby (np. dodawać komentarze, galerie).

## 4. Opis modeli wykorzystywanych w kolekcjach
Baza danych składa się z 4 głównych kolekcji:

1. **User (`users`)**
   * `first_name`, `last_name`, `username`: Dane tekstowe identyfikujące użytkownika (maks. 100 znaków).
   * `password`: Zahashowane hasło użytkownika.
2. **Gallery (`galleries`)**
   * `name`: Nazwa galerii.
   * `description`: Krótki opis.
   * `update_time`: Data ostatniej aktualizacji.
   * `owner`: Referencja (ObjectId) do twórcy z kolekcji `users`.
3. **Image (`images`)**
   * `name`: Nazwa zdjęcia.
   * `description`: Opis zdjęcia.
   * `path`: Ścieżka do pliku graficznego zapisanego na serwerze.
   * `gallery`: Referencja (ObjectId) przypisująca zdjęcie do konkretnej galerii z kolekcji `galleries`.
4. **Comment (`comments`)**
   * `text`: Treść komentarza (maks. 500 znaków).
   * `image`: Referencja (ObjectId) do komentowanego zdjęcia.
   * `user`: Referencja (ObjectId) do autora komentarza.
   * `created_at`: Czas utworzenia.

## 5. Opis interfejsu ścieżek/API (OpenAPI)
Aplikacja udostępnia interaktywną dokumentację w standardzie **OpenAPI (Swagger)**.
Po uruchomieniu aplikacji, pełny opis ścieżek, metod i modeli można przeglądać pod adresem:
👉 **`http://localhost:3000/api-docs`**

Główne grupy ścieżek obsługiwane przez aplikację:
* **`/` (Index):** Strona główna aplikacji, odczytująca status logowania z ciasteczka JWT (`mytoken`).
* **`/users`:** Rejestracja (`/user_add`), logowanie (`/user_login`), wylogowanie (`/user_logout`), lista użytkowników i ich usuwanie.
* **`/galleries`:** Przeglądanie galerii, dodawanie nowych (`/gallery_add`), usuwanie, edycja oraz wyświetlanie detali (`/gallery_show`). Większość operacji chroniona jest przez middleware `authenticate`.
* **`/images`:** Upload zdjęć (`/image_add`), edycja, usuwanie i wyświetlanie konkretnego zdjęcia wraz z mechanizmem dodawania komentarzy (`/image_show` metodą POST).
* **`/stats`:** Generowanie i pobieranie statystyk serwisu.

## 6. Instrukcja uruchomienia i instalacji

### Wymagania wstępne
> **Uwaga:** Poniższa instrukcja przygotowana jest dla systemu **Linux**.

1. Zainstalowane środowisko **Node.js** (wersja wspierająca ES6).
2. Zainstalowana i uruchomiona lokalnie baza **MongoDB**.
   * Baza musi nasłuchiwać na domyślnym porcie `27017`.
   * Aplikacja automatycznie utworzy i połączy się z bazą o nazwie `GalleryDB`.

### Kroki instalacji
1. Wypakuj katalog z projektem na swój dysk.
2. Otwórz terminal w głównym katalogu projektu (tam, gdzie znajduje się plik `package.json`).
3. Pobierz wszystkie niezbędne pakiety, wpisując polecenie:
   ```bash
   npm install
   ```
4. Uruchom serwer poleceniem:
   ```bash
   node bin/www
   ```
   * Jeśli pojawi się informacja, że port `3000` jest zajęty, należy go ręcznie zwolnić poleceniem:
     ```bash
     fuser -k 3000/tcp
     ```
     a następnie ponownie uruchomić serwer.
5. Otwórz przeglądarkę internetową i przejdź pod adres `http://localhost:3000`.

## 7. Import przykładowych danych (Bazy Testowej)

Do projektu dołączono zrzut bazy danych wykonany za pomocą narzędzia `mongodump`, znajdujący się w folderze `backup/GalleryDB`. Zrzut został wygenerowany za pomocą polecenia:

```bash
mongodump --archive="backup/GalleryDB" --db="GalleryDB"
```

### Wymagania
Do importu/eksportu bazy wymagany jest pakiet **MongoDB Database Tools**, dostępny do pobrania na stronie: https://www.mongodb.com/try/download/database-tools (np. `mongodb-database-tools-windows-x86_64-100.9.4.msi`). Po instalacji może być konieczne dodanie ścieżki do narzędzi do zmiennej środowiskowej `PATH`.

### Przywracanie bazy danych (restore)

* **Restore bazy pod tą samą nazwą (`GalleryDB`):**
  ```bash
  mongorestore --archive="backup/GalleryDB"
  ```

* **Restore bazy pod inną nazwą (np. `GalleryDB_AB`):**
  ```bash
  mongorestore --archive="backup/GalleryDB" --nsFrom="GalleryDB.*" --nsTo="GalleryDB_AB.*"
  ```