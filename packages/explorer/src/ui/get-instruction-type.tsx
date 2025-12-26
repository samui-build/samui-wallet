import type { ExplorerGetTransactionResultInstruction } from '../data-access/use-explorer-get-transaction.ts'

export function getInstructionType(instruction: ExplorerGetTransactionResultInstruction) {
  return instruction.parsed.type as string | ''
}
