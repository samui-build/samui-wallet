import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { testWalletMenuLabel, testWalletSeedPhrase } from '../fixtures/wallet.ts'
import { setupVaultPassword } from './vault.ts'

export async function importExistingWallet(page: Page) {
  await page.goto('')
  await page.getByRole('link', { name: 'I already have a wallet' }).click()

  for (const [index, word] of testWalletSeedPhrase.entries()) {
    const name = (index + 1).toString()
    await page.getByRole('textbox', { exact: true, name }).click()
    await page.getByRole('textbox', { exact: true, name }).fill(word)
  }

  await page.getByRole('button', { name: 'Import wallet' }).click()
  await setupVaultPassword(page)
  await expect(page.getByTestId('wallet-menu-trigger')).toContainText(testWalletMenuLabel)
}
