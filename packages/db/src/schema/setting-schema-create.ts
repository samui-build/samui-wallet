import { settingSchema } from './setting-schema.ts'

export const settingSchemaCreate = settingSchema.omit({ createdAt: true, id: true, updatedAt: true })
