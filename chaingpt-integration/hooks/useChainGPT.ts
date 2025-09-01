// React hook for ChainGPT AI integration

import { useState, useEffect, useCallback, useRef } from 'react'
import { chainGPTService, formatConfidence, getRiskColor, getActionIcon } from '../utils/chaingpt'
import type { 
  ChainGPTConnection,
  ContentAnalysisRequest,
  ContentAnalysisResult,
  ModerationRecommendation,
  AIUsageStats,
  AIAgentCapabilities,
  AIAnalysisEvent,
  AIConnectionEvent
} from '../types/ai'
import { ChainGPTError } from '../types/ai'

export interface UseChainGPTReturn {
  // Connection state
  connection: ChainGPTConnection
  isConnected: boolean
  isConnecting: boolean
  
  // AI capabilities
  capabilities: AIAgentCapabilities
  usageStats: AIUsageStats
  
  // Actions
  connect: (apiKey?: string) => Promise<void>
  disconnect: () => Promise<void>
  analyzeContent: (content: string, options?: Partial<ContentAnalysisRequest['options']>) => Promise<ContentAnalysisResult>
  getModerationRecommendation: (messageId: string) => Promise<ModerationRecommendation | null>
  getAnalysisResult: (id: string) => Promise<ContentAnalysisResult | null>
  
  // Real-time analysis state
  activeAnalyses: Map<string, { status: 'analyzing' | 'completed' | 'failed'; progress?: number }>
  
  // Formatted display values
  formatters: {
    confidence: (confidence: number) => string
    riskColor: (risk: string) => string
    actionIcon: (action: string) => string
  }
  
  // Error handling
  error: ChainGPTError | null
  clearError: () => void
  
  // Event handling
  onAnalysisEvent: (callback: (event: AIAnalysisEvent) => void) => () => void
  onConnectionEvent: (callback: (event: AIConnectionEvent) => void) => () => void
}

export function useChainGPT(): UseChainGPTReturn {
  const [connection, setConnection] = useState<ChainGPTConnection>(() => 
    chainGPTService.getConnection()
  )
  const [error, setError] = useState<ChainGPTError | null>(null)
  const [usageStats, setUsageStats] = useState<AIUsageStats>(() =>
    chainGPTService.getUsageStats()
  )
  const [activeAnalyses, setActiveAnalyses] = useState<Map<string, { status: 'analyzing' | 'completed' | 'failed'; progress?: number }>>(
    new Map()
  )
  
  const analysisRequestCounter = useRef(0)
  const statsUpdateInterval = useRef<number>()

  // Subscribe to connection events
  useEffect(() => {
    const unsubscribeConnection = chainGPTService.onConnectionEvent((event: AIConnectionEvent) => {
      switch (event.type) {
        case 'connected':
        case 'disconnected':
          setConnection(chainGPTService.getConnection())
          if (event.type === 'connected') {
            setError(null)
          }
          break
        case 'error':
          setError(event.data?.error || new ChainGPTError({
            code: 'CONNECTION_ERROR',
            message: 'Connection error occurred'
          }))
          break
        case 'rate_limited':
          setError(new ChainGPTError({
            code: 'RATE_LIMITED',
            message: 'API rate limit exceeded',
            rateLimitInfo: event.data?.rateLimitInfo
          }))
          break
      }
    })

    return unsubscribeConnection
  }, [])

  // Subscribe to analysis events
  useEffect(() => {
    const unsubscribeAnalysis = chainGPTService.onAnalysisEvent((event: AIAnalysisEvent) => {
      setActiveAnalyses((prev: Map<string, { status: 'analyzing' | 'completed' | 'failed'; progress?: number }>) => {
        const updated = new Map(prev)
        
        switch (event.type) {
          case 'analysis_started':
            updated.set(event.requestId, { status: 'analyzing', progress: 0 })
            break
          case 'analysis_progress':
            const current = updated.get(event.requestId)
            if (current) {
              updated.set(event.requestId, { 
                ...current, 
                progress: event.data?.progress || current.progress 
              })
            }
            break
          case 'analysis_completed':
            updated.set(event.requestId, { status: 'completed', progress: 100 })
            // Remove completed analysis after a delay to keep UI clean
            setTimeout(() => {
              setActiveAnalyses((map: Map<string, { status: 'analyzing' | 'completed' | 'failed'; progress?: number }>) => {
                const newMap = new Map(map)
                newMap.delete(event.requestId)
                return newMap
              })
            }, 5000)
            break
          case 'analysis_failed':
            updated.set(event.requestId, { status: 'failed' })
            // Remove failed analysis after a delay
            setTimeout(() => {
              setActiveAnalyses((map: Map<string, { status: 'analyzing' | 'completed' | 'failed'; progress?: number }>) => {
                const newMap = new Map(map)
                newMap.delete(event.requestId)
                return newMap
              })
            }, 10000)
            break
        }
        
        return updated
      })
    })

    return unsubscribeAnalysis
  }, [])

  // Periodically update usage stats
  useEffect(() => {
    const updateStats = () => {
      setUsageStats(chainGPTService.getUsageStats())
    }

    // Update immediately and then every 30 seconds
    updateStats()
    statsUpdateInterval.current = setInterval(updateStats, 30000)

    return () => {
      if (statsUpdateInterval.current) {
        clearInterval(statsUpdateInterval.current)
      }
    }
  }, [])

  // Clear error when connection status changes to connected
  useEffect(() => {
    if (connection.status === 'connected') {
      setError(null)
    }
  }, [connection.status])

  // Connection actions
  const connect = useCallback(async (apiKey?: string) => {
    try {
      setError(null)
      await chainGPTService.connect(apiKey)
    } catch (err) {
      setError(err as ChainGPTError)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      setError(null)
      await chainGPTService.disconnect()
    } catch (err) {
      setError(err as ChainGPTError)
    }
  }, [])

  // Content analysis
  const analyzeContent = useCallback(async (
    content: string, 
    options?: Partial<ContentAnalysisRequest['options']>
  ): Promise<ContentAnalysisResult> => {
    try {
      setError(null)
      
      const requestId = `analysis_${++analysisRequestCounter.current}_${Date.now()}`
      const request: ContentAnalysisRequest = {
        id: requestId,
        content,
        context: {
          author: 'user', // Could be passed as parameter in real implementation
          timestamp: Date.now()
        },
        options: {
          checkToxicity: true,
          checkSpam: true,
          checkScams: true,
          checkMaliciousLinks: true,
          provideSuggestions: true,
          ...options
        }
      }
      
      const result = await chainGPTService.analyzeContent(request)
      
      // Update stats after successful analysis
      setTimeout(() => {
        setUsageStats(chainGPTService.getUsageStats())
      }, 100)
      
      return result
    } catch (err) {
      setError(err as ChainGPTError)
      throw err
    }
  }, [])

  // Moderation recommendation
  const getModerationRecommendation = useCallback(async (messageId: string) => {
    try {
      return await chainGPTService.getModerationRecommendation(messageId)
    } catch (err) {
      setError(err as ChainGPTError)
      return null
    }
  }, [])

  // Get analysis result
  const getAnalysisResult = useCallback(async (id: string) => {
    try {
      return await chainGPTService.getAnalysisResult(id)
    } catch (err) {
      setError(err as ChainGPTError)
      return null
    }
  }, [])

  // Event subscription helpers
  const onAnalysisEvent = useCallback((callback: (event: AIAnalysisEvent) => void) => {
    return chainGPTService.onAnalysisEvent(callback)
  }, [])

  const onConnectionEvent = useCallback((callback: (event: AIConnectionEvent) => void) => {
    return chainGPTService.onConnectionEvent(callback)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Computed values
  const isConnected = chainGPTService.isConnected()
  const isConnecting = connection.status === 'connecting'
  const capabilities = chainGPTService.getCapabilities()

  // Formatters
  const formatters = {
    confidence: formatConfidence,
    riskColor: getRiskColor,
    actionIcon: getActionIcon
  }

  return {
    // Connection state
    connection,
    isConnected,
    isConnecting,
    
    // AI capabilities
    capabilities,
    usageStats,
    
    // Actions
    connect,
    disconnect,
    analyzeContent,
    getModerationRecommendation,
    getAnalysisResult,
    
    // Real-time analysis state
    activeAnalyses,
    
    // Formatted display values
    formatters,
    
    // Error handling
    error,
    clearError,
    
    // Event handling
    onAnalysisEvent,
    onConnectionEvent
  }
}

// Specialized hooks for specific use cases

export function useContentModerator() {
  const chainGPT = useChainGPT()
  
  const moderateMessage = useCallback(async (_messageId: string, content: string) => {
    if (!chainGPT.isConnected) {
      throw new Error('ChainGPT not connected')
    }
    
    const analysis = await chainGPT.analyzeContent(content)
    const recommendation = await chainGPT.getModerationRecommendation(analysis.id)
    
    return {
      analysis,
      recommendation,
      shouldFlag: analysis.shouldFlag,
      riskLevel: analysis.overallRisk,
      confidence: analysis.confidence
    }
  }, [chainGPT])
  
  return {
    ...chainGPT,
    moderateMessage
  }
}

export function useAIAnalytics() {
  const chainGPT = useChainGPT()
  const [analyticsData, setAnalyticsData] = useState({
    totalAnalyzed: 0,
    flaggedContent: 0,
    averageRiskScore: 0,
    topCategories: [] as Array<{ category: string; count: number }>
  })
  
  useEffect(() => {
    const unsubscribe = chainGPT.onAnalysisEvent((event) => {
      if (event.type === 'analysis_completed' && event.data) {
        setAnalyticsData(prev => ({
          totalAnalyzed: prev.totalAnalyzed + 1,
          flaggedContent: prev.flaggedContent + (event.data.shouldFlag ? 1 : 0),
          averageRiskScore: 0, // Would calculate based on accumulated data
          topCategories: prev.topCategories // Would update category counts
        }))
      }
    })
    
    return unsubscribe
  }, [chainGPT])
  
  return {
    ...chainGPT,
    analytics: analyticsData
  }
}