// ChainGPT AI integration types for QuackNet Framework

export type AIConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'
export type AnalysisStatus = 'idle' | 'analyzing' | 'completed' | 'failed'
export type ToxicityLevel = 'low' | 'medium' | 'high' | 'severe'
export type ContentCategory = 'spam' | 'hate_speech' | 'scam' | 'malicious_link' | 'inappropriate' | 'clean'

export interface AIModelConfig {
  apiKey?: string
  endpoint: string
  model: string
  temperature: number
  maxTokens: number
  timeout: number
}

export interface ChainGPTConnection {
  status: AIConnectionStatus
  model: string
  isAuthenticated: boolean
  rateLimitRemaining?: number
  rateLimitReset?: number
}

export interface ContentAnalysisRequest {
  id: string
  content: string
  context?: {
    author: string
    timestamp: number
    previousMessages?: string[]
  }
  options?: {
    checkToxicity: boolean
    checkSpam: boolean
    checkScams: boolean
    checkMaliciousLinks: boolean
    provideSuggestions: boolean
  }
}

export interface ToxicityAnalysis {
  level: ToxicityLevel
  confidence: number
  categories: string[]
  explanation: string
}

export interface SpamAnalysis {
  isSpam: boolean
  confidence: number
  indicators: string[]
  explanation: string
}

export interface ScamAnalysis {
  isScam: boolean
  confidence: number
  scamType?: 'phishing' | 'investment' | 'fake_airdrop' | 'impersonation' | 'other'
  riskFactors: string[]
  explanation: string
}

export interface MaliciousLinkAnalysis {
  hasMaliciousLinks: boolean
  links: Array<{
    url: string
    riskLevel: 'low' | 'medium' | 'high'
    category: 'suspicious' | 'malware' | 'phishing' | 'scam'
    explanation: string
  }>
}

export interface ContentAnalysisResult {
  id: string
  content: string
  timestamp: number
  status: AnalysisStatus
  overallRisk: 'low' | 'medium' | 'high' | 'critical'
  shouldFlag: boolean
  category: ContentCategory
  confidence: number
  
  // Detailed analysis results
  toxicity?: ToxicityAnalysis
  spam?: SpamAnalysis
  scam?: ScamAnalysis
  maliciousLinks?: MaliciousLinkAnalysis
  
  // AI recommendations
  recommendedAction: 'allow' | 'flag' | 'remove' | 'escalate'
  reasoning: string
  suggestions?: string[]
  
  // Metadata
  processingTime: number
  modelVersion: string
  error?: string
}

export interface ModerationRecommendation {
  messageId: string
  action: 'approve' | 'flag' | 'remove' | 'escalate'
  confidence: number
  reasoning: string
  evidence: string[]
  alternativeActions?: Array<{
    action: string
    reasoning: string
    confidence: number
  }>
}

export interface AIAgentCapabilities {
  contentAnalysis: boolean
  toxicityDetection: boolean
  spamDetection: boolean
  scamDetection: boolean
  linkAnalysis: boolean
  contextualAnalysis: boolean
  multiLanguageSupport: boolean
  realTimeAnalysis: boolean
}

export interface AIUsageStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  tokensUsed: number
  rateLimitHits: number
}

export class ChainGPTError extends Error {
  code: string
  statusCode?: number
  details?: any
  rateLimitInfo?: {
    remaining: number
    resetTime: number
  }

  constructor(params: { 
    code: string; 
    message: string; 
    statusCode?: number;
    details?: any;
    rateLimitInfo?: { remaining: number; resetTime: number }
  }) {
    super(params.message)
    this.code = params.code
    this.statusCode = params.statusCode
    this.details = params.details
    this.rateLimitInfo = params.rateLimitInfo
    this.name = 'ChainGPTError'
  }
}

// Event types for real-time updates
export type AIAnalysisEvent = {
  type: 'analysis_started' | 'analysis_progress' | 'analysis_completed' | 'analysis_failed'
  requestId: string
  data?: any
  timestamp: number
}

export type AIConnectionEvent = {
  type: 'connected' | 'disconnected' | 'rate_limited' | 'error'
  data?: any
  timestamp: number
}