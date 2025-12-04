import type { ReadonlyUint8Array } from '@solana/kit'

/**
 * @link https://github.com/mozilla/webextension-polyfill/issues/643
 * @link https://issues.chromium.org/issues/40321352
 */
export function ensureUint8Array(value: Record<string, number> | Uint8Array | ReadonlyUint8Array): Uint8Array {
  return value instanceof Uint8Array ? value : new Uint8Array(Object.values(value))
}
