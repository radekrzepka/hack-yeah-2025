"use client";

import {
  Card,
  CardContent,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  TypographyP,
} from "@hackathon/ui";
import { useMemo, useRef } from "react";
import type { LandingPageData } from "../_api/get-landing-data";

// stabilna pusta tablica, nie tworzy nowej referencji co render
const EMPTY_FACTS: ReadonlyArray<{
  id: string;
  fact: string;
  source: string;
}> = Object.freeze([]);

type Props = {
  initialData: LandingPageData;
};

function pickRandom<T>(arr: readonly T[], count: number): T[] {
  if (!arr?.length) return [];
  const res: T[] = [];
  const seen = new Set<number>();

  while (res.length < Math.min(count, arr.length)) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!seen.has(idx)) {
      seen.add(idx);
      const value = arr[idx];
      if (value !== undefined) res.push(value);
    }
  }
  return res;
}

function FunFactsCard({
  fact,
}: {
  fact: { id: string; fact: string; source: string };
}) {
  return (
    <Card className="m-5 bg-[#fefefe] p-5">
      <CardTitle className="mb-5">Ciekawostka:</CardTitle>
      <CardContent>
        <ul>
          <li>
            <TypographyP>{fact.fact}</TypographyP>
            <br />
            <em>źródło: {fact.source}</em>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default function FunFacts({ initialData }: Props) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const facts = initialData?.facts ?? EMPTY_FACTS;

  // losujemy 3 fakty tylko raz dla danych
  const selectedFacts = useMemo(() => pickRandom(facts, 3), [facts]);

  if (selectedFacts.length === 0) return <div className="w-full" />;

  return (
    <div className="w-full">
      <Carousel
        opts={{ align: "start", loop: true }}
        className="relative w-full"
        setApi={(api) => {
          // Jeśli API jest dostępne — ustaw interwał, jeśli nie, wyczyść
          if (api && !intervalRef.current) {
            const timer = setInterval(() => {
              api.scrollNext();
            }, 10000);
            intervalRef.current = timer;

            // zwracamy cleanup callback — wywoła się przy odmontowaniu
            return () => {
              clearInterval(timer);
              intervalRef.current = null;
            };
          }

          // gdy API zostanie odłączone (np. unmount)
          if (!api && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }}
      >
        <CarouselContent>
          {selectedFacts.map((fact) => (
            <CarouselItem key={fact.id}>
              <FunFactsCard fact={fact} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
}
