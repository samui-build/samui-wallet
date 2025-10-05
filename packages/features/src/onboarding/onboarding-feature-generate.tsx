import { OnboardingUiMnemonicSelectStrength } from './ui/onboarding-ui-mnemonic-select-strength.js'
import { OnboardingUiMnemonicSelectLanguage } from './ui/onboarding-ui-mnemonic-select-language.js'
import { OnboardingUiMnemonicShow } from './ui/onboarding-ui-mnemonic-show.js'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card.js'
import { OnboardingUiMnemonicCopy } from './ui/onboarding-ui-mnemonic-copy.js'
import { OnboardingUiMnemonicSave } from './ui/onboarding-ui-mnemonic-save.js'
import React from 'react'
import { UiBackButton } from './ui-back-button.js'

export function OnboardingFeatureGenerate() {
  return (
    <div>
      <div className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <UiBackButton className="mr-2" />
              Recovery Phrase
            </CardTitle>
            <CardDescription>
              This phrase is the ONLY way to recover your wallet. Do NOT share it with anyone!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between">
              <div>
                <OnboardingUiMnemonicSelectLanguage />
              </div>
              <div>
                <OnboardingUiMnemonicSelectStrength />
              </div>
            </div>
            <OnboardingUiMnemonicShow />
          </CardContent>
          <CardFooter className="flex justify-between">
            <OnboardingUiMnemonicCopy />
            <OnboardingUiMnemonicSave />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
