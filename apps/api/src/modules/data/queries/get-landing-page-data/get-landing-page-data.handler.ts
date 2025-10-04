import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { LoggerService } from "../../../../common/services";
import { GetLandingPageDataResponseDto } from "../../dtos/get-landing-page-data-response.dto";
import { DataRepository } from "../../repositories/data.repository";
import { GetLandingPageDataQuery } from "./get-landing-page-data.query";

@QueryHandler(GetLandingPageDataQuery)
export class GetLandingPageDataHandler
  implements IQueryHandler<GetLandingPageDataQuery>
{
  private readonly logger: LoggerService;

  constructor(private readonly dataRepository: DataRepository) {
    this.logger = new LoggerService(GetLandingPageDataHandler.name);
  }

  async execute(): Promise<GetLandingPageDataResponseDto> {
    this.logger.log("Fetching landing page data", { method: "execute" });

    const [facts, charts] = await Promise.all([
      this.dataRepository.findAllFacts(),
      this.dataRepository.findAllCharts(),
    ]);

    this.logger.log(
      `Found ${facts.length} facts and ${charts.length} charts`,
      { method: "execute" }
    );

    return new GetLandingPageDataResponseDto(facts, charts);
  }
}
