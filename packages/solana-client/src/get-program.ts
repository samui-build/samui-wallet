import type { GetTransactionResultInstruction } from './get-transaction.ts'
import { programMap } from './program-map.ts'

export function getProgram(instruction: GetTransactionResultInstruction): string {
  const found = programMap.get(instruction.programId)

  return found ?? instruction.programId
}
