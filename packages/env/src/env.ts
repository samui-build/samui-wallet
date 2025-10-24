import { z } from 'zod'

export const envSchema = z.object({
  apiEndpoint: z.url().default('https://api.samui.build'),
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
