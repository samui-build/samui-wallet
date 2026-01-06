import type { z } from 'zod'

import type { walletUpdateOrderSchema } from './wallet-update-order-schema.ts'

export type WalletUpdateOrderInput = z.infer<typeof walletUpdateOrderSchema>
