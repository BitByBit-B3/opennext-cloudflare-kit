# Setup Guide

This guide will walk you through setting up the B3 OpenNext Template from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Bun** (>= 1.0.0): [Install Bun](https://bun.sh)
- **Node.js** (>= 18.17.0): [Install Node.js](https://nodejs.org)
- **Cloudflare Account**: [Sign up](https://dash.cloudflare.com/sign-up)
- **Git**: [Install Git](https://git-scm.com)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/b3-opennext-template.git
cd b3-opennext-template
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Configuration

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Generate a secure secret for Better Auth:

```bash
openssl rand -base64 32
```

Update `.env.local`:

```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="your-generated-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Cloudflare Configuration

### 1. Install Wrangler CLI

```bash
bun add -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create D1 Databases

Create development database:

```bash
wrangler d1 create b3-db-dev
```

Copy the output `database_id` and update `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "b3-db-dev",
      "database_id": "paste-your-dev-database-id-here"
    }
  ]
}
```

Create production database:

```bash
wrangler d1 create b3-db-prod
```

Update `wrangler.production.jsonc` with the production database ID.

### 4. Create R2 Buckets

Create development bucket:

```bash
wrangler r2 bucket create b3-storage-dev
```

Create production bucket:

```bash
wrangler r2 bucket create b3-storage-prod
```

The bucket names in `wrangler.jsonc` and `wrangler.production.jsonc` should match these names.

### 5. Set Up Custom Domain (Optional)

For R2 public access, set up a custom domain:

1. Go to Cloudflare Dashboard
2. Navigate to R2 > Your bucket > Settings
3. Configure custom domain
4. Update `R2_PUBLIC_URL` in wrangler configs

## Database Setup

### 1. Generate Migrations

```bash
bun run db:generate
```

This creates migration files in the `drizzle/` directory.

### 2. Apply Migrations

For development:

```bash
bun run db:migrate:dev
```

For production:

```bash
bun run db:migrate:prod
```

### 3. Verify Database

Open Drizzle Studio to inspect your database:

```bash
bun run db:studio
```

## GitHub Setup (for CI/CD)

### 1. Create Repository

Create a new repository on GitHub and push your code:

```bash
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### 2. Add GitHub Secrets

Go to your repository settings and add these secrets:

- `CLOUDFLARE_API_TOKEN`: Create at [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
  - Permissions needed: Workers Scripts:Edit, D1:Edit, R2:Edit
- `ENV_SECRET`: Your complete `.env.local` file content

### 3. Create Stable Branch

```bash
git checkout -b stable
git push -u origin stable
```

## Development

Start the development server:

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing Setup

### 1. Install Playwright Browsers

```bash
bunx playwright install
```

### 2. Run Tests

E2E tests:

```bash
bun run test:e2e
```

API tests:

```bash
bun run test:api
```

## Optional: GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in details:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000` (dev) or your production URL
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### 2. Add Credentials

Add to `.env.local`:

```env
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
```

## Deployment

### Preview Deployment

Create a feature branch and push:

```bash
git checkout -b feature/my-feature
git push origin feature/my-feature
```

Open a PR to trigger preview deployment.

### Production Deployment

Merge to stable branch:

```bash
git checkout stable
git merge main
git push origin stable
```

## Troubleshooting

### Issue: Database not found

Make sure you've created the D1 database and updated the wrangler configs with the correct database IDs.

### Issue: R2 bucket access denied

Ensure your API token has the correct permissions for R2.

### Issue: Build fails

1. Clear the build cache: `rm -rf .next .open-next`
2. Reinstall dependencies: `rm -rf node_modules && bun install`
3. Try building again: `bun run build`

### Issue: TypeScript errors

Run type checking to see all errors:

```bash
bun run type-check
```

## Next Steps

- Read the [README](../README.md) for available commands
- Explore the codebase structure
- Add your first route
- Set up your custom domain
- Configure additional OAuth providers

## Support

For additional help:

- Check existing [issues](https://github.com/yourusername/b3-opennext-template/issues)
- Create a [new issue](https://github.com/yourusername/b3-opennext-template/issues/new)
- Read the [official documentation](https://docs.your-domain.com)
