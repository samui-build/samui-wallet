import { accountSchema } from './account-schema.ts'

export const accountCreateSchema = accountSchema
  .omit({
    createdAt: true,
    id: true,
    order: true,
    updatedAt: true,
  })
  .partial({
    derivationIndex: true,
  })
