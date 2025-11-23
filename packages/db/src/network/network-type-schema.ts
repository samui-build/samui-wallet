import { z } from 'zod'

export const networkTypeSchema = z.enum(['solana:devnet', 'solana:localnet', 'solana:mainnet', 'solana:testnet'])
