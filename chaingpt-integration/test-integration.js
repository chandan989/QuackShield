// Simple test script to verify ChainGPT integration functionality
// Run with: node chaingpt-integration/test-integration.js

console.log('🚀 Testing ChainGPT Integration...\n')

// Mock environment for testing outside of React
global.setTimeout = setTimeout
global.clearTimeout = clearTimeout
global.setInterval = setInterval
global.clearInterval = clearInterval

// Import the service (using require since this is a .js file)
const { chainGPTService } = require('./utils/chaingpt')

async function testChainGPTIntegration() {
  console.log('1. Testing ChainGPT Service Connection...')
  
  try {
    // Test connection
    const connection = await chainGPTService.connect()
    console.log('✅ Connection successful:', {
      status: connection.status,
      model: connection.model,
      isAuthenticated: connection.isAuthenticated
    })

    // Test content analysis
    console.log('\n2. Testing Content Analysis...')
    
    const testMessages = [
      {
        id: 'test_1',
        content: 'Hello everyone! This is a normal message.',
        expected: 'clean'
      },
      {
        id: 'test_2',
        content: 'Free airdrop claim now! Guaranteed profit! Act fast!',
        expected: 'spam'
      },
      {
        id: 'test_3',
        content: 'You are such an idiot and worthless trash!',
        expected: 'toxic'
      },
      {
        id: 'test_4',
        content: 'Send me your crypto for guaranteed returns! Risk-free investment!',
        expected: 'scam'
      },
      {
        id: 'test_5',
        content: 'Check out this link: https://airdrop-claim.tk/verify-wallet',
        expected: 'malicious_link'
      }
    ]

    let passed = 0
    let failed = 0

    for (const testCase of testMessages) {
      try {
        console.log(`\n  Testing: "${testCase.content}"`)
        
        const analysisRequest = {
          id: testCase.id,
          content: testCase.content,
          context: {
            author: 'test_user',
            timestamp: Date.now()
          },
          options: {
            checkToxicity: true,
            checkSpam: true,
            checkScams: true,
            checkMaliciousLinks: true,
            provideSuggestions: true
          }
        }

        const result = await chainGPTService.analyzeContent(analysisRequest)
        
        console.log(`    Result: ${result.category} (${result.overallRisk} risk, ${Math.round(result.confidence * 100)}% confidence)`)
        console.log(`    Action: ${result.recommendedAction}`)
        console.log(`    Reasoning: ${result.reasoning}`)

        // Simple validation
        const isCorrect = (
          (testCase.expected === 'clean' && !result.shouldFlag) ||
          (testCase.expected !== 'clean' && result.shouldFlag)
        )

        if (isCorrect) {
          console.log('    ✅ PASS')
          passed++
        } else {
          console.log('    ❌ FAIL')
          failed++
        }

        // Test moderation recommendation
        const recommendation = await chainGPTService.getModerationRecommendation(testCase.id)
        if (recommendation) {
          console.log(`    Recommendation: ${recommendation.action} (${Math.round(recommendation.confidence * 100)}% confidence)`)
        }

      } catch (error) {
        console.log(`    ❌ ERROR: ${error.message}`)
        failed++
      }
    }

    console.log(`\n3. Testing Usage Statistics...`)
    const stats = chainGPTService.getUsageStats()
    console.log('✅ Usage stats:', {
      totalRequests: stats.totalRequests,
      successfulRequests: stats.successfulRequests,
      failedRequests: stats.failedRequests,
      averageResponseTime: Math.round(stats.averageResponseTime) + 'ms'
    })

    console.log(`\n4. Testing AI Capabilities...`)
    const capabilities = chainGPTService.getCapabilities()
    console.log('✅ AI capabilities:', capabilities)

    console.log(`\n🎯 Test Summary:`)
    console.log(`   Passed: ${passed}`)
    console.log(`   Failed: ${failed}`)
    console.log(`   Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`)

    if (failed === 0) {
      console.log('\n🎉 All tests passed! ChainGPT integration is working correctly.')
    } else {
      console.log(`\n⚠️  Some tests failed. Review the results above.`)
    }

    // Test disconnect
    console.log('\n5. Testing Disconnection...')
    await chainGPTService.disconnect()
    console.log('✅ Disconnection successful')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error(error)
  }
}

// Run the test
testChainGPTIntegration().then(() => {
  console.log('\n✨ Test completed!')
}).catch(error => {
  console.error('\n💥 Test crashed:', error.message)
  process.exit(1)
})