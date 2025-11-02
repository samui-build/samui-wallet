import type { z } from 'zod'

import type { walletSchema } from '../schema/wallet-schema.js'

export type Wallet = z.infer<typeof walletSchema>
