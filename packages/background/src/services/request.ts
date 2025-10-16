import type { StandardConnectInput, StandardConnectOutput } from '@wallet-standard/core'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- https://github.com/aklinker1/webext-core/pull/117
import { defineProxyService } from '@webext-core/proxy-service'
import { browser } from 'wxt/browser'

interface Request<TType extends keyof RequestTypeMap> {
  data: RequestTypeMap[TType]['input']
  id: number
  reject: (reason?: Error) => void
  resolve: (data: RequestTypeMap[TType]['output']) => void
  type: TType
}

interface RequestTypeMap {
  connect: {
    input: StandardConnectInput | undefined
    output: StandardConnectOutput
  }
}

class RequestService {
  private request?: Request<keyof RequestTypeMap>

  constructor() {
    browser.windows.onRemoved.addListener((windowId: number) => {
      if (this.request && this.request.id === windowId) {
        this.request.reject(new Error('Request closed'))
        this.request = undefined
      }
    })
  }

  async create<TType extends keyof RequestTypeMap>(
    type: TType,
    data: RequestTypeMap[TType]['input'],
  ): Promise<RequestTypeMap[TType]['output']> {
    if (this.request) {
      throw new Error('Request already exists')
    }

    const window = await browser.windows.create({
      focused: true,
      height: 600,
      type: 'popup',
      url: browser.runtime.getURL(`/request.html`),
      width: 400,
    })

    const id = window?.id
    if (!id) {
      throw new Error('Failed to create request window')
    }

    return new Promise<RequestTypeMap[TType]['output']>((resolve, reject) => {
      this.request = {
        data,
        id,
        reject,
        resolve,
        type,
      }
    })
  }

  get() {
    return this.request
  }

  reject() {
    if (!this.request) {
      throw new Error('No request to reject')
    }

    const id = this.request.id
    this.request.reject(new Error('Request rejected'))
    this.request = undefined
    browser.windows.remove(id)
  }

  resolve<TType extends keyof RequestTypeMap>(data: RequestTypeMap[TType]['output']) {
    if (!this.request) {
      throw new Error('No request to resolve')
    }

    const id = this.request.id
    this.request.resolve(data)
    this.request = undefined
    browser.windows.remove(id)
  }
}

export const [registerRequestService, getRequestService] = defineProxyService(
  'RequestService',
  () => new RequestService(),
)
