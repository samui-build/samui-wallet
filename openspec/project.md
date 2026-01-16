# Project Context

## Purpose

Samui is an open-source Solana wallet and toolbox for builders. It provides a comprehensive suite of applications and packages for managing Solana wallets, accounts, and transactions across multiple platforms including web, desktop, mobile, browser extension, and CLI.

### Goals
- Provide a secure, user-friendly Solana wallet experience
- Support multiple platforms (web, desktop, mobile, extension, CLI)
- Enable developers to build on top of Samui's modular architecture
- Maintain high code quality with comprehensive testing
- Follow a pragmatic development philosophy: "Make it work, make it right, make it fast"

## Tech Stack

### Core Technologies
- **TypeScript** (v5.9.3) - Primary language with strict mode
- **Bun** (>=1.3.3) - Package manager and runtime
- **Node.js** (>=24) - Runtime environment
- **Turbo** (v2.7.3) - Monorepo build system

### Frontend
- **React** (v19.2.0) - UI framework
- **React Router** (v7.9.6) - Routing
- **TailwindCSS** (v4.1.17) - Styling
- **Vite** (v7.2.4) - Build tool
- **React Hook Form** (v7.66.0) + **Zod** (v4.1.13) - Form handling and validation
- **@tanstack/react-query** (v5.90.11) - Data fetching and state management
- **Lucide React** (v0.555.0) - Icons

### Blockchain
- **@solana/kit** (v5.0.0) - Solana SDK
- **@solana-program/system**, **@solana-program/token**, **@solana-program/token-2022** - Solana program interfaces

### Database & Storage
- **Dexie** - IndexedDB wrapper for local data storage

### Development Tools
- **Biome** (v2.3.11) - Linting and formatting
- **Vitest** (v4.0.14) - Testing framework
- **jsdom** (v27.2.0) - DOM testing environment
- **Lefthook** (v2.0.14) - Git hooks
- **Commitlint** - Commit message linting
- **cspell** - Spell checking
- **editorconfig-checker** - EditorConfig validation

### Platform-Specific
- **WXT** (v0.20.11) - Browser extension framework
- **Tauri** - Desktop application framework
- **Astro** - Static site generation for documentation

## Project Conventions

### Code Style

#### Formatting (Biome)
- **Indentation**: 2 spaces
- **Line Width**: 120 characters
- **Line Ending**: LF
- **Quotes**: Single quotes for JavaScript/TypeScript, double quotes for JSX
- **Semicolons**: As needed (ASI)
- **Trailing Commas**: Always
- **Arrow Parentheses**: Always

#### Naming Conventions
- **Variables/Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Files**: kebab-case (e.g., `network-create.ts`, `wallet-schema.ts`)
- **Test Files**: `*.test.ts` for unit tests, `*.integration.test.ts` for integration tests

#### Import Organization
- Type imports separate from value imports
- Alphabetical sorting of imports
- Use `@workspace/*` for internal package references

#### Error Handling
- Use `tryCatch` from `@workspace/core` for promise-based error handling
- Returns `Result<T, E>` type with `{ data, error }` structure
- Prefer explicit error handling over try/catch blocks

### Architecture Patterns

#### Monorepo Structure
- **apps/**: Application projects (web, desktop, mobile, extension, cli, site, api)
- **packages/**: Shared packages (core, db, ui, solana-client, etc.)
- **turbo/**: Turbo generators and configurations
- **examples/**: Example implementations

#### Package Organization
- Each package is self-contained with its own dependencies
- Shared configurations in `packages/config-*` (e.g., `config-vite`, `config-vitest`, `config-typescript`)
- Feature-based folder structure within packages (e.g., `network/`, `wallet/`, `account/`)
- Each feature includes: implementation, schema, input types, and tests

#### Data Validation
- **Zod** schemas for runtime validation
- Separate schema files (e.g., `*-schema.ts`, `*-input.ts`)
- Use `parseStrict` for strict validation

#### State Management
- React Query for server state
- React Context for shared client state
- Local state with React hooks

### Testing Strategy

#### Test Structure
All tests must follow this strict pattern:

```typescript
describe('function-name', () => {
  beforeEach(async () => {
    // Clear database or reset state
  })

  describe('expected behavior', () => {
    it('should do something when condition is met', async () => {
      // ARRANGE
      expect.assertions(N) // REQUIRED: Explicit assertion count
      const input = testInputCreate()

      // ACT
      const result = await functionUnderTest(input)

      // ASSERT
      expect(result).toBeDefined()
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when something fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testInputCreate({ invalid: true })

      // ACT & ASSERT
      await expect(functionUnderTest(input)).rejects.toThrow()
    })
  })
})
```

#### Key Testing Requirements
1. **Explicit Assertions**: Every test MUST start with `expect.assertions(N)`
2. **ARRANGE/ACT/ASSERT Comments**: All sections must have explicit comments
3. **Console Mocking**: Unexpected behavior tests must mock console.log in beforeEach
4. **Result Variable Names**: Results must be called `result`, `result1`, etc.
5. **Type Errors**: Use `// @ts-expect-error: Testing invalid input` for intentional type violations
6. **Combined ACT & ASSERT**: For error testing, ACT & ASSERT can be combined

#### Test Configuration
- **Framework**: Vitest with globals enabled
- **Environment**: jsdom for DOM testing
- **Integration Tests**: Separate files with `*.integration.test.ts` extension
- **Test Commands**:
  - `bun run test` - Run all unit tests
  - `bun run test:watch` - Watch mode
  - `bun run test:integration` - Run integration tests
  - `bun run test <path>` - Run specific test file

### Git Workflow

#### Branching Strategy
- **Main Branch**: `main` (default branch)
- **Feature Branches**: `<github-username>/feature-name`
  - DO NOT use `feat/` or `fix/` prefixes
  - Branch owner is responsible for the PR
- **Keep branches updated**: Use `rebase` instead of `merge` to sync with main

#### Commit Conventions
- **Format**: Conventional Commits (enforced by commitlint)
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Examples**:
  - `feat: Add network creation endpoint`
  - `fix: Resolve wallet deletion error`
  - `test: Add wallet-create validation tests`

#### Git Hooks (Lefthook)
**Pre-commit**:
- syncpack lint (package.json consistency)
- editorconfig checker
- biome lint
- spell check (cspell)

**Commit-msg**:
- commitlint validation
- spell check on commit message

#### Pull Request Guidelines
- Keep PRs small and focused (single-purpose)
- Break large features into incremental changes
- Unrelated fixes belong in separate PRs
- Provide clear description of changes
- Ensure tests pass and build succeeds before opening PR

#### Rebasing Workflow
```bash
git fetch upstream
git checkout <username>/feature-name
git rebase upstream/main
# Resolve conflicts if any
git push --force-with-lease origin <username>/feature-name
```

## Domain Context

### Solana Blockchain
- **Networks**: Mainnet, Testnet, Devnet, Localnet
- **Accounts**: Derived from keypairs, support multiple accounts per wallet
- **Transactions**: SOL transfers and SPL token transfers
- **Endpoints**: HTTP for RPC calls, WebSocket for subscriptions
- **Standards**: Wallet Standard for cross-wallet compatibility

### Wallet Management
- **Wallets**: HD wallets with BIP39 mnemonic phrases
- **Accounts**: Multiple accounts per wallet (derived from mnemonic)
- **Secret Storage**: Encrypted keypairs and mnemonics in IndexedDB
- **Active Account**: Single active account per wallet for transactions

### Data Models
- **Networks**: Solana network configurations with endpoints
- **Wallets**: Wallet metadata (name, color, order)
- **Accounts**: Account metadata (name, address, public key, order)
- **Bookmarks**: Saved accounts and transactions
- **Settings**: User preferences and configuration

## Important Constraints

### Technical Constraints
- **Bun Version**: Must use Bun >=1.3.3 (enforced by preinstall script)
- **Node Version**: Requires Node.js >=24
- **Package Manager**: Only Bun is allowed (`npx only-allow bun`)
- **TypeScript**: Strict mode enabled
- **Browser Support**: Modern browsers with IndexedDB support

### Security Constraints
- Never commit secrets (.env files, credentials)
- Encrypt sensitive data (private keys, mnemonics) in storage
- Use secure random ID generation
- Validate all user inputs with Zod schemas
- Socket security scanning with `@socketsecurity/bun-security-scanner`

### Code Quality Constraints
- All code must pass Biome linting with `--error-on-warnings`
- Type checking must pass (`bun check-types`)
- Tests must pass before merging
- Build must succeed before merging
- No AI-generated code without full understanding and ownership

### Development Philosophy
1. **Make it work**: Build functional implementation with tests
2. **Make it right**: Refactor for maintainability and cleanliness
3. **Make it fast**: Optimize based on measurements
4. Avoid premature optimization and "rabbit holes"
5. Create follow-up issues for non-critical improvements

## External Dependencies

### Blockchain Services
- **Solana RPC Endpoints**: Public RPC nodes for Mainnet, Testnet, Devnet
- **WebSocket Subscriptions**: Real-time blockchain updates
- **Explorers**: Solana Explorer, Solscan for transaction viewing

### Development Services
- **GitHub**: Source control and CI/CD (GitHub Actions)
- **Discord**: Community and developer discussions
- **pkg-pr-new**: Preview deployments for PRs
- **bundlemon**: Bundle size monitoring

### Build & Deploy
- **Vercel/Netlify**: Potential hosting for web apps
- **GitHub Pages**: Documentation hosting
- **CI/CD**: GitHub Actions for automated testing and building

### Monitoring & Analytics
- **Bundle Analyzer**: Vite bundle analyzer for optimization
- **CSpell**: Dictionary-based spell checking
- **Socket Security**: Dependency vulnerability scanning
