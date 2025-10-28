import { z } from 'zod'

export const envSchema = z.object({
  activeClusterId: z
    .enum(['clusterDevnet', 'clusterLocalnet', 'clusterMainnet', 'clusterTestnet'])
    .default('clusterDevnet'),
  apiEndpoint: z.url().default('https://api.samui.build'),
  clusterDevnet: z.url().or(z.literal('')).default('https://api.devnet.solana.com'),
  clusterLocalnet: z.url().or(z.literal('')).default('http://localhost:8899'),
  clusterMainnet: z.url().or(z.literal('')).default(''),
  clusterTestnet: z.url().or(z.literal('')).default('https://api.testnet.solana.com'),
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
