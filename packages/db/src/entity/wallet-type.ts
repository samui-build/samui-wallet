import type { z } from 'zod'

import type { walletTypeSchema } from '../schema/wallet-type-schema.ts'

export type WalletType = z.infer<typeof walletTypeSchema>
