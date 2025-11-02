import type { z } from 'zod'

import type { preferenceSchemaCreate } from '../schema/preference-schema-create.js'

export type PreferenceInputCreate = z.infer<typeof preferenceSchemaCreate>
