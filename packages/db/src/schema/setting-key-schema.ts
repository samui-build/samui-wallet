import { z } from 'zod'

export const settingKeySchema = z.enum([
  'activeAccountId',
  'activeClusterId',
  'activeWalletId',
  'apiEndpoint',
  'developerModeEnabled',
  'warningAcceptExperimental',
])
