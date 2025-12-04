import { expect, test } from '@playwright/test'

test('onboarding - import existing wallet', async ({ page }) => {
  await page.goto('')
  await page.getByRole('link', { name: 'I already have a wallet' }).click()

  const seedPhrase = [
    'pill',
    'tomorrow',
    'foster',
    'begin',
    'walnut',
    'borrow',
    'virtual',
    'kick',
    'shift',
    'mutual',
    'shoe',
    'scatter',
  ]

  for (const [index, word] of seedPhrase.entries()) {
    const name = (index + 1).toString()
    await page.getByRole('textbox', { exact: true, name }).click()
    await page.getByRole('textbox', { exact: true, name }).fill(word)
  }

  await page.getByRole('button', { name: 'Import wallet' }).click()
  await page.getByRole('button', { name: 'Copy public key' }).click()
  await expect(page.getByTestId('wallet-menu-trigger')).toContainText('W15F86')
})
