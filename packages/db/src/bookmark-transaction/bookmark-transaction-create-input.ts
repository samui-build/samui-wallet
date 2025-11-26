import type { z } from 'zod'

import type { bookmarkTransactionCreateSchema } from './bookmark-transaction-create-schema.ts'

export type BookmarkTransactionCreateInput = z.infer<typeof bookmarkTransactionCreateSchema>
