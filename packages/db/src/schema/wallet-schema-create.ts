import { walletSchema } from './wallet-schema'

export const walletSchemaCreate = walletSchema.omit({ createdAt: true, id: true, updatedAt: true })
