import { walletSchema } from './wallet-schema.ts'

export const walletSchemaCreate = walletSchema
  .omit({
    createdAt: true,
    id: true,
    updatedAt: true,
  })
  .partial({
    derivationIndex: true,
  })
