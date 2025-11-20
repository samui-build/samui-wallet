import type { z } from 'zod'

import type { walletCreateSchema } from './wallet-create-schema.ts'

export type WalletCreateInput = z.infer<typeof walletCreateSchema>
