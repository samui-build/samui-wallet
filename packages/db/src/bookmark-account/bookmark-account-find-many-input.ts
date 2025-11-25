import type { z } from 'zod'

import type { bookmarkAccountFindManySchema } from './bookmark-account-find-many-schema.ts'

export type BookmarkAccountFindManyInput = z.infer<typeof bookmarkAccountFindManySchema>
