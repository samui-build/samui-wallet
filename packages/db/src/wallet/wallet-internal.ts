import type { z } from 'zod'

import type { walletInternalSchema } from './wallet-internal-schema.ts'

export type WalletInternal = z.infer<typeof walletInternalSchema>
