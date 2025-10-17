export function convertByteArrayToJson(byteArray: Uint8Array): string {
  if (!(byteArray instanceof Uint8Array)) {
    throw new Error('Invalid input: expected a Uint8Array')
  }
  return JSON.stringify([...byteArray])
}
