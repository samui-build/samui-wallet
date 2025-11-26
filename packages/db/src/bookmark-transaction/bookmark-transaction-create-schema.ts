import { bookmarkTransactionSchema } from './bookmark-transaction-schema.ts'

export const bookmarkTransactionCreateSchema = bookmarkTransactionSchema.omit({
  createdAt: true,
  id: true,
  updatedAt: true,
})
