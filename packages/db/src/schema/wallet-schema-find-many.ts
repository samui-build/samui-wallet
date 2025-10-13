import { walletSchema } from './wallet-schema'

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
