import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { LoginCommand } from "../commands/login/login.command";
import { LoginRequestDto } from "../dtos/login/login-request.dto";
import { LoginResponseDto } from "../dtos/login/login-response.dto";

@Injectable()
export class AdminService {
  constructor(private readonly commandBus: CommandBus) {}

  async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const command = new LoginCommand(loginDto.login, loginDto.password);
    return await this.commandBus.execute(command);
  }
}

