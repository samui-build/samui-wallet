type NoUndefined<T> = Prettify<{
  [K in keyof T as T[K] extends undefined ? never : K]: Exclude<T[K], undefined>
}>

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

// NOTE: https://github.com/colinhacks/zod/issues/1510
export function parseStrict<T extends Record<string, unknown>>(value: T): NoUndefined<T> {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as NoUndefined<T>
}
