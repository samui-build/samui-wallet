import type { z } from 'zod'

import type { bookmarkAccountSchema } from './bookmark-account-schema.ts'

export type BookmarkAccount = z.infer<typeof bookmarkAccountSchema>
