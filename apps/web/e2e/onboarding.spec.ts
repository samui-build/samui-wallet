import { expect, test } from '@playwright/test'
import { importExistingWallet } from './flows/onboarding.ts'

test('onboarding - import existing wallet', async ({ page }) => {
  await importExistingWallet(page)
  const copyPublicKeyButton = page.getByRole('button', { name: 'Copy public key' })
  await expect(copyPublicKeyButton).toBeVisible()
  await copyPublicKeyButton.click()
})
