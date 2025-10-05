import { Injectable } from "@nestjs/common";

export interface PostalCodeApiResponse {
    kod: string;
    miejscowosc: string;
    gmina?: string;
    powiat: string;
    wojewodztwo: string;
    numeracja?: string[];
    ulica?: string;
    numer?: string;
    nazwa?: string;
}

@Injectable()
export class PostalCodeApiService {
    private readonly apiBaseUrl = "https://kodpocztowy.intami.pl/api";

    async getPostalCodeData(postalCode: string): Promise<PostalCodeApiResponse[]> {
        try {
            const response = await fetch(`${this.apiBaseUrl}/${postalCode}`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data as PostalCodeApiResponse[];
        } catch (error) {
            console.error(`Error fetching postal code data for ${postalCode}:`, error);
            return [];
        }
    }

    async getCountyFromPostalCode(postalCode: string): Promise<string | null> {
        const data = await this.getPostalCodeData(postalCode);

        if (data.length === 0) {
            return null;
        }

        // Zwróć nazwę powiatu z pierwszego wyniku
        return data[0]?.powiat || null;
    }
}
