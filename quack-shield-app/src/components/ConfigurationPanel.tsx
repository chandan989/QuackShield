import React from 'react'
import type { AgentsConfig, RulesConfig } from '../types/models'
import type { AIUsageStats, ChainGPTError } from '../types/ai'

interface Props {
  agents: AgentsConfig
  rules: RulesConfig
  onToggleAgent: (key: keyof AgentsConfig) => void
  onToggleRule: (key: keyof RulesConfig) => void
  // ChainGPT AI props
  aiConnected: boolean
  aiConnecting: boolean
  activeAnalyses: Map<string, any>
  usageStats: AIUsageStats
  aiError: ChainGPTError | null
  onConnectAI: () => void
  onDisconnectAI: () => void
}

const ConfigurationPanel: React.FC<Props> = ({ 
  agents, 
  rules, 
  onToggleAgent, 
  onToggleRule,
  aiConnected,
  aiConnecting,
  activeAnalyses,
  usageStats,
  aiError,
  onConnectAI,
  onDisconnectAI
}) => {
  return (
    <aside className="space-y-6 p-4 bg-white/40 backdrop-blur rounded-lg shadow-sm border border-slate-200">
      {/* ChainGPT AI Status Section */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800">ChainGPT AI Status</h2>
        <div className="mt-3 space-y-3">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                aiConnected ? 'bg-green-500' : aiConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <span className="text-sm">
                {aiConnected ? 'Connected' : aiConnecting ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={aiConnected ? onDisconnectAI : onConnectAI}
              disabled={aiConnecting}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                aiConnected 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300' 
                  : aiConnecting
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-300 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
              }`}
            >
              {aiConnected ? 'Disconnect' : aiConnecting ? 'Connecting...' : 'Connect'}
            </button>
          </div>

          {/* Usage Statistics */}
          {aiConnected && (
            <div className="bg-white/50 rounded-lg p-2 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Active Analyses:</span>
                <span className="font-medium">{activeAnalyses.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Analyzed:</span>
                <span className="font-medium">{usageStats.totalRequests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Success Rate:</span>
                <span className="font-medium">
                  {usageStats.totalRequests > 0 
                    ? ((usageStats.successfulRequests / usageStats.totalRequests) * 100).toFixed(1) 
                    : '0'}%
                </span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {aiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs">
              <div className="text-red-700 font-medium">AI Error:</div>
              <div className="text-red-600">{aiError.message}</div>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800">Active Agents</h2>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              checked={agents.moderatorEnabled}
              onChange={() => onToggleAgent('moderatorEnabled')}
            />
            <span>Moderator Agent</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              checked={agents.verifierEnabled}
              onChange={() => onToggleAgent('verifierEnabled')}
            />
            <span>Verifier Agent</span>
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800">Moderation Rules</h2>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={rules.blockMaliciousLinks}
              onChange={() => onToggleRule('blockMaliciousLinks')}
            />
            <span>Block Malicious Links</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={rules.flagToxicLanguage}
              onChange={() => onToggleRule('flagToxicLanguage')}
            />
            <span>Flag Toxic Language</span>
          </label>
        </div>
      </section>
    </aside>
  )
}

export default ConfigurationPanel
