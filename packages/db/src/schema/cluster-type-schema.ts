import { z } from 'zod'

export const clusterTypeSchema = z.enum(['solana:devnet', 'solana:localnet', 'solana:mainnet', 'solana:testnet'])
