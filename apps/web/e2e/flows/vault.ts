import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const testVaultPassword = 'password-one'

export async function setupVaultPassword(page: Page) {
  await expect(page.getByRole('heading', { name: 'Create app password' })).toBeVisible()
  await page.getByLabel('Password', { exact: true }).fill(testVaultPassword)
  await page.getByLabel('Confirm password', { exact: true }).fill(testVaultPassword)
  await page.getByRole('button', { name: 'Continue' }).click()
}
