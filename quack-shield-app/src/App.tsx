import { useEffect, useRef, useState } from 'react'
import ConfigurationPanel from './components/ConfigurationPanel'
import ChatFeed from './components/ChatFeed'
import Modal from './components/Modal'
import type { AgentsConfig, RulesConfig, Message } from './types/models'
import { initialMessages, liveTexts } from './data/mockData'
import { moderatorCheck } from './utils/agents'
import { useDuckChain } from './hooks/useDuckChain'

function App() {
  const [agents, setAgents] = useState<AgentsConfig>({
    moderatorEnabled: true,
    verifierEnabled: true,
  })
  const [rules, setRules] = useState<RulesConfig>({
    blockMaliciousLinks: true,
    flagToxicLanguage: true,
  })
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  const [isAppealModalOpen, setAppealModalOpen] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState<string | undefined>(undefined)
  
  // DuckChain integration
  const { 
    isConnected, 
    isConnecting, 
    formattedBalance, 
    formattedAddress,
    connect, 
    disconnect,
    submitAppeal,
    error: duckChainError 
  } = useDuckChain()

  const intervalRef = useRef<number | null>(null)
  const timeoutsRef = useRef<number[]>([])
  const nextIdRef = useRef<number>(100)

  const onToggleAgent = (key: keyof AgentsConfig) => {
    setAgents((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const onToggleRule = (key: keyof RulesConfig) => {
    setRules((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAppealClick = (id: string) => {
    setSelectedMessageId(id)
    setAppealModalOpen(true)
  }

  const closeAppeal = () => {
    setAppealModalOpen(false)
    setSelectedMessageId(undefined)
  }

  const confirmAppeal = async () => {
    if (!selectedMessageId) return
    
    try {
      // Submit appeal to blockchain
      await submitAppeal(selectedMessageId, 'User appeal for content moderation decision')
      
      // Update message status to submitted (blockchain will handle status progression)
      setMessages((prev) =>
        prev.map((m) => (m.id === selectedMessageId ? { ...m, appealStatus: 'submitted' } : m))
      )
      
      closeAppeal()
    } catch (error) {
      console.error('Failed to submit appeal:', error)
      // Keep modal open to show error to user
    }
  }

  // Live feed generator + agent orchestration (Wizard-of-Oz)
  useEffect(() => {
    // cleanup previous timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    timeoutsRef.current.forEach((t) => clearTimeout(t))
    timeoutsRef.current = []

    const interval = window.setInterval(() => {
      const idx = Math.floor(Math.random() * liveTexts.length)
      const text = liveTexts[idx]
      const id = `m${nextIdRef.current++}`
      const base = {
        id,
        author: Math.random() < 0.3 ? 'spamduck' : 'user' + id,
        text,
        createdAt: Date.now(),
      } as Partial<Message>

      let newMsg: Message = { ...(base as any), status: 'normal' }

      if (agents.moderatorEnabled) {
        const { shouldFlag, reason } = moderatorCheck(newMsg, rules)
        if (shouldFlag) {
          newMsg = { ...newMsg, status: 'flagged_by_moderator', reason }
        }
      }

      setMessages((prev) => [...prev, newMsg])

      if (newMsg.status === 'flagged_by_moderator' && agents.verifierEnabled) {
        const delay = 1500 + Math.floor(Math.random() * 1500)
        const timeoutId = window.setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === id && m.status === 'flagged_by_moderator'
                ? { ...m, status: 'verified_by_verifier', removed: true }
                : m
            )
          )
        }, delay)
        timeoutsRef.current.push(timeoutId)
      }
    }, 3000)

    intervalRef.current = interval

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
      timeoutsRef.current.forEach((t) => clearTimeout(t))
      timeoutsRef.current = []
    }
  }, [agents.moderatorEnabled, agents.verifierEnabled, rules.blockMaliciousLinks, rules.flagToxicLanguage])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">QuackNet Framework</h1>
          <div className="flex items-center gap-2">
            {/* DuckChain Connection Status */}
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border cursor-pointer transition-colors ${
              isConnected 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : isConnecting
                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            onClick={isConnected ? disconnect : connect}
            title={isConnected ? `Click to disconnect • ${formattedAddress} • ${formattedBalance}` : 'Click to connect wallet'}
            >
              <span className={`h-2 w-2 rounded-full inline-block ${
                isConnected 
                  ? 'bg-emerald-500' 
                  : isConnecting 
                  ? 'bg-yellow-500 animate-pulse' 
                  : 'bg-slate-400'
              }`} />
              {isConnecting ? 'Connecting...' : isConnected ? `Connected • ${formattedAddress}` : 'Connect to DuckChain'}
            </div>
            <span className={`hidden sm:inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${agents.moderatorEnabled ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-500 border-slate-300'}`}>🛡️ Moderator</span>
            <span className={`hidden sm:inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${agents.verifierEnabled ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-300'}`}>🔎 Verifier</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ConfigurationPanel
            agents={agents}
            rules={rules}
            onToggleAgent={onToggleAgent}
            onToggleRule={onToggleRule}
          />
        </div>
        <div className="md:col-span-2 rounded-lg border bg-white shadow-sm">
          <div className="sticky top-0 z-10 p-3 border-b text-sm text-slate-700 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">Community Chat Feed</div>
          <div className="max-h-[70vh] overflow-auto">
            <ChatFeed messages={messages} onAppealClick={handleAppealClick} />
          </div>
        </div>
      </main>

      <Modal
        title="Appeal Decision On-Chain"
        open={isAppealModalOpen}
        onClose={closeAppeal}
        onConfirm={confirmAppeal}
        confirmText={isConnected ? "Submit Appeal" : "Connect Wallet First"}
        cancelText="Cancel"
      >
        <div className="space-y-3">
          <p>Appeal this moderation decision on DuckChain? This will require staking 50 $DUCK.</p>
          
          {isConnected ? (
            <div className="bg-slate-50 rounded-lg p-3 text-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-600">Your Balance:</span>
                <span className="font-medium">{formattedBalance}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-600">Required Stake:</span>
                <span className="font-medium">50 $DUCK</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Wallet:</span>
                <span className="font-mono text-xs">{formattedAddress}</span>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              Please connect your DuckChain wallet to submit an appeal.
            </div>
          )}
          
          {duckChainError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              <strong>Error:</strong> {duckChainError.message}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default App
