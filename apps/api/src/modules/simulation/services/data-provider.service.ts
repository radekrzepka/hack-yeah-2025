import { Injectable } from "@nestjs/common";

import yearlyParametersData from "../data/data.json";
import powiatyData from "../data/powiaty.json";
import lifeExpectancyDataRaw from "../data/sdtz_prognoza.json";
import { PostalCodeApiService } from "./postal-code-api.service";

export interface YearlyParametersRaw {
  rok: number;
  wskaznikWzrostuWynagrodzenia: number;
  przecietneWynagrodzenie: number;
  stopaNaSubkonto: number;
  waloryzacjaKonta: number;
  waloryzacjaSubkonta: number;
}

export interface YearlyParameters {
  year: number;
  wageGrowthIndex: number;
  averageNationalWage: number;
  subAccountRate: number;
  mainAccountValorization: number;
  subAccountValorization: number;
}

export interface LifeExpectancyDataRaw {
  wiek: number;
  [year: string]: number;
}

export interface PowiatData {
  lp: number;
  nazwa: string;
  kod: string;
  absencjaKobiet: number;
  absencjaMezczyzn: number;
}

@Injectable()
export class DataProviderService {
  private readonly yearlyParameters: Array<YearlyParameters> =
    this.mapRawDataToParameters(
      yearlyParametersData as Array<YearlyParametersRaw>,
    );

  private mapRawDataToParameters(
    rawData: Array<YearlyParametersRaw>,
  ): Array<YearlyParameters> {
    return rawData.map((item) => ({
      year: item.rok,
      wageGrowthIndex: item.wskaznikWzrostuWynagrodzenia,
      averageNationalWage: item.przecietneWynagrodzenie,
      subAccountRate: item.stopaNaSubkonto,
      mainAccountValorization: item.waloryzacjaKonta,
      subAccountValorization: item.waloryzacjaSubkonta,
    }));
  }

  private readonly lifeExpectancyData: Array<LifeExpectancyDataRaw> =
    lifeExpectancyDataRaw as Array<LifeExpectancyDataRaw>;

  private readonly powiatyData: Array<PowiatData> = powiatyData as Array<PowiatData>;

  constructor(private readonly postalCodeApiService: PostalCodeApiService) { }

  private readonly futureWageGrowthRate = 1.04;
  private readonly futureMainAccountValorization = 1.05;
  private readonly futureSubAccountValorization = 1.055;
  private readonly totalContributionRate = 0.1952;

  getParametersForYear(year: number): YearlyParameters | null {
    const params = this.yearlyParameters.find((p) => p.year === year);
    if (params) {
      return params;
    }
    const lastKnownYear = Math.max(...this.yearlyParameters.map((p) => p.year));
    if (year <= lastKnownYear) {
      return null;
    }
    const yearsAhead = year - lastKnownYear;
    const lastKnownParams = this.yearlyParameters.find(
      (p) => p.year === lastKnownYear,
    );
    if (!lastKnownParams) {
      return null;
    }
    const projectedWage =
      lastKnownParams.averageNationalWage *
      Math.pow(this.futureWageGrowthRate, yearsAhead);
    return {
      year,
      wageGrowthIndex: this.futureWageGrowthRate,
      averageNationalWage: projectedWage,
      subAccountRate: 0.0438,
      mainAccountValorization: this.futureMainAccountValorization,
      subAccountValorization: this.futureSubAccountValorization,
    };
  }

  getLifeExpectancy({
    age,
    year,
    sex: _sex,
  }: {
    age: number;
    year: number;
    sex: "male" | "female";
  }): number {
    const ageData = this.lifeExpectancyData.find((d) => d.wiek === age);

    if (!ageData) {
      const baseAge = 65;
      const baseMonths = 221.7;
      const monthsPerYear = 12;
      const ageDiff = age - baseAge;
      return Math.max(baseMonths - ageDiff * monthsPerYear, 60);
    }

    const yearKey = year.toString();
    const lifeExpectancyMonths = ageData[yearKey];

    if (lifeExpectancyMonths !== undefined) {
      return lifeExpectancyMonths;
    }

    const availableYears = Object.keys(ageData)
      .filter((key) => key !== "wiek")
      .map(Number)
      .sort((a, b) => Math.abs(a - year) - Math.abs(b - year));

    if (availableYears.length > 0) {
      const closestYear = availableYears[0];
      if (closestYear !== undefined) {
        return ageData[closestYear.toString()] as number;
      }
    }

    const baseAge = 65;
    const baseMonths = 221.7;
    const monthsPerYear = 12;
    const ageDiff = age - baseAge;
    return Math.max(baseMonths - ageDiff * monthsPerYear, 60);
  }

  getTotalContributionRate(): number {
    return this.totalContributionRate;
  }

  estimateSalaryForYear({
    currentSalary,
    currentYear,
    targetYear,
  }: {
    currentSalary: number;
    currentYear: number;
    targetYear: number;
  }): number {
    if (targetYear === currentYear) {
      return currentSalary;
    }
    let estimatedSalary = currentSalary;
    if (targetYear < currentYear) {
      for (let year = currentYear - 1; year >= targetYear; year--) {
        const params = this.getParametersForYear(year + 1);
        if (params) {
          estimatedSalary = estimatedSalary / params.wageGrowthIndex;
        } else {
          estimatedSalary = estimatedSalary / this.futureWageGrowthRate;
        }
      }
    } else {
      for (let year = currentYear + 1; year <= targetYear; year++) {
        const params = this.getParametersForYear(year);
        if (params) {
          estimatedSalary = estimatedSalary * params.wageGrowthIndex;
        } else {
          estimatedSalary = estimatedSalary * this.futureWageGrowthRate;
        }
      }
    }
    return estimatedSalary;
  }

  async getAbsenceDataForPostalCode(postalCode: string, sex: "male" | "female"): Promise<number> {
    if (!postalCode) {
      // Domyślne wartości jeśli brak kodu pocztowego
      return sex === "female" ? 35.0 : 30.0;
    }

    try {
      const countyName = await this.postalCodeApiService.getCountyFromPostalCode(postalCode);
      if (!countyName) {
        // Domyślne wartości jeśli nie znaleziono powiatu
        return sex === "female" ? 35.0 : 30.0;
      }

      // Szukaj powiatu w danych - porównaj nazwy (case insensitive)
      const powiat = this.powiatyData.find(p =>
        p.nazwa.toLowerCase().includes(countyName.toLowerCase()) ||
        countyName.toLowerCase().includes(p.nazwa.toLowerCase())
      );

      if (!powiat) {
        // Domyślne wartości jeśli nie znaleziono danych powiatu
        return sex === "female" ? 35.0 : 30.0;
      }

      return sex === "female" ? powiat.absencjaKobiet : powiat.absencjaMezczyzn;
    } catch (error) {
      console.error(`Error getting absence data for postal code ${postalCode}:`, error);
      // Domyślne wartości w przypadku błędu
      return sex === "female" ? 35.0 : 30.0;
    }
  }
}
