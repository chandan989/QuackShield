import { useCallback, useRef, useState } from 'react'
import type { AIUsageStats, ChainGPTError } from '../types/ai'

export function useContentModerator() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<ChainGPTError | null>(null)
  const [usageStats, setUsageStats] = useState<AIUsageStats>({ totalRequests: 0, successfulRequests: 0, failedRequests: 0 })
  const [activeAnalyses, setActiveAnalyses] = useState<Map<string, { status: 'analyzing' | 'completed' | 'failed'; progress?: number }>>(new Map())
  const counterRef = useRef(0)

  const connect = useCallback(async (_apiKey?: string) => {
    try {
      setError(null)
      setIsConnecting(true)
      await new Promise((r) => setTimeout(r, 300))
      setIsConnected(true)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    setIsConnected(false)
  }, [])

  const moderateMessage = useCallback(async (messageId: string, content: string) => {
    if (!isConnected) throw new Error('ChainGPT not connected')

    const requestId = `${messageId}_${++counterRef.current}`
    setActiveAnalyses((prev) => new Map(prev).set(requestId, { status: 'analyzing', progress: 0 }))

    await new Promise((r) => setTimeout(r, 200))

    const lower = content.toLowerCase()
    const shouldFlag = /spam|http|www\./.test(lower)

    setUsageStats((prev) => ({
      totalRequests: prev.totalRequests + 1,
      successfulRequests: prev.successfulRequests + 1,
      failedRequests: prev.failedRequests,
    }))

    setActiveAnalyses((prev) => {
      const next = new Map(prev)
      next.set(requestId, { status: 'completed', progress: 100 })
      setTimeout(() => {
        setActiveAnalyses((prev2) => {
          const n2 = new Map(prev2)
          n2.delete(requestId)
          return n2
        })
      }, 3000)
      return next
    })

    return {
      analysis: { id: requestId, shouldFlag, overallRisk: shouldFlag ? 'high' : 'low', confidence: shouldFlag ? 0.9 : 0.2, reasoning: shouldFlag ? 'Heuristic match' : 'No issues' },
      recommendation: null,
      shouldFlag,
      riskLevel: shouldFlag ? 'high' as const : 'low' as const,
      confidence: shouldFlag ? 0.9 : 0.2,
    }
  }, [isConnected])

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    moderateMessage,
    activeAnalyses,
    usageStats,
    error,
  }
}
