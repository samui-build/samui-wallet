export function convertJsonToByteArray(json: string): Uint8Array {
  if (typeof json !== 'string') {
    throw new Error('Invalid input: expected a string')
  }
  try {
    const arr = JSON.parse(json)
    if (!Array.isArray(arr)) {
      throw new Error('Invalid JSON: expected an array')
    }
    if (arr.some((item) => typeof item !== 'number' || item < 0 || item > 255)) {
      throw new Error('Invalid JSON: array must contain only numbers between 0 and 255')
    }
    return new Uint8Array(arr)
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('Invalid JSON')) {
      throw e
    }
    throw new Error('Invalid JSON: failed to parse')
  }
}
