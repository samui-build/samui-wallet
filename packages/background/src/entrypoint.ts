import { localExtStorage } from '@webext-core/storage'
import { browser } from '@wxt-dev/browser'

export async function getEntrypoint(): Promise<string> {
  return (await localExtStorage.getItem('entrypoint')) ?? ''
}

export function setEntrypoint(name: string) {
  localExtStorage.setItem('entrypoint', name)
  browser.runtime.connect({ name })
}

export function entrypointListeners() {
  browser.runtime.onConnect.addListener((entrypoint) => {
    localExtStorage.setItem('entrypoint', entrypoint.name)

    entrypoint.onDisconnect.addListener(async () => {
      localExtStorage.removeItem('entrypoint')
    })
  })
}
