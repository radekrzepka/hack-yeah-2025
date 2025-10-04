import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import * as XLSX from "xlsx";

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
  async getAllDataAsXlsx(): Promise<Buffer> {
    const data = await this.getAllData();
    const worksheetData = data.map((item) => ({
      ID: item.id,
      "Data użycia": item.usageDate,
      "Godzina użycia": item.usageTime,
      "Oczekiwana emerytura": item.expectedPension,
      Wiek: item.age,
      Płeć: item.sex,
      "Wynagrodzenie brutto": item.grossSalary,
      "Uwzględniono chorobowe": item.includeSickLeave ? "Tak" : "Nie",
      "Kapitał całkowity": item.totalCapital || "N/A",
      "Kapitał konto główne": item.mainAccountCapital || "N/A",
      "Kapitał podkonto": item.subAccountCapital || "N/A",
      "Rzeczywista emerytura": item.actualPension || "N/A",
      "Skorygowana emerytura": item.adjustedPension || "N/A",
      "Kod pocztowy": item.postalCode || "N/A",
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Wyniki Symulacji");
    return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
  }
}
