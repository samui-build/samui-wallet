import type { z } from 'zod'

import type { preferenceSchema } from '../schema/preference-schema'

export type Preference = z.infer<typeof preferenceSchema>
