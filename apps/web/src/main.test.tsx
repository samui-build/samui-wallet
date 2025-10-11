import { page } from '@vitest/browser/context'
import { CoreFeature } from '@workspace/features/core/core-feature.tsx'
import { beforeEach, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

beforeEach(async () => {
  // TODO: Default test in dark mode
  // TODO: Figure out a strategy to test the complete app e2e and individual components as a unit test
  render(<CoreFeature />)
  await page.viewport(1920, 1280)
})

it('renders the header and initial portfolio view correctly', async () => {
  // ARRANGE
  expect.assertions(4)
  // ACT
  const { base64 } = await page.screenshot({ base64: true, save: true })
  // ASSERT
  expect(base64).not.toBeNull()
  expect(page.getByRole('link', { name: 'Portfolio' })).toBeInTheDocument()
  expect(page.getByRole('link', { name: 'Dev' })).toBeInTheDocument()
  expect(page.getByRole('link', { name: 'Settings' })).toBeInTheDocument()
})

it('navigates to the dev view', async () => {
  // ARRANGE
  expect.assertions(1)
  // ACT
  await page.getByRole('link', { name: 'Dev' }).click()
  const { base64 } = await page.screenshot({ base64: true, save: true })
  // ASSERT
  expect(base64).not.toBeNull()
})

it('navigates to the settings view', async () => {
  // ARRANGE
  expect.assertions(1)
  // ACT
  await page.getByRole('link', { name: 'Settings' }).click()
  const { base64 } = await page.screenshot({ base64: true, save: true })
  // ASSERT
  expect(base64).not.toBeNull()
})
