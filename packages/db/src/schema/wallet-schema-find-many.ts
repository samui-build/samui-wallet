import { walletSchema } from './wallet-schema.ts'

export const walletSchemaFindMany = walletSchema.pick({ id: true, name: true }).partial()
