export interface AIUsageStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
}

export class ChainGPTError extends Error {
  code?: string
  rateLimitInfo?: any
  constructor(init?: any) {
    super(init?.message || 'ChainGPT error')
    this.code = init?.code
    this.rateLimitInfo = init?.rateLimitInfo
  }
}
