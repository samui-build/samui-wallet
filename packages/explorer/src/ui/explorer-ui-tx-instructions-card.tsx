import { useTranslation } from '@workspace/i18n'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import { type ReactNode, useState } from 'react'
import type { ExplorerGetTransactionResultInstruction } from '../data-access/use-explorer-get-transaction.ts'
import { ExplorerUiDetailRow } from './explorer-ui-detail-row.tsx'
import { ExplorerUiDetailRowWide } from './explorer-ui-detail-row-wide.tsx'
import { ExplorerUiLinkAddress } from './explorer-ui-link-address.tsx'
import { ExplorerUiProgramLabel } from './explorer-ui-program-label.tsx'
import { getProgram } from './get-program.tsx'
import { getProgramFields } from './get-program-fields.tsx'
import { getProgramInstruction } from './get-program-instruction.tsx'

function getDetails({
  basePath,
  instruction,
}: {
  basePath: string
  instruction: ExplorerGetTransactionResultInstruction
}) {
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
  instruction: ExplorerGetTransactionResultInstruction
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
      <ExplorerUiDetailRowWide
        label={t(($) => $.program)}
        value={
          <ExplorerUiLinkAddress
            address={instruction.programId}
            basePath={basePath}
            label={<ExplorerUiProgramLabel address={instruction.programId} />}
          />
        }
      />
      {programFields.map(([label, handler]) => (
        <ExplorerUiDetailRowWide key={label} label={label} value={handler(instruction)} />
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
