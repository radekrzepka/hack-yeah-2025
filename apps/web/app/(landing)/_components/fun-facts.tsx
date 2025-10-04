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
} from "@hackathon/ui";
import { useRef } from "react";
import type { LandingPageData } from "../_api/get-landing-data";

import { TypographyP } from "@hackathon/ui";

type Props = {
  initialData: LandingPageData;
};

function getRandomNumber(factsNumber: number) {
  return Math.floor(Math.random() * factsNumber);
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
          <li key={fact.id}>
            <TypographyP>{fact.fact}</TypographyP>
            <br></br>
            <em>źródło: {fact.source}</em>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default function FunFacts({ initialData }: Props) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  return (
    // <div>{/* {straightFacts && <FunFactsCard fact={straightFacts} />} */}</div>
    <div className="w-full">
      {initialData.facts[getRandomNumber(initialData.facts.length)] && (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="relative w-full"
          setApi={(api) => {
            if (api && !intervalRef.current) {
              intervalRef.current = setInterval(() => {
                api.scrollNext();
              }, 10000);
            }
          }}
        >
          <CarouselContent>
            <CarouselItem>
              <FunFactsCard
                fact={
                  initialData.facts[getRandomNumber(initialData.facts.length)]!
                }
              />
            </CarouselItem>
            <CarouselItem>
              <FunFactsCard
                fact={
                  initialData.facts[getRandomNumber(initialData.facts.length)]!
                }
              />
            </CarouselItem>
            <CarouselItem>
              <FunFactsCard
                fact={
                  initialData.facts[getRandomNumber(initialData.facts.length)]!
                }
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
        </Carousel>
      )}
    </div>
  );
}
