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
import { useEffect, useMemo, useRef } from "react";
import type { LandingPageData } from "../_api/get-landing-data";

type Props = {
  initialData: LandingPageData;
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function pickRandom<T>(arr: T[], count: number): T[] {
  if (!arr?.length) return [];
  const res: T[] = [];
  const seen = new Set<number>();

  while (res.length < Math.min(count, arr.length)) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!seen.has(idx)) {
      seen.add(idx);
      const value = arr[idx];
      if (value !== undefined) res.push(value); // ✅ TS już wie, że value to T
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

  const facts = initialData?.facts ?? [];

  // wylosuj 3 fakty raz na zmianę danych
  const selectedFacts = useMemo(() => pickRandom(facts, 3), [facts]);

  // brak danych -> nic nie renderujemy (lub placeholder)
  if (selectedFacts.length === 0) {
    return <div className="w-full" />;
  }

  useEffect(() => {
    // cleanup interwału przy odmontowaniu/rekonfiguracji
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full">
      <Carousel
        opts={{ align: "start", loop: true }}
        className="relative w-full"
        setApi={(api) => {
          // zabezpieczenie przed wieloma interwałami
          if (api && !intervalRef.current) {
            intervalRef.current = setInterval(() => {
              api.scrollNext();
            }, 10000);
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
