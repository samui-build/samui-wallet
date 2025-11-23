import { bookmarkAccountSchema } from './bookmark-account-schema.ts'

export const bookmarkAccountUpdateSchema = bookmarkAccountSchema
  .omit({ address: true, createdAt: true, id: true, updatedAt: true })
  .partial()
