import { useTranslation } from '@workspace/i18n'
import { UiEmpty } from './ui-empty.tsx'

export function UiNotFound() {
  const { t } = useTranslation('ui')
  return <UiEmpty description={t(($) => $.notFoundDescription)} title={t(($) => $.notFoundTitle)} />
}
