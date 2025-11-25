import type { z } from 'zod'

import type { bookmarkAccountUpdateSchema } from './bookmark-account-update-schema.ts'

export type BookmarkAccountUpdateInput = z.infer<typeof bookmarkAccountUpdateSchema>
