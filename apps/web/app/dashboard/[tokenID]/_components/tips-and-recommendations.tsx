"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@hackathon/ui";

export function TipsAndRecommendations() {
  return (
    <section className="space-y-6">
      <Tabs defaultValue="salary-increase" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger
            value="salary-increase"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Zwiększenie Zarobków</span>
            <span className="sm:hidden">Zarobki</span>
          </TabsTrigger>
          <TabsTrigger
            value="work-longer"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground text-xs sm:text-sm"
          >
            Praca Dłużej
          </TabsTrigger>
          <TabsTrigger
            value="fewer-sick-days"
            className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Redukcja Dni Chorobowych</span>
            <span className="sm:hidden">Zdrowie</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="salary-increase">
          <Card className="border-primary/30 shadow-md">
            <CardHeader>
              <CardTitle className="text-primary">
                Zwiększenie Zarobków
              </CardTitle>
              <CardDescription>
                Strategie podnoszenia wynagrodzenia dla wyższej emerytury
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-inside list-disc space-y-2 text-sm sm:space-y-3 sm:text-base">
                <li className="text-foreground">
                  <strong>Negocjuj podwyżki wynagrodzenia</strong> - zwiększenie
                  pensji o 10-20% znacząco podniesie emeryturę
                </li>
                <li className="text-foreground">
                  <strong>Rozwijaj umiejętności zawodowe</strong> - awanse i
                  lepsze stanowiska to wyższe wynagrodzenie
                </li>
                <li className="text-foreground">
                  <strong>Poszukaj lepiej płatnej pracy</strong> - zmiana
                  stanowiska może przynieść znaczący wzrost zarobków
                </li>
                <li className="text-foreground">
                  <strong>Dodatkowe kwalifikacje</strong> - certyfikaty i
                  szkolenia zwiększają wartość na rynku pracy
                </li>
                <li className="text-foreground">
                  <strong>Freelancing i dodatkowa praca</strong> - dodatkowe
                  źródła dochodu zwiększają podstawę emerytalną
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work-longer">
          <Card className="border-secondary/30 shadow-md">
            <CardHeader>
              <CardTitle style={{ color: "rgb(0, 65, 110)" }}>
                Praca Dłużej
              </CardTitle>
              <CardDescription>
                Korzyści z przedłużenia aktywności zawodowej
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-inside list-disc space-y-2 text-sm sm:space-y-3 sm:text-base">
                <li className="text-foreground">
                  <strong>Przedłuż pracę o 1-2 lata</strong> - każdy dodatkowy
                  rok pracy znacząco zwiększa emeryturę
                </li>
                <li className="text-foreground">
                  <strong>Stopniowe przechodzenie na emeryturę</strong> - praca
                  w niepełnym wymiarze godzin
                </li>
                <li className="text-foreground">
                  <strong>Konsultacje z pracodawcą</strong> - możliwość
                  elastycznego harmonogramu pracy
                </li>
                <li className="text-foreground">
                  <strong>Zachowanie zdrowia</strong> - regularne badania i
                  aktywność fizyczna umożliwiają dłuższą pracę
                </li>
                <li className="text-foreground">
                  <strong>Dostosowanie stanowiska</strong> - mniej wymagające
                  fizycznie zadania w starszym wieku
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fewer-sick-days">
          <Card className="border-destructive/30 shadow-md">
            <CardHeader>
              <CardTitle className="text-destructive">
                Redukcja Dni Chorobowych
              </CardTitle>
              <CardDescription>
                Wpływ zmniejszenia absencji chorobowej na emeryturę
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-inside list-disc space-y-2 text-sm sm:space-y-3 sm:text-base">
                <li className="text-foreground">
                  <strong>Zadbaj o zdrowie</strong> - profilaktyka i zdrowy tryb
                  życia zmniejszają absencję w pracy
                </li>
                <li className="text-foreground">
                  <strong>Regularne badania lekarskie</strong> - wczesne
                  wykrywanie problemów zdrowotnych
                </li>
                <li className="text-foreground">
                  <strong>Aktywność fizyczna</strong> - regularne ćwiczenia
                  wzmacniają odporność i kondycję
                </li>
                <li className="text-foreground">
                  <strong>Zbilansowana dieta</strong> - prawidłowe odżywianie
                  wspiera układ odpornościowy
                </li>
                <li className="text-foreground">
                  <strong>Zarządzanie stresem</strong> - techniki relaksacyjne i
                  work-life balance
                </li>
                <li className="text-foreground">
                  <strong>Szczepienia profilaktyczne</strong> - ochrona przed
                  chorobami zakaźnymi
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
