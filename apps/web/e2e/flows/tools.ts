import { expect, type Page } from '@playwright/test'

export type CreatedToken = {
  mint: string
  tokenAccount: string
}

export type TokenProgram = 'SPL Token' | 'SPL Token 2022'

export async function createToken(page: Page, tokenProgram: TokenProgram): Promise<CreatedToken> {
  await navigateInApp(page, '/tools/create-token')

  if (tokenProgram === 'SPL Token 2022') {
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: tokenProgram }).click()
  }

  await closeToasts(page)
  await page.getByRole('button', { name: 'Create Token' }).click()

  const viewMint = page.getByRole('link', { exact: true, name: 'View Mint' })
  const viewTokenAccount = page.getByRole('link', { exact: true, name: 'View Token Account' })
  await expect(viewMint).toBeVisible({ timeout: 60_000 })
  await expect(viewTokenAccount).toBeVisible({ timeout: 60_000 })

  const result = {
    mint: addressFromLink(await viewMint.getAttribute('href')),
    tokenAccount: addressFromLink(await viewTokenAccount.getAttribute('href')),
  }

  await page.getByRole('button', { name: 'Done' }).click()

  return result
}

export async function requestLocalnetAirdrop(page: Page) {
  await navigateInApp(page, '/tools/airdrop')
  await page.getByRole('combobox').click()
  await page.getByRole('option').first().click()
  await page.getByRole('spinbutton', { name: 'Amount' }).fill('2')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('cell', { name: '2 SOL' })).toBeVisible({ timeout: 60_000 })
}

async function closeToasts(page: Page) {
  for (let index = 0; index < 5; index++) {
    const closeToast = page.getByRole('button', { name: 'Close toast' }).first()
    const isVisible = await closeToast.isVisible().catch(() => false)

    if (!isVisible) {
      return
    }

    await closeToast.click({ force: true, timeout: 1_000 }).catch(() => undefined)
    await page
      .locator('[data-sonner-toast]')
      .first()
      .waitFor({ state: 'detached', timeout: 1_000 })
      .catch(() => undefined)
  }
}

async function navigateInApp(page: Page, path: string) {
  await page.evaluate((hash) => {
    window.location.hash = hash
  }, path)
  await expect(page).toHaveURL((url) => url.hash === `#${path}`)
}

function addressFromLink(href: null | string) {
  if (!href) {
    throw new Error(`Expected explorer link to include an address, got ${href}`)
  }

  const parsedUrl = new URL(href, 'http://localhost')
  const parsedRoute = parsedUrl.hash ? new URL(parsedUrl.hash.slice(1), 'http://localhost') : parsedUrl
  const address = parsedRoute.pathname.split('/').filter(Boolean).at(-1)
  if (!address) {
    throw new Error(`Expected explorer link to include an address, got ${href}`)
  }
  return decodeURIComponent(address)
}
