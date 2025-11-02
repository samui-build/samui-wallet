import type { z } from 'zod'

import type { preferenceSchema } from '../schema/preference-schema.js'

export type Preference = z.infer<typeof preferenceSchema>
