import { accountSchema } from './account-schema.ts'

export const accountFindManySchema = accountSchema
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
