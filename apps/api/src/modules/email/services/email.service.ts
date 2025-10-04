import type { SendEmailCommandInput } from "@aws-sdk/client-ses";
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EmailSendException } from "../exceptions/email.exceptions";

@Injectable()
export class EmailService {
  constructor(
    @Inject("SES_CLIENT") private readonly sesClient: SESClient,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail({
    recipient,
    subject,
    body,
  }: {
    recipient: string;
    subject: string;
    body: string;
  }): Promise<void> {
    const emailParams: SendEmailCommandInput = {
      Source: this.configService.get("SOURCE_EMAIL"),
      Destination: { ToAddresses: [recipient] },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: body,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
    };

    try {
      const command = new SendEmailCommand(emailParams);
      await this.sesClient.send(command);
    } catch {
      throw new EmailSendException();
    }
  }
}
