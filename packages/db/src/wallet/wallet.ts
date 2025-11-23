import type { z } from 'zod'

import type { walletSchema } from './wallet-schema.ts'

export type Wallet = z.infer<typeof walletSchema>
