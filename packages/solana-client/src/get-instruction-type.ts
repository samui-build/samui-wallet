import type { GetTransactionResultInstruction } from './get-transaction.ts'

export function getInstructionType(instruction: GetTransactionResultInstruction): string {
  const parsedType = instruction.parsed?.type
  return typeof parsedType === 'string' ? parsedType : ''
}
