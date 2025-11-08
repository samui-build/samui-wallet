import { walletSchema } from './wallet-schema.ts'

export const walletSchemaUpdate = walletSchema
  .omit({ accounts: true, createdAt: true, derivationPath: true, id: true, updatedAt: true })
  .partial()
