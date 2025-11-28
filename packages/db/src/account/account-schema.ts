import { accountInternalSchema } from './account-internal-schema.ts'

export const accountSchema = accountInternalSchema.omit({
  secretKey: true,
})
