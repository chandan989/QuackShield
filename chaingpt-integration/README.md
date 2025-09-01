# ChainGPT Integration

This directory contains the complete ChainGPT AI integration for the QuackNet Framework, providing advanced AI-powered content moderation and analysis capabilities.

## Overview

The ChainGPT integration enhances the QuackNet multi-agent moderation framework with intelligent content analysis, including toxicity detection, spam identification, scam detection, and malicious link analysis. This AI-powered layer works alongside the existing Moderator and Verifier agents to provide more accurate and contextual moderation decisions.

## Directory Structure

```
chaingpt-integration/
├── README.md                 # This documentation file
├── types/
│   └── ai.ts                 # TypeScript types for AI operations
├── utils/
│   └── chaingpt.ts          # Core ChainGPT service implementation
└── hooks/
    └── useChainGPT.ts       # React hooks for ChainGPT integration
```

## Files Description

### types/ai.ts
Contains comprehensive TypeScript type definitions for the ChainGPT integration:
- `ChainGPTConnection` - AI service connection state and authentication
- `ContentAnalysisRequest` - Content analysis request structure
- `ContentAnalysisResult` - Detailed AI analysis results with toxicity, spam, scam detection
- `ModerationRecommendation` - AI-generated moderation recommendations
- `AIAgentCapabilities` - Available AI analysis capabilities
- Various enums for connection status, analysis status, toxicity levels, and content categories
- Custom error handling with `ChainGPTError` class

### utils/chaingpt.ts
Core service implementation providing:
- AI service connection and authentication management
- Advanced content analysis with multiple detection algorithms:
  - **Toxicity Detection**: Identifies offensive language and hate speech
  - **Spam Detection**: Recognizes promotional and spam content patterns
  - **Scam Detection**: Detects cryptocurrency scams and phishing attempts
  - **Malicious Link Analysis**: Identifies suspicious URLs and domains
- Real-time analysis event system for progress tracking
- Usage statistics and rate limiting management
- Mock AI responses for development and testing
- Comprehensive error handling and logging

### hooks/useChainGPT.ts
React hooks that provide:
- **useChainGPT**: Main hook with connection management, content analysis, and real-time state
- **useContentModerator**: Specialized hook for message moderation workflows
- **useAIAnalytics**: Hook for AI usage analytics and insights
- Real-time analysis progress tracking
- Formatted display utilities for UI components
- Event subscription management for real-time updates

## Key Features

1. **Advanced AI Analysis**: Multi-layered content analysis with confidence scoring
2. **Real-time Processing**: Live analysis progress updates and event streaming
3. **Intelligent Recommendations**: Context-aware moderation action suggestions
4. **Risk Assessment**: Comprehensive risk scoring with detailed explanations
5. **Scalable Architecture**: Event-driven design supporting high-volume analysis
6. **Developer Experience**: Easy-to-use React hooks with TypeScript support
7. **Mock Implementation**: Complete development environment without external API dependencies

## Integration with QuackNet Framework

The ChainGPT integration enhances the existing multi-agent system by:

### Enhanced Moderator Agent
The Moderator Agent can now leverage AI analysis to:
- Detect subtle toxicity patterns beyond keyword matching
- Identify sophisticated scam attempts and social engineering
- Analyze context and intent, not just content
- Provide confidence scores and detailed reasoning

### Intelligent Verifier Agent
The Verifier Agent benefits from:
- AI-powered second opinion on moderation decisions
- Risk assessment validation with alternative action suggestions
- Evidence-based verification with detailed analysis breakdown
- Context-aware appeal recommendations

### New AI Agent Capabilities
- **Content Categorization**: Automatic classification of problematic content
- **Sentiment Analysis**: Understanding emotional context and intent
- **Pattern Recognition**: Identifying emerging threats and spam techniques
- **Multi-language Support**: Analysis capabilities across different languages (planned)

## Usage Examples

### Basic Content Analysis
```javascript
import { useChainGPT } from '../chaingpt-integration/hooks/useChainGPT'

function MessageModerator() {
  const { analyzeContent, isConnected, connect } = useChainGPT()
  
  useEffect(() => {
    connect() // Connect to ChainGPT service
  }, [])
  
  const handleAnalyzeMessage = async (content) => {
    if (!isConnected) return
    
    const result = await analyzeContent(content, {
      checkToxicity: true,
      checkSpam: true,
      checkScams: true,
      checkMaliciousLinks: true,
      provideSuggestions: true
    })
    
    console.log('Analysis result:', {
      shouldFlag: result.shouldFlag,
      riskLevel: result.overallRisk,
      confidence: result.confidence,
      reasoning: result.reasoning,
      recommendations: result.suggestions
    })
  }
  
  return (
    <div>
      <button onClick={() => handleAnalyzeMessage("Check this message!")}>
        Analyze Content
      </button>
    </div>
  )
}
```

### Enhanced Agent Integration
```typescript
import { useContentModerator } from '../chaingpt-integration/hooks/useChainGPT'

function EnhancedModeratorAgent() {
  const { moderateMessage, activeAnalyses, usageStats } = useContentModerator()
  
  const handleMessageModeration = async (messageId: string, content: string) => {
    try {
      const result = await moderateMessage(messageId, content)
      
      // Enhanced moderation decision with AI insight
      const action = result.recommendation?.action || 'allow'
      const confidence = result.confidence
      const reasoning = result.analysis.reasoning
      
      // Apply moderation action based on AI recommendation
      applyModerationAction(messageId, action, { confidence, reasoning })
      
    } catch (error) {
      console.error('AI moderation failed:', error)
      // Fallback to traditional rule-based moderation
      fallbackModeration(messageId, content)
    }
  }
  
  return (
    <div>
      <div>Active Analyses: {activeAnalyses.size}</div>
      <div>Total Analyzed: {usageStats.totalRequests}</div>
      <div>Success Rate: {(usageStats.successfulRequests / usageStats.totalRequests * 100).toFixed(1)}%</div>
    </div>
  )
}
```

### Real-time Analysis Monitoring
```typescript
function AnalysisMonitor() {
  const { onAnalysisEvent, activeAnalyses } = useChainGPT()
  const [recentAnalyses, setRecentAnalyses] = useState([])
  
  useEffect(() => {
    const unsubscribe = onAnalysisEvent((event) => {
      switch (event.type) {
        case 'analysis_started':
          console.log('Analysis started:', event.requestId)
          break
        case 'analysis_completed':
          console.log('Analysis completed:', event.data)
          setRecentAnalyses(prev => [event.data, ...prev.slice(0, 9)])
          break
        case 'analysis_failed':
          console.error('Analysis failed:', event.data.error)
          break
      }
    })
    
    return unsubscribe
  }, [onAnalysisEvent])
  
  return (
    <div>
      <h3>AI Analysis Monitor</h3>
      <div>Active: {activeAnalyses.size}</div>
      <div>Recent Results: {recentAnalyses.length}</div>
    </div>
  )
}
```

## Configuration

The integration uses a mock ChainGPT API configuration for development:

```typescript
const CHAINGPT_CONFIG = {
  endpoint: 'https://api.chaingpt.org/v1/analyze',
  model: 'chaingpt-moderation-v2',
  temperature: 0.1,
  maxTokens: 1000,
  timeout: 10000
}
```

For production deployment, update the configuration with:
- Real ChainGPT API endpoint
- Valid API authentication keys
- Production-appropriate rate limits
- Custom model parameters

## AI Analysis Capabilities

### Toxicity Detection
- **Levels**: Low, Medium, High, Severe
- **Categories**: Offensive language, hate speech, harassment
- **Confidence Scoring**: 0-1 scale with explanation
- **Context Awareness**: Considers conversation history

### Spam Detection
- **Pattern Recognition**: Promotional language, urgency keywords
- **Behavioral Analysis**: Repetitive content, excessive links
- **Crypto-specific**: Airdrop scams, fake giveaways
- **False Positive Prevention**: Context-aware filtering

### Scam Detection
- **Types**: Phishing, investment scams, fake airdrops, impersonation
- **Risk Factors**: Multiple indicators with weighted scoring
- **Social Engineering**: Advanced manipulation technique detection
- **Financial Focus**: Cryptocurrency and wallet-related threats

### Malicious Link Analysis
- **Domain Reputation**: Known malicious domains and TLD patterns
- **URL Structure**: Suspicious patterns and redirects
- **Content Analysis**: Landing page risk assessment
- **Real-time Updates**: Dynamic threat intelligence integration

## Performance and Scaling

### Optimization Features
- **Batch Processing**: Multiple content analysis in single requests
- **Caching**: Result caching for repeated content
- **Rate Limiting**: Built-in request throttling and queue management
- **Error Recovery**: Automatic retry with exponential backoff

### Monitoring and Analytics
- **Usage Statistics**: Request counts, response times, success rates
- **Performance Metrics**: Analysis duration, queue lengths
- **Quality Metrics**: Confidence distributions, action effectiveness
- **Real-time Dashboards**: Live analysis monitoring and alerts

## Security and Privacy

### Data Handling
- **Privacy Protection**: No persistent storage of analyzed content
- **Encryption**: All API communications use TLS
- **Anonymization**: User identifiers removed from analysis requests
- **Audit Logging**: Comprehensive logging for compliance

### Access Control
- **API Key Management**: Secure credential handling
- **Rate Limiting**: Per-user and global limits
- **Permission System**: Role-based access to different analysis types
- **Monitoring**: Suspicious usage pattern detection

## Development and Testing

### Mock Implementation
The current implementation provides comprehensive mock responses for development:
- Realistic analysis results with varying confidence levels
- Simulated processing delays for real-world testing
- Error scenario simulation for robust error handling
- Event streaming for real-time feature testing

### Testing Strategy
- **Unit Tests**: Individual analysis algorithms and utilities
- **Integration Tests**: Full analysis workflow testing
- **Performance Tests**: Load testing with concurrent analyses
- **UI Tests**: React component integration testing

## Future Enhancements

### Planned Features
1. **Multi-language Support**: Content analysis in multiple languages
2. **Custom Model Training**: Domain-specific model fine-tuning
3. **Advanced Context Analysis**: Conversation thread understanding
4. **Visual Content Analysis**: Image and media content moderation
5. **Behavioral Analytics**: User pattern analysis and risk scoring

### Integration Roadmap
1. **Real API Integration**: Connect to production ChainGPT services
2. **Advanced Analytics**: Detailed reporting and trend analysis
3. **Custom Rules Engine**: User-defined analysis parameters
4. **Machine Learning Pipeline**: Continuous model improvement
5. **Multi-chain Support**: Analysis across different blockchain networks

## Support and Maintenance

### Documentation
- API reference documentation with examples
- Integration guides for different use cases
- Troubleshooting guides and FAQ
- Performance optimization recommendations

### Community
- GitHub issues for bug reports and feature requests
- Discord community for real-time support
- Regular updates and security patches
- Contribution guidelines for community developers

---

This ChainGPT integration represents a significant advancement in AI-powered content moderation for Web3 communities, providing the intelligence and automation needed for effective, scalable community management while maintaining transparency and user control over moderation decisions.