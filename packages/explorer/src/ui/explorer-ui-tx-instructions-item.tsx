import { useTranslation } from '@workspace/i18n'
import type { GetTransactionResult, GetTransactionResultInstruction } from '@workspace/solana-client/get-transaction'
import { ExplorerUiDetailRow } from './explorer-ui-detail-row.tsx'
import { ExplorerUiTxInstructionsCard } from './explorer-ui-tx-instructions-card.tsx'

export function ExplorerUiTxInstructionsItem({
  basePath,
  meta,
  instruction,
  index,
}: {
  basePath: string
  index: number
  meta: GetTransactionResult['meta']
  instruction: GetTransactionResultInstruction
}) {
  const { t } = useTranslation('explorer')
  const innerInstructions = (meta?.innerInstructions ?? []).find((item) => item.index === index)?.instructions ?? []

  return (
    <ExplorerUiTxInstructionsCard basePath={basePath} index={`${index + 1}`} instruction={instruction}>
      {innerInstructions.length ? (
        <ExplorerUiDetailRow
          label={t(($) => $.innerInstructions)}
          value={
            <div className="space-y-2 md:space-y-6">
              {innerInstructions.map((innerInstruction, idx) => (
                <ExplorerUiTxInstructionsCard
                  basePath={basePath}
                  className="bg-neutral-100 dark:bg-neutral-900"
                  index={`${index + 1}.${idx + 1}`}
                  instruction={innerInstruction}
                  key={idx.toString()}
                />
              ))}
            </div>
          }
        />
      ) : null}
    </ExplorerUiTxInstructionsCard>
  )
}
