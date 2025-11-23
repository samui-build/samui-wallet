import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 25)

export function randomId(size?: number) {
  return nanoid(size)
}
