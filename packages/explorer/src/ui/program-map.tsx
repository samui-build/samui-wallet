import { type Address, address } from '@solana/kit'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '@workspace/solana-client/constants'

export const programMap = new Map<Address, string>()
  .set(TOKEN_2022_PROGRAM_ADDRESS, 'Token 2022')
  .set(TOKEN_PROGRAM_ADDRESS, 'Token Program')
  .set(address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'), 'Associated Token Program')
  .set(address('11111111111111111111111111111111'), 'System Program')
  .set(address('SysvarRent111111111111111111111111111111111'), 'Sysvar: Rent')
