import type { z } from 'zod'

import type { preferenceKeySchema } from '../schema/preference-key-schema'

export type PreferenceKey = z.infer<typeof preferenceKeySchema>
