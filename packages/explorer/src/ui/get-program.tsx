import type { ExplorerGetTransactionResultInstruction } from '../data-access/use-explorer-get-transaction.ts'
import { programMap } from './program-map.tsx'

export function getProgram(instruction: ExplorerGetTransactionResultInstruction) {
  const found = programMap.get(instruction.programId)

  return found ?? null
}
