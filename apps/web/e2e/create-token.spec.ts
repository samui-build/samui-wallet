import { expect, test } from '@playwright/test'
import { importExistingWallet } from './flows/onboarding.ts'
import { createToken, requestLocalnetAirdrop } from './flows/tools.ts'

test('tools - create SPL Token and Token-2022 mints', async ({ page }) => {
  test.setTimeout(180_000)

  await importExistingWallet(page)
  await requestLocalnetAirdrop(page)

  const splToken = await createToken(page, 'SPL Token')
  const token2022 = await createToken(page, 'SPL Token 2022')

  expect(splToken.mint).not.toBe(splToken.tokenAccount)
  expect(splToken.mint).not.toBe(token2022.mint)
  expect(token2022.mint).not.toBe(token2022.tokenAccount)
})
