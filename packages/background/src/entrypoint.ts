import { localExtStorage } from '@webext-core/storage'
import { browser } from '@wxt-dev/browser'

const ENTRYPOINT_KEY = 'entrypoints'

export async function getEntrypoint(): Promise<string> {
  const entrypoints = (await localExtStorage.getItem(ENTRYPOINT_KEY)) ?? []
  if (!entrypoints.length) {
    throw new Error('No entrypoints found')
  }

  return entrypoints[0]
}

export function setEntrypoint(name: string) {
  browser.runtime.connect({ name })
}

export function entrypointListeners() {
  browser.runtime.onConnect.addListener(async (entrypoint) => {
    const entrypoints = (await localExtStorage.getItem(ENTRYPOINT_KEY)) ?? []
    if (entrypoints.includes(entrypoint.name)) {
      return
    }

    entrypoints.push(entrypoint.name)
    await localExtStorage.setItem(ENTRYPOINT_KEY, entrypoints)

    entrypoint.onDisconnect.addListener(async () => {
      const entrypoints = (await localExtStorage.getItem(ENTRYPOINT_KEY)) ?? []
      await localExtStorage.setItem(
        ENTRYPOINT_KEY,
        entrypoints.filter((e: string) => e !== entrypoint.name),
      )
    })
  })
}
