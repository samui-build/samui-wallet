import type { z } from 'zod'

import type { settingSchemaUpdate } from '../schema/setting-schema-update.ts'

export type SettingInputUpdate = z.infer<typeof settingSchemaUpdate>
