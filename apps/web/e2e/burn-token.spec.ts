import { test } from '@playwright/test'
import { importExistingWallet } from './flows/onboarding.ts'
import { burnToken } from './flows/portfolio.ts'
import { createToken, requestLocalnetAirdrop } from './flows/tools.ts'

test('portfolio - burn SPL Token and Token-2022 balances', async ({ page }) => {
  test.setTimeout(180_000)

  await importExistingWallet(page)
  await requestLocalnetAirdrop(page)

  const splToken = await createToken(page, 'SPL Token')
  const token2022 = await createToken(page, 'SPL Token 2022')

  await burnToken(page, splToken.mint)
  await burnToken(page, token2022.mint)
})
