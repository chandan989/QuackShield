// Ambient declarations to avoid type-checking external chaingpt-integration sources during app build

declare module '../../chaingpt-integration/hooks/useChainGPT' {
  export interface AIUsageStats {
    totalRequests: number
    successfulRequests: number
    failedRequests: number
  }

  export interface ChainGPTError extends Error {
    code?: string
    rateLimitInfo?: any
  }

  export function useContentModerator(): {
    // basic connection state
    isConnected: boolean
    isConnecting: boolean

    // actions
    connect: (apiKey?: string) => Promise<void>
    disconnect: () => Promise<void>
    moderateMessage: (messageId: string, content: string) => Promise<{
      analysis: any
      recommendation: any
      shouldFlag: boolean
      riskLevel: string
      confidence: number
    }>

    // realtime state
    activeAnalyses: Map<string, any>
    usageStats: AIUsageStats

    // error
    error: ChainGPTError | null
  }
}

declare module '../../../chaingpt-integration/types/ai' {
  export interface AIUsageStats {
    totalRequests: number
    successfulRequests: number
    failedRequests: number
  }

  export class ChainGPTError extends Error {
    code?: string
    rateLimitInfo?: any
    constructor(init?: any)
  }
}
