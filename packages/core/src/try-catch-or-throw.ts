import { tryCatch } from './try-catch.ts'

export async function tryCatchOrThrow<T>(promise: Promise<T>, message: string): Promise<T> {
  const { data, error } = await tryCatch(promise)
  if (error) {
    console.error(error)
    throw new Error(message)
  }
  return data
}
