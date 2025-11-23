import { derivationPaths } from '@workspace/keypair/derivation-paths'
import { type DerivedAccount, deriveFromMnemonicAtIndex } from '@workspace/keypair/derive-from-mnemonic-at-index'
import { generateMnemonic, type MnemonicStrength } from '@workspace/keypair/generate-mnemonic'
import { useState } from 'react'
import { Button, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function OnboardingFeatureGenerate() {
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const [account, setAccount] = useState<DerivedAccount | null>(null)

  async function generate(strength: MnemonicStrength) {
    const mnemonic = generateMnemonic({ strength })
    setMnemonic(mnemonic)
    deriveFromMnemonicAtIndex({
      derivationIndex: 0,
      derivationPath: derivationPaths.default,
      mnemonic,
    })
      .then((res) => {
        setAccount(res)
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  return (
    <SafeAreaView>
      <View className="flex flex-col h-full items-center justify-center">
        <Text className="text-center text-neutral-900 dark:text-neutral-100">Generate new wallet</Text>
        <View className="flex flex-row items-center gap-2">
          <Button onPress={() => generate(128)} title="12 words" />
          <Button onPress={() => generate(256)} title="24 words" />
        </View>
        <Text className="text-center text-neutral-900 dark:text-neutral-100">{mnemonic ?? 'No mnemonic'}</Text>
        <Text className="text-center text-neutral-900 dark:text-neutral-100">
          {JSON.stringify({ account, mnemonic }, null, 2)}
        </Text>
      </View>
    </SafeAreaView>
  )
}
