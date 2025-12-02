import type { DrizzleConfig } from "drizzle-orm";

export function createCacheConfig(): Pick<DrizzleConfig, "cache"> {
  return {
    cache: {
      async get(key: string) {
        try {
          const { getCloudflareContext } = await import(
            "@opennextjs/cloudflare"
          );
          const { env } = await getCloudflareContext({ async: true });

          if (!env.CACHE_KV) {
            return undefined;
          }

          const cached = await env.CACHE_KV.get(key);
          return cached ? JSON.parse(cached) : undefined;
        } catch {
          return undefined;
        }
      },
      async set(key: string, value: unknown, options?: { ex?: number }) {
        try {
          const { getCloudflareContext } = await import(
            "@opennextjs/cloudflare"
          );
          const { env } = await getCloudflareContext({ async: true });

          if (!env.CACHE_KV) {
            return;
          }

          const ttl = options?.ex || 3600;
          await env.CACHE_KV.put(key, JSON.stringify(value), {
            expirationTtl: ttl,
          });
        } catch {
          return;
        }
      },
      async invalidate(options: { tables?: string[]; tags?: string[] }) {
        try {
          const { getCloudflareContext } = await import(
            "@opennextjs/cloudflare"
          );
          const { env } = await getCloudflareContext({ async: true });

          if (!env.CACHE_KV) {
            return;
          }

          if (options.tables) {
            for (const table of options.tables) {
              const keys = await env.CACHE_KV.list({ prefix: `drizzle:${table}:` });
              for (const key of keys.keys) {
                await env.CACHE_KV.delete(key.name);
              }
            }
          }

          if (options.tags) {
            for (const tag of options.tags) {
              const keys = await env.CACHE_KV.list({ prefix: `tag:${tag}:` });
              for (const key of keys.keys) {
                await env.CACHE_KV.delete(key.name);
              }
            }
          }
        } catch {
          return;
        }
      },
    },
  };
}
