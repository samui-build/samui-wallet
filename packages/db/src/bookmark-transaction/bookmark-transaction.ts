import type { z } from 'zod'

import type { bookmarkTransactionSchema } from './bookmark-transaction-schema.ts'

export type BookmarkTransaction = z.infer<typeof bookmarkTransactionSchema>
