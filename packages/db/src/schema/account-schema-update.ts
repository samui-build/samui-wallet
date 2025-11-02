import { accountSchema } from './account-schema.js'

export const accountSchemaUpdate = accountSchema
  .omit({ createdAt: true, derivationPath: true, id: true, updatedAt: true, wallets: true })
  .partial()
