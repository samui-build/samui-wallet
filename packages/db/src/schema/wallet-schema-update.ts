import { walletSchema } from './wallet-schema'

export const walletSchemaUpdate = walletSchema.omit({ createdAt: true, id: true, updatedAt: true }).partial()
