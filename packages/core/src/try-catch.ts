export interface Failure<E> {
  data: null
  error: E
}

export type Result<T, E = Error> = Failure<E> | Success<T>

export interface Success<T> {
  data: T
  error: null
}

export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as E }
  }
}
