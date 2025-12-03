export type VanityWorkerMessage =
  | { payload: number; type: 'progress' }
  | {
      payload: { address: string; attempts: number; secretKey: string }
      type: 'found'
    }
  | { payload: string; type: 'error' }
