import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { testWalletMenuLabel, testWalletSeedPhrase } from '../fixtures/wallet.ts'
import { setupVaultPassword } from './vault.ts'

async function fillImportMnemonic(page: Page) {
  for (const [index, word] of testWalletSeedPhrase.entries()) {
    const name = (index + 1).toString()
    await page.getByRole('textbox', { exact: true, name }).click()
    await page.getByRole('textbox', { exact: true, name }).fill(word)
  }
}

export async function importExistingWallet(page: Page) {
  await page.goto('')
  await page.getByRole('link', { name: 'I already have a wallet' }).click()
  await fillImportMnemonic(page)

  await page.getByRole('button', { name: 'Import wallet' }).click()
  await setupVaultPassword(page)
  await expect(page.getByTestId('wallet-menu-trigger')).toContainText(testWalletMenuLabel)
}

export async function importExistingWalletUnsecured(page: Page) {
  await page.goto('')
  await page.getByRole('link', { name: 'I already have a wallet' }).click()
  await fillImportMnemonic(page)

  await page.getByText('Advanced protection').click()
  await page.getByRole('radio', { name: 'Unsecured' }).click()
  await page.getByLabel('I understand this wallet is not protected by a password or PIN.').click()
  await page.getByRole('button', { name: 'Import wallet' }).click()
  await expect(page.getByRole('heading', { name: 'Create app password' })).toBeHidden()
  await expect(page.getByTestId('wallet-menu-trigger')).toContainText(testWalletMenuLabel)
}
