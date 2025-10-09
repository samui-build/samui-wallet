import type { StandardEventsListeners, StandardEventsNames } from '@wallet-standard/core'

export function on<T extends StandardEventsNames>(event: T, listener: StandardEventsListeners[T]): () => void {
  console.log('on called', event, listener)
  return () => {
    console.log('off called')
  }
}
