import { SALT_ROUNDS } from "@hackathon/domain";
import * as bcrypt from "bcrypt";

import type { AdminInsert } from "../schema";

const hashedPassword = bcrypt.hashSync("123", SALT_ROUNDS);

export const SEED_ADMIN: Array<AdminInsert> = [
  {
    id: "a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d",
    login: "admin",
    password: hashedPassword,
  },
];
