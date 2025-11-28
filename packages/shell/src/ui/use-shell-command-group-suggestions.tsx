import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useTranslation } from '@workspace/i18n'
import { useHandleCopyText } from '@workspace/ui/components/use-handle-copy-text'
import type { ShellCommandGroup } from './use-shell-command-groups.tsx'

export function useShellCommandGroupSuggestions(): ShellCommandGroup {
  const { t } = useTranslation('shell')
  const { publicKey } = useAccountActive()
  const { handleCopy } = useHandleCopyText()
  return {
    commands: [
      {
        handler: () =>
          handleCopy({
            text: publicKey,
            toast: t(($) => $.accountPublicKeyCopySuccess),
            toastFailed: t(($) => $.accountPublicKeyCopyFailed),
          }),
        label: t(($) => $.accountPublicKeyCopy),
      },
    ],
    label: t(($) => $.commandSuggestions),
  }
}
