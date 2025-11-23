import type { z } from 'zod'

import type { walletFindManySchema } from './wallet-find-many-schema.ts'

export type WalletFindManyInput = z.infer<typeof walletFindManySchema>
