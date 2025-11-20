import { walletSchema } from './wallet-schema.ts'

export const walletFindManySchema = walletSchema.pick({ id: true, name: true }).partial()
