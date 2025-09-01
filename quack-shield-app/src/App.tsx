import { useEffect, useRef, useState } from 'react'
import ConfigurationPanel from './components/ConfigurationPanel'
import ChatFeed from './components/ChatFeed'
import Modal from './components/Modal'
import type { AgentsConfig, RulesConfig, Message } from './types/models'
import { initialMessages, liveTexts } from './data/mockData'
import { moderatorCheck } from './utils/agents'

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

  const confirmAppeal = () => {
    if (!selectedMessageId) return
    setMessages((prev) =>
      prev.map((m) => (m.id === selectedMessageId ? { ...m, appealStatus: 'pending' } : m))
    )
    closeAppeal()
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
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-sm border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              Connected to DuckChain Testnet
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
        title="Appeal Decision"
        open={isAppealModalOpen}
        onClose={closeAppeal}
        onConfirm={confirmAppeal}
        confirmText="Confirm"
        cancelText="Cancel"
      >
        Appeal this decision on-chain? This will require a stake of 50 $DUCK.
      </Modal>
    </div>
  )
}

export default App
