import { address, isAddress } from '@solana/kit'
import { z } from 'zod'

export const solanaAddressSchema = z
  .string()
  .refine((val) => isAddress(val), { message: 'Invalid Solana address' })
  .transform((val) => address(val))
