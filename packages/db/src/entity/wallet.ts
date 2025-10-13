import type { z } from 'zod'

import type { walletSchema } from '../schema/wallet-schema'

export type Wallet = z.infer<typeof walletSchema>
