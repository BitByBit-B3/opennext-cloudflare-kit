"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useExampleStore } from "@/stores/example-store";
import { api } from "@/trpc/client";

export default function HomePage() {
  const { count, increment, decrement, reset } = useExampleStore();
  const { data: users, isLoading } = api.user.getAll.useQuery();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 p-4">
      <div className="container flex flex-col items-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          B3 <span className="text-blue-500">OpenNext</span> Template
        </h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Zustand Counter</CardTitle>
              <CardDescription>
                State management with Zustand and localStorage persistence
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="text-center text-4xl font-bold">{count}</div>
              <div className="flex gap-2">
                <Button onClick={decrement} variant="outline" className="flex-1">
                  Decrement
                </Button>
                <Button onClick={increment} className="flex-1">
                  Increment
                </Button>
              </div>
              <Button onClick={reset} variant="secondary">
                Reset
              </Button>
            </CardContent>
          </Card>

          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>tRPC Integration</CardTitle>
              <CardDescription>
                Type-safe API routes with tRPC and React Query
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Loading users...</p>
              ) : users && users.length > 0 ? (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="rounded-lg border p-3">
                      <p className="font-medium">{user.name || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No users found</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-4 text-white">
            <a
              className="flex items-center gap-2 hover:underline"
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js
            </a>
            <a
              className="flex items-center gap-2 hover:underline"
              href="https://trpc.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              tRPC
            </a>
            <a
              className="flex items-center gap-2 hover:underline"
              href="https://orm.drizzle.team"
              target="_blank"
              rel="noopener noreferrer"
            >
              Drizzle
            </a>
            <a
              className="flex items-center gap-2 hover:underline"
              href="https://better-auth.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Better Auth
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
