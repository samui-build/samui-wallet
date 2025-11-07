import type { z } from 'zod'

import type { settingSchemaCreate } from '../schema/setting-schema-create.ts'

export type SettingInputCreate = z.infer<typeof settingSchemaCreate>
