import { accountSchema } from './account-schema.ts'

export const accountUpdateSchema = accountSchema.omit({ createdAt: true, id: true, updatedAt: true }).partial()
