// ChainGPT AI integration service for QuackNet Framework

import type {
  ChainGPTConnection,
  ContentAnalysisRequest,
  ContentAnalysisResult,
  ModerationRecommendation,
  AIModelConfig,
  AIConnectionStatus,
  AIUsageStats,
  AIAgentCapabilities,
  ToxicityLevel,
  ContentCategory,
  AIAnalysisEvent,
  AIConnectionEvent
} from '../types/ai'
import { ChainGPTError } from '../types/ai'

// Mock ChainGPT API configuration
const CHAINGPT_CONFIG: AIModelConfig = {
  endpoint: 'https://api.chaingpt.org/v1/analyze',
  model: 'chaingpt-moderation-v2',
  temperature: 0.1,
  maxTokens: 1000,
  timeout: 10000
}

// Keywords and patterns for mock analysis
const TOXIC_KEYWORDS = [
  'hate', 'stupid', 'idiot', 'trash', 'garbage', 'kill', 'die', 'worthless'
]

const SPAM_PATTERNS = [
  /\b(free|win|claim|airdrop|giveaway)\s+(now|here|click)\b/i,
  /\b(guaranteed|100%|instant)\s+(profit|money|crypto)\b/i,
  /\b(urgent|act\s+fast|limited\s+time)\b/i
]

const SCAM_INDICATORS = [
  'send me crypto', 'doubling coins', 'investment opportunity',
  'risk-free', 'guaranteed returns', 'verify your wallet',
  'connect wallet here', 'exclusive access'
]

const MALICIOUS_DOMAINS = [
  '.tk', '.ml', '.ga', '.cf', 'bit.ly', 'tinyurl.com',
  'airdrop-claim', 'verify-wallet', 'crypto-bonus'
]

class ChainGPTService {
  private connection: ChainGPTConnection = {
    status: 'disconnected',
    model: CHAINGPT_CONFIG.model,
    isAuthenticated: false
  }
  
  private analysisResults: Map<string, ContentAnalysisResult> = new Map()
  private usageStats: AIUsageStats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    tokensUsed: 0,
    rateLimitHits: 0
  }
  
  private analysisListeners: Set<(event: AIAnalysisEvent) => void> = new Set()
  private connectionListeners: Set<(event: AIConnectionEvent) => void> = new Set()

  // Connection management
  async connect(apiKey?: string): Promise<ChainGPTConnection> {
    try {
      this.setConnectionStatus('connecting')
      this.notifyConnectionListeners({
        type: 'connected',
        timestamp: Date.now()
      })
      
      // Simulate connection delay
      await this.delay(800)
      
      this.connection = {
        status: 'connected',
        model: CHAINGPT_CONFIG.model,
        isAuthenticated: true,
        rateLimitRemaining: 1000,
        rateLimitReset: Date.now() + 3600000 // 1 hour
      }
      
      this.notifyConnectionListeners({
        type: 'connected',
        data: { model: this.connection.model },
        timestamp: Date.now()
      })
      
      return this.connection
    } catch (error) {
      this.setConnectionStatus('error')
      throw new ChainGPTError({
        code: 'CONNECTION_FAILED',
        message: 'Failed to connect to ChainGPT API',
        details: error
      })
    }
  }

  async disconnect(): Promise<void> {
    this.connection = {
      status: 'disconnected',
      model: CHAINGPT_CONFIG.model,
      isAuthenticated: false
    }
    
    this.notifyConnectionListeners({
      type: 'disconnected',
      timestamp: Date.now()
    })
  }

  // Content analysis
  async analyzeContent(request: ContentAnalysisRequest): Promise<ContentAnalysisResult> {
    if (!this.isConnected()) {
      throw new ChainGPTError({
        code: 'NOT_CONNECTED',
        message: 'Not connected to ChainGPT API'
      })
    }

    const startTime = Date.now()
    this.usageStats.totalRequests++

    // Notify analysis started
    this.notifyAnalysisListeners({
      type: 'analysis_started',
      requestId: request.id,
      timestamp: startTime
    })

    try {
      // Simulate API processing time
      await this.delay(1000 + Math.random() * 2000)

      const result = await this.performMockAnalysis(request)
      result.processingTime = Date.now() - startTime
      
      this.analysisResults.set(request.id, result)
      this.usageStats.successfulRequests++
      this.updateAverageResponseTime(result.processingTime)

      // Notify analysis completed
      this.notifyAnalysisListeners({
        type: 'analysis_completed',
        requestId: request.id,
        data: result,
        timestamp: Date.now()
      })

      return result
    } catch (error) {
      this.usageStats.failedRequests++
      
      this.notifyAnalysisListeners({
        type: 'analysis_failed',
        requestId: request.id,
        data: { error: error.message },
        timestamp: Date.now()
      })

      throw error
    }
  }

  // Generate moderation recommendation
  async getModerationRecommendation(messageId: string): Promise<ModerationRecommendation | null> {
    const analysis = this.analysisResults.get(messageId)
    if (!analysis) return null

    return {
      messageId,
      action: analysis.recommendedAction as any,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning,
      evidence: this.generateEvidence(analysis),
      alternativeActions: this.generateAlternativeActions(analysis)
    }
  }

  // Get analysis result
  async getAnalysisResult(id: string): Promise<ContentAnalysisResult | null> {
    return this.analysisResults.get(id) || null
  }

  // Connection status
  getConnection(): ChainGPTConnection {
    return { ...this.connection }
  }

  isConnected(): boolean {
    return this.connection.status === 'connected' && this.connection.isAuthenticated
  }

  // Usage statistics
  getUsageStats(): AIUsageStats {
    return { ...this.usageStats }
  }

  // AI capabilities
  getCapabilities(): AIAgentCapabilities {
    return {
      contentAnalysis: true,
      toxicityDetection: true,
      spamDetection: true,
      scamDetection: true,
      linkAnalysis: true,
      contextualAnalysis: true,
      multiLanguageSupport: false, // Mock limitation
      realTimeAnalysis: true
    }
  }

  // Event listeners
  onAnalysisEvent(callback: (event: AIAnalysisEvent) => void): () => void {
    this.analysisListeners.add(callback)
    return () => this.analysisListeners.delete(callback)
  }

  onConnectionEvent(callback: (event: AIConnectionEvent) => void): () => void {
    this.connectionListeners.add(callback)
    return () => this.connectionListeners.delete(callback)
  }

  // Private methods
  private async performMockAnalysis(request: ContentAnalysisRequest): Promise<ContentAnalysisResult> {
    const content = request.content.toLowerCase()
    const result: ContentAnalysisResult = {
      id: request.id,
      content: request.content,
      timestamp: Date.now(),
      status: 'completed',
      overallRisk: 'low',
      shouldFlag: false,
      category: 'clean',
      confidence: 0.95,
      recommendedAction: 'allow',
      reasoning: 'Content appears to be safe and appropriate.',
      processingTime: 0,
      modelVersion: CHAINGPT_CONFIG.model
    }

    // Toxicity analysis
    if (request.options?.checkToxicity !== false) {
      const toxicityResult = this.analyzeToxicity(content)
      result.toxicity = toxicityResult
      if (toxicityResult.level !== 'low') {
        result.overallRisk = toxicityResult.level === 'severe' ? 'critical' : 'high'
        result.shouldFlag = true
        result.category = 'hate_speech'
        result.recommendedAction = toxicityResult.level === 'severe' ? 'remove' : 'flag'
        result.reasoning = toxicityResult.explanation
      }
    }

    // Spam analysis
    if (request.options?.checkSpam !== false) {
      const spamResult = this.analyzeSpam(content)
      result.spam = spamResult
      if (spamResult.isSpam) {
        result.overallRisk = result.overallRisk === 'critical' ? 'critical' : 'medium'
        result.shouldFlag = true
        result.category = 'spam'
        if (result.recommendedAction === 'allow') {
          result.recommendedAction = 'flag'
          result.reasoning = spamResult.explanation
        }
      }
    }

    // Scam analysis
    if (request.options?.checkScams !== false) {
      const scamResult = this.analyzeScam(content)
      result.scam = scamResult
      if (scamResult.isScam) {
        result.overallRisk = 'critical'
        result.shouldFlag = true
        result.category = 'scam'
        result.recommendedAction = 'remove'
        result.reasoning = scamResult.explanation
      }
    }

    // Malicious links analysis
    if (request.options?.checkMaliciousLinks !== false) {
      const linkResult = this.analyzeMaliciousLinks(request.content)
      result.maliciousLinks = linkResult
      if (linkResult.hasMaliciousLinks) {
        const hasHighRisk = linkResult.links.some(link => link.riskLevel === 'high')
        result.overallRisk = hasHighRisk ? 'high' : 'medium'
        result.shouldFlag = true
        result.category = 'malicious_link'
        if (result.recommendedAction === 'allow') {
          result.recommendedAction = hasHighRisk ? 'remove' : 'flag'
          result.reasoning = 'Content contains potentially malicious links'
        }
      }
    }

    // Add suggestions if requested
    if (request.options?.provideSuggestions) {
      result.suggestions = this.generateSuggestions(result)
    }

    return result
  }

  private analyzeToxicity(content: string) {
    const toxicWords = TOXIC_KEYWORDS.filter(word => content.includes(word))
    const level: ToxicityLevel = toxicWords.length > 2 ? 'severe' : 
                                toxicWords.length > 1 ? 'high' : 
                                toxicWords.length > 0 ? 'medium' : 'low'
    
    return {
      level,
      confidence: toxicWords.length > 0 ? 0.85 : 0.95,
      categories: toxicWords.length > 0 ? ['offensive_language'] : [],
      explanation: toxicWords.length > 0 ? 
        `Detected potentially toxic language: ${toxicWords.join(', ')}` :
        'No toxic language detected'
    }
  }

  private analyzeSpam(content: string) {
    const spamMatches = SPAM_PATTERNS.filter(pattern => pattern.test(content))
    const isSpam = spamMatches.length > 0
    
    return {
      isSpam,
      confidence: isSpam ? 0.8 : 0.9,
      indicators: isSpam ? ['promotional_language', 'urgency_keywords'] : [],
      explanation: isSpam ? 'Content contains spam-like promotional language' : 'No spam indicators detected'
    }
  }

  private analyzeScam(content: string) {
    const scamIndicators = SCAM_INDICATORS.filter(indicator => 
      content.toLowerCase().includes(indicator.toLowerCase())
    )
    const isScam = scamIndicators.length > 0
    
    return {
      isScam,
      confidence: isScam ? 0.9 : 0.95,
      scamType: isScam ? ('phishing' as const) : undefined,
      riskFactors: scamIndicators,
      explanation: isScam ? 
        `Potential scam detected with indicators: ${scamIndicators.join(', ')}` :
        'No scam indicators detected'
    }
  }

  private analyzeMaliciousLinks(content: string) {
    const urlRegex = /https?:\/\/[^\s]+/g
    const urls = content.match(urlRegex) || []
    
    const maliciousLinks = urls.filter(url => 
      MALICIOUS_DOMAINS.some(domain => url.includes(domain))
    ).map(url => ({
      url,
      riskLevel: 'high' as const,
      category: 'suspicious' as const,
      explanation: 'URL contains suspicious domain patterns'
    }))

    return {
      hasMaliciousLinks: maliciousLinks.length > 0,
      links: maliciousLinks
    }
  }

  private generateEvidence(analysis: ContentAnalysisResult): string[] {
    const evidence: string[] = []
    
    if (analysis.toxicity?.level !== 'low') {
      evidence.push(`Toxicity level: ${analysis.toxicity.level}`)
    }
    if (analysis.spam?.isSpam) {
      evidence.push('Contains spam patterns')
    }
    if (analysis.scam?.isScam) {
      evidence.push('Contains scam indicators')
    }
    if (analysis.maliciousLinks?.hasMaliciousLinks) {
      evidence.push('Contains suspicious links')
    }
    
    return evidence.length > 0 ? evidence : ['AI analysis completed']
  }

  private generateAlternativeActions(analysis: ContentAnalysisResult) {
    if (analysis.recommendedAction === 'remove') {
      return [
        { action: 'flag', reasoning: 'Flag for manual review instead of immediate removal', confidence: 0.7 },
        { action: 'escalate', reasoning: 'Escalate to senior moderators', confidence: 0.8 }
      ]
    }
    if (analysis.recommendedAction === 'flag') {
      return [
        { action: 'approve', reasoning: 'Allow with monitoring', confidence: 0.6 },
        { action: 'remove', reasoning: 'Remove if risk tolerance is low', confidence: 0.7 }
      ]
    }
    return []
  }

  private generateSuggestions(analysis: ContentAnalysisResult): string[] {
    const suggestions: string[] = []
    
    if (analysis.shouldFlag) {
      suggestions.push('Consider notifying the user about community guidelines')
      suggestions.push('Monitor user for repeated violations')
    }
    
    if (analysis.maliciousLinks?.hasMaliciousLinks) {
      suggestions.push('Strip links and warn user about suspicious URLs')
    }
    
    return suggestions
  }

  private setConnectionStatus(status: AIConnectionStatus) {
    this.connection = { ...this.connection, status }
  }

  private notifyAnalysisListeners(event: AIAnalysisEvent) {
    this.analysisListeners.forEach(callback => callback(event))
  }

  private notifyConnectionListeners(event: AIConnectionEvent) {
    this.connectionListeners.forEach(callback => callback(event))
  }

  private updateAverageResponseTime(responseTime: number) {
    const total = this.usageStats.averageResponseTime * (this.usageStats.successfulRequests - 1)
    this.usageStats.averageResponseTime = (total + responseTime) / this.usageStats.successfulRequests
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Singleton instance
export const chainGPTService = new ChainGPTService()

// Configuration access
export const getChainGPTConfig = () => ({ ...CHAINGPT_CONFIG })

// Utility functions
export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`
}

export const getRiskColor = (risk: string): string => {
  switch (risk) {
    case 'low': return 'green'
    case 'medium': return 'yellow'
    case 'high': return 'orange'
    case 'critical': return 'red'
    default: return 'gray'
  }
}

export const getActionIcon = (action: string): string => {
  switch (action) {
    case 'allow': return '✅'
    case 'flag': return '⚠️'
    case 'remove': return '🚫'
    case 'escalate': return '⬆️'
    default: return '❓'
  }
}