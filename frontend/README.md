# Konzola — Frontend

React + Vite frontend za aplikaciju za iznajmljivanje konzola. Apple-styled dizajn (Inter
font, system blue akcenat), bez izmena na backendu.

## Stack

- **React 18** + **Vite 5**
- **Tailwind CSS** — boje i fontovi definisani u `src/main.css` i `tailwind.config.js`
- **axios** — HTTP klijent (`src/lib/api.js`)
- **@tanstack/react-query** — keširanje i mutacije (`src/lib/hooks.js`)
- **lucide-react** — ikonice

## Pokretanje

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

Backend (ASP.NET) mora da radi na **http://localhost:5070** (profil `http`).
Vite dev server **proksira** `/auth`, `/konzole`, `/klijenti`, `/iznajmljivanja` na backend
(vidi `vite.config.js`), pa nema CORS problema i backend se ne dira.

## Prijava

- **Radnik (demo):** `admin` / `Admin123!`
- **Klijent:** registruj se kroz formu (Registracija) ili iskoristi nalog iz baze.

## Uloge

| Uloga   | Mogućnosti                                                                    |
| ------- | ----------------------------------------------------------------------------- |
| Radnik  | Konzole (CRUD), Klijenti (izmena + kredit), Iznajmljivanja (korpa → kreiraj, završi/otkaži) |
| Klijent | Katalog konzola (pregled), Moja iznajmljivanja (pregled)                       |

> Napomena: backend dozvoljava kreiranje iznajmljivanja samo radniku
> (`POST /iznajmljivanja` je `[Authorize(Roles = "Radnik")]`), pa klijent vidi svoja
> iznajmljivanja read-only, a radnik ih kreira na šalteru.

## Struktura

```
src/
  lib/        api, auth (JWT), hooks (react-query), constants (enumi), format
  components/ ui primitivci, Modal, Toast, kartice, forme
  pages/      AuthPage, KonzolePage, KlijentiPage, IznajmljivanjaPage,
              KatalogPage, MojaIznajmljivanjaPage
```

### Detalji vredni pažnje

- Backend serijalizuje enume kao **brojeve** (default `System.Text.Json`), pa
  `src/lib/constants.js` mapira brojeve ↔ nazive (`Stanje`, `Status`, `TipKonzole`).
- Mesta su hardkodirana u `constants.js` (backend nema `GET /mesta`).
