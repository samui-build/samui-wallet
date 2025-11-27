import type { z } from 'zod'

import type { bookmarkTransactionFindManySchema } from './bookmark-transaction-find-many-schema.ts'

export type BookmarkTransactionFindManyInput = z.infer<typeof bookmarkTransactionFindManySchema>
