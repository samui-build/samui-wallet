import { bookmarkTransactionSchema } from './bookmark-transaction-schema.ts'

export const bookmarkTransactionUpdateSchema = bookmarkTransactionSchema
  .omit({ createdAt: true, id: true, signature: true, updatedAt: true })
  .partial()
