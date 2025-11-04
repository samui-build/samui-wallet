import { walletSchema } from './wallet-schema.ts'

export const walletSchemaUpdate = walletSchema.omit({ createdAt: true, id: true, updatedAt: true }).partial()
