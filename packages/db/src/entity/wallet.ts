import type { z } from 'zod'

import type { walletSchema } from '../schema/wallet-schema.ts'

export type Wallet = z.infer<typeof walletSchema>
