import type { z } from 'zod'

import type { preferenceKeySchema } from '../schema/preference-key-schema.ts'

export type PreferenceKey = z.infer<typeof preferenceKeySchema>
