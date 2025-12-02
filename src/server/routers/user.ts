import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(users).all();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .get();
      return user;
    }),

  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, ctx.session.userId))
      .get();
    return user;
  }),
});
