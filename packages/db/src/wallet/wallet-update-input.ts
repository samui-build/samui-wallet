import type { z } from 'zod'

import type { walletUpdateSchema } from './wallet-update-schema.ts'

export type WalletUpdateInput = z.infer<typeof walletUpdateSchema>
