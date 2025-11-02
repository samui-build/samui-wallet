import type { z } from 'zod'

import type { preferenceSchemaUpdate } from '../schema/preference-schema-update.js'

export type PreferenceInputUpdate = z.infer<typeof preferenceSchemaUpdate>
