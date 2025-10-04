import * as crypto from "crypto";
import { SALT_ROUNDS } from "@hackathon/domain";
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { addHours } from "date-fns";

@Injectable()
export class EncryptionService {
  private generateToken(length: number = 32): string {
    const randomBytes = crypto.randomBytes(length);

    return randomBytes.toString("base64url");
  }

  verifyToken(providedToken: string, storedToken: string): boolean {
    try {
      const providedBuffer = Buffer.from(providedToken, "utf8");
      const storedBuffer = Buffer.from(storedToken, "utf8");

      return crypto.timingSafeEqual(providedBuffer, storedBuffer);
    } catch {
      return false;
    }
  }

  public getDateAfterHours(days: number): Date {
    return addHours(new Date(), days);
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
