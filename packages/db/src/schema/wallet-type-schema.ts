import { z } from 'zod'

export const walletTypeSchema = z.enum(['Derived', 'Imported', 'Watched'])
