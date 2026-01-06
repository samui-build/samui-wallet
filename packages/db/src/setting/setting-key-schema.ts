import { z } from 'zod'

export const settingKeySchema = z.enum([
  'activeAccountId',
  'activeNetworkId',
  'apiEndpoint',
  'language',
  'theme',
  'warningAcceptExperimental',
])
