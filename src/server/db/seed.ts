import { drizzle } from "drizzle-orm/d1";
import { seed } from "drizzle-seed";
import * as schema from "./schema";

async function main() {
  console.log("Seeding database...");

  const db = drizzle(process.env.DATABASE_URL as any, { schema });

  await seed(db, schema).refine((f) => ({
    users: {
      columns: {
        id: f.uuid(),
        email: f.email(),
        name: f.fullName(),
        emailVerified: f.boolean({ probability: 0.7 }),
        image: f.valuesFromArray({
          values: [
            "https://i.pravatar.cc/150?img=1",
            "https://i.pravatar.cc/150?img=2",
            "https://i.pravatar.cc/150?img=3",
            "https://i.pravatar.cc/150?img=4",
            "https://i.pravatar.cc/150?img=5",
          ],
        }),
      },
      count: 10,
    },
  }));

  console.log("Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
