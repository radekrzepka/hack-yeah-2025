import type { AdminSelect } from "@hackathon/db";

export interface IAdminRepository {
  findByLogin(login: string): Promise<AdminSelect | null>;
}

