/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from "@nestjs/common";

import {
  AccountBreakdownDto,
  AccumulationChartDataDto,
  ContributionVsGrowthDto,
  DecadeSummaryDto,
  GetSimulationResultResponseDto,
  PensionChartsDto,
  PensionSummaryDto,
} from "../dtos/get-simulation-result/get-simulation-result-response.dto";
import { ImprovementScenariosService } from "./improvement-scenarios.service";
import {
  PensionCalculationResult,
  SimulationInput,
  YearlyBreakdownItem,
} from "./pension-calculation.service";

interface BuildResponseInput {
  id: string;
  requestId: string;
  expectedPension: number;
  calculationResult: PensionCalculationResult;
  simulationInput: SimulationInput;
}

@Injectable()
export class ResponseBuilderService {
  constructor(
    private readonly improvementScenariosService: ImprovementScenariosService,
  ) { }

  async buildResponse(input: BuildResponseInput): Promise<GetSimulationResultResponseDto> {
    const { id, requestId, expectedPension, calculationResult, simulationInput } = input;
    const summary = this.buildSummary({
      calculationResult,
      simulationInput,
    });
    const charts = this.buildCharts({
      calculationResult,
    });
    const improvementScenarios =
      await this.improvementScenariosService.calculateImprovementScenarios({
        baseInput: simulationInput,
        basePension: calculationResult.monthlyPensionGross,
        birthYear: calculationResult.birthYear,
        currentYear: calculationResult.currentYear,
      });
    return new GetSimulationResultResponseDto({
      id,
      requestId,
      expectedPension,
      summary,
      charts,
      improvementScenarios,
    });
  }

  private buildSummary(params: {
    calculationResult: PensionCalculationResult;
    simulationInput: SimulationInput;
  }): PensionSummaryDto {
    const { calculationResult, simulationInput } = params;
    const currentSalary = calculationResult.lastYearlySalary / 12;
    const projectedPension = calculationResult.monthlyPensionGross;
    const replacementRate = (projectedPension / currentSalary) * 100;
    const yearsToRetirement =
      simulationInput.plannedRetirementYear - calculationResult.currentYear;
    return {
      projectedPension: this.roundToTwoDecimals(projectedPension),
      currentSalary: this.roundToTwoDecimals(currentSalary),
      replacementRate: this.roundToTwoDecimals(replacementRate),
      yearsToRetirement,
      totalCapital: this.roundToTwoDecimals(calculationResult.totalCapital),
      retirementAge: calculationResult.retirementAge,
    };
  }

  private buildCharts(params: {
    calculationResult: PensionCalculationResult;
  }): PensionChartsDto {
    const { calculationResult } = params;
    const accumulationOverTime = this.buildAccumulationOverTime(
      calculationResult.yearlyBreakdown,
    );
    const accountBreakdown = this.buildAccountBreakdown(calculationResult);
    const contributionVsGrowth =
      this.buildContributionVsGrowth(calculationResult);
    const decadeSummary = this.buildDecadeSummary(
      calculationResult.yearlyBreakdown,
    );
    return {
      accumulationOverTime,
      accountBreakdown,
      contributionVsGrowth,
      decadeSummary,
    };
  }

  private buildAccumulationOverTime(
    yearlyBreakdown: Array<YearlyBreakdownItem>,
  ): Array<AccumulationChartDataDto> {
    const sampleEveryNYears = this.calculateSampleRate(yearlyBreakdown.length);
    return yearlyBreakdown
      .filter((_, index) => index % sampleEveryNYears === 0)
      .map((item) => ({
        year: item.year,
        age: item.age,
        totalBalance: this.roundToTwoDecimals(item.totalBalance),
        mainAccountBalance: this.roundToTwoDecimals(item.mainAccountBalance),
        subAccountBalance: this.roundToTwoDecimals(item.subAccountBalance),
        yearlySalary: this.roundToTwoDecimals(item.estimatedYearlySalary),
      }));
  }

  private buildAccountBreakdown(
    calculationResult: PensionCalculationResult,
  ): AccountBreakdownDto {
    const { mainAccountCapital, subAccountCapital, totalCapital } =
      calculationResult;
    const mainAccountPercentage = (mainAccountCapital / totalCapital) * 100;
    const subAccountPercentage = (subAccountCapital / totalCapital) * 100;
    return {
      mainAccountCapital: this.roundToTwoDecimals(mainAccountCapital),
      mainAccountPercentage: this.roundToTwoDecimals(mainAccountPercentage),
      subAccountCapital: this.roundToTwoDecimals(subAccountCapital),
      subAccountPercentage: this.roundToTwoDecimals(subAccountPercentage),
      totalCapital: this.roundToTwoDecimals(totalCapital),
    };
  }

  private buildContributionVsGrowth(
    calculationResult: PensionCalculationResult,
  ): ContributionVsGrowthDto {
    const { totalContributions, valorizationGrowth, totalCapital } =
      calculationResult;
    const contributionPercentage = (totalContributions / totalCapital) * 100;
    const valorizationPercentage = (valorizationGrowth / totalCapital) * 100;
    return {
      totalContributions: this.roundToTwoDecimals(totalContributions),
      valorizationGrowth: this.roundToTwoDecimals(valorizationGrowth),
      totalCapital: this.roundToTwoDecimals(totalCapital),
      contributionPercentage: this.roundToTwoDecimals(contributionPercentage),
      valorizationPercentage: this.roundToTwoDecimals(valorizationPercentage),
    };
  }

  private buildDecadeSummary(
    yearlyBreakdown: Array<YearlyBreakdownItem>,
  ): Array<DecadeSummaryDto> {
    const decades: Map<string, Array<YearlyBreakdownItem>> = new Map();
    for (const item of yearlyBreakdown) {
      const decadeStart = Math.floor(item.year / 10) * 10;
      const decadeKey = `${decadeStart}-${decadeStart + 9}`;
      if (!decades.has(decadeKey)) {
        decades.set(decadeKey, []);
      }
      decades.get(decadeKey)!.push(item);
    }
    const summaries: Array<DecadeSummaryDto> = [];
    for (const [decadeKey, items] of decades) {
      if (items.length === 0) {
        continue;
      }
      const firstItem = items[0]!;
      const lastItem = items[items.length - 1]!;
      const totalContributions = items.reduce(
        (sum, item) =>
          sum + item.contributionToMainAccount + item.contributionToSubAccount,
        0,
      );
      const averageYearlyContribution = totalContributions / items.length;
      const balanceAtStart =
        firstItem.totalBalance -
        (firstItem.contributionToMainAccount +
          firstItem.contributionToSubAccount);
      const balanceAtEnd = lastItem.totalBalance;
      const growthInDecade = balanceAtEnd - balanceAtStart;
      const ageRange = `${firstItem.age}-${lastItem.age}`;
      summaries.push({
        decade: decadeKey,
        ageRange,
        averageYearlyContribution: this.roundToTwoDecimals(
          averageYearlyContribution,
        ),
        balanceAtEnd: this.roundToTwoDecimals(balanceAtEnd),
        growthInDecade: this.roundToTwoDecimals(growthInDecade),
      });
    }
    return summaries;
  }

  private calculateSampleRate(totalYears: number): number {
    if (totalYears <= 20) return 1;
    if (totalYears <= 30) return 2;
    if (totalYears <= 40) return 3;
    return 5;
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
