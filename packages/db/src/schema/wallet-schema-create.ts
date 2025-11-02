import { walletSchema } from './wallet-schema.js'

export const walletSchemaCreate = walletSchema
  .omit({
    createdAt: true,
    id: true,
    updatedAt: true,
  })
  .partial({
    derivationIndex: true,
  })
