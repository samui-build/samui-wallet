import type { createSolanaClient } from './create-solana-client.ts'

export type SolanaClient = ReturnType<typeof createSolanaClient>
