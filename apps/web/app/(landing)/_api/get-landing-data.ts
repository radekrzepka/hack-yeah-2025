"use server";

import type { ApiResponse } from "@/_utils/fetch/shared";

import { clientFetch } from "@/_utils/fetch/client-fetch";

export interface FactData {
  id: string;
  fact: string;
  source: string;
}

export interface LandingPageData {
  facts: Array<FactData>;
}

export async function getLandingData(): Promise<LandingPageData> {
  // używamy clientFetch z endpointem zgodnym z konwencją /v1/*
  const response: ApiResponse<LandingPageData> =
    await clientFetch<LandingPageData>("/data/landing-page-data", {
      method: "GET",
    });

  // clientFetch już sam rzuci ApiError przy błędzie, więc tu tylko zwracamy dane
  return response.data;
}
