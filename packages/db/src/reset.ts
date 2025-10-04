import { drizzle } from "drizzle-orm/node-postgres";
import { reset } from "drizzle-seed";
import { Pool } from "pg";

import * as schema from "./schema";

const resetDb = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);

  await reset(db, schema);
};

resetDb().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
