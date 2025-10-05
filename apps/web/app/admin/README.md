# Admin Panel - Dokumentacja

Panel administracyjny dla systemu symulacji emerytalnych ZUS.

## 🚀 Quick Start

### Dostęp do panelu

Panel admina jest dostępny pod adresem: `/admin`

### Dane testowe

Do logowania użyj poniższych danych:

```
Login: admin
Hasło: admin123
```

Inne dostępne konta:
- `moderator` / `mod123`
- `viewer` / `view123`

## 📁 Struktura projektu

```
/app/admin/
├── _api/
│   └── client/
│       ├── login.ts          # API client do logowania
│       └── dashboard.ts      # API client do pobierania danych dashboardu
├── _hooks/
│   ├── use-login.ts          # Hook do obsługi logowania
│   ├── use-auth.ts           # Hook do zarządzania sesją
│   └── use-dashboard.ts      # Hook do pobierania danych dashboardu
├── _utils/
│   └── handle-admin-error.ts # Obsługa błędów API
├── dashboard/
│   └── page.tsx              # Główny dashboard administratora
├── login-form.tsx            # Komponent formularza logowania
├── page.tsx                  # Strona logowania
├── schema.ts                 # Schematy walidacji Zod
└── README.md                 # Ten plik
```

## 🔐 Autentykacja

### Proces logowania

1. Użytkownik wypełnia formularz z loginem i hasłem
2. Dane są walidowane lokalnie przez Zod schema
3. Request jest wysyłany do `/v1/admin/login`
4. Backend zwraca JWT token
5. Token jest zapisywany w:
   - Cookie `auth-token` (dla API calls)
   - LocalStorage/SessionStorage (dla persistence)
6. Przekierowanie na `/admin/dashboard`

### Request/Response

**POST** `/v1/admin/login`

Request:
```json
{
  "login": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 📊 Dashboard

### Features

- **Statystyki w czasie rzeczywistym**
  - Liczba wszystkich symulacji
  - Symulacje dzisiejsze
  - Aktywni użytkownicy (30 dni)
  - Średnia kwota emerytury
  - Wskaźniki wzrostu/spadku

- **Ostatnia aktywność**
  - Lista 10 ostatnich zdarzeń w systemie
  - Czasy względne (np. "5 minut temu")
  - Rodzaje aktywności: symulacje, logowania, eksporty

- **Auto-refresh**
  - Dashboard automatycznie odświeża dane co 30 sekund
  - Przycisk manualnego odświeżania

### API Endpoint

**GET** `/v1/admin/dashboard`

Headers:
```
Authorization: Bearer {jwt_token}
```

Response:
```json
{
  "stats": {
    "totalSimulations": 12847,
    "todaySimulations": 342,
    "activeUsers": 2156,
    "averagePension": 3245.50,
    "monthlyGrowth": 12.5,
    "dailyGrowth": 8.3
  },
  "recentActivity": [
    {
      "id": "uuid",
      "type": "simulation",
      "user": "Jan Kowalski",
      "timestamp": "2024-01-15T10:30:00Z",
      "details": "Nowa symulacja emerytury - 3245.50 PLN"
    }
  ]
}
```

## 🛡️ Zabezpieczenia

### Middleware

Middleware (`/middleware.ts`) chroni route `/admin/dashboard`:
- Sprawdza obecność tokenu w cookies
- Przekierowuje na stronę logowania jeśli brak tokenu
- Automatycznie ustawia `auth-token` cookie dla API calls

### Token Storage

- **Remember Me = ON**: Token w `localStorage` (7 dni w cookie)
- **Remember Me = OFF**: Token w `sessionStorage` (session cookie)

### Wylogowanie

Proces wylogowania:
1. Usuwa token z localStorage/sessionStorage
2. Usuwa cookie `auth-token`
3. Przekierowuje na `/admin`

## 🎨 UI/UX Features

### Strona logowania
- Animowane tło z gradientami
- Pulsujące efekty świetlne
- Przezroczysta karta z backdrop blur
- Walidacja w czasie rzeczywistym
- Responsywny design

### Dashboard
- Sticky header z blur effect
- Karty statystyk z gradientami
- Wskaźniki wzrostu ze strzałkami
- Skeleton loaders podczas ładowania
- Mini wykres trendów (7 dni)
- Status systemu z pulsującą kropką

## 🔧 Development

### Uruchomienie lokalnie

```bash
# Frontend (Next.js)
cd apps/web
npm run dev

# Backend (NestJS)
cd apps/api
npm run start:dev
```

### Zmienne środowiskowe

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Testowanie

```bash
# Frontend tests
cd apps/web
npm run test

# Backend tests
cd apps/api
npm run test
```

## 📝 Walidacja formularzy

### Login
- Wymagane: minimum 1 znak
- Dozwolone znaki: `a-z`, `A-Z`, `0-9`, `_`, `.`, `-`
- Regex: `/^[a-zA-Z0-9_.-]+$/`

### Hasło
- Wymagane: minimum 1 znak
- Brak innych ograniczeń (dla uproszczenia)

## 🐛 Troubleshooting

### Problem: Token nie jest wysyłany do API

**Rozwiązanie**: Sprawdź czy cookie `auth-token` jest ustawione:
```javascript
document.cookie // powinno zawierać "auth-token"
```

### Problem: Dashboard pokazuje "Brak autoryzacji"

**Rozwiązanie**: Wyczyść storage i zaloguj się ponownie:
```javascript
localStorage.clear();
sessionStorage.clear();
document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
```

### Problem: CORS errors

**Rozwiązanie**: Sprawdź konfigurację CORS w backend (`main.ts`):
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

## 📚 Dodatkowe zasoby

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🔄 Changelog

### v2.0.0 (Aktualna)
- ✅ Nowoczesny UI z gradientami i animacjami
- ✅ Integracja z prawdziwym API NestJS
- ✅ Automatyczne odświeżanie danych
- ✅ JWT authentication
- ✅ Middleware protection
- ✅ Responsive design
- ✅ Real-time statistics

---

**Stworzone przez**: Zespół ZUS Tech
**Ostatnia aktualizacja**: 2024
**Wersja**: 2.0.0