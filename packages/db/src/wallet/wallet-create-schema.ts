import { walletInternalSchema } from './wallet-internal-schema.ts'

export const walletCreateSchema = walletInternalSchema.omit({
  accounts: true,
  createdAt: true,
  id: true,
  order: true,
  updatedAt: true,
})
