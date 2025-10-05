/**
 * Turn an enum into an array of `{ name, value }` pairs.
 *
 * Example:
 *   enum Color { Red = 'R', Green = 'G' }
 *   const colors = enumOptions(Color)
 *   // → [{ name: 'Red', value: 'R' }, { name: 'Green', value: 'G' }]
 */
export function enumOptions<E extends Record<number | string, number | string>>(
  e: E,
): Array<{ name: keyof E; value: E[keyof E] }> {
  return Object.entries(e)
    .filter(([key]) => typeof key === 'string') // skip numeric reverse‑keys
    .map(([name, value]) => ({ name: name as keyof E, value }) as { name: keyof E; value: E[keyof E] })
}
