import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/env";
import { createDb } from "@/server/db";

export const auth = betterAuth({
  database: drizzleAdapter(createDb((globalThis as any).DB), {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    cookiePrefix: "opennext-template-kit",
    useSecureCookies: true,
  },
  session: {
    cookieCache: { enabled: true, strategy: "jwt" },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
});

export type Session = typeof auth.$Infer.Session;
