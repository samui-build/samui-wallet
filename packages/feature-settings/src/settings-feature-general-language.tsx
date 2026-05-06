import { useSetting } from '@workspace/db-react/use-setting'
import { i18n, useSupportedLanguages, useTranslation } from '@workspace/i18n'
import { Label } from '@workspace/ui/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { useId } from 'react'

export function SettingsFeatureGeneralLanguage() {
  const { t } = useTranslation('settings')
  const languageId = useId()
  const [language, setLanguage] = useSetting('language')
  const supportedLanguages = useSupportedLanguages()

  async function handleLanguageChange(newLanguage: string) {
    await setLanguage(newLanguage)
    await i18n.changeLanguage(newLanguage)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={languageId}>{t(($) => $.pageGeneralLanguage)}</Label>
      <Select onValueChange={handleLanguageChange} value={language ?? 'en'}>
        <SelectTrigger id={languageId}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(supportedLanguages).map(([code, name]) => (
            <SelectItem disabled={language === code} key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
