import { AdminSelect, adminTable } from "@hackathon/db";
import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DatabaseService } from "../../database/services/database.service";
import { IAdminRepository } from "./admin.repository.interface";

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(private readonly db: DatabaseService) {}

  async findByLogin(login: string): Promise<AdminSelect | null> {
    const [record] = await this.db.client
      .select()
      .from(adminTable)
      .where(eq(adminTable.login, login));
    return record || null;
  }
}

