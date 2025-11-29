import { accountInternalSchema } from './account-internal-schema.ts'

export const accountCreateSchema = accountInternalSchema
  .omit({
    createdAt: true,
    id: true,
    order: true,
    updatedAt: true,
  })
  .partial({
    derivationIndex: true,
  })
