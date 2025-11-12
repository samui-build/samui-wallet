import { accountSchema } from './account-schema.ts'

export const accountSchemaFindMany = accountSchema
  .pick({
    id: true,
    name: true,
    publicKey: true,
    type: true,
  })
  .partial()
  .extend({
    walletId: accountSchema.shape.walletId,
  })
