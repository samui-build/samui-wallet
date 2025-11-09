import { walletSchema } from './wallet-schema.ts'

export const walletCreateSchema = walletSchema.omit({
  accounts: true,
  createdAt: true,
  id: true,
  order: true,
  updatedAt: true,
})
