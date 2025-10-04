import { ErrorMessages } from "@hackathon/shared";

export class EmailSendException extends Error {
  public constructor() {
    super(ErrorMessages.EMAIL.SEND_FAILED);
    this.name = "EmailSendException";
  }
}
