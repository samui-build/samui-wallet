import { accountSchema } from './account-schema'

export const accountSchemaCreate = accountSchema.omit({ createdAt: true, id: true, updatedAt: true, wallets: true })
