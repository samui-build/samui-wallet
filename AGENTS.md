# Agent Guidelines for Samui Wallet

## Commands
- **Build**: `pnpm build`
- **Lint**: `pnpm lint` / `pnpm lint:fix`
- **Type Check**: `pnpm check-types`
- **Test All**: `pnpm test` / `pnpm test:watch`
- **Single Test**: `vitest run <path/to/test.ts>`
- **Format**: `pnpm format` / `pnpm format:check`

## Code Style
- **TypeScript**: Strict mode, consistent type definitions/imports
- **Formatting**: Prettier (single quotes, 120 width, no semicolons, trailing commas)
- **Linting**: ESLint with perfectionist (alphabetical imports/sorting)
- **Naming**: camelCase variables/functions, PascalCase types
- **Error Handling**: Use `tryCatch` from `@workspace/core`
- **Testing**: Vitest globals, jsdom env, ARRANGE/ACT/ASSERT pattern
- **Imports**: Type imports separate, alphabetical perfectionist sorting