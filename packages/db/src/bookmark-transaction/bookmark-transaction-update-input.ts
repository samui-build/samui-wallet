import type { z } from 'zod'

import type { bookmarkTransactionUpdateSchema } from './bookmark-transaction-update-schema.ts'

export type BookmarkTransactionUpdateInput = z.infer<typeof bookmarkTransactionUpdateSchema>
