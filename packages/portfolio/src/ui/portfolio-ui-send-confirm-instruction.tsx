import type { Instruction } from '@solana/kit'
import { useTranslation } from '@workspace/i18n'
import { Badge } from '@workspace/ui/components/badge'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

export function getInstructionAccountAddress(account: unknown) {
  if (!account || typeof account !== 'object' || !('address' in account)) {
    return undefined
  }

  const { address } = account as { address?: unknown }

  return typeof address === 'string' ? address : undefined
}

export function PortfolioUiSendConfirmInstruction({ index, instruction }: { index: number; instruction: Instruction }) {
  const { t } = useTranslation('portfolio')
  const accounts = instruction.accounts ?? []

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-muted-foreground text-xs">{t(($) => $.sendConfirmInstructionProgram)}</div>
          <div className="break-all font-mono text-xs" title={instruction.programAddress}>
            {ellipsify(instruction.programAddress)}
          </div>
        </div>
        <Badge className="shrink-0" variant="secondary">
          #{index + 1}
        </Badge>
      </div>
      <div className="space-y-1">
        <div className="text-muted-foreground text-xs">{t(($) => $.sendConfirmInstructionAccounts)}</div>
        {accounts.length ? (
          <div className="flex flex-wrap gap-1.5">
            {accounts.map((account, accountIndex) => {
              const accountAddress = getInstructionAccountAddress(account)

              return (
                <Badge key={`${accountAddress ?? 'unknown'}-${accountIndex}`} title={accountAddress} variant="outline">
                  {accountAddress ? ellipsify(accountAddress) : t(($) => $.sendConfirmInstructionUnknownAccount)}
                </Badge>
              )
            })}
          </div>
        ) : (
          <div className="text-muted-foreground text-xs">{t(($) => $.sendConfirmInstructionNoAccounts)}</div>
        )}
      </div>
      <div className="text-muted-foreground text-xs">
        {t(($) => $.sendConfirmInstructionDataBytes, { bytes: instruction.data?.length ?? 0 })}
      </div>
    </div>
  )
}
