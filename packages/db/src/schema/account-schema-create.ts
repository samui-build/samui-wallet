import { accountSchema } from './account-schema'

export const accountSchemaCreate = accountSchema.omit({
  createdAt: true,
  id: true,
  order: true,
  updatedAt: true,
  wallets: true,
})
