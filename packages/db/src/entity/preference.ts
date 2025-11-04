import type { z } from 'zod'

import type { preferenceSchema } from '../schema/preference-schema.ts'

export type Preference = z.infer<typeof preferenceSchema>
