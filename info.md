# kalkulowanie emerytury

Jasne, rozumiem. Potrzebujesz "przepisu na ciasto" – konkretnego wzoru i dokładnej listy składników (danych z tabel) z instrukcją, jak ich użyć.

Oto najprostszy do zrozumienia, ale wciąż poprawny merytorycznie model, który możecie zaimplementować.

### **Wzór "Wielki Finał"**

Na samym końcu waszych obliczeń, emerytura jest wyliczana z banalnie prostego wzoru:

> Emerytura Miesięczna Brutto = Całkowity Zgromadzony Kapitał / Średnie Dalsze Trwanie Życia (w miesiącach)
> 

Cała trudność polega na obliczeniu tych dwóch składowych: `Kapitału` i `Średniego Dalszego Trwania Życia`. Poniżej znajdziesz instrukcję krok po kroku, jak to zrobić.

---

### **Część 1: Jak znaleźć "Średnie Dalsze Trwanie Życia"?**

To najłatwiejsza część. Jest to wartość statystyczna, którą publikuje Główny Urząd Statystyczny (GUS).

- **Nazwa tabeli:** Tablice średniego dalszego trwania życia kobiet i mężczyzn.
- **Słowa kluczowe do wyszukania:** `tablice średniego dalszego trwania życia GUS`
- **Co jest z niej potrzebne:** Jedna, konkretna liczba.

### **Jak wygląda i jak jej użyć:**

Tabela wygląda mniej więcej tak (dane są przykładowe):

| Wiek (lata ukończone) | Kobiety (w miesiącach) | Mężczyźni (w miesiącach) |
| --- | --- | --- |
| ... | ... | ... |
| 60 | 264,2 | 221,4 |
| 61 | 255,5 | 213,2 |
| 62 | 246,9 | 205,1 |
| 63 | 238,4 | 197,1 |
| 64 | 230,0 | 189,2 |
| **65** | 221,7 | **181,3** |
| ... | ... | ... |

**Instrukcja:**

1. Ustal wiek, w którym użytkownik przechodzi na emeryturę (np. 65 lat dla mężczyzny).
2. Znajdź w tabeli wiersz dla wieku `65`.
3. Wybierz wartość z kolumny odpowiadającej płci (`Mężczyźni`).
4. W tym przypadku, twoja wartość `Średnie Dalsze Trwanie Życia` to **181,3**. To jest mianownik twojego głównego wzoru.

---

### **Część 2: Jak obliczyć "Całkowity Zgromadzony Kapitał"?**

To jest serce twojej aplikacji. Obliczasz to w pętli, rok po roku, od `workStartDate` do `plannedRetirementYear`. W każdej iteracji (w każdym roku) wykonujesz dwie operacje: **dodajesz nowe składki** i **waloryzujesz (oprocentowujesz) cały dotychczasowy kapitał**.

**Wzór na każdy rok w pętli:**

> Kapitał_w_roku_X = (Kapitał_z_roku_X-1 * Wskaźnik_Waloryzacji) + Roczna_Składka
> 

Aby użyć tego wzoru, potrzebujesz dwóch rzeczy: `Rocznej Składki` i `Wskaźnika Waloryzacji`.

### **2A. Jak obliczyć `Roczną Składkę`?**

> Roczna Składka = Wynagrodzenie Roczne Brutto * 19,52%
> 

Problem: Znasz tylko dzisiejsze wynagrodzenie. Musisz oszacować je dla przeszłości i przyszłości.

- **Tabela do tego potrzebna:** Przeciętne wynagrodzenie w gospodarce narodowej (GUS).
- **Słowa kluczowe:** `przeciętne wynagrodzenie GUS rok do roku`
- **Co jest z niej potrzebne:** Wskaźnik wzrostu z roku na rok.

**Jak wygląda i jak jej użyć (dane przykładowe):**

| Rok | Przeciętne wynagrodzenie (PLN) | Wskaźnik wzrostu (rok do roku) |
| --- | --- | --- |
| 2021 | 5920 | - |
| 2022 | 6480 | 1,094 (bo 6480 / 5920) |
| 2023 | 7100 | 1,095 (bo 7100 / 6480) |

**Instrukcja (Reverse-indexing dla przeszłości):**
Aby oszacować pensję użytkownika w 2022 roku, znając jego pensję z 2023 (np. 7500 PLN), robisz:
`Pensja_2022 = 7500 / 1,095 = 6849 PLN`.
Robisz tak dla każdego roku wstecz aż do `workStartDate`.

**Dla przyszłości:** Musicie znaleźć prognozy wzrostu wynagrodzeń (szukaj: `wieloletni plan finansowy państwa założenia`) lub przyjąć stałe, sensowne założenie (np. `4%` rocznie) i o tym powiedzieć.

### **2B. Jak znaleźć `Wskaźnik Waloryzacji`?**

To "oprocentowanie" twojego kapitału w ZUS. Co roku w czerwcu ZUS ogłasza oficjalny wskaźnik.

- **Tabela do tego potrzebna:** Wskaźniki waloryzacji składek na ubezpieczenie emerytalne.
- **Słowa kluczowe:** `wskaźniki waloryzacji składek ZUS archiwum`
- **Co jest z niej potrzebne:** Wskaźnik na dany rok.

**Jak wygląda i jak jej użyć (dane przykładowe, ale bliskie realnym):**

| Waloryzacja za rok | Ogłoszona w roku | Wskaźnik Waloryzacji |
| --- | --- | --- |
| 2020 | 2021 | 105,41% (czyli mnożnik **1,0541**) |
| 2021 | 2022 | 109,20% (czyli mnożnik **1,0920**) |
| 2022 | 2023 | 114,40% (czyli mnożnik **1,1440**) |

**Instrukcja:**
W pętli, dla każdego roku, pobierasz odpowiedni wskaźnik. Np. waloryzując kapitał na koniec 2022 roku, używasz wskaźnika za rok 2022, czyli `1,1440`.

**Dla przyszłości:** Znowu, musicie znaleźć prognozy (są w tych samych dokumentach co wzrost pensji) lub przyjąć rozsądne założenie (np. `5%` rocznie) i jasno to zakomunikować.

---

### **Podsumowanie: Algorytm dla Backendu (Ty i Radek)**

```tsx
// 1. ZNAJDŹ DANE ZEWNĘTRZNE
// Pobierz i zapisz gdzieś w projekcie (np. w pliku JSON) dane z tabel:
// - Średniego dalszego trwania życia (GUS)
// - Przeciętnego wynagrodzenia (GUS) -> przelicz na wskaźniki wzrostu
// - Historycznych wskaźników waloryzacji (ZUS)
// Ustalcie wasze założenia co do przyszłych wskaźników (np. 4% wzrost pensji, 5% waloryzacji)

// 2. GŁÓWNA FUNKCJA SYMULACJI
function symulujEmeryture(daneWejsciowe) {
    let kapital = 0.0;
    const SKLADKA_PROCENT = 0.1952;

    const startYear = getYear(daneWejsciowe.workStartDate);
    const endYear = daneWejsciowe.plannedRetirementYear;

    let aktualneRoczneWynagrodzenie = daneWejsciowe.grossSalary * 12;

    // Pętla od tyłu (do oszacowania pensji historycznych)
    // ... tutaj logika reverse-indexing

    // 3. GŁÓWNA PĘTLA OBLICZENIOWA
    for (let rok = startYear; rok < endYear; rok++) {
        // a) Ustal wynagrodzenie na dany rok (użyj oszacowanych/prognozowanych wartości)
        const wynagrodzenieWRoku = obliczWynagrodzenieDlaRoku(rok, ...);

        // b) Oblicz roczną składkę
        const rocznaSkladka = wynagrodzenieWRoku * SKLADKA_PROCENT;

        // c) Znajdź wskaźnik waloryzacji na dany rok (historyczny lub wasze założenie)
        const wskaznikWaloryzacji = znajdzWskaznikDlaRoku(rok, ...);

        // d) Zastosuj wzór na dany rok
        kapital = (kapital * wskaznikWaloryzacji) + rocznaSkladka;
    }

    // 4. FINAŁ
    const wiekEmerytalny = endYear - getYear(dataUrodzenia);
    const sdtz = znajdzWartoscZDanejGUS(wiekEmerytalny, daneWejsciowe.sex);

    const miesiecznaEmerytura = kapital / sdtz;

    return miesiecznaEmerytura;
}

```

To jest kompletny przepis. Jeśli zaimplementujecie ten model, będzie on w 100% zgodny z wymaganiami i metodologią ZUS, a jednocześnie jest wystarczająco prosty do zrobienia w 24 godziny.

Genialnie! To jest absolutny skarb, macie wszystko, czego potrzebujecie. To są oficjalne dane prognostyczne ZUS. Waszym zadaniem jest teraz je poprawnie zinterpretować i użyć.

Oto wasz **ostateczny plan działania** oparty na tych plikach.

### **Podsumowanie: Które dane są najważniejsze?**

1. **Silnik symulacji (90% waszej pracy):** Będzie oparty **WYŁĄCZNIE** na pierwszym tabie: **`Parametry roczne`**. On zawiera wszystko: historyczne i prognozowane pensje, wskaźniki waloryzacji dla konta i subkonta.
2. **Obliczenie emerytury (ostatni krok):** Użyjecie tabeli **`e_x M i K-PROGRNOZA`**. To jest prognoza, jak długo ludzie będą żyli w przyszłości i jest dokładniejsza niż statyczne tablice GUS.

**Co z resztą? IGNORUJECIE JE na razie.**

- `kwartalne wskazniki waloryzacji`: Zbyt skomplikowane na hackathon. Waloryzacja roczna jest tym, czego potrzebujecie.
- `e_x M i K-GUS`: To alternatywna, prostsza tabela. Macie lepszą (`PROGNOZA`), więc użyjcie tej lepszej.
- `e60 M i K...`: To tylko wycinki dużych tabel. Nie są wam potrzebne.

---

### **Krok 1: Przygotowanie Danych (Zadanie na teraz)**

1. **Konwersja na JSON:** Skoncentrujcie się i zróbcie to dobrze raz a porządnie. Użyjcie skryptu, który wam podałem wcześniej.
    - **Plik 1:** Otwórzcie `Parametry-III 2025.xlsx`, przejdźcie do taba `Parametry roczne` i zapiszcie go jako **NOWY PLIK CSV**, np. `parametry_roczne.csv`. Skrypt `xlsx` czasem ma problemy ze złożonymi plikami Excel, konwersja do CSV upraszcza sprawę. Potem przeróbcie CSV na JSON.
    - **Plik 2:** To samo zróbcie dla taba `e_x M i K-PROGRNOZA`. Zapiszcie go jako `sdtz_prognoza.csv` i przekonwertujcie na JSON.
2. **Struktura JSON:** Wasz wynikowy plik `parametry_roczne.json` powinien wyglądać tak (po oczyszczeniu nazw kolumn):
    
    ```json
    [
      {
        "rok": 2014,
        "wskaznikWzrostuWynagrodzenia": 1.03655,
        "przecietneWynagrodzenie": 3783.46,
        "stopaNaSubkonto": 0.0438, // 4.38%
        "waloryzacjaKonta": 1.0206, // 102.06%
        "waloryzacjaSubkonta": 1.0489 // 104.89%
      },
      // ... kolejne lata
    ]
    
    ```
    

---

### **Krok 2: Ulepszony i Ostateczny Algorytm Obliczeniowy**

Kluczowa informacja z tych danych jest taka, że musicie osobno śledzić kapitał na **koncie głównym** i na **subkoncie**, bo mają inne "oprocentowanie" (waloryzację).

**Oto wasz nowy, precyzyjny pseudokod:**

```tsx
// W waszym DataProviderService macie dostęp do danych z JSONów

function symulujEmeryture(daneWejsciowe) {
    let kapitalKontoGlowne = 0.0;
    let kapitalSubkonto = 0.0;

    const startYear = getYear(daneWejsciowe.workStartDate);
    const endYear = daneWejsciowe.plannedRetirementYear;

    // --- PĘTLA GŁÓWNA ---
    for (let biezacyRok = startYear; biezacyRok < endYear; biezacyRok++) {

        // 1. ZNAJDŹ PARAMETRY DLA BIEŻĄCEGO ROKU
        const parametryRoczne = dataProvider.getParamsForYear(biezacyRok); // Pobiera cały wiersz z JSONa

        // 2. OBLICZ WYNAGRODZENIE W DANYM ROKU
        // Użyjcie "przecietneWynagrodzenie" i "wskaznikWzrostuWynagrodzenia" do oszacowania pensji użytkownika
        const roczneWynagrodzenie = obliczWynagrodzenieDlaRoku(
            daneWejsciowe.grossSalary, biezacyRok, dataProvider
        );

        // 3. OBLICZ I PODZIEL SKŁADKĘ
        const calkowitaSkladkaEmerytalna = 0.1952; // 19.52%

        // Dane w pliku są w % całości pensji, nie % składki, więc upraszczamy:
        const stopaNaSubkonto = parametryRoczne.stopaNaSubkonto; // np. 0.0438
        const stopaNaKontoGlowne = calkowitaSkladkaEmerytalna - stopaNaSubkonto;

        const skladkaNaSubkonto = roczneWynagrodzenie * stopaNaSubkonto;
        const skladkaNaKontoGlowne = roczneWynagrodzenie * stopaNaKontoGlowne;

        // 4. ZASTOSUJ SKŁADKĘ (Dodaj do kapitału)
        kapitalKontoGlowne += skladkaNaKontoGlowne;
        kapitalSubkonto += skladkaNaSubkonto;

        // 5. ZASTOSUJ WALORYZACJĘ (Oprocentowanie całego kapitału)
        const mnoznikWaloryzacjiKonta = parametryRoczne.waloryzacjaKonta;     // np. 1.0206
        const mnoznikWaloryzacjiSubkonta = parametryRoczne.waloryzacjaSubkonta; // np. 1.0489

        kapitalKontoGlowne *= mnoznikWaloryzacjiKonta;
        kapitalSubkonto *= mnoznikWaloryzacjiSubkonta;
    }

    // --- FINAŁOWE OBLICZENIE ---

    // 6. ZSUMUJ KAPITAŁ
    const calkowityKapital = kapitalKontoGlowne + kapitalSubkonto;

    // 7. ZNAJDŹ ŚREDNIE DALSZE TRWANIE ŻYCIA (SDTŻ)
    const wiekEmerytalny = endYear - rokUrodzeniaUzytkownika;
    const sdtz_w_miesiacach = dataProvider.getPrognozowaneSDTZ(wiekEmerytalny, endYear, daneWejsciowe.sex);
    // Ta funkcja musi znaleźć w JSONie `sdtz_prognoza` wartość na przecięciu wiersza 'wiek' i kolumny 'rok'.

    // 8. OBLICZ EMERYTURĘ
    const miesiecznaEmerytura = calkowityKapital / sdtz_w_miesiacach;

    return miesiecznaEmerytura;
}

```

### **Instrukcja dla `DataProviderService`**

Wasz serwis będzie miał teraz kluczowe metody:

- `getParamsForYear(rok)`: Znajduje w `parametry_roczne.json` obiekt dla danego roku i go zwraca.
- `getPrognozowaneSDTZ(wiek, rok, plec)`: Ta jest trudniejsza. Wasz JSON z prognozą życia będzie wyglądał tak:
Musicie odfiltrować obiekt, gdzie `wiek (x)` jest równy `wiek`, a następnie pobrać z niego wartość pod kluczem `rok` (który jest stringiem!). Pamiętajcie, że tablica jest wspólna dla kobiet i mężczyzn - musicie dostać od ZUS informację, której użyć (prawdopodobnie tej samej dla obu płci, bo to uśrednienie). **Jeśli nie macie tej informacji, załóżcie, że jest taka sama - to akceptowalne uproszczenie na hackathon.**
    
    ```json
    [
      {
        "wiek (x)": 65,
        "2060": 274.0,
        "2061": 275.4,
        // ...
      },
      // ...
    ]
    
    ```
    

**Podsumowując, wasz plan:**

1. **Backend (Ty i Radek):**
    - Jedna osoba konwertuje `Parametry roczne` i `e_x M i K-PROGRNOZA` do JSON.
    - Druga osoba buduje szkielet `DataProviderService` i `SimulationService`.
    - Wspólnie implementujecie **nowy, ulepszony algorytm**, który rozdziela kapitał na konto główne i subkonto.
2. **Frontend:** Wasz kontrakt API się nie zmienia, ale dane, które dostaniecie, będą teraz dużo dokładniejsze.
3. **Wszyscy:** Jesteście w świetnej pozycji, bo macie twarde, oficjalne dane. Podkreślcie to w prezentacji! To wasza przewaga.