import { bookmarkAccountSchema } from './bookmark-account-schema.ts'

export const bookmarkAccountCreateSchema = bookmarkAccountSchema.omit({
  createdAt: true,
  id: true,
  updatedAt: true,
})
