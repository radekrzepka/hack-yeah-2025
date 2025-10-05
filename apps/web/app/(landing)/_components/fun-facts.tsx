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

const EMPTY_FACTS: ReadonlyArray<{
  id: string;
  fact: string;
  source: string;
}> = Object.freeze([]);

type Props = {
  initialData: LandingPageData;
};

function pickRandom<T>(arr: ReadonlyArray<T>, count: number): Array<T> {
  if (!arr?.length) return [];
  const res: Array<T> = [];
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
      <CardTitle className="mb-5">Czy wiesz że:</CardTitle>
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
  const selectedFacts = useMemo(() => pickRandom(facts, 3), [facts]);

  if (selectedFacts.length === 0) return <div className="w-full" />;

  return (
    <div className="w-full">
      <Carousel
        ref={(el) => {
          if (!el && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }}
        opts={{ align: "start", loop: true }}
        className="relative w-full"
        setApi={(api) => {
          if (api && !intervalRef.current) {
            intervalRef.current = setInterval(() => {
              api.scrollNext();
            }, 10000);
          }
          if (!api && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }}
        onMouseEnter={() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }}
        onFocus={() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }}
        onSelect={() => {
          // Reset timer when user manually scrolls
          if (intervalRef.current) {
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
        <CarouselPrevious
          aria-label="Poprzednia ciekawostka"
          className="absolute left-2 top-1/2 -translate-y-1/2"
        />
        <CarouselNext
          aria-label="Następna ciekawostka"
          className="absolute right-2 top-1/2 -translate-y-1/2"
        />
      </Carousel>
    </div>
  );
}
