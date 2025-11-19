import { useSetting } from '@workspace/db-react/use-setting'
import { i18n, useTranslation } from '@workspace/i18n'
import { Label } from '@workspace/ui/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { useId } from 'react'

const SUPPORTED_LANGUAGES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
}

export function SettingsFeatureGeneralLanguage() {
  const { t } = useTranslation('settings')
  const languageId = useId()
  const [language, setLanguageSetting] = useSetting('language')

  async function handleLanguageChange(newLanguage: string) {
    await setLanguageSetting(newLanguage)
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
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
