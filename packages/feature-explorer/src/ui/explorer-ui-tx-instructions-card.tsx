import { useTranslation } from '@workspace/i18n'
import { getProgram } from '@workspace/solana-client/get-program'
import { getProgramInstruction } from '@workspace/solana-client/get-program-instruction'
import type { GetTransactionResultInstruction } from '@workspace/solana-client/get-transaction'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import { type ReactNode, useState } from 'react'
import { ExplorerUiDetailRow } from './explorer-ui-detail-row.tsx'
import { ExplorerUiLinkAddress } from './explorer-ui-link-address.tsx'
import { ExplorerUiProgramLabel } from './explorer-ui-program-label.tsx'
import { getProgramFields } from './get-program-fields.tsx'

function getDetails({ basePath, instruction }: { basePath: string; instruction: GetTransactionResultInstruction }) {
  const programFields = getProgramFields({ basePath, instruction })
  const programInstruction = getProgramInstruction(instruction)
  const programName = getProgram(instruction)

  return { programFields, programInstruction, programName }
}

export function ExplorerUiTxInstructionsCard({
  basePath,
  className,
  children,
  index,
  instruction,
}: {
  basePath: string
  className?: string | undefined
  children?: ReactNode
  index: string
  instruction: GetTransactionResultInstruction
}) {
  const { t } = useTranslation('explorer')
  const { programName, programInstruction, programFields } = getDetails({ basePath, instruction })
  const [showData, setShowData] = useState(!programFields.length)
  return (
    <UiCard
      action={
        <Button onClick={() => setShowData((value) => !value)} size="sm" variant="outline">
          {t(($) => $.raw)}
        </Button>
      }
      className={className}
      contentProps={{ className: 'space-y-2 md:space-y-6' }}
      title={
        <>
          <Badge variant="outline">#{index}</Badge> {programName}
          {programInstruction ? `: ${programInstruction}` : null}
        </>
      }
    >
      <ExplorerUiDetailRow
        label={t(($) => $.program)}
        value={
          <ExplorerUiLinkAddress
            address={instruction.programId}
            basePath={basePath}
            label={<ExplorerUiProgramLabel address={instruction.programId} />}
          />
        }
        variant="wide"
      />
      {programFields.map(([label, handler]) => (
        <ExplorerUiDetailRow key={label} label={label} value={handler(instruction)} variant="wide" />
      ))}
      {showData ? (
        <ExplorerUiDetailRow
          label={t(($) => $.data)}
          value={<UiDebug className="text-muted-foreground" data={instruction?.parsed} />}
        />
      ) : null}
      {children}
    </UiCard>
  )
}
