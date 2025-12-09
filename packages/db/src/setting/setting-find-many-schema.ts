import { settingSchema } from './setting-schema.ts'

export const settingFindManySchema = settingSchema.pick({ key: true, value: true }).partial()
