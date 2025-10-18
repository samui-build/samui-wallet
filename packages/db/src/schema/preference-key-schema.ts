import { z } from 'zod'

export const preferenceKeySchema = z.enum(['activeAccountId', 'activeClusterId', 'activeWalletId'])
