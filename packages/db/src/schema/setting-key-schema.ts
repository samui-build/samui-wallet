import { z } from 'zod'

export const settingKeySchema = z.enum([
  'activeAccountId',
  'activeNetworkId',
  'activeWalletId',
  'apiEndpoint',
  'developerModeEnabled',
  'warningAcceptExperimental',
])
