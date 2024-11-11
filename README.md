# Trullo

Individuell examinationsuppgift - Trullo | FJS23

## Extra VG Features

- Robust felhantering och validering.
- Utvecklad datamodellen Task med Tags.
- Lade till datamodellen Project som inehåller tasks, mm.
- Krypterat lösenord i databasen med hashing och salting.
- Implementerat möjlighet för användaren att nollställa och välja nytt lösenord.

## Teoretiska resonemang

### Motivera ditt val av databas

Jag valde att använda mig utav MongoDB med mongoose främst för att fördjupa mig med en NoSQL databas. Realistiskt sätt spelar det inte så stor roll i detta projekt då det bara är en uppgift men om det var en live service som Trello så passar MongoDB fortfarande då det är väldigt skalbart samt snabbt med de relativt små dokumenten som skapas. Jag tycker personligen att NoSQL är snabbare att utveckla i jämfört med SQL.

### Redogör vad de olika teknikerna (ex. verktyg, npm-paket, etc.) gör i applikationen

- NodeJS: Är till för att köra javascript utanför en webbläsare så det kan användas för att skriva serverkod.
- Express: Ett framwork för att förenkla utveckling av serverkod med NodeJS.
- Mongoose: Definera datamodeller och operationer på dessa för en MongoDB databas.
- dotenv: Helper för att ladda in environment variabler från en .env fil för sånt som inte bör laddas upp i ett repo.
- BCrypt: Används för att salta, kryptera samt checka krypterade lösenord.
- Nodemon: Utvecklingsverktyg som automatiskt startar om lokala applikationen när en ändring sparas.
- Cors: Middleware för att tillåta kommunikation mellan frontend och backend servern. OBS: Har inte gjort klart client till inlämningen men planerar att göra den i framtiden.

### Redogör översiktligt hur applikationen fungerar

Applikationen är baserad kring tre datamodeller User, Project och Task för att efterlikna kanban verktyget Trello. Man börjar med att skapa en användare med ett namn, email och lösenord. Användare kan sedan skapa projekt likt boards in Trello, den som skapar projektet blir då ägaren. Ägaren kan sedan bjuda in andra användare till projektet samt skapa tasks som då tillhör projektet. Tasksen har en del data som en titel, beskrivning, status, tags, mm och kan även tilldelas till en av användarna i projektet.

## Dependencies

### .env

PORT=0000  
DB_URI="..."  
DB_USER="..."  
DB_PASS="..."
