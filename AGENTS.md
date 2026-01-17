# Agent Guidelines for Samui Wallet

## Commands

- **Build**: `bun run build`
- **Lint**: `bun lint` / `bun lint:fix`
- **Type Check**: `bun check-types`
- **Test All**: `bun run test` / `bun run test:watch`
- **Single Test**: `bun run test <path/to/test.ts>`
- **Format**: `bun format` / `bun format:check`

## Code Style

- **TypeScript**: Strict mode, consistent type definitions/imports
- **Formatting**: Biome (single quotes, 120 width, no semicolons, trailing commas)
- **Linting**: Biome
- **Naming**: camelCase variables/functions, PascalCase types
- **Error Handling**: Use `Result` from `@workspace/core` (re-exports `better-result`)
- **Testing**: Vitest globals, jsdom env, ARRANGE/ACT/ASSERT pattern
- **Imports**: Type imports separate, alphabetical sorting

## Testing Guidelines

### Test Structure

All tests must follow this strict structure:

```typescript
describe('function-name', () => {
  beforeEach(async () => {
    // Clear database or reset state
  })

  describe('expected behavior', () => {
    it('should do something when condition is met', async () => {
      // Test implementation
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
      // Test implementation
    })
  })
})
```

### Test Sections

1. **Expected Behavior**: Tests for normal operation and valid inputs
2. **Unexpected Behavior**: Tests for error handling, invalid inputs, and edge cases
  2.1 Must mock `console.log` in beforeEach
  2.2 Must restore mocks in afterEach

### Test Pattern: ARRANGE/ACT/ASSERT

Every test must follow the ARRANGE/ACT/ASSERT pattern with explicit comments:

```typescript
it('should create a network', async () => {
  // ARRANGE
  expect.assertions(2) // REQUIRED: Explicit assertion count
  const input = testNetworkInputCreate()

  // ACT
  const result = await networkCreate(db, input) // REQUIRED: Results must be called result, result1, etc...

  // ASSERT
  expect(result).toBeDefined()
  expect(result?.name).toBe(input.name)
})
```

### Combined ACT & ASSERT

For error testing, ACT & ASSERT can be combined:

```typescript
it('should throw an error with an invalid key', async () => {
  // ARRANGE
  expect.assertions(1) // REQUIRED: Explicit assertion count
  const input = testNetworkInputCreate({
    // @ts-expect-error: Testing invalid input
    type: 'invalid-type',
  })

  // ACT & ASSERT
  await expect(networkCreate(db, input)).rejects.toThrow()
})
```

### Key Requirements

1. **Explicit Assertions**: Every test MUST start with `expect.assertions(N)` where N is the exact number of assertions
2. **Comments**: All ARRANGE/ACT/ASSERT sections must have explicit comments
3. **Console Mocking**: Unexpected behavior tests must mock console.log to avoid noise
4. **Type Errors**: Use `// @ts-expect-error: Testing invalid input` for intentional type violations
5. **Clear Descriptions**: Test descriptions should clearly state what is being tested and under what conditions
