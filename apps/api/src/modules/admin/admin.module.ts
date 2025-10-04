import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";

import { EncryptionModule } from "../encryption/encryption.module";
import { LoginHandler } from "./commands/login/login.handler";
import { AdminController } from "./controllers/admin.controller";
import { AdminRepository } from "./repositories/admin.repository";
import { AdminService } from "./services/admin.service";

const AdminCommandHandlers = [LoginHandler];

@Module({
  imports: [
    CqrsModule,
    EncryptionModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [AdminController],
  providers: [...AdminCommandHandlers, AdminService, AdminRepository],
  exports: [AdminService, AdminRepository],
})
export class AdminModule {}

