import { walletSchema } from './wallet-schema.ts'

export const walletSchemaFindMany = walletSchema
  .pick({
    id: true,
    name: true,
    publicKey: true,
    type: true,
  })
  .partial()
  .extend({
    accountId: walletSchema.shape.accountId,
  })
