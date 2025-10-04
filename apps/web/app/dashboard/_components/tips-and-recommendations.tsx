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
      <div className="space-y-2 text-center">
        <h2 className="text-foreground text-3xl font-bold">
          Porady i Rekomendacje
        </h2>
        <p className="text-muted-foreground">
          Spersonalizowane wskazówki dla każdego scenariusza
        </p>
      </div>

      <Tabs defaultValue="optimistic" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger
            value="optimistic"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Optymistyczny
          </TabsTrigger>
          <TabsTrigger
            value="medium"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            Średni
          </TabsTrigger>
          <TabsTrigger
            value="pessimistic"
            className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
          >
            Pesymistyczny
          </TabsTrigger>
        </TabsList>

        <TabsContent value="optimistic">
          <Card className="border-primary/30 shadow-md">
            <CardHeader>
              <CardTitle className="text-primary">
                Scenariusz Optymistyczny
              </CardTitle>
              <CardDescription>
                Strategia dla najlepszych warunków ekonomicznych
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-inside list-disc space-y-3">
                <li className="text-foreground">
                  <strong>Zwiększ składki o 20%</strong> - większe wpłaty
                  zapewnią znacznie wyższą emeryturę
                </li>
                <li className="text-foreground">
                  <strong>Rozważ III filar emerytalny</strong> - dodatkowe
                  zabezpieczenie finansowe
                </li>
                <li className="text-foreground">
                  <strong>Inwestuj w fundusze kapitałowe</strong> - wykorzystaj
                  korzystne warunki rynkowe
                </li>
                <li className="text-foreground">
                  <strong>Planuj wcześniejszą emeryturę</strong> - przy wysokich
                  oszczędnościach możesz przejść na emeryturę wcześniej
                </li>
                <li className="text-foreground">
                  <strong>Dywersyfikuj inwestycje</strong> - zabezpiecz kapitał
                  przed zmianami ekonomicznymi
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medium">
          <Card className="border-secondary/30 shadow-md">
            <CardHeader>
              <CardTitle style={{ color: "rgb(0, 65, 110)" }}>
                Scenariusz Średni
              </CardTitle>
              <CardDescription>
                Zrównoważona strategia dla stabilnych warunków
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-inside list-disc space-y-3">
                <li className="text-foreground">
                  <strong>Kontynuuj obecne składki</strong> - utrzymuj
                  regularność wpłat
                </li>
                <li className="text-foreground">
                  <strong>Rozważ dodatkowe oszczędności</strong> - 10-15%
                  dochodu na emeryturę
                </li>
                <li className="text-foreground">
                  <strong>Monitoruj stan konta</strong> - regularna kontrola co
                  kwartał
                </li>
                <li className="text-foreground">
                  <strong>Ubezpieczenie na życie</strong> - dodatkowe
                  zabezpieczenie rodziny
                </li>
                <li className="text-foreground">
                  <strong>Edukacja finansowa</strong> - poszerzaj wiedzę o
                  planowaniu emerytalnym
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pessimistic">
          <Card className="border-destructive/30 shadow-md">
            <CardHeader>
              <CardTitle className="text-destructive">
                Scenariusz Pesymistyczny
              </CardTitle>
              <CardDescription>
                Działania zaradcze w trudnych warunkach ekonomicznych
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-inside list-disc space-y-3">
                <li className="text-foreground">
                  <strong>Zwiększ składki o minimum 30%</strong> - niezbędne dla
                  osiągnięcia minimalnej emerytury
                </li>
                <li className="text-foreground">
                  <strong>Rozważ dodatkową pracę</strong> - wydłuż okres
                  składkowy lub zwiększ dochody
                </li>
                <li className="text-foreground">
                  <strong>IKE lub IKZE</strong> - wykorzystaj ulgi podatkowe na
                  oszczędności emerytalne
                </li>
                <li className="text-foreground">
                  <strong>Konsultacja z doradcą</strong> - profesjonalna pomoc w
                  planowaniu finansowym
                </li>
                <li className="text-foreground">
                  <strong>Redukcja wydatków</strong> - przeznaczyaj więcej
                  środków na oszczędności
                </li>
                <li className="text-foreground">
                  <strong>Opóźnij przejście na emeryturę</strong> - każdy
                  dodatkowy rok znacznie zwiększa świadczenie
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
