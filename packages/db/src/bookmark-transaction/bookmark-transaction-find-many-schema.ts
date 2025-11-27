import { bookmarkTransactionSchema } from './bookmark-transaction-schema.ts'

export const bookmarkTransactionFindManySchema = bookmarkTransactionSchema
  .pick({
    id: true,
    label: true,
    signature: true,
  })
  .partial()
