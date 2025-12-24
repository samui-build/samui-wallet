import type { GetTransactionResultInstruction } from './get-transaction.ts'

export function getInstructionType(instruction: GetTransactionResultInstruction) {
  return instruction.parsed?.type ?? ''
}
