import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiLoaderFull } from '@workspace/ui/components/ui-loader-full'
import type { ReactNode } from 'react'
import { useShellUnlockGate } from '../data-access/use-shell-unlock-gate.tsx'

export function ShellUiUnlockGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation('shell')
  const { actions, state } = useShellUnlockGate()

  if (state.isChecking) {
    return <UiLoaderFull />
  }

  if (!state.isLocked) {
    return children
  }

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <UiCard
        className="w-full max-w-xs"
        contentProps={{ className: 'space-y-4' }}
        description={t(($) => $.unlockGateDescription, { walletName: state.walletName })}
        title={t(($) => $.unlockGateTitle)}
      >
        <Button disabled={state.isUnlocking} onClick={actions.unlock} type="button">
          {t(($) => $.unlockGateAction)}
        </Button>
      </UiCard>
    </div>
  )
}
