import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useTranslation } from '@workspace/i18n'
import { handleCopyText } from '@workspace/ui/lib/handle-copy-text'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import type { ShellCommandGroup } from './use-shell-command-groups.tsx'

export function useShellCommandGroupSuggestions(): ShellCommandGroup {
  const { t } = useTranslation('shell')
  const { publicKey } = useAccountActive()
  return {
    commands: [
      {
        handler: async () => {
          try {
            await handleCopyText(publicKey)
            toastSuccess(t(($) => $.accountPublicKeyCopySuccess))
          } catch (error) {
            toastError(error instanceof Error ? error.message : t(($) => $.accountPublicKeyCopyFailed))
          }
        },
        label: t(($) => $.accountPublicKeyCopy),
      },
    ],
    label: t(($) => $.commandSuggestions),
  }
}
