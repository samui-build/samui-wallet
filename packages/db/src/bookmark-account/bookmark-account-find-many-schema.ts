import { bookmarkAccountSchema } from './bookmark-account-schema.ts'

export const bookmarkAccountFindManySchema = bookmarkAccountSchema
  .pick({
    address: true,
    id: true,
    label: true,
  })
  .partial()
