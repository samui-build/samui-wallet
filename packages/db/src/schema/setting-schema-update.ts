import { settingSchema } from './setting-schema.ts'

export const settingSchemaUpdate = settingSchema
  .omit({ createdAt: true, id: true, key: true, updatedAt: true })
  .partial()
