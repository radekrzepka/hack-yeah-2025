"use server";

export interface FactData {
  id: string;
  fact: string;
  source: string;
}

export interface LandingPageData {
  facts: Array<FactData>;
}

export async function getLandingData(): Promise<LandingPageData> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("Missing API_URL or NEXT_PUBLIC_API_URL");

  const url = `${base}v1/data/landing-page-data`; // dodany brakujący "/"
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json() as Promise<LandingPageData>;
}
