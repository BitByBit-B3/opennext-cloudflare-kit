import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { createCacheConfig } from "./cache";

export function createDb(d1: D1Database, enableCache = true) {
  const config = enableCache ? createCacheConfig() : {};
  return drizzle(d1, { schema, ...config });
}

export type Database = ReturnType<typeof createDb>;
export { schema };
