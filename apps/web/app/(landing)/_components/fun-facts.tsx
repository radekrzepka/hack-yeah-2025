"use client";

import { Card, CardContent, CardTitle } from "@hackathon/ui";
import { useState } from "react";
import type { LandingPageData } from "../_api/get-landing-data";

type Props = {
  initialData: LandingPageData;
};

export default function FunFacts({ initialData }: Props) {
  const [randomNumber] = useState<number>(
    Math.floor(Math.random() * initialData.facts.length),
  );
  const straightFacts = initialData.facts[randomNumber];

  return (
    <div>
      {straightFacts && (
        <Card className="m-5 bg-[#fefefe] p-5">
          <CardTitle className="mb-5">Ciekawostka:</CardTitle>
          <CardContent>
            <ul>
              <li key={straightFacts.id}>
                <strong>{straightFacts.fact}</strong>
                <br></br>
                <em>źródło: {straightFacts.source}</em>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
