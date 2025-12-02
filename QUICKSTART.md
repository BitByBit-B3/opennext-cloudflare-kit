# Quick Start Guide

Get your B3 OpenNext Template up and running in minutes.

## Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- [Node.js](https://nodejs.org) >= 18.17.0
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare Account (free tier works)

## 1. Install Dependencies

```bash
bun install
```

## 2. Environment Setup

```bash
cp .env.example .env.local
```

Generate a secure secret:

```bash
openssl rand -base64 32
```

Update `.env.local`:

```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="paste-your-generated-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 3. Cloudflare Setup

### Login to Cloudflare

```bash
wrangler login
```

### Create D1 Databases

```bash
# Development database
wrangler d1 create b3-db-dev

# Production database
wrangler d1 create b3-db-prod
```

Copy the `database_id` from each output and update:
- `wrangler.jsonc` (dev)
- `wrangler.production.jsonc` (prod)

### Create R2 Buckets

```bash
# Development bucket
wrangler r2 bucket create b3-storage-dev

# Production bucket
wrangler r2 bucket create b3-storage-prod
```

### Create KV Namespaces

```bash
# Development KV
wrangler kv namespace create CACHE_KV

# Production KV
wrangler kv namespace create CACHE_KV --env production
```

Update the KV IDs in both wrangler configs.

## 4. Database Setup

```bash
# Generate migrations
bun run db:generate

# Apply migrations to dev database
bun run db:migrate:dev

# (Optional) Seed database with sample data
bun run db:seed
```

## 5. Run Development Server

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## What You Should See

- ✅ Homepage with Zustand counter
- ✅ tRPC integration card
- ✅ Responsive UI with Tailwind
- ✅ Working navigation links

## Testing

### E2E Tests

```bash
# Install Playwright browsers (first time only)
bunx playwright install

# Run tests
bun run test:e2e
```

### API Tests

```bash
bun run test:api
```

## Deployment

### Preview Deployment

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Push and create a PR
git push origin feature/my-feature
```

GitHub Actions will automatically create a preview deployment.

### Production Deployment

```bash
# Merge to stable branch
git checkout stable
git merge main
git push origin stable
```

## Troubleshooting

### Dependencies Won't Install

```bash
rm -rf node_modules bun.lockb
bun install
```

### Database Issues

```bash
# Reset and reseed
bun run db:reset
bun run db:migrate:dev
bun run db:seed
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 bun run dev
```

### Build Fails

```bash
# Clean build artifacts
rm -rf .next .open-next

# Try again
bun run build
```

## Next Steps

1. ✅ Customize your database schema in `src/server/db/schema.ts`
2. ✅ Add your first tRPC route in `src/server/routers/`
3. ✅ Create new UI components in `src/components/`
4. ✅ Set up GitHub OAuth (optional)
5. ✅ Configure custom domain

## Learn More

- [Full Setup Guide](docs/SETUP.md)
- [Performance Optimizations](docs/OPTIMIZATIONS.md)
- [Contributing Guide](CONTRIBUTING.md)
- [API Documentation](docs/API.md)

## Support

Need help? Check out:
- [GitHub Issues](https://github.com/yourusername/b3-opennext-template/issues)
- [Discussions](https://github.com/yourusername/b3-opennext-template/discussions)
- [Documentation](README.md)

---

**Happy Coding!** 🚀
