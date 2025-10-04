import { Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";

import { GetLandingPageDataResponseDto } from "../dtos/get-landing-page-data-response.dto";
import { GetLandingPageDataQuery } from "../queries/get-landing-page-data/get-landing-page-data.query";

@Injectable()
export class DataService {
  constructor(private readonly queryBus: QueryBus) {}

  async getLandingPageData(): Promise<GetLandingPageDataResponseDto> {
    const query = new GetLandingPageDataQuery();
    return this.queryBus.execute(query);
  }
}
