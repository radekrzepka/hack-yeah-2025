import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";

import { LoggerService } from "../../../../common/services";
import { EncryptionService } from "../../../encryption/services/encryption.service";
import { LoginResponseDto } from "../../dtos/login/login-response.dto";
import {
  AdminNotFoundException,
  InvalidCredentialsException,
} from "../../exceptions/admin.exceptions";
import { AdminRepository } from "../../repositories/admin.repository";
import { LoginCommand } from "./login.command";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private readonly logger: LoggerService;

  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
  ) {
    this.logger = new LoggerService(LoginHandler.name);
  }

  async execute(command: LoginCommand): Promise<LoginResponseDto> {
    const { login, password } = command;
    this.logger.logCommandStart("LoginCommand", "execute", { login });
    const admin = await this.adminRepository.findByLogin(login);
    if (!admin) {
      this.logger.logWarning(
        `Admin login failed: admin not found: ${login}`,
        "execute",
      );
      throw new AdminNotFoundException();
    }
    const isPasswordValid = await this.encryptionService.comparePassword(
      password,
      admin.password,
    );
    if (!isPasswordValid) {
      this.logger.logWarning(
        `Admin login failed: invalid password for: ${login}`,
        "execute",
      );
      throw new InvalidCredentialsException();
    }
    const token = this.jwtService.sign({
      sub: admin.id,
      login: admin.login,
    });
    this.logger.logSuccess(
      `Admin logged in successfully: ${admin.login}`,
      "execute",
    );
    return new LoginResponseDto(token);
  }
}

