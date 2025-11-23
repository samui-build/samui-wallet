import type { z } from 'zod'

import type { bookmarkAccountCreateSchema } from './bookmark-account-create-schema.ts'

export type BookmarkAccountCreateInput = z.infer<typeof bookmarkAccountCreateSchema>
