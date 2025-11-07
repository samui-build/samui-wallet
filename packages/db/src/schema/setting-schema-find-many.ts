import { settingSchema } from './setting-schema.ts'

export const settingSchemaFindMany = settingSchema.pick({ id: true, key: true, value: true }).partial()
