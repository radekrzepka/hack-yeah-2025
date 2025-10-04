import { SESClient } from "@aws-sdk/client-ses";
import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EmailService } from "./services/email.service";

@Module({})
export class EmailModule {
  static forRootAsync(): DynamicModule {
    return {
      module: EmailModule,
      global: true,
      providers: [
        {
          provide: "SES_CLIENT",
          useFactory: (configService: ConfigService) =>
            new SESClient({
              region: configService.getOrThrow("AWS_DEFAULT_REGION"),
              credentials: {
                accessKeyId: configService.getOrThrow("AWS_ACCESS_KEY_ID"),
                secretAccessKey: configService.getOrThrow(
                  "AWS_SECRET_ACCESS_KEY",
                ),
              },
            }),
          inject: [ConfigService],
        },
        EmailService,
      ],
      exports: [EmailService],
    };
  }
}
