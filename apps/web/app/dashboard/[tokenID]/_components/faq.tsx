"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@hackathon/ui";

export function FAQ() {
  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
          Często zadawane pytania
        </h2>
        <p className="text-muted-foreground">
          Odpowiedzi na najczęstsze pytania o emeryturę
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem
          value="item-1"
          className="rounded-lg border px-4 shadow-sm sm:px-6"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="text-left text-sm font-semibold sm:text-base">
              Co wpływa na wysokość mojej emerytury?
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-sm sm:text-base">
            Wysokość emerytury zależy od kilku czynników: łącznej kwoty
            wpłaconych składek, długości okresu składkowego, średniego
            wynagrodzenia oraz wskaźników ekonomicznych takich jak inflacja i
            stopa zwrotu z inwestycji ZUS.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-2"
          className="rounded-lg border px-4 shadow-sm sm:px-6"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="text-left text-sm font-semibold sm:text-base">
              Czy mogę zwiększyć swoją przyszłą emeryturę?
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-sm sm:text-base">
            Tak! Możesz zwiększyć emeryturę poprzez: wydłużenie okresu
            składkowego, zwiększenie składek, inwestycje w III filar (IKE/IKZE),
            opóźnienie przejścia na emeryturę lub dodatkową pracę.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-3"
          className="rounded-lg border px-4 shadow-sm sm:px-6"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="text-left text-sm font-semibold sm:text-base">
              Jak często powinienem sprawdzać stan konta w ZUS?
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-sm sm:text-base">
            Zaleca się sprawdzanie stanu konta co najmniej raz na kwartał, aby
            upewnić się, że wszystkie składki są prawidłowo naliczane i
            ewidencjonowane. Możesz to zrobić poprzez platformę PUE ZUS.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-4"
          className="rounded-lg border px-4 shadow-sm sm:px-6"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="text-left text-sm font-semibold sm:text-base">
              Co to jest III filar emerytalny?
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-sm sm:text-base">
            III filar to dobrowolne oszczędzanie na emeryturę poprzez IKE
            (Indywidualne Konto Emerytalne) lub IKZE (Indywidualne Konto
            Zabezpieczenia Emerytalnego), które oferują korzyści podatkowe i
            dodatkowe zabezpieczenie finansowe.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
