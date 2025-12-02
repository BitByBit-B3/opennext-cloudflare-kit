import { drizzle } from "drizzle-orm/d1";
import { reset } from "drizzle-seed";
import * as schema from "./schema";

async function main() {
  console.log("Resetting database...");

  const db = drizzle(process.env.DATABASE_URL as any, { schema });

  await reset(db, schema);

  console.log("Database reset successfully!");
}

main()
  .catch((error) => {
    console.error("Error resetting database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
