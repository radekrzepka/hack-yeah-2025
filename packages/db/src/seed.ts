import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { adminTable, testTable } from "./schema";
import { SEED_ADMIN } from "./seed-data/seed-admin";
import { SEED_TEST } from "./seed-data/seed-test";

const seed = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);

  await db.insert(adminTable).values(SEED_ADMIN).onConflictDoNothing();
  await db.insert(testTable).values(SEED_TEST).onConflictDoNothing();
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
