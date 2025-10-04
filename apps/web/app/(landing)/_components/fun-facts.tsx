"use client";

import type { LandingPageData } from "../_api/get-landing-data";

type Props = {
  initialData: LandingPageData;
};

export default function FunFacts({ initialData }: Props) {

console.log(initialData.facts)

  return (
    <div>
      <h2>jołmenik</h2>

      {/* <ul>
        {initialData.facts.map(f => (
          <li key={f.id}>
            <strong>{f.fact}</strong> — <em>{f.source}</em>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
