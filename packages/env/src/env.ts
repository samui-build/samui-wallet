import { z } from 'zod'

export const envSchema = z.object({
  activeNetworkId: z
    .enum(['networkDevnet', 'networkLocalnet', 'networkMainnet', 'networkTestnet'])
    .default('networkDevnet'),
  apiEndpoint: z.url().default('https://api.samui.build'),
  networkDevnet: z.url().or(z.literal('')).default('https://api.devnet.solana.com'),
  networkDevnetSubscriptions: z.url().or(z.literal('')).default(''),
  networkLocalnet: z.url().or(z.literal('')).default('http://localhost:8899'),
  networkLocalnetSubscriptions: z.url().or(z.literal('')).default('ws://127.0.0.1:8900'),
  networkMainnet: z.url().or(z.literal('')).default(''),
  networkMainnetSubscriptions: z.url().or(z.literal('')).default(''),
  networkTestnet: z.url().or(z.literal('')).default('https://api.testnet.solana.com'),
  networkTestnetSubscriptions: z.url().or(z.literal('')).default(''),
})

export type Env = z.infer<typeof envSchema>

let memoizedEnv: Env | undefined

export function env(key: keyof Env): string {
  if (!memoizedEnv) {
    memoizedEnv = envSchema.parse({})
  }
  return memoizedEnv[key]
}

export function setEnv(env: Partial<Env> = {}) {
  memoizedEnv = envSchema.parse(env)
}
