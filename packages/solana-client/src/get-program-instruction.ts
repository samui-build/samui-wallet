import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from './constants.ts'
import { getInstructionType } from './get-instruction-type.ts'

import type { GetTransactionResultInstruction } from './get-transaction.ts'

const instructionMap = new Map<string, string>()
  .set(`${TOKEN_2022_PROGRAM_ADDRESS}.getAccountDataSize`, 'Get Account Data Size')
  .set(`${TOKEN_2022_PROGRAM_ADDRESS}.initializeAccount3`, 'Initialize Account (3)')
  .set(`${TOKEN_2022_PROGRAM_ADDRESS}.initializeImmutableOwner`, 'Initialize Immutable Owner')
  .set(`${TOKEN_2022_PROGRAM_ADDRESS}.mintToChecked`, 'Mint to (checked)')
  .set(`${TOKEN_PROGRAM_ADDRESS}.getAccountDataSize`, 'Get Account Data Size')
  .set(`${TOKEN_PROGRAM_ADDRESS}.initializeAccount3`, 'Initialize Account (3)')
  .set(`${TOKEN_PROGRAM_ADDRESS}.initializeImmutableOwner`, 'Initialize Immutable Owner')
  .set(`${TOKEN_PROGRAM_ADDRESS}.transferChecked`, 'Transfer (checked)')
  .set(`11111111111111111111111111111111.createAccount`, 'Create Account')
  .set(`ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL.create`, 'Create')
  .set(`ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL.createIdempotent`, 'Create idempotent')

export function getProgramInstruction(instruction: GetTransactionResultInstruction) {
  return (
    instructionMap.get(`${instruction.programId}.${getInstructionType(instruction)}`) ?? getInstructionType(instruction)
  )
}
