import { useTranslation } from '@workspace/i18n'
import { Badge } from '@workspace/ui/components/badge'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import type { PortfolioPreparedTransaction } from '../data-access/use-portfolio-tx-prepare.tsx'
import { PortfolioUiSendConfirmInstruction } from './portfolio-ui-send-confirm-instruction.tsx'

export function PortfolioUiSendConfirmTransaction({
  isPreparing,
  preparedTransaction,
}: {
  isPreparing: boolean
  preparedTransaction: PortfolioPreparedTransaction | undefined
}) {
  const { t } = useTranslation('portfolio')

  if (isPreparing) {
    return (
      <div className="flex items-center gap-2 rounded-md border p-3 text-muted-foreground text-sm">
        <UiLoader className="size-4" />
        {t(($) => $.sendConfirmPreparingTransaction)}
      </div>
    )
  }

  if (!preparedTransaction) {
    return null
  }

  const instructionCount = preparedTransaction.instructions.length
  const instructionLabel = t(($) => $.sendConfirmInstructionCount, { count: instructionCount })

  return (
    <div className="rounded-md border text-sm">
      <div className="flex items-center justify-between gap-3 border-b p-3">
        <div className="font-medium">{t(($) => $.sendConfirmTransactionPreview)}</div>
        <Badge variant="outline">{instructionLabel}</Badge>
      </div>
      <div className="divide-y">
        {preparedTransaction.instructions.map((instruction, index) => (
          <PortfolioUiSendConfirmInstruction
            index={index}
            instruction={instruction}
            key={`${instruction.programAddress}-${index}`}
          />
        ))}
      </div>
    </div>
  )
}
