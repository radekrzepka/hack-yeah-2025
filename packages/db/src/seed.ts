import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { adminTable, chartsTable, factsTable, testTable } from "./schema";
import { SEED_ADMIN } from "./seed-data/seed-admin";
import { SEED_CHARTS } from "./seed-data/seed-chart-table";
import { SEED_FACTS } from "./seed-data/seed-facts-table";
import { SEED_TEST } from "./seed-data/seed-test";

const seed = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);

  await db.insert(adminTable).values(SEED_ADMIN).onConflictDoNothing();
  await db.insert(testTable).values(SEED_TEST).onConflictDoNothing();
  await db.insert(factsTable).values(SEED_FACTS).onConflictDoNothing();
  await db.insert(chartsTable).values(SEED_CHARTS).onConflictDoNothing();
};

seed()
  .then(() => {
    console.log("Seeding complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
