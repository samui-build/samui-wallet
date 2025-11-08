import { z } from 'zod'

export const accountTypeSchema = z.enum(['Derived', 'Imported', 'Watched'])
