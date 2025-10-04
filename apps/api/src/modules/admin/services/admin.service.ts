import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { LoginCommand } from "../commands/login/login.command";
import { GetAllSimulationResultsResponseDto } from "../dtos/get-all-simulation-results/get-all-simulation-results-response.dto";
import { LoginRequestDto } from "../dtos/login/login-request.dto";
import { LoginResponseDto } from "../dtos/login/login-response.dto";
import { GetAllSimulationResultsQuery } from "../queries/get-all-simulation-results/get-all-simulation-results.query";

@Injectable()
export class AdminService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const command = new LoginCommand(loginDto.login, loginDto.password);
    return await this.commandBus.execute(command);
  }

  async getAllData(): Promise<Array<GetAllSimulationResultsResponseDto>> {
    const query = new GetAllSimulationResultsQuery();
    return await this.queryBus.execute(query);
  }
}
