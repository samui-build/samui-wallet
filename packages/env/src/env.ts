import { z } from 'zod'

export const envSchema = z.object({
  activeClusterId: z
    .enum(['clusterDevnet', 'clusterLocalnet', 'clusterMainnet', 'clusterTestnet'])
    .default('clusterDevnet'),
  apiEndpoint: z.url().default('https://api.samui.build'),
  clusterDevnet: z.url().or(z.literal('')).default('https://api.devnet.solana.com'),
  clusterDevnetSubscriptions: z.url().or(z.literal('')).default(''),
  clusterLocalnet: z.url().or(z.literal('')).default('http://localhost:8899'),
  clusterLocalnetSubscriptions: z.url().or(z.literal('')).default('ws://127.0.0.1:8900'),
  clusterMainnet: z.url().or(z.literal('')).default(''),
  clusterMainnetSubscriptions: z.url().or(z.literal('')).default(''),
  clusterTestnet: z.url().or(z.literal('')).default('https://api.testnet.solana.com'),
  clusterTestnetSubscriptions: z.url().or(z.literal('')).default(''),
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
