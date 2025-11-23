import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiBottomSheet } from '@workspace/ui/components/ui-bottom-sheet'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'
import { PortfolioUiAccountFormSend } from './portfolio-ui-account-form-send.tsx'

export function PortfolioUiAccountSheetSend({
  balances,
  isLoading,
  send,
}: {
  balances: TokenBalance[]
  isLoading: boolean
  send: (input: { amount: string; destination: string; mint: TokenBalance }) => Promise<void>
}) {
  const { t } = useTranslation('portfolio')
  return (
    <UiBottomSheet
      description={t(($) => $.pageSendDescription)}
      title={t(($) => $.pageSendTitle)}
      trigger={
        <Button variant="secondary">
          <UiIcon icon="arrowUp" /> {t(($) => $.actionSend)}
        </Button>
      }
    >
      <PortfolioUiAccountFormSend balances={balances} isLoading={isLoading} send={send} />
    </UiBottomSheet>
  )
}
