import { useTranslation } from '@workspace/i18n'
import { Label } from '@workspace/ui/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { useId } from 'react'

import { useThemes } from './data-access/use-themes.tsx'

export function SettingsFeatureGeneralTheme() {
  const { t } = useTranslation('settings')
  const themeId = useId()
  const { options, setTheme, theme } = useThemes()

  return (
    <div className="space-y-2">
      <Label htmlFor={themeId}>{t(($) => $.pageGeneralTheme)}</Label>
      <Select onValueChange={setTheme} value={theme ?? 'dark'}>
        <SelectTrigger id={themeId}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ label, value }) => (
            <SelectItem disabled={theme === value} key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
