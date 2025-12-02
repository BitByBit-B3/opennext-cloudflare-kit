# B3 OpenNext Template

A modern, full-stack Next.js template optimized for Cloudflare Workers with a complete development setup.

## Features

- **Next.js 15** - Latest React framework with App Router
- **Cloudflare Workers** - Edge-first deployment with OpenNext
- **tRPC** - End-to-end typesafe APIs
- **Drizzle ORM** - TypeScript ORM with Cloudflare D1 + KV caching
- **Better Auth** - Modern authentication system
- **Zustand** - Lightweight state management with persistence
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **TypeScript** - Full type safety with strict mode
- **ESLint & Prettier** - Code quality and formatting
- **Playwright** - End-to-end testing
- **Bruno** - API testing
- **GitHub Actions** - Complete CI/CD pipeline
- **Bun** - Fast package manager and runtime

## Performance Optimizations

- ⚡ **Drizzle ORM Caching** - KV-based query caching with automatic invalidation
- ⚡ **OpenNext Optimizations** - Worker separation, edge converter, R2 cache
- ⚡ **React Query** - 60s stale time, optimized refetch behavior
- ⚡ **Image Optimization** - Automatic WebP conversion with Sharp compression
- ⚡ **Static Asset Caching** - 1-year cache for immutable assets
- ⚡ **Security Headers** - HSTS, CSP, XSS protection, and more
- ⚡ **Bundle Optimization** - CSS chunking, tree shaking, minification

## Quick Start

### Automated Setup

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Manual Setup

#### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- [Node.js](https://nodejs.org) >= 18.17.0
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) - Cloudflare CLI

#### Installation

```bash
bun install
```

### Environment Setup

Copy the environment example file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="your-secret-key-change-this-in-production"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database Setup

Create and configure your D1 databases:

```bash
npx wrangler d1 create b3-db-dev
npx wrangler d1 create b3-db-prod
```

Update the database IDs in `wrangler.jsonc` and `wrangler.production.jsonc`.

Generate and run migrations:

```bash
bun run db:generate
bun run db:migrate:dev
```

### R2 Storage Setup

Create R2 buckets:

```bash
npx wrangler r2 bucket create b3-storage-dev
npx wrangler r2 bucket create b3-storage-prod
```

### KV Namespace Setup

Create KV namespaces for caching:

```bash
npx wrangler kv namespace create CACHE_KV
npx wrangler kv namespace create CACHE_KV --env production
```

Update the KV IDs in `wrangler.jsonc` and `wrangler.production.jsonc`.

### Development

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── api-tests/              # Bruno API tests
├── drizzle/                # Database migrations
├── src/
│   ├── app/                # Next.js app router pages
│   ├── components/         # React components
│   │   └── ui/             # shadcn/ui components
│   ├── lib/                # Utility functions
│   │   └── utils/          # Helper utilities
│   ├── server/             # Server-side code
│   │   ├── db/             # Database schema and config
│   │   ├── lib/            # Server utilities
│   │   └── routers/        # tRPC routers
│   ├── stores/             # Zustand stores
│   ├── trpc/               # tRPC client setup
│   ├── types/              # TypeScript type definitions
│   └── env.ts              # Environment validation
├── tests/
│   └── e2e/                # Playwright E2E tests
├── .github/
│   └── workflows/          # CI/CD pipelines
└── wrangler.jsonc          # Cloudflare Workers config
```

## Available Scripts

### Development

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run cf:dev` - Start with Wrangler dev

### Code Quality

- `bun run lint` - Run ESLint
- `bun run lint:fix` - Fix ESLint errors
- `bun run format` - Format code with Prettier
- `bun run type-check` - Run TypeScript compiler

### Database

- `bun run db:generate` - Generate migrations
- `bun run db:migrate:dev` - Run dev migrations
- `bun run db:migrate:prod` - Run prod migrations
- `bun run db:push` - Push schema changes
- `bun run db:studio` - Open Drizzle Studio

### Testing

- `bun run test:e2e` - Run Playwright tests
- `bun run test:e2e:ui` - Run Playwright with UI
- `bun run test:e2e:debug` - Debug Playwright tests
- `bun run test:api` - Run Bruno API tests

### Deployment

- `bun run deploy` - Deploy to development
- `bun run deploy:prod` - Deploy to production
- `bun run preview` - Create preview deployment

## Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Zustand** - State management
- **React Query** - Data fetching (via tRPC)

### Backend

- **tRPC** - End-to-end typesafe APIs
- **Drizzle ORM** - TypeScript ORM
- **Better Auth** - Authentication
- **Cloudflare D1** - SQLite at the edge
- **Cloudflare R2** - Object storage with image compression

### Development Tools

- **TypeScript** - Type safety
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit checks

### Testing

- **Playwright** - E2E testing
- **Bruno** - API testing

### Deployment

- **Cloudflare Workers** - Edge computing
- **GitHub Actions** - CI/CD
- **OpenNext** - Next.js adapter for Workers

## File Upload & Image Compression

This template includes a comprehensive R2 file upload system with automatic image compression and WebP conversion:

```typescript
import { uploadFileWithCompression, UploadFolder } from "@/server/lib/r2-storage";

const result = await uploadFileWithCompression(
  fileBuffer,
  UploadFolder.PROFILE_PICTURES,
  "avatar",
  {
    compression: {
      quality: 80,
      maxWidth: 2000,
      maxHeight: 2000,
      format: "webp"
    }
  }
);
```

Features:
- Automatic image compression
- WebP conversion for optimal performance
- File validation
- Multiple upload folders
- Public URL generation

## Deployment

### Preview Deployments

Preview deployments are automatically created for pull requests:

```bash
git checkout -b feature/my-feature
git push origin feature/my-feature
```

### Production Deployment

Push to the `stable` branch to deploy to production:

```bash
git checkout stable
git merge main
git push origin stable
```

## Environment Variables

### Required

- `BETTER_AUTH_SECRET` - Secret key for Better Auth (min 32 chars)
- `BETTER_AUTH_URL` - Base URL for authentication
- `NEXT_PUBLIC_APP_URL` - Public application URL

### Optional

- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `CLOUDFLARE_ACCOUNT_ID` - For Drizzle migrations
- `CLOUDFLARE_DATABASE_ID` - D1 database ID
- `CLOUDFLARE_D1_TOKEN` - D1 API token

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details

## Support

For issues and questions, please [open an issue](https://github.com/yourusername/b3-opennext-template/issues).
