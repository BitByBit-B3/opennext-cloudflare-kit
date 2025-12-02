# Contributing to B3 OpenNext Template

Thank you for your interest in contributing to the B3 OpenNext Template! This document provides guidelines for contributing to the project.

## Code of Conduct

Be respectful and inclusive. We're all here to build something great together.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/b3-opennext-template.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit your changes
7. Push to your fork
8. Create a Pull Request

## Development Setup

See [docs/SETUP.md](docs/SETUP.md) for detailed setup instructions.

Quick start:

```bash
bun install
cp .env.example .env.local
bun run dev
```

## Code Style

We use ESLint and Prettier to maintain code quality and consistency.

### Before Committing

The project uses Husky and lint-staged to automatically format and lint your code before committing.

To manually check your code:

```bash
bun run lint
bun run type-check
bun run format
```

## Testing

### Unit/Integration Tests

Currently, the project uses E2E tests. If you're adding unit tests, please follow these guidelines:

- Place tests next to the files they test
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)

### E2E Tests

Add E2E tests for new features:

```bash
bun run test:e2e
```

Tests are located in `tests/e2e/`.

### API Tests

Add API tests using Bruno for new endpoints.

Tests are located in `api-tests/`.

## Pull Request Process

1. **Update Documentation**: If you're adding a feature, update the README.md and relevant docs
2. **Add Tests**: Include tests for new functionality
3. **Follow Code Style**: Ensure your code passes linting and type-checking
4. **Write Clear Commit Messages**: Use conventional commits format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `refactor:` for refactoring
   - `test:` for tests
   - `chore:` for maintenance

Example:
```
feat: add user profile page

- Add profile page component
- Add profile API endpoint
- Add profile tests
```

5. **Keep PRs Focused**: One feature or fix per PR
6. **Reference Issues**: Link to relevant issues in your PR description

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/              # Utility functions
├── server/           # Server-side code
│   ├── db/           # Database schema
│   ├── lib/          # Server utilities
│   └── routers/      # tRPC routers
├── stores/           # Zustand stores
├── trpc/             # tRPC client
└── types/            # TypeScript types
```

## Adding New Features

### Adding a New Page

1. Create a new file in `src/app/`
2. Export a default component
3. Add necessary metadata
4. Add to navigation if needed

### Adding a New API Route

1. Create a new router in `src/server/routers/`
2. Add procedures using tRPC
3. Export the router
4. Import and merge in `src/server/routers/_app.ts`
5. Add API tests in `api-tests/`

### Adding a New Database Table

1. Add schema in `src/server/db/schema.ts`
2. Generate migration: `bun run db:generate`
3. Apply migration: `bun run db:migrate:dev`
4. Update types if needed

### Adding a New Component

1. Create component in `src/components/`
2. Use TypeScript for props
3. Follow existing component patterns
4. Add to shadcn/ui components if reusable

## Common Tasks

### Adding Dependencies

```bash
bun add package-name
```

For dev dependencies:

```bash
bun add -d package-name
```

### Running Linter

```bash
bun run lint
bun run lint:fix
```

### Type Checking

```bash
bun run type-check
```

### Database Migrations

```bash
bun run db:generate    # Generate migration
bun run db:migrate:dev # Apply to dev database
```

## Debugging

### Enable Debug Logging

Set `NODE_ENV=development` in your `.env.local`:

```env
NODE_ENV=development
```

### Debugging Tests

```bash
bun run test:e2e:debug
```

### Debugging API

Use Drizzle Studio to inspect the database:

```bash
bun run db:studio
```

## Need Help?

- Check existing issues
- Ask in discussions
- Create a new issue with the `question` label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
