import { walletSchema } from './wallet-schema.js'

export const walletSchemaUpdate = walletSchema.omit({ createdAt: true, id: true, updatedAt: true }).partial()
