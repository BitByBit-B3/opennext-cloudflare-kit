# Installation Guide

## Issue: `opennextjs-cloudflare: command not found`

This error occurs because the dependencies haven't been installed yet. Follow these steps:

## Step 1: Install Dependencies

```bash
bun install
```

This may take 2-5 minutes as it installs all dependencies including:
- Next.js and React
- Cloudflare packages
- Database and ORM packages
- Image processing libraries (Sharp)
- Development tools

## Step 2: Verify Installation

Check that the package is installed:

```bash
ls node_modules/@opennextjs/cloudflare
```

You should see the package directory.

## Step 3: Build the Project

Now you can build:

```bash
bun run build
```

This runs: `bunx opennextjs-cloudflare` which:
1. Builds your Next.js app
2. Transforms it for Cloudflare Workers
3. Creates the `.open-next` directory

## Alternative: Use npx

If `bunx` doesn't work, try:

```bash
npx opennextjs-cloudflare
```

## Troubleshooting

### Installation Fails

```bash
# Clear cache and try again
rm -rf node_modules bun.lockb
bun install
```

### Build Fails

```bash
# Clean build artifacts
rm -rf .next .open-next

# Try building again
bun run build
```

### Sharp Installation Issues (macOS)

Sharp (image processing) can sometimes have issues on macOS:

```bash
# If Sharp fails to install, try:
bun add sharp --force

# Or use npm for Sharp specifically:
npm install sharp
```

## Expected Output

When build succeeds, you should see:

```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size
┌ ○ /                                    X kB
└ ○ /api/trpc/[trpc]                     X kB

○  (Static)  prerendered as static content

✓ OpenNext build complete!
```

## Next Steps

After successful build:

1. **Test locally with Wrangler:**
   ```bash
   bun run cf:dev
   ```

2. **Deploy to Cloudflare:**
   ```bash
   bun run deploy
   ```

3. **View your site:**
   The deployment URL will be shown in the output

## Complete Setup Checklist

- [ ] Run `bun install`
- [ ] Create `.env.local` from `.env.example`
- [ ] Update environment variables
- [ ] Create Cloudflare D1 database
- [ ] Create Cloudflare R2 bucket
- [ ] Create Cloudflare KV namespace
- [ ] Update wrangler.jsonc with IDs
- [ ] Run `bun run db:generate`
- [ ] Run `bun run db:migrate:dev`
- [ ] Run `bun run db:seed` (optional)
- [ ] Run `bun run build`
- [ ] Run `bun run dev` for local development

## Need Help?

- Check [QUICKSTART.md](QUICKSTART.md) for quick setup
- Read [docs/SETUP.md](docs/SETUP.md) for detailed instructions
- See [README.md](README.md) for full documentation

## Common Issues

### Error: "Cannot find module '@opennextjs/cloudflare'"

**Solution:** Dependencies not installed. Run `bun install`.

### Error: "Database not found"

**Solution:** Create D1 database and update wrangler.jsonc.

### Error: "R2 bucket not found"

**Solution:** Create R2 bucket and update wrangler.jsonc.

### Error: "Invalid environment variables"

**Solution:** Check .env.local and ensure all required variables are set.

---

**Pro Tip:** Use the automated setup script:

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This handles most of the setup automatically!
