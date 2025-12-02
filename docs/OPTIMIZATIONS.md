# Performance Optimizations

This document outlines all the performance optimizations implemented in the B3 OpenNext Template.

## Table of Contents

1. [Drizzle ORM Caching](#drizzle-orm-caching)
2. [OpenNext Cloudflare Optimizations](#opennext-cloudflare-optimizations)
3. [Next.js Configuration](#nextjs-configuration)
4. [React Query Optimizations](#react-query-optimizations)
5. [Image Optimization](#image-optimization)
6. [Static Asset Caching](#static-asset-caching)

## Drizzle ORM Caching

### Implementation

We've implemented a custom Cloudflare KV-based cache for Drizzle ORM queries.

**Location:** `src/server/db/cache.ts`

### Features

- **Explicit Caching**: Queries are cached only when explicitly requested
- **Automatic Invalidation**: Cache is invalidated on mutations
- **TTL Configuration**: Default 1-hour TTL, configurable per query
- **KV-based Storage**: Uses Cloudflare KV for edge caching

### Usage

```typescript
const db = createDb(env.DB, true);

const users = await db.select().from(usersTable).$withCache({
  ttl: 3600,
  tags: ["users"],
});
```

### Manual Invalidation

```typescript
await db.$cache.invalidate({ tables: ["users"] });
await db.$cache.invalidate({ tags: ["custom_key"] });
```

## OpenNext Cloudflare Optimizations

### Configuration

**Location:** `open-next.config.ts`

### Optimizations

1. **Worker Separation**: Middleware runs in separate Worker
2. **Edge Converter**: Uses edge runtime for optimal performance
3. **S3Lite Cache**: R2-based incremental cache
4. **DynamoDB-Lite**: Tag cache for on-demand revalidation
5. **Regional Caching**: Enabled with long-lived mode

### Cache Strategy

- **SSG Pages**: Uses Workers Static Assets (fastest)
- **ISR Pages**: R2-based storage with automatic purge
- **Tag Cache**: Durable Objects for high-traffic applications

## Next.js Configuration

### Performance Features

**Location:** `next.config.ts`

1. **Image Optimization**
   - WebP and AVIF format support
   - Optimized device sizes
   - 1-year cache TTL
   - SVG protection disabled

2. **CSS Chunking**
   - Loose chunking strategy
   - Reduced CSS bundle sizes

3. **Package Imports Optimization**
   - Optimized imports for lucide-react
   - Optimized imports for Radix UI

4. **Compression**
   - Gzip compression enabled
   - Automatic for all responses

5. **Production Optimizations**
   - Console removal (except errors/warnings)
   - No powered-by header
   - ETag generation
   - HTTP agent keep-alive

### Security Headers

All responses include:
- HSTS
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy
- DNS Prefetch Control

## React Query Optimizations

### Configuration

**Location:** `src/trpc/client.ts`

### Settings

```typescript
{
  staleTime: 60 * 1000,        // 1 minute
  gcTime: 5 * 60 * 1000,       // 5 minutes
  refetchOnWindowFocus: false,  // Prevent unnecessary refetches
  retry: 1                      // Single retry on failure
}
```

### Benefits

- **Reduced API Calls**: Data considered fresh for 1 minute
- **Better UX**: No refetch on window focus
- **Edge Optimization**: Minimal retries for faster failures
- **SSR-Safe**: Separate client instances for SSR

## Image Optimization

### Automatic WebP Conversion

**Location:** `src/lib/utils/image-compression.ts`

### Features

1. **Compression**
   - Quality: 80% (configurable)
   - Format: WebP (default)
   - Max dimensions: 2000x2000

2. **Sharp Integration**
   - Modern image processing
   - Automatic resize
   - Progressive encoding

3. **R2 Upload**
   - Compressed images only
   - Proper content-type headers
   - Immutable cache headers

### Usage

```typescript
const result = await uploadFileWithCompression(
  fileBuffer,
  UploadFolder.PROFILE_PICTURES,
  "avatar",
  {
    compression: {
      quality: 80,
      maxWidth: 2000,
      maxHeight: 2000,
      format: "webp",
    },
  }
);
```

## Static Asset Caching

### Configuration

**Location:** `public/_headers`

### Cache Rules

| Asset Type | Cache Duration | Strategy |
|------------|---------------|----------|
| Static files | 1 year | Immutable |
| Next.js assets | 1 year | Immutable |
| Images | 1 year | Immutable |
| Fonts | 1 year | Immutable |
| Favicon | 1 day | Public |

### Headers Applied

All assets receive security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy

## Database Optimizations

### Connection Pooling

Cloudflare D1 automatically handles connection pooling at the edge.

### Query Optimization

1. **Indexes**: Define on frequently queried columns
2. **Batching**: Use batch operations where possible
3. **Caching**: Enable for read-heavy operations

### Example

```typescript
const users = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.id, userId))
  .$withCache({ ttl: 3600 });
```

## Monitoring

### Performance Metrics

Track these metrics:
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

### Tools

- Cloudflare Analytics
- Wrangler tail (for logs)
- Chrome DevTools
- Lighthouse

## Best Practices

1. **Always cache read-heavy queries**
2. **Invalidate cache on mutations**
3. **Use appropriate TTLs**
4. **Enable compression**
5. **Optimize images before upload**
6. **Use WebP format**
7. **Implement proper headers**
8. **Monitor performance metrics**
9. **Test on edge locations**
10. **Profile production builds**

## Troubleshooting

### High TTFB

- Check cache configuration
- Verify KV namespace bindings
- Enable regional caching

### Cache Misses

- Increase staleTime
- Check cache invalidation logic
- Verify KV quotas

### Image Issues

- Verify Sharp installation
- Check R2 bucket permissions
- Validate compression settings

## Further Reading

- [Drizzle ORM Caching](https://orm.drizzle.team/docs/cache)
- [OpenNext Performance](https://opennext.js.org/cloudflare/perf)
- [Next.js Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Query Performance](https://tanstack.com/query/latest/docs/framework/react/guides/performance)
