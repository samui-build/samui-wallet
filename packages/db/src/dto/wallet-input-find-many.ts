import type { z } from 'zod'

import type { walletSchemaFindMany } from '../schema/wallet-schema-find-many.ts'

export type WalletInputFindMany = z.infer<typeof walletSchemaFindMany>
